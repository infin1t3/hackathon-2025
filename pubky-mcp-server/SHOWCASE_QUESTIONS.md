# 5 Showcase Questions for Pubky MCP Server

These questions demonstrate the versatility and comprehensive coverage of the Pubky MCP Server across all 4 layers of the Pubky ecosystem.

---

## Question 1: Multi-Layer Architecture Understanding
**"Explain the complete Pubky architecture with all 4 layers - from discovery to social graph. How do Pkarr, Pubky Core, App Specs, and Nexus work together?"**

**Why it showcases versatility:**
- ✅ Demonstrates understanding of all 4 layers
- ✅ Shows how components integrate
- ✅ Uses `get_pubky_concept` and `get_pkarr_concept` tools
- ✅ Provides comprehensive ecosystem overview

**Expected response:** Detailed explanation covering:
- Layer 1: Pkarr (DHT-based discovery) + Pkdns (DNS resolver)
- Layer 2: Pubky Core (protocol, auth, storage)
- Layer 3: App Specs (validated data models)
- Layer 4: Nexus (social indexer) + Nexus API

---

## Question 2: End-to-End App Creation
**"Create a complete Pubky social app called 'my-social-app' in TypeScript with authentication, the ability to create posts, and a feed that reads from Nexus. Include all necessary setup steps."**

**Why it showcases versatility:**
- ✅ Uses `generate_app_scaffold` for project creation
- ✅ Combines multiple tools (auth, storage, Nexus API)
- ✅ Generates working code across layers
- ✅ Shows practical, real-world usage
- ✅ Demonstrates code generation capabilities

**Expected response:** 
- Complete project scaffold with TypeScript
- Auth flow implementation
- Post creation with App Specs validation
- Nexus API client for reading feeds
- Setup instructions and dependencies

---

## Question 3: Discovery Layer Deep Dive
**"I want to publish my homeserver URL using Pkarr so others can discover it. Show me how to generate a Pkarr keypair, create DNS records, and publish them. Include both Rust and JavaScript examples."**

**Why it showcases versatility:**
- ✅ Demonstrates Layer 1 (Discovery) expertise
- ✅ Uses `generate_pkarr_keypair` and `generate_dns_record_builder`
- ✅ Provides multi-language examples (Rust + JS)
- ✅ Shows practical discovery implementation
- ✅ Uses `get_pkarr_example` for code examples

**Expected response:**
- Keypair generation code (both languages)
- DNS record builder examples
- Publishing workflow explanation
- Complete working examples

---

## Question 4: Data Validation & Social Features
**"I'm building a social feed feature. Show me how to create a validated post using Pubky App Specs, then query the Nexus API to display posts in a feed. Include error handling and validation."**

**Why it showcases versatility:**
- ✅ Combines Layer 3 (App Specs) + Layer 4 (Nexus API)
- ✅ Uses `generate_data_model` and `validate_model_data`
- ✅ Uses `query_nexus_api` and `explain_nexus_endpoint`
- ✅ Shows data validation workflow
- ✅ Demonstrates read/write separation (write to homeserver, read from Nexus)

**Expected response:**
- Post model generation with validation
- Example of creating a validated post
- Nexus API endpoint explanation
- Feed query implementation
- Error handling patterns

---

## Question 5: Debugging & Problem Solving
**"I'm getting a 403 error when trying to write to `/pub/my-app/posts/data.json` on my homeserver. My capability string is `/pub/my-app/:r`. What's wrong and how do I fix it?"**

**Why it showcases versatility:**
- ✅ Uses `explain_capabilities` tool
- ✅ Demonstrates debugging capabilities
- ✅ Shows practical problem-solving
- ✅ Provides actionable solutions
- ✅ Combines concept explanation with code fixes

**Expected response:**
- Explanation of capability strings
- Analysis of the error (read-only vs read-write)
- Corrected capability string: `/pub/my-app/:rw`
- Code example with proper capabilities
- Best practices for capability management

---

## Bonus: Infrastructure Setup
**"Set up a complete local development environment for Pubky. I want to run a testnet, start a Pkarr relay, and have everything ready for development."**

**Why it showcases versatility:**
- ✅ Uses `start_testnet` and `start_pkarr_relay` tools
- ✅ Shows infrastructure management
- ✅ Demonstrates environment setup automation
- ✅ Provides complete dev environment

**Expected response:**
- Testnet startup instructions
- Pkarr relay configuration
- Connection details and URLs
- Verification steps

---

## Usage Tips for Demonstrations

1. **Start with Question 1** - Shows comprehensive coverage
2. **Follow with Question 2** - Demonstrates code generation
3. **Use Question 3** - Shows discovery layer expertise
4. **Question 4** - Combines multiple layers
5. **Question 5** - Shows problem-solving capabilities

## What Makes These Questions Effective

✅ **Cover all 4 layers** - Discovery, Protocol, Data Models, Social Graph  
✅ **Mix of concepts and code** - Both explanations and implementations  
✅ **Practical use cases** - Real-world scenarios developers face  
✅ **Multi-language support** - Rust and JavaScript examples  
✅ **End-to-end workflows** - Complete solutions, not just snippets  
✅ **Problem-solving** - Debugging and troubleshooting capabilities  

These questions showcase that the Pubky MCP Server is not just documentation, but a complete development assistant covering the entire Pubky ecosystem!

