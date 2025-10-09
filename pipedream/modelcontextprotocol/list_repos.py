#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Quick script to list all GitHub repositories using the optimized system.
"""
import asyncio
import os
import sys
from pathlib import Path

# Fix Windows console encoding
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Add gitops to path
sys.path.insert(0, str(Path(__file__).parent))

from gitops.lib.github_client import GitHubAPIClient
from gitops.lib.env_loader import load_env

async def list_user_repos():
    """List all repositories for the authenticated user."""
    # Try environment variable first, then .env file
    token = os.getenv('GH_TOKEN')
    if not token:
        load_env()
        token = os.getenv('GH_TOKEN')

    if not token:
        print("Error: GH_TOKEN not found in environment or .env file")
        return

    print("Fetching your GitHub repositories...")
    print("=" * 60)

    async with GitHubAPIClient(token) as client:
        # Get authenticated user info
        user = await client.get('user')
        username = user['login']
        print(f"\nAuthenticated as: {username}")
        print(f"Public repos: {user['public_repos']}")
        print(f"Total repos: {user.get('total_private_repos', 0) + user['public_repos']}")

        # Fetch all repositories (supports pagination)
        print("\nFetching repository list...")
        repos = await client.paginate('user/repos', {'per_page': 100}, max_pages=20)

        print(f"\nFound {len(repos)} repositories:")
        print("-" * 60)

        # Categorize repos
        forks = []
        owned = []

        for repo in repos:
            if repo['fork']:
                forks.append(repo)
            else:
                owned.append(repo)

        # Show owned repos
        if owned:
            print(f"\n📦 OWNED REPOSITORIES ({len(owned)}):")
            for repo in sorted(owned, key=lambda r: r['updated_at'], reverse=True)[:10]:
                stars = repo.get('stargazers_count', 0)
                updated = repo['updated_at'][:10]
                print(f"  {repo['name']:40} ⭐ {stars:4} (updated: {updated})")
            if len(owned) > 10:
                print(f"  ... and {len(owned) - 10} more")

        # Show forks
        if forks:
            print(f"\n🍴 FORKED REPOSITORIES ({len(forks)}):")
            for repo in sorted(forks, key=lambda r: r['updated_at'], reverse=True)[:10]:
                updated = repo['updated_at'][:10]
                parent = repo.get('parent', {}).get('full_name', 'unknown')
                print(f"  {repo['name']:40} ← {parent} (updated: {updated})")
            if len(forks) > 10:
                print(f"  ... and {len(forks) - 10} more")

        # Show performance metrics
        print()
        client.print_metrics()

        return repos

if __name__ == '__main__':
    repos = asyncio.run(list_user_repos())
