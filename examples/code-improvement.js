/**
 * Code Improvement Example
 * 
 * Demonstrates how to improve code files using diff-improver
 */

const fs = require('fs').promises;
const path = require('path');
const { SchemaICU } = require('../src');

async function improveFile(filePath) {
  const client = new SchemaICU();

  if (!client.isAuthenticated()) {
    console.error('❌ Not authenticated. Run: npm run setup');
    process.exit(1);
  }

  try {
    console.log(`🔍 Improving: ${filePath}\n`);

    // Read file
    const code = await fs.readFile(filePath, 'utf-8');
    
    // Create backup
    const backupDir = path.join(process.cwd(), '.backups');
    await fs.mkdir(backupDir, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${path.basename(filePath)}_${timestamp}`;
    const backupPath = path.join(backupDir, backupName);
    
    await fs.writeFile(backupPath, code);
    console.log(`📦 Backup: ${backupName}\n`);
    
    // Call diff-improver
    console.log('🤖 Calling diff-improver...\n');
    const result = await client.diffImprover.improve(code, {
      language: path.extname(filePath).slice(1),
      focusAreas: ['performance', 'readability', 'best practices', 'security']
    });
    
    // Show results
    if (result.data.improvedCode) {
      console.log('✨ Improved code generated\n');
      
      if (result.data.diff) {
        console.log('📝 Diff:');
        console.log(result.data.diff);
        console.log('');
      }
      
      if (result.data.explanation) {
        console.log('💡 Explanation:');
        console.log(result.data.explanation);
        console.log('');
      }
      
      // Apply changes
      await fs.writeFile(filePath, result.data.improvedCode);
      console.log(`✅ Changes applied to ${filePath}`);
      
    } else {
      console.log('ℹ️  No improvements suggested');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// CLI execution
const filePath = process.argv[2];

if (!filePath) {
  console.log('Usage: node code-improvement.js <file>');
  console.log('Example: node code-improvement.js ../sample-code.js');
  process.exit(1);
}

improveFile(filePath);
