.PHONY: all setup build test clean

all: setup build test

setup:
	./bootstrap.sh

build:
	@echo "--- Building Node.js example ---"
	(cd agentrpc/examples/node && npm run build)
	@echo "--- Building Go example ---"
	(cd agentrpc/examples/go && go build ./...)
	@echo "--- Building Python example (installing package) ---"
	(cd agentrpc/examples/python && pip install .)

test:
	@echo "--- Testing Node.js example ---"
	(cd agentrpc/examples/node && npm test)
	@echo "--- Testing Go example ---"
	(cd agentrpc/examples/go && go test ./...)
	@echo "--- Skipping Python tests (no explicit test command found) ---"

clean:
	@echo "--- Cleaning Node.js example ---"
	(cd agentrpc/examples/node && rm -rf dist)
	@echo "--- Cleaning Go example ---"
	(cd agentrpc/examples/go && go clean)
	@echo "--- Cleaning Python example ---"
	(cd agentrpc/examples/python && rm -rf build dist *.egg-info)
	@echo "--- Cleaning root dependencies ---"
	rm -rf node_modules
	@echo "--- Cleaning documentation files ---"
	rm -f docs/pipedream-mcp-server.md
	@echo "--- Cleaning example files ---"
	rm -f agentrpc/examples/node/call.ts
	rm -f agentrpc/examples/python/register.py
	rm -f agentrpc/examples/go/call.go
	@echo "--- Cleaning .env.example ---"
	rm -f .env.example
	@echo "--- Cleaning root README.md ---"
	rm -f README.md
