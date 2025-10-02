#!/bin/bash

# This script starts the modelcontextprotocol server and the gemini-cli client,
# and pipes them together for seamless communication.

# Exit on error
set -e

# Create two named pipes (FIFOs) for bidirectional communication.
# We use mktemp to create temporary, unique filenames for the pipes.
PIPE_SERVER_TO_CLIENT=$(mktemp -u)
PIPE_CLIENT_TO_SERVER=$(mktemp -u)

# Create the named pipes on the filesystem.
mkfifo "$PIPE_SERVER_TO_CLIENT"
mkfifo "$PIPE_CLIENT_TO_SERVER"

# Trap exit signals to ensure cleanup of the named pipes.
trap 'rm -f "$PIPE_SERVER_TO_CLIENT" "$PIPE_CLIENT_TO_SERVER"' EXIT

echo "Starting server and client..."

# Start the stdio server in the background.
# Its standard input is read from the client-to-server pipe.
# Its standard output is written to the server-to-client pipe.
pnpm prod:stdio < "$PIPE_CLIENT_TO_SERVER" > "$PIPE_SERVER_TO_CLIENT" &
SERVER_PID=$!

# Start the gemini-cli in the background.
# Its standard input is read from the server-to-client pipe.
# Its standard output is written to the client-to-server pipe.
# We run this in the agentrpc/gemini-cli directory.
(cd agentrpc/gemini-cli && npm start -- < "$PIPE_SERVER_TO_CLIENT" > "$PIPE_CLIENT_TO_SERVER") &
CLIENT_PID=$!

echo "Server (PID: $SERVER_PID) and Client (PID: $CLIENT_PID) are running."
echo "You can now interact with the gemini-cli."

# Wait for the client process to exit.
# When the user exits the CLI, the script will then terminate the server
# and clean up the pipes.
wait $CLIENT_PID
