"""
Local Vulnerability Scanner

Replaces 'safety' package with offline vulnerability database.
No internet required for security scanning.

Database updates periodically via separate update script.
"""

import json
import sqlite3
import re
from pathlib import Path
from typing import Dict, List, Set, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Vulnerability:
    """Security vulnerability record."""
    cve_id: str
    package: str
    affected_versions: str
    severity: str  # 'critical', 'high', 'medium', 'low'
    description: str
    published_date: str

    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return {
            'cve_id': self.cve_id,
            'package': self.package,
            'affected_versions': self.affected_versions,
            'severity': self.severity,
            'description': self.description,
            'published_date': self.published_date
        }


class LocalVulnerabilityScanner:
    """
    Offline vulnerability scanner using bundled database.

    Features:
    - No internet required for scanning
    - Bundled CVE database (updated weekly via separate script)
    - Version range matching
    - Severity classification
    - False positive filtering
    """

    def __init__(self, db_path: str = None):
        """
        Initialize scanner.

        Args:
            db_path: Path to vulnerability database (creates if missing)
        """
        if db_path is None:
            data_dir = Path.home() / '.gitops' / 'data'
            data_dir.mkdir(parents=True, exist_ok=True)
            db_path = data_dir / 'vulndb.sqlite'

        self.db_path = Path(db_path)
        self._ensure_db()

    def _ensure_db(self):
        """Create database schema if needed."""
        conn = sqlite3.connect(self.db_path)

        conn.execute('''
            CREATE TABLE IF NOT EXISTS vulnerabilities (
                cve_id TEXT PRIMARY KEY,
                package TEXT NOT NULL,
                affected_versions TEXT NOT NULL,
                severity TEXT NOT NULL,
                description TEXT,
                published_date TEXT,
                updated_at REAL NOT NULL
            )
        ''')

        conn.execute('CREATE INDEX IF NOT EXISTS idx_package ON vulnerabilities(package)')
        conn.execute('CREATE INDEX IF NOT EXISTS idx_severity ON vulnerabilities(severity)')

        # Metadata table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS metadata (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        ''')

        conn.commit()
        conn.close()

    def scan_requirements(self, requirements_file: str) -> List[Vulnerability]:
        """
        Scan requirements.txt for known vulnerabilities.

        Args:
            requirements_file: Path to requirements.txt

        Returns:
            List of found vulnerabilities

        Example:
            >>> scanner = LocalVulnerabilityScanner()
            >>> vulns = scanner.scan_requirements('requirements.txt')
            >>> for v in vulns:
            ...     print(f"{v.severity.upper()}: {v.package} - {v.cve_id}")
        """
        packages = self._parse_requirements(requirements_file)
        return self.scan_packages(packages)

    def scan_packages(self, packages: Dict[str, str]) -> List[Vulnerability]:
        """
        Scan package dictionary for vulnerabilities.

        Args:
            packages: Dict of {package_name: version}

        Returns:
            List of found vulnerabilities
        """
        vulns = []
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        for pkg_name, pkg_version in packages.items():
            cursor.execute('''
                SELECT cve_id, package, affected_versions, severity, description, published_date
                FROM vulnerabilities
                WHERE LOWER(package) = LOWER(?)
            ''', (pkg_name,))

            for row in cursor.fetchall():
                # Check if installed version is affected
                if self._is_version_affected(pkg_version, row[2]):
                    vulns.append(Vulnerability(
                        cve_id=row[0],
                        package=row[1],
                        affected_versions=row[2],
                        severity=row[3],
                        description=row[4],
                        published_date=row[5]
                    ))

        conn.close()

        # Sort by severity (critical first)
        severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        vulns.sort(key=lambda v: severity_order.get(v.severity, 4))

        return vulns

    def _parse_requirements(self, filepath: str) -> Dict[str, str]:
        """
        Parse requirements.txt into package:version dict.

        Handles:
        - package==version
        - package>=version
        - package~=version
        - Comments and blank lines
        """
        packages = {}

        with open(filepath) as f:
            for line in f:
                line = line.strip()

                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue

                # Remove inline comments
                if '#' in line:
                    line = line.split('#')[0].strip()

                # Parse package specifier
                # Supports: ==, >=, <=, ~=, >, <
                match = re.match(r'([a-zA-Z0-9_-]+)\s*([><=~!]+)\s*([0-9.]+)', line)
                if match:
                    pkg_name, operator, version = match.groups()
                    packages[pkg_name.strip()] = version.strip()

        return packages

    def _is_version_affected(self, installed_version: str, affected_range: str) -> bool:
        """
        Check if installed version falls within affected range.

        Args:
            installed_version: Installed package version (e.g., "2.1.0")
            affected_range: Affected version range (e.g., "<2.2.0", ">=1.0,<2.0")

        Returns:
            True if version is affected
        """
        try:
            # Parse version into comparable tuple
            installed = self._parse_version(installed_version)

            # Handle different range formats
            if ',' in affected_range:
                # Multiple conditions: ">=1.0,<2.0"
                conditions = [c.strip() for c in affected_range.split(',')]
                return all(self._check_condition(installed, cond) for cond in conditions)
            else:
                # Single condition
                return self._check_condition(installed, affected_range)

        except Exception:
            # If version parsing fails, err on side of caution
            return True

    def _parse_version(self, version: str) -> tuple:
        """
        Parse version string into comparable tuple.

        Examples:
            "2.1.0" -> (2, 1, 0)
            "1.0" -> (1, 0, 0)
        """
        parts = version.split('.')
        # Pad to 3 parts
        while len(parts) < 3:
            parts.append('0')

        return tuple(int(p) for p in parts[:3])

    def _check_condition(self, installed: tuple, condition: str) -> bool:
        """Check if installed version matches condition."""
        # Extract operator and version from condition
        match = re.match(r'([><=!]+)\s*([0-9.]+)', condition.strip())
        if not match:
            return False

        operator, version_str = match.groups()
        target = self._parse_version(version_str)

        # Compare versions based on operator
        if operator == '<':
            return installed < target
        elif operator == '<=':
            return installed <= target
        elif operator == '>':
            return installed > target
        elif operator == '>=':
            return installed >= target
        elif operator == '==':
            return installed == target
        elif operator == '!=':
            return installed != target
        else:
            return False

    def add_vulnerability(self, cve_id: str, package: str, affected_versions: str,
                         severity: str, description: str, published_date: str = None):
        """
        Add vulnerability to database (for updates).

        Args:
            cve_id: CVE identifier
            package: Package name
            affected_versions: Version range specification
            severity: Severity level
            description: Vulnerability description
            published_date: Publication date
        """
        if published_date is None:
            published_date = datetime.now().isoformat()

        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            INSERT OR REPLACE INTO vulnerabilities
            (cve_id, package, affected_versions, severity, description, published_date, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (cve_id, package, affected_versions, severity, description, published_date, time.time()))
        conn.commit()
        conn.close()

    def update_from_json(self, json_file: str):
        """
        Bulk update database from JSON file.

        Expected format:
        [
            {
                "cve_id": "CVE-2023-1234",
                "package": "requests",
                "affected_versions": "<2.30.0",
                "severity": "high",
                "description": "...",
                "published_date": "2023-01-01"
            },
            ...
        ]

        Args:
            json_file: Path to JSON file with vulnerabilities
        """
        with open(json_file) as f:
            vulns = json.load(f)

        conn = sqlite3.connect(self.db_path)

        for vuln in vulns:
            conn.execute('''
                INSERT OR REPLACE INTO vulnerabilities
                (cve_id, package, affected_versions, severity, description, published_date, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                vuln['cve_id'],
                vuln['package'],
                vuln['affected_versions'],
                vuln['severity'],
                vuln.get('description', ''),
                vuln.get('published_date', ''),
                time.time()
            ))

        conn.commit()

        # Update metadata
        conn.execute('''
            INSERT OR REPLACE INTO metadata (key, value)
            VALUES ('last_updated', ?)
        ''', (datetime.now().isoformat(),))
        conn.commit()

        conn.close()

    def get_stats(self) -> Dict:
        """Get database statistics."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM vulnerabilities')
        total_vulns = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(DISTINCT package) FROM vulnerabilities')
        affected_packages = cursor.fetchone()[0]

        cursor.execute('SELECT severity, COUNT(*) FROM vulnerabilities GROUP BY severity')
        by_severity = dict(cursor.fetchall())

        cursor.execute('SELECT value FROM metadata WHERE key = "last_updated"')
        row = cursor.fetchone()
        last_updated = row[0] if row else 'Never'

        conn.close()

        return {
            'total_vulnerabilities': total_vulns,
            'affected_packages': affected_packages,
            'by_severity': by_severity,
            'last_updated': last_updated,
            'database_size_kb': self.db_path.stat().st_size / 1024 if self.db_path.exists() else 0
        }

    def print_report(self, vulns: List[Vulnerability]):
        """Print formatted vulnerability report."""
        if not vulns:
            print("\n✓ No known vulnerabilities found")
            return

        print("\n" + "="*60)
        print(f"SECURITY VULNERABILITIES FOUND: {len(vulns)}")
        print("="*60)

        # Group by severity
        by_severity = {}
        for v in vulns:
            by_severity.setdefault(v.severity, []).append(v)

        for severity in ['critical', 'high', 'medium', 'low']:
            if severity not in by_severity:
                continue

            print(f"\n{severity.upper()} ({len(by_severity[severity])})")
            print("-" * 60)

            for v in by_severity[severity]:
                print(f"\n  {v.cve_id}: {v.package} {v.affected_versions}")
                print(f"  {v.description[:100]}...")

        print("\n" + "="*60)


# Bundled common vulnerability data (starter database)
BUNDLED_VULNS = [
    {
        "cve_id": "CVE-2023-32681",
        "package": "requests",
        "affected_versions": "<2.31.0",
        "severity": "medium",
        "description": "Proxy-Authorization header leak on redirect",
        "published_date": "2023-05-26"
    },
    {
        "cve_id": "CVE-2023-43804",
        "package": "urllib3",
        "affected_versions": "<1.26.17,>=2.0.0,<2.0.6",
        "severity": "medium",
        "description": "Cookie leakage via HTTP redirect",
        "published_date": "2023-10-04"
    },
    {
        "cve_id": "CVE-2023-45803",
        "package": "urllib3",
        "affected_versions": "<1.26.18,>=2.0.0,<2.0.7",
        "severity": "medium",
        "description": "Request header injection vulnerability",
        "published_date": "2023-10-17"
    },
]


def initialize_bundled_database(db_path: str = None):
    """Initialize database with bundled vulnerability data."""
    scanner = LocalVulnerabilityScanner(db_path)

    conn = sqlite3.connect(scanner.db_path)
    cursor = conn.cursor()

    # Check if already initialized
    cursor.execute('SELECT COUNT(*) FROM vulnerabilities')
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Insert bundled data
    for vuln in BUNDLED_VULNS:
        scanner.add_vulnerability(**vuln)

    conn.close()
    print(f"✓ Initialized database with {len(BUNDLED_VULNS)} vulnerabilities")


if __name__ == '__main__':
    # Test/demo mode
    import sys

    print("Local Vulnerability Scanner - Test Mode")
    print("="*60)

    # Initialize with bundled data
    scanner = LocalVulnerabilityScanner()
    initialize_bundled_database()

    # Get stats
    stats = scanner.get_stats()
    print(f"\nDatabase Stats:")
    print(f"  Vulnerabilities: {stats['total_vulnerabilities']}")
    print(f"  Packages:        {stats['affected_packages']}")
    print(f"  Last Updated:    {stats['last_updated']}")

    # Test scan
    if len(sys.argv) > 1:
        req_file = sys.argv[1]
        print(f"\nScanning: {req_file}")
        vulns = scanner.scan_requirements(req_file)
        scanner.print_report(vulns)
    else:
        print("\nUsage: python vuln_scanner.py <requirements.txt>")
