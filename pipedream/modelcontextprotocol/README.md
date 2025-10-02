# Model Context Protocol Monorepo

This repository contains several projects related to the Model Context Protocol (MCP), AI agent tooling, and other related services.

## Components

This is a monorepo containing the following main components:

### 1. Pipedream MCP Server

A reference implementation of a Model Context Protocol (MCP) server that integrates with Pipedream's platform.

- **Purpose**: To demonstrate how to self-host an MCP server to connect AI models with Pipedream's 2,800+ integrated APIs.
- **Details**: [Pipedream MCP Server Documentation](./docs/pipedream-mcp-server.md)

### 2. AgentRPC

A universal RPC (Remote Procedure Call) layer that allows AI agents to connect to functions and tools across different languages and network boundaries.

- **Purpose**: To provide a unified way for AI models to access tools, whether they are running locally, in a private VPC, or in the cloud.
- **SDKs**: Go, Python, Node.js/TypeScript
- **Details**: [AgentRPC README](./agentrpc/README.md)

### 3. Gemini CLI

A command-line interface for interacting with Google's Gemini models and potentially other services.

- **Purpose**: To provide a powerful CLI for AI-assisted development workflows.
- **Details**: This is located in the `agentrpc/packages/gemini-cli` directory. See the README within that package for more details.

### 4. Dolt

A Git-like database for data. This appears to be included as a submodule.

- **Purpose**: To provide versioned data storage and collaboration.
- **Details**: See the `dolt` directory for the submodule source and documentation.

## Getting Started

To get started with a specific component, please refer to its documentation linked above.