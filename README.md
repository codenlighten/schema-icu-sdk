# Schema.ICU SDK

> Production-ready Node.js SDK for Schema.ICU - Structured AI with cryptographic verification

[![NPM Version](https://img.shields.io/badge/npm-1.0.0-blue.svg)](https://www.npmjs.com/package/@smartledger/schema-icu-sdk)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

- 🎯 **11 Specialized AI Agents** - Code generation, schema design, project planning, and more
- 🔐 **Cryptographic Verification** - Every response is signed with BSV cryptography
- 🛡️ **Post-Quantum Ready** - ML-DSA-65/87 quantum-resistant signatures (NIST FIPS 204)
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

console.log(result.code);
console.log('Complexity:', result.complexity);
console.log('Reasoning:', result.reasoning);
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

console.log(result.code);
console.log('Complexity:', result.complexity);
console.log('Reasoning:', result.reasoning);
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

console.log('Improved:', result.improvedCode);
console.log('Diff:', result.diff);
console.log('Explanation:', result.explanation);
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

console.log(`Project: ${result.projectName}`);
console.log(`Tasks: ${result.tasks.length}`);

result.tasks.forEach(task => {
  console.log(`- ${task.taskName} (${task.estimatedTimeHours}h)`);
});
```

### Schema Generation

```javascript
const result = await client.schemaGenerator.generate(
  'Create a schema for a product catalog with categories'
);

const schema = JSON.parse(result.schemaAsString);
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

## Post-Quantum Cryptography

Schema.ICU supports quantum-resistant cryptographic signatures using **ML-DSA** (Module-Lattice-Based Digital Signature Algorithm) based on [NIST FIPS 204](https://csrc.nist.gov/pubs/fips/204/final).

### Why Post-Quantum?

Current ECDSA signatures will be vulnerable when practical quantum computers emerge (~10-20 years). ML-DSA signatures are quantum-resistant **today**, ensuring your cryptographic proofs remain valid in the post-quantum era.

### Available Algorithms

| Algorithm | Security Level | Signature Size | Use Case |
|-----------|---------------|----------------|----------|
| **ECDSA** (default) | Classical | ~88 chars | Standard use, smallest size |
| **ml-dsa-65** | NIST Level 3 | ~4,412 chars (50x) | Recommended for most PQ needs |
| **ml-dsa-87** | NIST Level 5 | ~6,172 chars (70x) | Maximum security, high-value ops |
| **pq** (alias) | NIST Level 5 | ~6,172 chars (70x) | Shorthand for ml-dsa-87 |

### Usage Methods

#### Method 1: Pass in Context

```javascript
const result = await client.codeGenerator.generate(
  'Create a secure authentication function',
  {
    signatureAlgorithm: 'ml-dsa-65',
    language: 'JavaScript'
  }
);

console.log('Algorithm:', result.signature.algorithm);        // 'ml-dsa-65'
console.log('Quantum-resistant:', result.signature.quantumResistant); // true
console.log('Signature length:', result.signature.signature.length);   // ~4412
```

#### Method 2: Client Helper Methods

```javascript
// Set post-quantum for all subsequent requests
client.usePostQuantum('ml-dsa-87');
console.log(client.getSignatureAlgorithm()); // 'ml-dsa-87'

const result = await client.codeGenerator.generate('...');
// Will use ML-DSA-87 signature

// Switch back to ECDSA
client.useECDSA();
console.log(client.getSignatureAlgorithm()); // 'ecdsa'
```

#### Method 3: Use PQ Alias

```javascript
// 'pq' is a convenient shorthand for 'ml-dsa-87'
const result = await client.schemaGenerator.generate(
  'Create a user schema',
  { signatureAlgorithm: 'pq' }
);

console.log(result.signature.algorithm); // 'ml-dsa-87'
```

### All Agents Support PQ

Post-quantum signatures work with **all agents**:

```javascript
// Base Agent
await client.base.query('...', { signatureAlgorithm: 'ml-dsa-65' });

// Code Generator
await client.codeGenerator.generate('...', { signatureAlgorithm: 'ml-dsa-87' });

// Code Improver
await client.codeImprover.improve('...', { signatureAlgorithm: 'pq' });

// Schema Generator
await client.schemaGenerator.generate('...', { signatureAlgorithm: 'ml-dsa-65' });

// Project Planner
await client.projectPlanner.plan('...', { signatureAlgorithm: 'ml-dsa-87' });

// And all other agents...
```

### Enhanced Signature Response

When using post-quantum signatures, the response includes additional metadata:

```javascript
{
  signature: {
    hash: "992ca02ee975884200cdb5c567eff3dbb9b916b1fd93c758be7dd876213371b1",
    signature: "5nnm5y9SHZTQijl2y2/Arm1dkqzDfmvTAlmbKSPiK3Q3tO...",
    publicKey: "8a4b02f0eafac5d36676e5b68d05667e23a295185cf45a0c04ac04fe7d9bcd89",
    algorithm: "ml-dsa-65",                    // Signature algorithm used
    suite: "ml-dsa-65",                        // Cryptographic suite
    quantumResistant: true,                    // NEW: Indicates quantum resistance
    signedAt: "2025-12-19T05:13:51.125Z"
  }
}
```

### Best Practices

1. **Default to ML-DSA-65** for most production use cases - good balance of security and size
2. **Use ML-DSA-87** for high-value operations requiring maximum security
3. **Use PQ alias** for convenience when you want the strongest protection
4. **Consider signature size** - PQ signatures are 50-70x larger than ECDSA
5. **Test performance** - PQ signatures may take slightly longer to generate

### Complete Example

See [`examples/post-quantum-signatures.js`](./examples/post-quantum-signatures.js) for a comprehensive demonstration.

```javascript
// Quick comparison of all algorithms
const results = {
  ecdsa: await client.base.query('test'),
  mldsa65: await client.base.query('test', { signatureAlgorithm: 'ml-dsa-65' }),
  mldsa87: await client.base.query('test', { signatureAlgorithm: 'ml-dsa-87' })
};

console.log('ECDSA:', results.ecdsa.signature.signature.length, 'chars');
console.log('ML-DSA-65:', results.mldsa65.signature.signature.length, 'chars (quantum-safe)');
console.log('ML-DSA-87:', results.mldsa87.signature.signature.length, 'chars (quantum-safe)');
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

// Post-Quantum Helper Methods (v1.0.4+)
client.usePostQuantum(algorithm)      // Set PQ algorithm ('ml-dsa-65', 'ml-dsa-87', 'pq')
client.useECDSA()                     // Switch back to ECDSA (default)
client.getSignatureAlgorithm()        // Get current algorithm
client.setSignatureAlgorithm(algorithm) // Set custom algorithm
```

### Common Response Format

All API responses include:

```javascript
{
  success: true,
  // Agent-specific data fields at top level
  code: "...",              // For code generator
  improvedCode: "...",      // For code improver
  schemaAsString: "...",    // For schema generator
  projectName: "...",       // For project planner
  tasks: [],                // For project planner
  // Common fields
  timestamp: "2025-12-08T13:52:42.655Z",
  signature: {
    hash: "...",
    signature: "...",
    publicKey: "...",
    algorithm: "ecdsa",
    suite: "bsv-ecdsa-secp256k1",
    signedAt: "2025-12-08T13:52:42.719Z"
  }
}
```

**Note:** Response data is at the top level, not nested under a `data` property.

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
