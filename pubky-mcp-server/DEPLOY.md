# Deploying Pubky MCP Server to Render

This guide explains how to deploy the Pubky MCP Server to Render so you can use it via HTTP in Cursor or other MCP clients.

## Prerequisites

- A Render account (free tier available)
- Git repository with your code

## Deployment Steps

### 1. Push Your Code to GitHub

Make sure your code is committed and pushed to your repository:

```bash
git add .
git commit -m "Add HTTP transport support for Render deployment"
git push origin main
```

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click **Apply** to deploy

#### Option B: Manual Configuration

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `pubky-mcp-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:http`
   - **Health Check Path**: `/health`
5. Add environment variables:
   - `PORT`: `10000` (Render will override this)
   - `NODE_ENV`: `production`
6. Click **Create Web Service**

### 3. Get Your Server URL

After deployment, Render will provide you with a URL like:
```
https://pubky-mcp-server.onrender.com
```

Your MCP endpoint will be at:
```
https://pubky-mcp-server.onrender.com/mcp
```

## Using in Cursor

**Note**: As of now, Cursor primarily supports stdio transport. However, you can use the HTTP endpoint with other MCP clients that support HTTP transport.

### For HTTP-Compatible Clients

If your client supports HTTP transport, configure it with:

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

### For Cursor (Stdio Transport)

Cursor uses stdio transport, so you'll need to use the npm package:

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

## Testing Your Deployment

### Health Check

```bash
curl https://your-render-url.onrender.com/health
```

Should return:
```json
{"status":"ok","service":"pubky-mcp-server"}
```

### MCP Endpoint Test

You can test the MCP endpoint using the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```bash
npx @modelcontextprotocol/inspector https://your-render-url.onrender.com/mcp
```

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Verify that `npm run build` works locally
- Check Render build logs for specific errors

### Server Not Starting

- Verify the start command: `npm run start:http`
- Check Render logs for runtime errors
- Ensure `PORT` environment variable is set (Render sets this automatically)

### Resources Not Found

The build process fetches resources automatically. If resources are missing:
- Check that `scripts/fetch-resources.sh` has execute permissions
- Verify network access during build (GitHub, nexus.pubky.app must be accessible)

## Environment Variables

You can add these in Render dashboard under your service settings:

- `PORT`: Port number (Render sets this automatically)
- `NODE_ENV`: `production` (recommended)

## Cost

Render's free tier includes:
- 750 hours/month of runtime
- Automatic sleep after 15 minutes of inactivity
- Free SSL certificates

For production use, consider upgrading to a paid plan for:
- Always-on service (no sleep)
- Better performance
- More resources

## Next Steps

After deployment:
1. Test the `/health` endpoint
2. Test the `/mcp` endpoint with MCP Inspector
3. Configure your MCP client to use the HTTP URL
4. Monitor logs in Render dashboard

