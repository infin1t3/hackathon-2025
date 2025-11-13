# Deploying Pubky MCP Server on Render

This guide will walk you through deploying the Pubky MCP Server on Render as an HTTP service.

## Prerequisites

- A GitHub account
- A Render account (sign up at https://render.com)
- Your code pushed to a GitHub repository

## Step-by-Step Deployment Guide

### Step 1: Push Your Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit: Pubky MCP Server with HTTP wrapper"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Sign Up / Log In to Render

1. Go to https://render.com
2. Sign up or log in with your GitHub account
3. Authorize Render to access your GitHub repositories

### Step 3: Create a New Web Service

1. In your Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect account"** if you haven't connected GitHub yet
4. Select your repository containing the `pubky-mcp-server`

### Step 4: Configure the Service

Fill in the following configuration:

**Basic Settings:**
- **Name**: `pubky-mcp-server` (or any name you prefer)
- **Region**: Choose the region closest to your users
- **Branch**: `main` (or your default branch)
- **Runtime**: `Node`
- **Root Directory**: `pubky-mcp-server` (if your repo has multiple projects)

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:http`

**Environment Variables:**
- `NODE_ENV`: `production`
- `PORT`: `3000` (Render will override this automatically, but it's good to have a default)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run the build command (fetches resources and compiles TypeScript)
   - Start the HTTP server
3. Monitor the build logs for any issues

### Step 6: Verify Deployment

Once deployed, Render will provide you with a URL like:
```
https://pubky-mcp-server.onrender.com
```

Test the endpoints:

1. **Health Check:**
   ```bash
   curl https://your-service.onrender.com/health
   ```

2. **List Resources:**
   ```bash
   curl https://your-service.onrender.com/api/resources
   ```

3. **List Tools:**
   ```bash
   curl https://your-service.onrender.com/api/tools
   ```

4. **Execute a Tool:**
   ```bash
   curl -X POST https://your-service.onrender.com/api/tools/get_pubky_concept \
     -H "Content-Type: application/json" \
     -d '{"arguments": {"concept": "homeserver"}}'
   ```

## API Endpoints

Once deployed, your server exposes the following REST API:

### Health Check
- `GET /health` - Server health status

### Resources
- `GET /api/resources` - List all available resources
- `GET /api/resources/:uri` - Get a specific resource (URI encoded)

### Tools
- `GET /api/tools` - List all available tools
- `POST /api/tools/:name` - Execute a tool
  ```json
  {
    "arguments": {
      "param1": "value1",
      "param2": "value2"
    }
  }
  ```

### Prompts
- `GET /api/prompts` - List all available prompts
- `POST /api/prompts/:name` - Get a prompt with arguments
  ```json
  {
    "arguments": {
      "param1": "value1"
    }
  }
  ```

## Using render.yaml (Alternative Method)

If you prefer using a configuration file:

1. The `render.yaml` file is already included in the repository
2. In Render dashboard, when creating a new service, select **"Apply render.yaml"**
3. Render will automatically use the configuration from `render.yaml`

## Troubleshooting

### Build Fails

**Issue**: Build command fails during deployment

**Solutions**:
- Check that `npm run build` completes successfully locally
- Ensure all dependencies are in `package.json`
- Check Render build logs for specific error messages

### Resources Not Found

**Issue**: Server starts but resources are missing

**Solutions**:
- The build command should run `npm run fetch-resources` automatically
- Check that the `data/` directory exists after build
- Verify build logs show "✅ All resources fetched successfully"

### Port Issues

**Issue**: Server doesn't start

**Solutions**:
- Render automatically sets the `PORT` environment variable
- The server listens on `0.0.0.0` and uses `process.env.PORT || 3000`
- Check Render logs for port binding errors

### Service Goes to Sleep (Free Plan)

**Issue**: Service is slow to respond after inactivity

**Solutions**:
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to a paid plan for always-on service
- Or use a service like UptimeRobot to ping your service periodically

## Environment Variables

You can add these in Render dashboard under **Environment** tab:

- `NODE_ENV`: `production` (default)
- `PORT`: Automatically set by Render (don't override)

## Monitoring

Render provides:
- **Logs**: Real-time logs in the dashboard
- **Metrics**: CPU, memory, and request metrics
- **Events**: Deployment and service events

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. Or manually trigger a deploy from the Render dashboard

## Cost Considerations

- **Free Tier**: 
  - 750 hours/month free
  - Services sleep after 15 minutes of inactivity
  - Good for development/testing

- **Paid Plans**: 
  - Always-on service
  - Better performance
  - More resources

## Next Steps

After deployment:

1. Test all API endpoints
2. Integrate the HTTP API into your applications
3. Set up monitoring/alerting
4. Consider adding authentication if needed
5. Document your API usage

## Support

For issues:
- Check Render logs: Dashboard → Your Service → Logs
- Render documentation: https://render.com/docs
- Pubky MCP Server issues: https://github.com/pubky/pubky-hackathon/issues

---

**Note**: The HTTP wrapper exposes MCP functionality via REST API. For local development with Cursor, continue using the stdio-based `index.js` entry point.

