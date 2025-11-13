#!/usr/bin/env node
/**
 * Pubky MCP Server - Stdio Transport
 *
 * Model Context Protocol server that provides comprehensive Pubky protocol knowledge,
 * code examples, and development tools for building Pubky applications.
 * Uses stdio transport for local clients like Cursor.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer, verifyBundledResources, DATA_ROOT } from './server-setup.js';

// Start the server
async function main() {
  console.error('🚀 Pubky MCP Server starting...');
  console.error(`📂 Data path: ${DATA_ROOT}`);

  // Verify bundled data exists
  const hasResources = await verifyBundledResources();
  if (hasResources) {
    console.error('✅ Bundled resources found');
  } else {
    console.error(`⚠️  Warning: Bundled resources not found at ${DATA_ROOT}`);
    console.error('Please run: npm run fetch-resources');
  }

  const server = createMcpServer();

  // Handle process errors
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('✅ Pubky MCP Server running');
  console.error('');
  console.error('📦 Available capabilities:');
  console.error('  • Resources: Documentation, API specs, code examples');
  console.error('  • Tools: Code generation, validation, testnet management');
  console.error('  • Prompts: Interactive guides for building on Pubky');
  console.error('');
  console.error('🔺 Complete Pubky Stack (4 Layers + Tools):');
  console.error('  • Layer 1a: Pkarr (protocol) - Discovery via Mainline DHT');
  console.error('  • Layer 1b: Pkdns (resolver) - DNS server for Pkarr domains');
  console.error('  • Layer 2: Pubky Core (protocol) - HOW to read/write homeserver');
  console.error('  • Layer 3: App Specs (models) - WHAT format to use');
  console.error('  • Layer 4a: Nexus API (interface) - WHERE you READ social data');
  console.error('  • Layer 4b: Nexus (implementation) - Graph indexer internals');
  console.error('');
  console.error('💡 Complete Flow:');
  console.error('   1. Resolve pubkey → homeserver URL (Pkarr + Pkdns)');
  console.error('   2. Write data to YOUR homeserver (Pubky Core + App Specs)');
  console.error('   3. Nexus watcher indexes from all homeservers');
  console.error('   4. Read aggregated social data (Nexus API)');
  console.error('');
  console.error('🛠️  Now covering 6 Pubky projects with 65+ tools!');
  console.error('Your complete Pubky ecosystem expert is ready! 🎉');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
