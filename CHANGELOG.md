# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2025-12-19

### Added - 🌉 THE FUTURE SELF BRIDGE - Revolutionary Architecture

**This makes Schema.ICU the ONLY SDK with both Post-Quantum Cryptography AND Future Self Bridge!**

#### Core Architecture Components
- **Future Self Bridge** (`src/core/future-self-bridge.js`) - Revolutionary pattern where "current self" plans schema, "future self" executes with self-awareness
  - Schema planning before execution
  - Self-aware context detection
  - Automatic retry with missing context accumulation
  - Confidence scoring (0-1 scale)
  - Memory integration support

- **Memory Manager** (`src/core/memory-manager.js`) - Cryptographically signed memory with rolling compression
  - Rolling 21-message + 3-summary architecture
  - Post-quantum signed interactions (ML-DSA-65/87)
  - File persistence (daily JSON files)
  - Automatic compression using SummaryAgent
  - Meta-summary generation

- **Future Self Wrapper** (`src/core/future-self-wrapper.js`) - Middleware to wrap any agent with Future Self pattern
  - Wrap individual agents: `wrapAgent('code-generator')`
  - Memory-aware wrapping: `wrapAgentWithMemory('email', memory)`
  - Batch wrapping: `wrapMultiple([...])` or `wrapAllAgents()`
  - Convenience methods for all 13 agents

#### Client Methods
- `useFutureSelfBridge()` - Enable and get Future Self Bridge instance
- `getFutureSelfWrapper()` - Get wrapper for agent enhancement
- `createMemorySession(options)` - Create memory-aware session
- `getMemorySession()` - Get current memory session
- `executeFutureSelf(agentType, query, options)` - Execute with Future Self pattern
- `wrapAgent(agentType)` - Wrap agent with Future Self
- `wrapAgentWithMemory(agentType, memory)` - Wrap with memory integration
- `wrapAllAgents()` - Batch wrap all agents

#### Examples
- `examples/future-self-bridge.js` - Comprehensive examples (7 scenarios):
  1. Basic Future Self execution
  2. Wrapper pattern usage
  3. Memory integration
  4. Multi-agent orchestration
  5. Self-aware retry with missing context detection
  6. Schema planning (Current Self)
  7. Advanced features (Bridge + Memory + PQ)

### Architecture Flow
```
1. Current Self (Planning)    → Generate schema before execution
2. Schema Generation          → Define expected response structure
3. External Actions           → Execute agent with schema guidance
4. Future Self (Execution)    → Deliver with self-awareness
5. Cryptographic Signature    → ML-DSA post-quantum verification
6. Memory Storage             → Signed interaction history
```

### Key Features
- 🧠 **Self-Aware Agents**: Detect and report missing context
- 🔄 **Auto-Retry**: Accumulate context across attempts
- 📊 **Confidence Scoring**: Quantify response completeness
- 🔐 **PQ Memory**: Every interaction signed with ML-DSA
- 💾 **Rolling Compression**: 21 messages → summaries → meta-summaries
- 📝 **Schema Planning**: Current Self plans, Future Self executes
- �� **File Persistence**: Daily JSON memory files

### Technical Details
Future Self Bridge execution returns enhanced response:
```javascript
{
  response: "...",
  code: "...",
  signature: "...",
  futureSelfBridge: {
    schemaPlanned: {...},
    selfAwareness: {
      complete: true,
      missingContext: [],
      needsContinue: false,
      hasQuestion: false,
      question: null,
      confidence: 0.95
    },
    attempts: 1,
    complete: true
  }
}
```

Memory Manager statistics:
```javascript
{
  activeInteractions: 15,
  maxInteractions: 21,
  totalSummaries: 2,
  maxSummaries: 3,
  totalCount: 42,
  signatureAlgorithm: "PQ"
}
```

### Integration
Ported from Lumen Bridge (lumenbridge.xyz) and enhanced with:
- Post-quantum signatures (ML-DSA-65/87 instead of ECDSA)
- Schema.ICU agent integration
- Enhanced self-awareness
- Memory persistence with PQ signatures

## [1.0.5] - 2025-12-19

### Added
- **Summary Agent** (`src/agents/summary-agent.js`) - Conversation compression and analysis
  - `summarize(query, context)` - Main compression method
  - `compress(query, context)` - Alias for summarize
  - `summarizeWithFocus(query, focus, context)` - Targeted summarization
  - Returns: `{ summary, keyPoints[], contextMeta: { dominantThemes[], unresolvedThreads[], toneSummary } }`

