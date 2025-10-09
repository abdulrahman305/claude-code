#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sync all forks and update dependencies across repositories.
"""
import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Tuple
import json

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add gitops to path
sys.path.insert(0, str(Path(__file__).parent))

from gitops.lib.github_client import GitHubAPIClient
from gitops.lib.env_loader import load_env

class ForkSyncManager:
    """Manages fork synchronization operations."""

    def __init__(self, client: GitHubAPIClient):
        self.client = client
        self.stats = {
            'total_forks': 0,
            'checked': 0,
            'behind': 0,
            'synced': 0,
            'failed': 0,
            'errors': []
        }

    async def check_fork_status(self, repo: Dict) -> Tuple[bool, int, int]:
        """
        Check if fork is behind upstream.
        Returns: (needs_sync, behind_by, ahead_by)
        """
        if not repo.get('parent'):
            return False, 0, 0

        try:
            owner = repo['owner']['login']
            name = repo['name']
            default_branch = repo['default_branch']
            parent_owner = repo['parent']['owner']['login']
            parent_name = repo['parent']['name']

            # Get comparison
            comparison = await self.client.get(
                f"repos/{owner}/{name}/compare/{parent_owner}:{default_branch}...{owner}:{default_branch}"
            )

            behind_by = comparison.get('behind_by', 0)
            ahead_by = comparison.get('ahead_by', 0)

            return behind_by > 0, behind_by, ahead_by

        except Exception as e:
            self.stats['errors'].append(f"{repo['name']}: {str(e)}")
            return False, 0, 0

    async def sync_fork(self, repo: Dict) -> bool:
        """
        Sync fork with upstream using GitHub's sync endpoint.
        """
        try:
            owner = repo['owner']['login']
            name = repo['name']
            default_branch = repo['default_branch']
            parent_owner = repo['parent']['owner']['login']

            # Use GitHub's sync fork endpoint
            result = await self.client.post(
                f"repos/{owner}/{name}/merge-upstream",
                json_data={
                    'branch': default_branch
                }
            )

            return True

        except Exception as e:
            self.stats['errors'].append(f"Sync failed for {repo['name']}: {str(e)}")
            return False

    async def process_all_forks(self, forks: List[Dict], batch_size: int = 50, sync: bool = True):
        """Process all forks in batches."""
        self.stats['total_forks'] = len(forks)

        print(f"\nProcessing {len(forks)} forks...")
        print("=" * 60)

        # Process in batches to avoid rate limiting
        for i in range(0, len(forks), batch_size):
            batch = forks[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(forks) + batch_size - 1) // batch_size

            print(f"\nBatch {batch_num}/{total_batches} (repos {i+1}-{min(i+batch_size, len(forks))})")

            # Check status for all in batch
            tasks = []
            for repo in batch:
                tasks.append(self.check_fork_status(repo))

            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            for repo, result in zip(batch, results):
                if isinstance(result, Exception):
                    self.stats['errors'].append(f"{repo['name']}: {str(result)}")
                    continue

                self.stats['checked'] += 1
                needs_sync, behind_by, ahead_by = result

                if needs_sync:
                    self.stats['behind'] += 1
                    print(f"  {repo['name']:50} behind by {behind_by:4} commits", end='')

                    if sync:
                        # Attempt to sync
                        synced = await self.sync_fork(repo)
                        if synced:
                            self.stats['synced'] += 1
                            print(" -> SYNCED")
                        else:
                            self.stats['failed'] += 1
                            print(" -> FAILED")
                    else:
                        print(" -> needs sync")

            # Small delay between batches
            if i + batch_size < len(forks):
                await asyncio.sleep(1)

        return self.stats

class DependencyScanner:
    """Scans repositories for outdated dependencies."""

    def __init__(self, client: GitHubAPIClient):
        self.client = client
        self.stats = {
            'total_repos': 0,
            'scanned': 0,
            'has_dependencies': 0,
            'alerts': 0,
            'repos_with_alerts': []
        }

    async def check_dependency_alerts(self, repo: Dict) -> List[Dict]:
        """Check for Dependabot alerts."""
        try:
            owner = repo['owner']['login']
            name = repo['name']

            # Get Dependabot alerts
            alerts = await self.client.get(
                f"repos/{owner}/{name}/dependabot/alerts",
                {'state': 'open'}
            )

            return alerts or []

        except Exception as e:
            # Repo might not have Dependabot enabled or alerts endpoint access
            return []

    async def check_package_files(self, repo: Dict) -> Dict:
        """Check for package manager files."""
        try:
            owner = repo['owner']['login']
            name = repo['name']

            # Common dependency files
            dep_files = {
                'package.json': False,      # npm
                'requirements.txt': False,  # pip
                'Gemfile': False,          # ruby
                'go.mod': False,           # go
                'Cargo.toml': False,       # rust
                'pom.xml': False,          # maven
                'build.gradle': False,     # gradle
                'composer.json': False,    # php
            }

            # Check repository contents
            try:
                contents = await self.client.get(f"repos/{owner}/{name}/contents")
                if contents:
                    file_names = [item['name'] for item in contents if item['type'] == 'file']
                    for dep_file in dep_files:
                        if dep_file in file_names:
                            dep_files[dep_file] = True
            except:
                pass

            return dep_files

        except Exception as e:
            return {}

    async def scan_repositories(self, repos: List[Dict], batch_size: int = 30):
        """Scan repositories for dependency issues."""
        self.stats['total_repos'] = len(repos)

        print(f"\nScanning {len(repos)} repositories for dependencies...")
        print("=" * 60)

        # Process in batches
        for i in range(0, len(repos), batch_size):
            batch = repos[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(repos) + batch_size - 1) // batch_size

            print(f"\nBatch {batch_num}/{total_batches} (repos {i+1}-{min(i+batch_size, len(repos))})")

            # Check alerts for all in batch
            tasks = []
            for repo in batch:
                tasks.append(self.check_dependency_alerts(repo))

            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            for repo, alerts in zip(batch, results):
                if isinstance(alerts, Exception):
                    continue

                self.stats['scanned'] += 1

                if alerts and len(alerts) > 0:
                    self.stats['alerts'] += len(alerts)
                    self.stats['repos_with_alerts'].append({
                        'repo': repo,
                        'alert_count': len(alerts),
                        'alerts': alerts
                    })

                    severity_counts = {}
                    for alert in alerts:
                        severity = alert.get('security_advisory', {}).get('severity', 'unknown')
                        severity_counts[severity] = severity_counts.get(severity, 0) + 1

                    severity_str = ', '.join([f"{k}: {v}" for k, v in severity_counts.items()])
                    print(f"  {repo['name']:50} {len(alerts)} alerts ({severity_str})")

            # Small delay between batches
            if i + batch_size < len(repos):
                await asyncio.sleep(1)

        return self.stats

async def main():
    """Main execution function."""
    # Get token
    token = os.getenv('GH_TOKEN')
    if not token:
        load_env()
        token = os.getenv('GH_TOKEN')

    if not token:
        print("Error: GH_TOKEN not found")
        return

    print("=" * 60)
    print("GITHUB REPOSITORY SYNC & DEPENDENCY UPDATE")
    print("=" * 60)

    async with GitHubAPIClient(token) as client:
        # Fetch all repos
        print("\nFetching repositories...")
        repos = await client.paginate('user/repos', {'per_page': 100}, max_pages=20)

        # Separate forks and owned
        forks = [r for r in repos if r['fork']]
        owned = [r for r in repos if not r['fork']]

        print(f"Total: {len(repos)} repos ({len(owned)} owned, {len(forks)} forks)")

        # PHASE 1: Fork Synchronization
        print("\n" + "=" * 60)
        print("PHASE 1: FORK SYNCHRONIZATION")
        print("=" * 60)

        sync_manager = ForkSyncManager(client)
        fork_stats = await sync_manager.process_all_forks(forks, batch_size=50, sync=True)

        # PHASE 2: Dependency Scanning
        print("\n" + "=" * 60)
        print("PHASE 2: DEPENDENCY SCANNING")
        print("=" * 60)

        # Scan owned repos (more likely to have write access for alerts)
        dep_scanner = DependencyScanner(client)
        dep_stats = await dep_scanner.scan_repositories(owned[:100], batch_size=30)  # Limit to 100 for now

        # FINAL SUMMARY
        print("\n" + "=" * 60)
        print("FINAL SUMMARY")
        print("=" * 60)

        print(f"\nFork Synchronization:")
        print(f"  Total forks: {fork_stats['total_forks']}")
        print(f"  Checked: {fork_stats['checked']}")
        print(f"  Behind upstream: {fork_stats['behind']}")
        print(f"  Successfully synced: {fork_stats['synced']}")
        print(f"  Failed to sync: {fork_stats['failed']}")

        print(f"\nDependency Scanning:")
        print(f"  Repositories scanned: {dep_stats['scanned']}")
        print(f"  Total security alerts: {dep_stats['alerts']}")
        print(f"  Repos with alerts: {len(dep_stats['repos_with_alerts'])}")

        if fork_stats['errors']:
            print(f"\nErrors encountered: {len(fork_stats['errors'])}")
            print("First 5 errors:")
            for error in fork_stats['errors'][:5]:
                print(f"  - {error}")

        # Performance metrics
        print()
        client.print_metrics()

        # Save detailed report
        report = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'fork_stats': fork_stats,
            'dependency_stats': {
                'scanned': dep_stats['scanned'],
                'total_alerts': dep_stats['alerts'],
                'repos_with_alerts': [
                    {
                        'name': item['repo']['name'],
                        'alert_count': item['alert_count']
                    }
                    for item in dep_stats['repos_with_alerts']
                ]
            }
        }

        report_file = Path('update_report.json')
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\nDetailed report saved to: {report_file}")

if __name__ == '__main__':
    asyncio.run(main())
