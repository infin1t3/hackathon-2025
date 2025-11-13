# Quick Start: Deploy to Render

## 🚀 Ready to Deploy!

Your MCP server is now configured for Render deployment with HTTP transport support.

## What Changed

1. ✅ **Added HTTP Transport** (`src/server-http.ts`)
   - Uses `StreamableHTTPServerTransport` for HTTP/SSE communication
   - Stateless mode for better scalability
   - CORS enabled for browser clients

2. ✅ **Refactored Server Setup** (`src/server-setup.ts`)
   - Shared server logic for both stdio and HTTP transports
   - Reusable server creation function

3. ✅ **Updated Package.json**
   - Added `express` and `cors` dependencies
   - New scripts: `start:http` and `dev:http`

4. ✅ **Render Configuration** (`render.yaml`)
   - Pre-configured for Render deployment
   - Health check endpoint included

## Deploy Now

### Step 1: Commit and Push

```bash
git add .
git commit -m "Add HTTP transport for Render deployment"
git push origin main
```

### Step 2: Deploy to Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **Apply**

### Step 3: Get Your URL

After deployment, Render will give you a URL like:
```
https://pubky-mcp-server-xxxx.onrender.com
```

Your MCP endpoint:
```
https://pubky-mcp-server-xxxx.onrender.com/mcp
```

## Using in Cursor

**Important Note**: Cursor currently uses stdio transport, not HTTP. However:

- ✅ The HTTP server works with other MCP clients (MCP Inspector, Claude Code, etc.)
- ✅ The stdio version (`npm run start`) still works for Cursor via npm package
- ✅ Future Cursor versions may support HTTP transport

### For Cursor (Current - Stdio)

Use the npm package as before:
```json
{
  "mcpServers": {
    "pubky": {
      "command": "npx",
      "args": ["@pubky/mcp-server"]
    }
  }
}
```

### For HTTP-Compatible Clients

```json
{
  "mcpServers": {
    "pubky": {
      "url": "https://your-render-url.onrender.com/mcp",
      "transport": "http"
    }
  }
}
```

## Test Your Deployment

```bash
# Health check
curl https://your-render-url.onrender.com/health

# Test with MCP Inspector
npx @modelcontextprotocol/inspector https://your-render-url.onrender.com/mcp
```

## Files Created/Modified

- ✅ `src/server-http.ts` - HTTP server entry point
- ✅ `src/server-setup.ts` - Shared server setup
- ✅ `src/index.ts` - Updated to use shared setup
- ✅ `package.json` - Added Express dependencies
- ✅ `render.yaml` - Render deployment config
- ✅ `DEPLOY.md` - Detailed deployment guide

## Next Steps

1. Push to GitHub
2. Deploy to Render
3. Test the `/health` endpoint
4. Test with MCP Inspector
5. Share your URL with others!

---

**All functionality remains the same** - only the transport layer changed. Your 65+ tools, 25+ resources, and 10+ prompts all work identically! 🎉

