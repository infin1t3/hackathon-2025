#!/usr/bin/env node
/**
 * Pubky MCP Server - HTTP Transport
 *
 * HTTP server for Render deployment using Streamable HTTP transport
 */

import express from 'express';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer, verifyBundledResources, DATA_ROOT } from './server-setup.js';

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*', // Allow all origins for MCP clients
    exposedHeaders: ['Mcp-Session-Id'],
    allowedHeaders: ['Content-Type', 'mcp-session-id'],
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'pubky-mcp-server' });
});

// Create the MCP server once (reused across requests)
const server = createMcpServer();

// MCP endpoint - handles all MCP requests
app.all('/mcp', async (req, res) => {
  try {
    // Create a new transport for each request (stateless mode)
    // This prevents request ID collisions between different clients
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
      enableJsonResponse: true, // Enable JSON responses for simpler clients
    });

    // Clean up transport when connection closes
    res.on('close', () => {
      transport.close();
    });

    // Connect server to transport
    await server.connect(transport);

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  } catch (error: any) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

// Start server
async function main() {
  const port = parseInt(process.env.PORT || '3000', 10);

  console.log('🚀 Pubky MCP Server (HTTP) starting...');
  console.log(`📂 Data path: ${DATA_ROOT}`);

  // Verify bundled data exists
  const hasResources = await verifyBundledResources();
  if (hasResources) {
    console.log('✅ Bundled resources found');
  } else {
    console.warn(`⚠️  Warning: Bundled resources not found at ${DATA_ROOT}`);
    console.warn('Please run: npm run fetch-resources');
  }

  app.listen(port, () => {
    console.log(`✅ Pubky MCP Server running on port ${port}`);
    console.log('');
    console.log('📦 Available endpoints:');
    console.log(`  • MCP: http://localhost:${port}/mcp`);
    console.log(`  • Health: http://localhost:${port}/health`);
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
    console.log('💡 Complete Flow:');
    console.log('   1. Resolve pubkey → homeserver URL (Pkarr + Pkdns)');
    console.log('   2. Write data to YOUR homeserver (Pubky Core + App Specs)');
    console.log('   3. Nexus watcher indexes from all homeservers');
    console.log('   4. Read aggregated social data (Nexus API)');
    console.log('');
    console.log('🛠️  Now covering 6 Pubky projects with 65+ tools!');
    console.log('Your complete Pubky ecosystem expert is ready! 🎉');
  }).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
  });
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

