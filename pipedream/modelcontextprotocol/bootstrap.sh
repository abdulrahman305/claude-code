#!/bin/bash

# This script installs all dependencies for the monorepo.

set -e # Exit immediately if a command exits with a non-zero status.

echo "--- Installing root dependencies (pnpm) ---"
pnpm install

echo "\n--- Installing Node.js example dependencies (npm) ---"
(cd agentrpc/examples/node && npm install)

echo "\n--- Installing Python example dependencies (pip) ---"
(cd agentrpc/examples/python && pip install .)

echo "\n--- Installing Go example dependencies (go mod) ---"
(cd agentrpc/examples/go && go mod tidy)

echo "\n--- Bootstrap complete! ---"
