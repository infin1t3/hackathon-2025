/**
 * Shared server setup logic for both stdio and HTTP transports
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

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
export const DATA_ROOT = path.join(__dirname, '..', 'data');
export const PUBKY_CORE_ROOT = path.join(DATA_ROOT, 'pubky-core');
export const PKARR_ROOT = path.join(DATA_ROOT, 'pkarr');
export const PKDNS_ROOT = path.join(DATA_ROOT, 'pkdns');
export const NEXUS_ROOT = path.join(DATA_ROOT, 'pubky-nexus');
export const WORKSPACE_ROOT = DATA_ROOT;

/**
 * Creates and configures an MCP server with all handlers
 */
export function createMcpServer(): Server {
  // Initialize handlers
  const fileReader = new FileReader(PUBKY_CORE_ROOT, PKARR_ROOT, PKDNS_ROOT, NEXUS_ROOT);
  const resourceHandler = new ResourceHandler(fileReader, WORKSPACE_ROOT);
  const toolHandler = new ToolHandler(
    fileReader,
    PUBKY_CORE_ROOT,
    WORKSPACE_ROOT,
    PKARR_ROOT,
    PKDNS_ROOT,
    NEXUS_ROOT
  );
  const promptHandler = new PromptHandler();

  // Create MCP server
  const server = new Server(
    {
      name: 'pubky-mcp-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        resources: {},
        tools: {},
        prompts: {},
      },
    }
  );

  // Error handler
  server.onerror = error => {
    console.error('[MCP Error]', error);
  };

  // List resources handler
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    try {
      const resources = await resourceHandler.listResources();
      return { resources };
    } catch (error) {
      console.error('Error listing resources:', error);
      return { resources: [] };
    }
  });

  // Read resource handler
  server.setRequestHandler(ReadResourceRequestSchema, async request => {
    try {
      const { uri } = request.params;
      return await resourceHandler.getResource(uri);
    } catch (error: any) {
      console.error('Error reading resource:', error);
      throw new Error(`Failed to read resource: ${error.message}`);
    }
  });

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
      const tools = toolHandler.listTools();
      return { tools };
    } catch (error) {
      console.error('Error listing tools:', error);
      return { tools: [] };
    }
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async request => {
    try {
      const { name, arguments: args } = request.params;
      return await toolHandler.executeTool(name, args || {});
    } catch (error: any) {
      console.error('Error executing tool:', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  });

  // List prompts handler
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    try {
      const prompts = promptHandler.listPrompts();
      return { prompts };
    } catch (error) {
      console.error('Error listing prompts:', error);
      return { prompts: [] };
    }
  });

  // Get prompt handler
  server.setRequestHandler(GetPromptRequestSchema, async request => {
    try {
      const { name, arguments: args } = request.params;
      return await promptHandler.getPrompt(name, args || {});
    } catch (error: any) {
      console.error('Error getting prompt:', error);
      throw new Error(`Failed to get prompt: ${error.message}`);
    }
  });

  return server;
}

/**
 * Verifies that bundled resources exist
 */
export async function verifyBundledResources(): Promise<boolean> {
  const fileReader = new FileReader(PUBKY_CORE_ROOT, PKARR_ROOT, PKDNS_ROOT, NEXUS_ROOT);
  try {
    await fileReader.fileExists(path.join(PUBKY_CORE_ROOT, 'README.md'));
    return true;
  } catch {
    return false;
  }
}

