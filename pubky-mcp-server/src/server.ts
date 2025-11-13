#!/usr/bin/env node
/**
 * Pubky MCP Server - HTTP Wrapper
 * 
 * HTTP server wrapper for Render deployment that exposes MCP functionality
 * via REST API endpoints.
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { FileReader } from './utils/file-reader.js';
import { ResourceHandler } from './resources.js';
import { ToolHandler } from './tools.js';
import { PromptHandler } from './prompts.js';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module (works in ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to bundled data directory (dist/../data after build)
const DATA_ROOT = path.join(__dirname, '..', 'data');
const PUBKY_CORE_ROOT = path.join(DATA_ROOT, 'pubky-core');
const PKARR_ROOT = path.join(DATA_ROOT, 'pkarr');
const PKDNS_ROOT = path.join(DATA_ROOT, 'pkdns');
const NEXUS_ROOT = path.join(DATA_ROOT, 'pubky-nexus');
const WORKSPACE_ROOT = DATA_ROOT;

// Initialize handlers
const fileReader = new FileReader(PUBKY_CORE_ROOT, PKARR_ROOT, PKDNS_ROOT, NEXUS_ROOT);
const resourceHandler = new ResourceHandler(fileReader, WORKSPACE_ROOT);
const toolHandler = new ToolHandler(fileReader, PUBKY_CORE_ROOT, WORKSPACE_ROOT, PKARR_ROOT, PKDNS_ROOT, NEXUS_ROOT);
const promptHandler = new PromptHandler();

// Create Express app
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    service: 'pubky-mcp-server',
    version: '1.0.0'
  });
});

// Resources endpoints
app.get('/api/resources', async (req: Request, res: Response) => {
  try {
    const resources = await resourceHandler.listResources();
    res.json({ resources });
  } catch (error: any) {
    console.error('Error listing resources:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resources/:uri', async (req: Request, res: Response) => {
  try {
    const { uri } = req.params;
    const decodedUri = decodeURIComponent(uri);
    const resource = await resourceHandler.getResource(decodedUri);
    res.json(resource);
  } catch (error: any) {
    console.error('Error reading resource:', error);
    res.status(404).json({ error: error.message });
  }
});

// Tools endpoints
app.get('/api/tools', (req: Request, res: Response) => {
  try {
    const tools = toolHandler.listTools();
    res.json({ tools });
  } catch (error: any) {
    console.error('Error listing tools:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tools/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const args = req.body.arguments || {};
    const result = await toolHandler.executeTool(name, args);
    res.json(result);
  } catch (error: any) {
    console.error('Error executing tool:', error);
    res.status(500).json({ 
      content: [{
        type: 'text',
        text: `Error: ${error.message}`
      }]
    });
  }
});

// Prompts endpoints
app.get('/api/prompts', (req: Request, res: Response) => {
  try {
    const prompts = promptHandler.listPrompts();
    res.json({ prompts });
  } catch (error: any) {
    console.error('Error listing prompts:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/prompts/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const args = req.body.arguments || {};
    const prompt = await promptHandler.getPrompt(name, args);
    res.json(prompt);
  } catch (error: any) {
    console.error('Error getting prompt:', error);
    res.status(404).json({ error: error.message });
  }
});

// Root endpoint with API info
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Pubky MCP Server',
    version: '1.0.0',
    description: 'Complete Pubky ecosystem MCP server - All 6 official projects with 75+ resources and 65+ dev tools',
    endpoints: {
      health: '/health',
      resources: {
        list: 'GET /api/resources',
        get: 'GET /api/resources/:uri'
      },
      tools: {
        list: 'GET /api/tools',
        execute: 'POST /api/tools/:name (body: { arguments: {...} })'
      },
      prompts: {
        list: 'GET /api/prompts',
        get: 'POST /api/prompts/:name (body: { arguments: {...} })'
      }
    },
    documentation: 'https://github.com/pubky/pubky-hackathon/tree/main/pubky-mcp-server'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function main() {
  console.log('🚀 Pubky MCP Server (HTTP) starting...');
  console.log(`📂 Data path: ${DATA_ROOT}`);

  // Verify bundled data exists
  try {
    await fileReader.fileExists(path.join(PUBKY_CORE_ROOT, 'README.md'));
    console.log('✅ Bundled resources found');
  } catch {
    console.warn(`⚠️  Warning: Bundled resources not found at ${DATA_ROOT}`);
    console.warn('Please run: npm run fetch-resources');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('✅ Pubky MCP Server (HTTP) running');
    console.log(`🌐 Server listening on http://0.0.0.0:${PORT}`);
    console.log('');
    console.log('📦 Available capabilities:');
    console.log('  • Resources: Documentation, API specs, code examples');
    console.log('  • Tools: Code generation, validation, testnet management');
    console.log('  • Prompts: Interactive guides for building on Pubky');
    console.log('');
    console.log('🔺 Complete Pubky Stack (4 Layers + Tools):');
    console.log('  • Layer 1a: Pkarr (protocol) - Discovery via Mainline DHT');
    console.log('  • Layer 1b: Pkdns (resolver) - DNS server for Pkarr domains');
    console.log('  • Layer 2: Pubky Core (protocol) - HOW to read/write homeserver');
    console.log('  • Layer 3: App Specs (models) - WHAT format to use');
    console.log('  • Layer 4a: Nexus API (interface) - WHERE you READ social data');
    console.log('  • Layer 4b: Nexus (implementation) - Graph indexer internals');
    console.log('');
    console.log('🛠️  Now covering 6 Pubky projects with 65+ tools!');
    console.log('Your complete Pubky ecosystem expert is ready! 🎉');
  });
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

