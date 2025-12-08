#!/usr/bin/env node
/**
 * Schema.ICU SDK - Interactive Setup Wizard
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { AuthManager } = require('../src/auth');
const { Config } = require('../src/utils/config');
const { AuthenticationError } = require('../src/utils/errors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function passwordQuestion(query) {
  return new Promise(resolve => {
    const stdin = process.stdin;
    const write = process.stdout.write.bind(process.stdout);
    
    process.stdout.write(query);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    
    stdin.on('data', function onData(char) {
      char = char.toString('utf8');
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f':
        case '\b':
          if (password.length > 0) {
            password = password.slice(0, -1);
            write('\b \b');
          }
          break;
        default:
          password += char;
          write('*');
          break;
      }
    });
  });
}

async function welcome() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║          🚀 Schema.ICU SDK Setup Wizard 🚀                ║');
  console.log('║                                                            ║');
  console.log('║       Structured AI. Verified. Trusted.                   ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

async function checkExistingConfig() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Found existing .env file\n');
    const overwrite = await question('Do you want to reconfigure? (y/n): ');
    
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n✅ Using existing configuration\n');
      rl.close();
      process.exit(0);
    }
  }
}

async function selectAuthMethod() {
  console.log('\n📋 How would you like to authenticate?\n');
  console.log('1. Login with existing account');
  console.log('2. Register new account');
  console.log('3. Use API key directly\n');
  
  const choice = await question('Select option (1-3): ');
  return choice.trim();
}

async function loginFlow() {
  console.log('\n🔐 Login to Schema.ICU\n');
  
  const email = await question('Email: ');
  const password = await passwordQuestion('Password: ');
  
  console.log('\n⏳ Authenticating...\n');
  
  const config = new Config();
  const auth = new AuthManager(config);
  
  try {
    const result = await auth.login(email, password);
    
    if (result.success) {
      console.log('✅ Login successful!\n');
      console.log(`👤 User: ${email}`);
      console.log(`🎫 Tier: ${result.user?.tier || 'N/A'}`);
      console.log(`🔑 API Key: ${result.user?.apiKey}\n`);
      
      return {
        email,
        apiKey: result.user?.apiKey,
        jwtToken: result.token
      };
    } else {
      throw new Error(result.message || 'Login failed');
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('\n❌ Authentication failed!');
      console.log(`Error: ${error.message}\n`);
      console.log('💡 Tip: Visit https://schema.icu/register to create an account\n');
    } else {
      console.log('\n❌ Login failed:', error.message, '\n');
    }
    
    const retry = await question('Try again? (y/n): ');
    if (retry.toLowerCase() === 'y') {
      return await loginFlow();
    }
    
    return null;
  }
}

async function registerFlow() {
  console.log('\n📝 Register for Schema.ICU\n');
  
  const email = await question('Email: ');
  const password = await passwordQuestion('Password: ');
  const confirmPassword = await passwordQuestion('Confirm Password: ');
  
  if (password !== confirmPassword) {
    console.log('\n❌ Passwords do not match!\n');
    const retry = await question('Try again? (y/n): ');
    if (retry.toLowerCase() === 'y') {
      return await registerFlow();
    }
    return null;
  }
  
  console.log('\n⏳ Creating account...\n');
  
  const config = new Config();
  const auth = new AuthManager(config);
  
  try {
    const result = await auth.register(email, password);
    
    if (result.success) {
      console.log('✅ Registration successful!\n');
      console.log('📧 Please check your email for OTP verification code\n');
      
      const otp = await question('Enter OTP: ');
      
      console.log('\n⏳ Verifying...\n');
      
      const verifyResult = await auth.verifyEmail(email, otp);
      
      if (verifyResult.success) {
        console.log('✅ Email verified!\n');
        console.log(`🔑 API Key: ${verifyResult.apiKey}\n`);
        
        return {
          email,
          apiKey: verifyResult.apiKey,
          jwtToken: null
        };
      } else {
        throw new Error('Verification failed');
      }
    } else {
      throw new Error(result.message || 'Registration failed');
    }
  } catch (error) {
    console.log('\n❌ Registration failed:', error.message, '\n');
    
    const retry = await question('Try again? (y/n): ');
    if (retry.toLowerCase() === 'y') {
      return await registerFlow();
    }
    
    return null;
  }
}

async function apiKeyFlow() {
  console.log('\n🔑 Enter API Key\n');
  
  const apiKey = await question('API Key: ');
  const email = await question('Email (optional): ');
  
  return {
    email: email || null,
    apiKey,
    jwtToken: null
  };
}

async function saveConfiguration(credentials) {
  const config = new Config({
    apiKey: credentials.apiKey,
    jwtToken: credentials.jwtToken,
    email: credentials.email
  });
  
  const envPath = config.saveToEnv();
  
  console.log(`✅ Configuration saved to: ${envPath}\n`);
  console.log('📦 You can now use the Schema.ICU SDK!\n');
  console.log('Quick Start:\n');
  console.log('  const { SchemaICU } = require(\'@schema-icu/schema-icu-sdk\');');
  console.log('  const client = new SchemaICU();');
  console.log('  const result = await client.codeGenerator.generate(\'Create a hello world function\');\n');
}

async function main() {
  try {
    await welcome();
    await checkExistingConfig();
    
    const authMethod = await selectAuthMethod();
    let credentials = null;
    
    switch (authMethod) {
      case '1':
        credentials = await loginFlow();
        break;
      case '2':
        credentials = await registerFlow();
        break;
      case '3':
        credentials = await apiKeyFlow();
        break;
      default:
        console.log('\n❌ Invalid option\n');
        rl.close();
        process.exit(1);
    }
    
    if (credentials) {
      await saveConfiguration(credentials);
    } else {
      console.log('\n⚠️  Setup cancelled\n');
    }
    
    rl.close();
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message, '\n');
    rl.close();
    process.exit(1);
  }
}

main();
