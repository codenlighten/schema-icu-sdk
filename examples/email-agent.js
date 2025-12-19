/**
 * Email Agent Example
 * 
 * Demonstrates how to use the Email Agent to compose professional emails
 * in various styles and tones.
 */

require('dotenv').config();
const { SchemaICU } = require('@smartledger/schema-icu-sdk');

async function main() {
  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Email Agent Example                                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Example 1: Compose a formal business email
  console.log('Example 1: Formal Business Email\n');
  console.log('-'.repeat(60));
  
  const email1 = await client.emailAgent.composeFormal(
    'Request a meeting with the CEO to discuss Q1 2026 budget allocation',
    { recipient: 'CEO', urgency: 'normal' }
  );
  
  console.log(`Subject: ${email1.subject}`);
  console.log(`\nBody:\n${email1.body}`);
  console.log(`\nClosing: ${email1.closing}`);

  // Example 2: Casual team email
  console.log('\n\nExample 2: Casual Team Email\n');
  console.log('-'.repeat(60));
  
  const email2 = await client.emailAgent.composeCasual(
    'Invite the team to Friday happy hour at the new brewery downtown',
    { tone: 'friendly', emoji: true }
  );
  
  console.log(`Subject: ${email2.subject}`);
  console.log(`\nBody:\n${email2.body}`);
  console.log(`\nClosing: ${email2.closing}`);

  // Example 3: Marketing email
  console.log('\n\nExample 3: Marketing Email\n');
  console.log('-'.repeat(60));
  
  const email3 = await client.emailAgent.composeMarketing(
    'Announce the launch of our new AI-powered code review tool with 50% discount for early adopters',
    { product: 'CodeReview AI', discount: '50%' }
  );
  
  console.log(`Subject: ${email3.subject}`);
  console.log(`\nBody:\n${email3.body}`);
  console.log(`\nClosing: ${email3.closing}`);

  // Example 4: Reply to an email
  console.log('\n\nExample 4: Reply to Email\n');
  console.log('-'.repeat(60));
  
  const originalEmail = `
    Subject: Project Deadline Extension Request
    
    Hi,
    
    I'm writing to request a 2-week extension on the XYZ project deadline.
    We've encountered some unexpected technical challenges with the API integration.
    
    Thanks,
    John
  `;
  
  const email4 = await client.emailAgent.reply(
    originalEmail,
    'Approve the extension but ask for a detailed status update by Wednesday',
    { tone: 'professional but understanding' }
  );
  
  console.log(`Subject: ${email4.subject}`);
  console.log(`\nBody:\n${email4.body}`);
  console.log(`\nClosing: ${email4.closing}`);

  // Example 5: Email with Post-Quantum Signature
  console.log('\n\nExample 5: Email with Quantum-Resistant Signature\n');
  console.log('-'.repeat(60));
  
  const email5 = await client.emailAgent.compose(
    'Inform the security team about implementing post-quantum cryptography in our platform',
    {
      tone: 'technical and informative',
      signatureAlgorithm: 'ml-dsa-65'
    }
  );
  
  console.log(`Subject: ${email5.subject}`);
  console.log(`\nSignature Info:`);
  console.log(`  Algorithm: ${email5.signature.algorithm}`);
  console.log(`  Quantum-resistant: ${email5.signature.quantumResistant}`);
  console.log(`  Signature size: ${email5.signature.signature.length} chars`);

  // Example 6: Multiple tone options
  console.log('\n\nExample 6: Same Request, Different Tones\n');
  console.log('-'.repeat(60));
  
  const request = 'Ask Sarah to review the code changes before tomorrow\'s deployment';
  
  const formalVersion = await client.emailAgent.composeFormal(request);
  const casualVersion = await client.emailAgent.composeCasual(request);
  
  console.log('Formal Subject:', formalVersion.subject);
  console.log('Casual Subject:', casualVersion.subject);

  console.log('\n✓ All examples completed successfully!\n');
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
