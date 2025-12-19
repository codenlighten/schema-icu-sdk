/**
 * Post-Quantum Signatures Example
 * 
 * This example demonstrates how to use quantum-resistant cryptographic signatures
 * with the Schema.ICU SDK. ML-DSA (Module-Lattice-Based Digital Signature Algorithm)
 * is based on NIST FIPS 204 standard.
 * 
 * Learn more: https://schema.icu
 */

require('dotenv').config();
const { SchemaICU } = require('@smartledger/schema-icu-sdk');

async function main() {
  // Initialize client
  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY || 'your-api-key-here'
  });

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Schema.ICU - Post-Quantum Cryptography Example           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // ========================================
  // Method 1: Using signatureAlgorithm in context
  // ========================================
  console.log('Method 1: Pass signatureAlgorithm in context\n');
  console.log('-'.repeat(60));

  const result1 = await client.codeGenerator.generate(
    'Create a function to calculate factorial',
    {
      signatureAlgorithm: 'ml-dsa-65',
      language: 'JavaScript'
    }
  );

  console.log('✓ Code generated with ML-DSA-65 signature');
  console.log(`  Algorithm: ${result1.signature.algorithm}`);
  console.log(`  Quantum-resistant: ${result1.signature.quantumResistant}`);
  console.log(`  Signature length: ${result1.signature.signature.length} chars`);
  console.log(`  Hash: ${result1.signature.hash.substring(0, 20)}...`);
  console.log();

  // ========================================
  // Method 2: Using helper methods
  // ========================================
  console.log('Method 2: Use client helper methods\n');
  console.log('-'.repeat(60));

  // Set post-quantum for all subsequent requests
  client.usePostQuantum('ml-dsa-87');
  console.log(`✓ Client set to: ${client.getSignatureAlgorithm()}`);

  const result2 = await client.codeImprover.improve(
    'Optimize this code: for(let i=0;i<arr.length;i++){sum+=arr[i]}',
    { language: 'JavaScript' }
  );

  console.log('✓ Code improved with ML-DSA-87 signature');
  console.log(`  Algorithm: ${result2.signature.algorithm}`);
  console.log(`  Quantum-resistant: ${result2.signature.quantumResistant}`);
  console.log(`  Signature length: ${result2.signature.signature.length} chars`);
  console.log();

  // Switch back to ECDSA
  client.useECDSA();
  console.log(`✓ Client set to: ${client.getSignatureAlgorithm()}\n`);

  // ========================================
  // Method 3: Using 'pq' alias (defaults to ml-dsa-87)
  // ========================================
  console.log('Method 3: Use "pq" shorthand alias\n');
  console.log('-'.repeat(60));

  const result3 = await client.schemaGenerator.generate(
    'Create a JSON schema for a user profile',
    {
      signatureAlgorithm: 'pq'  // Shorthand for 'ml-dsa-87'
    }
  );

  console.log('✓ Schema generated with PQ alias (defaults to ML-DSA-87)');
  console.log(`  Algorithm: ${result3.signature.algorithm}`);
  console.log(`  Quantum-resistant: ${result3.signature.quantumResistant}`);
  console.log(`  Signature length: ${result3.signature.signature.length} chars`);
  console.log();

  // ========================================
  // Signature Size Comparison
  // ========================================
  console.log('Signature Size Comparison\n');
  console.log('-'.repeat(60));

  // ECDSA (default)
  const ecdsaResult = await client.base.query('Hello world');
  console.log(`ECDSA:     ${ecdsaResult.signature.signature.length} chars (baseline)`);

  // ML-DSA-65
  const mldsa65Result = await client.base.query('Hello world', { 
    signatureAlgorithm: 'ml-dsa-65' 
  });
  const ratio65 = (mldsa65Result.signature.signature.length / ecdsaResult.signature.signature.length).toFixed(1);
  console.log(`ML-DSA-65: ${mldsa65Result.signature.signature.length} chars (${ratio65}x larger, quantum-resistant)`);

  // ML-DSA-87
  const mldsa87Result = await client.base.query('Hello world', { 
    signatureAlgorithm: 'ml-dsa-87' 
  });
  const ratio87 = (mldsa87Result.signature.signature.length / ecdsaResult.signature.signature.length).toFixed(1);
  console.log(`ML-DSA-87: ${mldsa87Result.signature.signature.length} chars (${ratio87}x larger, quantum-resistant)`);
  console.log();

  // ========================================
  // Best Practices
  // ========================================
  console.log('Best Practices\n');
  console.log('-'.repeat(60));
  console.log('1. ML-DSA-65: Faster, smaller signatures (recommended for most use cases)');
  console.log('2. ML-DSA-87: Maximum security (use for high-value operations)');
  console.log('3. PQ alias: Convenient shorthand that defaults to ML-DSA-87');
  console.log('4. ECDSA: Smallest signatures, not quantum-resistant (default)');
  console.log();
  console.log('When quantum computers become practical (~10-20 years),');
  console.log('ECDSA signatures will be vulnerable. ML-DSA is quantum-safe today.');
  console.log();

  // ========================================
  // Understanding the Response
  // ========================================
  console.log('Understanding the Response\n');
  console.log('-'.repeat(60));
  console.log('Every response includes a signature object:');
  console.log(JSON.stringify({
    signature: {
      hash: 'SHA-256 hash of the response data',
      signature: 'Cryptographic signature (varies by algorithm)',
      publicKey: 'Public key for verification',
      algorithm: 'ecdsa | ml-dsa-65 | ml-dsa-87',
      suite: 'Cryptographic suite used',
      quantumResistant: 'true for ML-DSA, false for ECDSA',
      signedAt: 'ISO timestamp'
    }
  }, null, 2));

  console.log('\n✓ Example completed successfully!');
}

// Run the example
main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
