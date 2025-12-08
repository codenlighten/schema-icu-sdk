/**
 * Basic Usage Example
 * 
 * Demonstrates simple SDK usage with different agents
 */

const { SchemaICU } = require('../src');

async function main() {
  // Initialize client (loads credentials from .env)
  const client = new SchemaICU();

  console.log('🚀 Schema.ICU SDK - Basic Usage Example\n');

  // Check authentication
  if (!client.isAuthenticated()) {
    console.error('❌ Not authenticated. Run: npm run setup');
    process.exit(1);
  }

  try {
    // Example 1: Generate code
    console.log('1️⃣  Generating code...');
    const codeResult = await client.codeGenerator.generate(
      'Create a function to validate email addresses',
      { language: 'JavaScript' }
    );
    console.log('✅ Code generated:');
    console.log(codeResult.data.code);
    console.log('');

    // Example 2: Improve code
    console.log('2️⃣  Improving code...');
    const improveResult = await client.codeImprover.improve(
      'Improve this code',
      { 
        code: 'function add(a,b){return a+b}',
        language: 'JavaScript'
      }
    );
    console.log('✅ Improved code:');
    console.log(improveResult.data.improvedCode);
    console.log('');

    // Example 3: Generate schema
    console.log('3️⃣  Generating schema...');
    const schemaResult = await client.schemaGenerator.generate(
      'Create schema for a product with name, price, and description'
    );
    console.log('✅ Schema:');
    console.log(schemaResult.data.schemaAsString);
    console.log('');

    console.log('✅ All examples completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
