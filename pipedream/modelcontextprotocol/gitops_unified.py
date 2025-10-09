#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitOps Unified Toolchain - Single entry point for all operations.

This consolidates ALL operations into a single, cohesive command-line tool:
- CLI operations (pr, fork, quality, health, conflict, optimize)
- MCP server management
- Database updates (vulnerability DB)
- System diagnostics and health checks
- Performance benchmarking

Usage:
    gitops-unified cli <command>      # Run CLI commands
    gitops-unified mcp-server          # Start MCP server
    gitops-unified update-db           # Update vulnerability database
    gitops-unified doctor              # System health check
    gitops-unified benchmark           # Performance benchmarks
    gitops-unified version             # Show version info

Examples:
    gitops-unified cli pr merge --repo owner/repo --pr 123 --safe
    gitops-unified cli fork sync --all
    gitops-unified doctor
"""

import sys
import os
import asyncio
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add gitops to path
sys.path.insert(0, str(Path(__file__).parent))


class UnifiedToolchain:
    """Single unified entry point for all GitOps operations."""

    VERSION = "2.0.0-optimized"

    def __init__(self):
        self.commands = {
            'cli': self.run_cli,
            'mcp-server': self.run_mcp_server,
            'update-db': self.update_databases,
            'doctor': self.run_doctor,
            'benchmark': self.run_benchmark,
            'cache-stats': self.show_cache_stats,
            'version': self.show_version,
            'help': self.show_help,
        }

    def run(self, args):
        """Main entry point."""
        if len(args) < 2:
            self.show_help()
            return 1

        command = args[1]
        if command not in self.commands:
            print(f"Unknown command: {command}")
            self.show_help()
            return 1

        try:
            return self.commands[command](args[2:])
        except Exception as e:
            print(f"✗ Error: {e}")
            return 1

    def run_cli(self, args):
        """Run CLI commands."""
        # Add gitops package to Python path
        gitops_path = Path(__file__).parent / 'gitops'
        if str(gitops_path) not in sys.path:
            sys.path.insert(0, str(gitops_path))

        from gitops.gitops import main
        sys.argv = ['gitops'] + args
        return main()

    def run_mcp_server(self, args):
        """Start MCP server."""
        import subprocess

        mcp_server = Path(__file__).parent / 'mcp-server' / 'dist' / 'index.js'

        if not mcp_server.exists():
            print("✗ MCP server not built. Run: cd mcp-server && npm run build")
            return 1

        print("Starting MCP server...")
        return subprocess.run(['node', str(mcp_server)]).returncode

    def update_databases(self, args):
        """Update vulnerability and other offline databases."""
        from gitops.lib.vuln_scanner import LocalVulnerabilityScanner, initialize_bundled_database

        print("Updating vulnerability database...")
        print("="*60)

        # Initialize/update local database
        scanner = LocalVulnerabilityScanner()
        initialize_bundled_database()

        stats = scanner.get_stats()
        print(f"\n✓ Database updated successfully")
        print(f"  Total vulnerabilities: {stats['total_vulnerabilities']}")
        print(f"  Affected packages:     {stats['affected_packages']}")
        print(f"  Database size:         {stats['database_size_kb']:.1f} KB")
        print(f"  Last updated:          {stats['last_updated']}")

        print("\nNote: For latest CVE data, download updated database from:")
        print("  https://github.com/pyupio/safety-db")

        return 0

    def run_doctor(self, args):
        """Comprehensive system health check."""
        print("GitOps System Doctor")
        print("="*60)

        all_ok = True

        # Check Python version
        print("\n[Python Environment]")
        import sys
        py_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
        if sys.version_info >= (3, 8):
            print(f"✓ Python {py_version}")
        else:
            print(f"✗ Python {py_version} (need 3.8+)")
            all_ok = False

        # Check dependencies
        print("\n[Dependencies]")
        deps = {
            'aiohttp': 'GitHub API client',
            'aiosqlite': 'Cache database',
            'psutil': 'System monitoring',
            'radon': 'Code analysis'
        }

        for dep, desc in deps.items():
            try:
                __import__(dep)
                print(f"✓ {dep:15} {desc}")
            except ImportError:
                print(f"✗ {dep:15} {desc} - MISSING")
                all_ok = False

        # Check configuration
        print("\n[Configuration]")
        env_file = Path('.env')
        if env_file.exists():
            print(f"✓ .env file found")

            # Load and check env vars
            from gitops.lib.env_loader import load_env
            env_vars = load_env()

            if 'GH_TOKEN' in env_vars:
                print(f"✓ GH_TOKEN configured")
            else:
                print(f"✗ GH_TOKEN not set in .env")
                all_ok = False
        else:
            print(f"⚠ .env file not found (using environment variables)")

        # Check GitHub token
        token = os.getenv('GH_TOKEN')
        if token:
            print(f"✓ GitHub token available ({len(token)} chars)")
        else:
            print(f"✗ GitHub token not found")
            all_ok = False

        # Check databases
        print("\n[Databases]")
        cache_db = Path.home() / '.gitops' / 'cache' / 'api_cache_enhanced.db'
        if cache_db.exists():
            size = cache_db.stat().st_size / 1024 / 1024
            print(f"✓ API cache ({size:.2f} MB)")
        else:
            print(f"⚠ API cache not initialized (will create on first use)")

        vuln_db = Path.home() / '.gitops' / 'data' / 'vulndb.sqlite'
        if vuln_db.exists():
            size = vuln_db.stat().st_size / 1024
            print(f"✓ Vulnerability DB ({size:.1f} KB)")
        else:
            print(f"⚠ Vulnerability DB not initialized")
            print(f"  Run: gitops-unified update-db")

        # Check GitHub connectivity
        print("\n[Network Connectivity]")
        try:
            import socket
            socket.create_connection(('api.github.com', 443), timeout=5)
            print("✓ GitHub API reachable")
        except:
            print("✗ GitHub API unreachable")
            print("  System will use offline mode with cached data")

        # Check MCP server
        print("\n[MCP Server]")
        mcp_server = Path(__file__).parent / 'mcp-server' / 'dist' / 'index.js'
        if mcp_server.exists():
            print(f"✓ MCP server built")
        else:
            print(f"⚠ MCP server not built")
            print(f"  Run: cd mcp-server && npm install && npm run build")

        # Summary
        print("\n" + "="*60)
        if all_ok:
            print("✓ System is healthy and ready")
            return 0
        else:
            print("⚠ System has some issues (see above)")
            return 1

    def run_benchmark(self, args):
        """Run performance benchmarks."""
        print("Performance Benchmark Suite")
        print("="*60)

        token = os.getenv('GH_TOKEN')
        if not token:
            print("✗ GH_TOKEN not set, cannot run benchmarks")
            return 1

        async def run_benchmarks():
            from gitops.lib.github_client import GitHubAPIClient
            import time

            async with GitHubAPIClient(token) as client:
                print("\n[Benchmark 1] Single API request")
                start = time.perf_counter()
                await client.get('rate_limit')
                duration = (time.perf_counter() - start) * 1000
                print(f"  Duration: {duration:.2f}ms")

                print("\n[Benchmark 2] Cached request (should be faster)")
                start = time.perf_counter()
                await client.get('rate_limit')
                duration = (time.perf_counter() - start) * 1000
                print(f"  Duration: {duration:.2f}ms (from cache)")

                print("\n[Benchmark 3] Parallel requests (3x)")
                start = time.perf_counter()
                await client.get_many([
                    'repos/microsoft/vscode',
                    'repos/python/cpython',
                    'repos/torvalds/linux'
                ])
                duration = (time.perf_counter() - start) * 1000
                print(f"  Duration: {duration:.2f}ms ({duration/3:.2f}ms per request)")

                print("\n[Benchmark 4] Sequential requests (3x)")
                start = time.perf_counter()
                for repo in ['microsoft/vscode', 'python/cpython', 'torvalds/linux']:
                    await client.get(f'repos/{repo}')
                duration = (time.perf_counter() - start) * 1000
                print(f"  Duration: {duration:.2f}ms ({duration/3:.2f}ms per request)")

                # Show metrics
                print("\n")
                client.print_metrics()

        asyncio.run(run_benchmarks())
        return 0

    def show_cache_stats(self, args):
        """Show cache statistics."""
        from gitops.lib.api_cache_enhanced import EnhancedAPICache

        cache = EnhancedAPICache()
        cache.print_stats()
        return 0

    def show_version(self, args):
        """Show version information."""
        print(f"GitOps Unified Toolchain v{self.VERSION}")
        print(f"\nComponents:")
        print(f"  - GitOps CLI (Python)")
        print(f"  - MCP Server (TypeScript)")
        print(f"  - Enhanced API Cache")
        print(f"  - Local Vulnerability Scanner")
        print(f"  - Optimized GitHub Client")
        return 0

    def show_help(self):
        """Show help message."""
        print(__doc__)


def main():
    """Main entry point."""
    toolchain = UnifiedToolchain()
    return toolchain.run(sys.argv)


if __name__ == '__main__':
    sys.exit(main())