- **Email Agent** (`src/agents/email-agent.js`) - Professional email composition
  - `compose(query, context)` - General email composition
  - `composeFormal(query, context)` - Formal business emails
  - `composeCasual(query, context)` - Friendly team emails
  - `composeMarketing(query, context)` - Marketing/persuasive emails
  - `reply(originalEmail, replyInstructions, context)` - Email replies
  - Returns: `{ subject, body, closing, tone, purpose }`

- **Examples**:
  - `examples/summary-agent.js` - 4 comprehensive scenarios
  - `examples/email-agent.js` - 6 comprehensive scenarios

### Changed
- Client now initializes 13 agents (was 11)
- Both new agents support post-quantum signatures
- All agents maintain consistent signatureAlgorithm pattern

### Use Cases
- **Summary Agent**: Memory management, conversation compression, meeting notes
- **Email Agent**: Business communication, team collaboration, marketing campaigns

## [1.0.4] - 2025-12-19

### Added
- **Post-Quantum Cryptography Support**: All agents now support quantum-resistant signatures
  - ML-DSA-65 (NIST FIPS 204) - 50x larger than ECDSA, quantum-resistant
  - ML-DSA-87 (NIST FIPS 204) - 70x larger than ECDSA, maximum security
  - Convenient "pq" alias that defaults to ML-DSA-87
- **Client Helper Methods**:
  - `client.usePostQuantum(algorithm)` - Switch to post-quantum signatures
  - `client.useECDSA()` - Switch back to standard ECDSA (default)
  - `client.getSignatureAlgorithm()` - Get current algorithm
  - `client.setSignatureAlgorithm(algorithm)` - Set custom algorithm
- **New Example**: `examples/post-quantum-signatures.js` - Comprehensive PQ guide
- **Enhanced Documentation**: All agents now document `signatureAlgorithm` parameter

### Changed
- All 11 agents updated to extract and use `signatureAlgorithm` from context
- Signature algorithm passed at top level of API requests (not nested in context)
- Package description updated to mention post-quantum support

### Technical Details
All agent methods (`generate()`, `query()`, `improve()`, `plan()`, `design()`, `recommend()`) now accept `signatureAlgorithm` in the context object:

```javascript
// Method 1: Pass in context
await client.codeGenerator.generate('query', { 
  signatureAlgorithm: 'ml-dsa-65' 
});

// Method 2: Use helper methods
client.usePostQuantum('ml-dsa-87');
await client.codeGenerator.generate('query');
```

**Supported Algorithms:**
- `null` or omitted - ECDSA (default, ~88 chars)
- `'ecdsa'` - Explicit ECDSA
- `'ml-dsa-65'` - Post-quantum (~4,412 chars)
- `'ml-dsa-87'` - Post-quantum (~6,172 chars)
- `'pq'` - Alias for ml-dsa-87

### Response Structure
All responses now include enhanced signature metadata:

```javascript
{
  signature: {
    hash: "...",
    signature: "...",
    publicKey: "...",
    algorithm: "ml-dsa-65",        // NEW
    suite: "...",
    quantumResistant: true,        // NEW
    signedAt: "2025-12-19T..."
  }
}
```

## [1.0.3] - 2025-12-18

### Fixed
- **BREAKING DOCUMENTATION FIX**: Corrected all documentation to reflect actual API response structure
  - Response data is at the top level, not nested under `result.data`
  - Updated README.md with correct examples
  - Updated all example files (`basic-usage.js`, `code-improvement.js`, `project-planning.js`)
  - Added note in "Common Response Format" section explaining the structure

### Changed
- Improved "Common Response Format" documentation with specific examples for each agent type
- Added clarification that response data fields vary by agent

### Documentation Changes
**Before (INCORRECT):**
```javascript
console.log(result.data.code);
console.log(result.data.improvedCode);
```

**After (CORRECT):**
```javascript
console.log(result.code);
console.log(result.improvedCode);
```

## [1.0.2] - 2025-12-08

### Added
- Initial release
- 11 specialized AI agents
- Cryptographic verification with BSV ECDSA
- Interactive CLI setup wizard
- Authentication flows (login, register, verify)
- Example files demonstrating SDK usage
- Error handling with custom error classes

### Features
- Code Generator
- Code Improver
- Diff Improver
- Schema Generator
- Project Planner
- Terminal Agent
- Box Designer
- Prompt Improver
- Tool Choice
- GitHub Agent
- Base Agent

## [1.0.1] - 2025-12-08

### Fixed
- Minor bug fixes

## [1.0.0] - 2025-12-08

### Added
- Initial beta release
