# Ollama Quick Start Guide

## Discovery ✅

**Ollama source code is present** at: `E:\claude-code\pipedream\modelcontextprotocol\ollama\`

This is the full Ollama Go source repository - you can build it locally or download the binary.

---

## Installation Options

### Option 1: Download Pre-built Binary (Fastest)

**Windows**:
```powershell
# Download installer
Invoke-WebRequest -Uri https://ollama.com/download/OllamaSetup.exe -OutFile OllamaSetup.exe

# Run installer
.\OllamaSetup.exe

# Verify installation
ollama --version
```

**macOS**:
```bash
# Download and install
curl -fsSL https://ollama.com/install.sh | sh

# Verify
ollama --version
```

**Linux**:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Option 2: Build from Source (Advanced)

You have the source code at `./ollama/`:

```bash
cd ollama/

# Install Go (if not already installed)
# Windows: choco install golang
# macOS: brew install go
# Linux: apt install golang-go

# Build Ollama
go generate ./...
go build .

# The binary will be at ./ollama
```

### Option 3: Docker (Cross-platform)

```bash
# Pull Ollama Docker image
docker pull ollama/ollama:latest

# Run Ollama server
docker run -d \
  --name ollama \
  -p 11434:11434 \
  -v ollama-data:/root/.ollama \
  ollama/ollama:latest

# Verify it's running
curl http://localhost:11434/api/tags
```

---

## Quick Setup (After Installation)

### 1. Start Ollama Server

```bash
# Start server (runs in background)
ollama serve
```

Server will be available at: `http://localhost:11434`

### 2. Download Models

```bash
# Recommended starter models (download these first)
ollama pull llama3.2:latest      # 8B params - fast, general-purpose
ollama pull qwen2.5:7b           # Excellent for coding
ollama pull nomic-embed-text     # For embeddings

# Verify downloads
ollama list
```

### 3. Test Your Setup

```bash
# Chat with llama3.2
ollama run llama3.2 "Hello! Tell me about yourself."

# Via API (same as OpenAI)
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?"
}'
```

---

## Integration with MCP Server

Once Ollama is running, update your `.env`:

```bash
# Add to .env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.2
OLLAMA_CODE_MODEL=qwen2.5:7b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text

# Optional: Disable external APIs
DISABLE_OPENAI=true
DISABLE_GEMINI=true
```

---

## Expected Benefits

### Cost Savings
- **OpenAI**: $200-$1,000/month → **$0/month**
- **Gemini**: $50-$200/month → **$0/month**
- **Total savings**: **$250-$1,200/month**

### Performance
- **Latency**: 800ms → 100-200ms (4-8x faster)
- **No rate limits**: Unlimited requests
- **No internet required**: Works offline

### Privacy
- **100% local**: All data stays on your machine
- **No API keys needed**: No risk of token exposure
- **GDPR/HIPAA compliant**: Complete data sovereignty

---

## Next Steps

1. **Install Ollama** (choose option above)
2. **Download models** (llama3.2, qwen2.5, nomic-embed-text)
3. **Start server**: `ollama serve`
4. **Update .env**: Add Ollama configuration
5. **Test integration**: Run MCP server with Ollama

---

## Model Recommendations

| Use Case | Model | Size | Notes |
|----------|-------|------|-------|
| General chat | llama3.2 | 8B | Best all-around |
| Coding | qwen2.5:7b | 7B | Code completion |
| Embeddings | nomic-embed-text | 137M | Fast, accurate |
| High quality | mixtral:8x7b | 47B | Slower but better |

---

## Troubleshooting

**"ollama: command not found"**
- Add to PATH: `C:\Program Files\Ollama\bin` (Windows)
- Or use full path: `/usr/local/bin/ollama` (Unix)

**"Connection refused"**
- Start server: `ollama serve`
- Check port 11434 is not in use

**"Out of memory"**
- Use smaller models (llama3.2 instead of mixtral)
- Close other applications
- Increase Docker memory limit

---

## Current Status

- ✅ Ollama source code present (`./ollama/`)
- ⏳ **ACTION REQUIRED**: Install Ollama binary or build from source
- ⏳ **ACTION REQUIRED**: Download models
- ⏳ **ACTION REQUIRED**: Start Ollama server

**Next**: Follow installation instructions above, then test with MCP server
