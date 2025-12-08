# Schema.ICU SDK

> Production-ready Node.js SDK for Schema.ICU - Structured AI with cryptographic verification

[![NPM Version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/package/@smartledger/schema-icu-sdk)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- 🎯 **11 Specialized AI Agents** - Code generation, schema design, project planning, and more
- 🔐 **Cryptographic Verification** - Every response is signed with BSV cryptography
- ✅ **JSON Schema Validation** - Guaranteed structured outputs
- 🚀 **Production Ready** - Error handling, rate limiting, 99.9% uptime SLA
- ⚡ **Cost Optimized** - GPT-5-nano at $0.05/1M tokens (96% cheaper than GPT-4)
- 🛠️ **Interactive CLI** - Setup wizard and command-line tools
- 📦 **TypeScript Ready** - Full type definitions (coming soon)

## Installation

```bash
npm install @smartledger/schema-icu-sdk
```

## Quick Start

### 1. Setup

Run the interactive setup wizard:

```bash
npm run setup
```

Or use the CLI:

```bash
npx schema-icu setup
```

This will guide you through:
- Creating an account or logging in
- Configuring your API credentials
- Saving configuration to `.env`

### 2. Basic Usage

```javascript
const { SchemaICU } = require('@smartledger/schema-icu-sdk');

// Initialize client (loads credentials from .env)
const client = new SchemaICU();

// Generate code
const result = await client.codeGenerator.generate(
  'Create a debounce function in JavaScript',
  { language: 'JavaScript', style: 'modern ES6+' }
);

console.log(result.data.code);
```

## Available Agents

| Agent | Endpoint | Description |
|-------|----------|-------------|
| **Base Agent** | `client.base` | General-purpose with code generation |
| **Code Generator** | `client.codeGenerator` | Production-ready code in any language |
| **Schema Generator** | `client.schemaGenerator` | JSON schemas with validation rules |
| **Terminal Agent** | `client.terminalAgent` | Optimal shell commands |
| **Code Improver** | `client.codeImprover` | Optimize without breaking changes |
| **Diff Improver** | `client.diffImprover` | Improvements with unified diffs |
| **Box Designer** | `client.boxDesigner` | Modular components (Alan Kay) |
| **Project Planner** | `client.projectPlanner` | Task breakdown with time estimates |
| **Prompt Improver** | `client.promptImprover` | Optimize prompts for better results |
| **Tool Choice** | `client.toolChoice` | Best agent recommendation |
| **GitHub Agent** | `client.githubAgent` | GitHub CLI commands |

## Examples

### Code Generation

```javascript
const { SchemaICU } = require('@smartledger/schema-icu-sdk');
const client = new SchemaICU();

const result = await client.codeGenerator.generate(
  'Create a REST API endpoint for user registration',
  {
    language: 'JavaScript',
    framework: 'Express',
    features: ['validation', 'error handling']
  }
);

console.log(result.data.code);
console.log('Complexity:', result.data.complexity);
console.log('Reasoning:', result.data.reasoning);
```

### Code Improvement

```javascript
const code = `
function getData(id) {
  var result;
  if (id) {
    result = database.get(id);
  }
  return result;
}
`;

const result = await client.diffImprover.improve(code, {
  language: 'JavaScript',
  focusAreas: ['performance', 'security', 'readability']
});

console.log('Improved:', result.data.improvedCode);
console.log('Diff:', result.data.diff);
console.log('Explanation:', result.data.explanation);
```

### Project Planning

```javascript
const result = await client.projectPlanner.plan(
  'Build a chat application with real-time messaging',
  {
    technology: 'Node.js, React, WebSocket',
    experience: 'intermediate'
  }
);

const plan = result.data;
console.log(`Project: ${plan.projectName}`);
console.log(`Tasks: ${plan.tasks.length}`);

plan.tasks.forEach(task => {
  console.log(`- ${task.taskName} (${task.estimatedTimeHours}h)`);
});
```

### Schema Generation

```javascript
const result = await client.schemaGenerator.generate(
  'Create a schema for a product catalog with categories'
);

const schema = JSON.parse(result.data.schemaAsString);
console.log(schema);
```

## Authentication

### Login Programmatically

```javascript
const { SchemaICU } = require('@smartledger/schema-icu-sdk');
const client = new SchemaICU();

const loginResult = await client.auth.login('email@example.com', 'password');

if (loginResult.success) {
  console.log('API Key:', loginResult.user.apiKey);
  console.log('Token:', loginResult.token);
  
  // Update config
  client.config.apiKey = loginResult.user.apiKey;
  client.config.jwtToken = loginResult.token;
}
```

### Register New Account

```javascript
// Register
const registerResult = await client.auth.register(
  'email@example.com',
  'securePassword123'
);

// Verify email with OTP
const verifyResult = await client.auth.verifyEmail(
  'email@example.com',
  '123456'
);

console.log('API Key:', verifyResult.apiKey);
```

## Configuration

### Environment Variables

Create a `.env` file:

```env
SCHEMA_ICU_API_KEY=your_api_key_here
SCHEMA_ICU_JWT_TOKEN=your_jwt_token_here
SCHEMA_ICU_EMAIL=your_email@example.com
SCHEMA_ICU_BASE_URL=schema.icu
SCHEMA_ICU_PORT=443
```

### Programmatic Configuration

```javascript
const { SchemaICU, Config } = require('@smartledger/schema-icu-sdk');

const config = new Config({
  apiKey: 'your_api_key',
  jwtToken: 'your_jwt_token',
  timeout: 30000,
  retryAttempts: 3
});

const client = new SchemaICU(config);
```

## CLI Commands

```bash
# Setup wizard
npm run setup

# Run examples
npm run example:basic
npm run example:improve
npm run example:plan

# Improve a file
npx schema-icu improve server.js

# Generate code
npx schema-icu generate "Create a REST API"
```

## Error Handling

```javascript
const { 
  SchemaICU,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError 
} = require('@smartledger/schema-icu-sdk');

const client = new SchemaICU();

try {
  const result = await client.codeGenerator.generate('...');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else {
    console.error('API error:', error.message);
  }
}
```

## API Reference

### SchemaICU Client

```javascript
const client = new SchemaICU(options);

// Properties
client.auth              // AuthManager
client.base              // BaseAgent
client.codeGenerator     // CodeGenerator
client.schemaGenerator   // SchemaGenerator
client.terminalAgent     // TerminalAgent
client.codeImprover      // CodeImprover
client.diffImprover      // DiffImprover
client.boxDesigner       // BoxDesigner
client.projectPlanner    // ProjectPlanner
client.promptImprover    // PromptImprover
client.toolChoice        // ToolChoice
client.githubAgent       // GitHubAgent

// Methods
client.isAuthenticated()
client.getConfig()
client.updateConfig(options)
```

### Common Response Format

All API responses include:

```javascript
{
  success: true,
  data: {
    // Agent-specific data
  },
  timestamp: "2025-12-08T13:52:42.655Z",
  signature: {
    hash: "...",
    signature: "...",
    publicKey: "...",
    signedAt: "2025-12-08T13:52:42.719Z"
  }
}
```

## Pricing

- **Free Tier**: 21 requests/day
- **Registered**: 200 requests/day
- **Professional**: $49/month for 3M requests
- **Enterprise**: Unlimited requests

[View pricing details →](https://schema.icu/#pricing)

## Examples Directory

See the [`examples/`](./examples) directory for more:

- `basic-usage.js` - Simple SDK usage
- `code-improvement.js` - File improvement workflow
- `project-planning.js` - Project planning example
- `authentication.js` - Auth flows

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run setup wizard
npm run setup
```

## Contributing

Contributions welcome! Please read our [Contributing Guide](CONTRIBUTING.md).

## License

MIT © SmartLedger Technologies

## Links

- [Schema.ICU Website](https://schema.icu)
- [API Documentation](https://schema.icu/docs/API_DOCS.html)
- [GitHub Repository](https://github.com/codenlighten/schema-icu-sdk)
- [Issue Tracker](https://github.com/codenlighten/schema-icu-sdk/issues)

## Support

- 📧 Email: support@smartledger.technology
- 📚 Documentation: https://schema.icu/docs
- 💬 GitHub Issues: https://github.com/codenlighten/schema-icu-sdk/issues

---

**Built with ❤️ by SmartLedger Technologies**
