#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Analyze GitHub repositories to identify those needing updates.
"""
import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add gitops to path
sys.path.insert(0, str(Path(__file__).parent))

from gitops.lib.github_client import GitHubAPIClient
from gitops.lib.env_loader import load_env

async def analyze_fork_sync_status(client: GitHubAPIClient, fork_repos: List[Dict]) -> List[Dict]:
    """Analyze which forks are behind their upstream."""
    print("\nAnalyzing fork sync status...")
    print("=" * 60)

    needs_sync = []

    # Check first 20 forks (to avoid rate limiting)
    for repo in fork_repos[:20]:
        if not repo.get('parent'):
            continue

        try:
            # Compare commits between fork and upstream
            owner = repo['owner']['login']
            name = repo['name']
            default_branch = repo['default_branch']
            parent_owner = repo['parent']['owner']['login']

            # Get comparison
            comparison = await client.get(
                f"repos/{owner}/{name}/compare/{parent_owner}:{default_branch}...{owner}:{default_branch}"
            )

            behind_by = comparison.get('behind_by', 0)
            ahead_by = comparison.get('ahead_by', 0)

            if behind_by > 0:
                needs_sync.append({
                    'repo': repo,
                    'behind_by': behind_by,
                    'ahead_by': ahead_by
                })
                print(f"  {name:40} behind by {behind_by:3} commits")

        except Exception as e:
            continue

    return needs_sync

async def analyze_open_prs(client: GitHubAPIClient, repos: List[Dict]) -> List[Dict]:
    """Find repositories with open pull requests."""
    print("\nAnalyzing open pull requests...")
    print("=" * 60)

    repos_with_prs = []

    # Check first 20 owned repos
    owned_repos = [r for r in repos if not r['fork']][:20]

    for repo in owned_repos:
        try:
            owner = repo['owner']['login']
            name = repo['name']

            prs = await client.get(f"repos/{owner}/{name}/pulls", {'state': 'open'})

            if prs and len(prs) > 0:
                repos_with_prs.append({
                    'repo': repo,
                    'pr_count': len(prs),
                    'prs': prs
                })
                print(f"  {name:40} has {len(prs):2} open PRs")

        except Exception as e:
            continue

    return repos_with_prs

async def analyze_repository_health(client: GitHubAPIClient, repos: List[Dict]) -> Dict:
    """Analyze overall repository health metrics."""
    print("\nAnalyzing repository health...")
    print("=" * 60)

    metrics = {
        'archived': [],
        'no_activity_6_months': [],
        'private_repos': [],
        'public_repos': []
    }

    now = datetime.now(timezone.utc)
    six_months_ago = now.timestamp() - (180 * 24 * 60 * 60)

    for repo in repos:
        # Archived repos
        if repo.get('archived'):
            metrics['archived'].append(repo)

        # No activity in 6 months
        updated_at = datetime.fromisoformat(repo['updated_at'].replace('Z', '+00:00'))
        if updated_at.timestamp() < six_months_ago:
            metrics['no_activity_6_months'].append(repo)

        # Privacy
        if repo.get('private'):
            metrics['private_repos'].append(repo)
        else:
            metrics['public_repos'].append(repo)

    print(f"  Archived repos: {len(metrics['archived'])}")
    print(f"  No activity (6+ months): {len(metrics['no_activity_6_months'])}")
    print(f"  Private repos: {len(metrics['private_repos'])}")
    print(f"  Public repos: {len(metrics['public_repos'])}")

    return metrics

async def main():
    """Main analysis function."""
    # Get token
    token = os.getenv('GH_TOKEN')
    if not token:
        load_env()
        token = os.getenv('GH_TOKEN')

    if not token:
        print("Error: GH_TOKEN not found")
        return

    async with GitHubAPIClient(token) as client:
        # Fetch all repos
        print("Fetching repositories...")
        repos = await client.paginate('user/repos', {'per_page': 100}, max_pages=20)

        print(f"Found {len(repos)} total repositories\n")

        # Separate forks and owned
        forks = [r for r in repos if r['fork']]
        owned = [r for r in repos if not r['fork']]

        print(f"Owned: {len(owned)}, Forked: {len(forks)}")

        # Run analyses
        needs_sync = await analyze_fork_sync_status(client, forks)
        repos_with_prs = await analyze_open_prs(client, owned)
        health_metrics = await analyze_repository_health(client, repos)

        # Summary
        print("\n" + "=" * 60)
        print("ANALYSIS SUMMARY")
        print("=" * 60)
        print(f"\nForks needing sync: {len(needs_sync)}")
        print(f"Repos with open PRs: {len(repos_with_prs)}")
        print(f"Archived repos: {len(health_metrics['archived'])}")
        print(f"Inactive repos (6+ months): {len(health_metrics['no_activity_6_months'])}")

        # Performance metrics
        print()
        client.print_metrics()

        return {
            'needs_sync': needs_sync,
            'repos_with_prs': repos_with_prs,
            'health_metrics': health_metrics
        }

if __name__ == '__main__':
    results = asyncio.run(main())
