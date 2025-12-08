/**
 * Authentication Example
 * 
 * Demonstrates authentication flows
 */

const { SchemaICU } = require('../src');

async function authExample() {
  console.log('🔐 Schema.ICU SDK - Authentication Example\n');

  // Create client without credentials
  const client = new SchemaICU();

  try {
    // Example 1: Check authentication status
    console.log('1️⃣  Checking authentication...');
    if (client.isAuthenticated()) {
      console.log('✅ Already authenticated\n');
      
      // Get user info
      const userInfo = await client.auth.getMe();
      console.log('User Info:', JSON.stringify(userInfo, null, 2));
    } else {
      console.log('❌ Not authenticated\n');
      
      // Example 2: Login (requires user input)
      console.log('2️⃣  To authenticate, run: npm run setup\n');
      console.log('Or programmatically:');
      console.log('  const result = await client.auth.login(email, password);');
      console.log('  client.config.apiKey = result.user.apiKey;');
      console.log('  client.config.jwtToken = result.token;\n');
    }

    // Example 3: Show config
    console.log('3️⃣  Current configuration:');
    const config = client.getConfig();
    console.log(JSON.stringify(config, null, 2));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

authExample();
