#!/usr/bin/env node
/**
 * Schema.ICU SDK CLI
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0];

const commands = {
  setup: path.join(__dirname, 'setup.js'),
  init: path.join(__dirname, 'setup.js'),
  login: path.join(__dirname, 'commands', 'login.js'),
  improve: path.join(__dirname, 'commands', 'improve.js'),
  generate: path.join(__dirname, 'commands', 'generate.js')
};

function showHelp() {
  console.log('\n📚 Schema.ICU SDK CLI\n');
  console.log('Usage: schema-icu <command> [options]\n');
  console.log('Commands:');
  console.log('  setup, init       Interactive setup wizard');
  console.log('  login             Login to Schema.ICU');
  console.log('  improve <file>    Improve a code file');
  console.log('  generate <query>  Generate code');
  console.log('');
  console.log('Examples:');
  console.log('  schema-icu setup');
  console.log('  schema-icu improve server.js');
  console.log('  schema-icu generate "Create a REST API"');
  console.log('');
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

const scriptPath = commands[command];

if (!scriptPath) {
  console.error(`\n❌ Unknown command: ${command}\n`);
  showHelp();
  process.exit(1);
}

const child = spawn('node', [scriptPath, ...args.slice(1)], {
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error(`\n❌ Failed to execute command: ${error.message}\n`);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
