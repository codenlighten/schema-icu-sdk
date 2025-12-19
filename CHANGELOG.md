# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
