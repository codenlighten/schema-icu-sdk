/**
 * Summary Agent Example
 * 
 * Demonstrates how to use the Summary Agent to compress conversations
 * and extract key insights.
 */

require('dotenv').config();
const { SchemaICU } = require('@smartledger/schema-icu-sdk');

async function main() {
  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Summary Agent Example                                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Example 1: Summarize a long conversation
  const longConversation = `
    User: I'm planning to build a real-time chat application with WebSocket support.
    Assistant: That sounds great! You'll need to consider authentication, message persistence, and scalability.
    User: Yes, I'm thinking of using Node.js with Express and Socket.IO.
    Assistant: Good choice. For the database, consider MongoDB for message storage and Redis for real-time state.
    User: What about handling disconnections and reconnections?
    Assistant: Implement heartbeat mechanisms and store session state in Redis with TTL.
    User: Should I use microservices or monolith?
    Assistant: For a chat app, start with a monolith. Scale to microservices when needed.
  `;

  console.log('Example 1: Summarizing Long Conversation\n');
  console.log('-'.repeat(60));
  
  const summary1 = await client.summaryAgent.summarize(longConversation);
  
  console.log('Summary:', summary1.summary);
  console.log('\nKey Points:');
  summary1.keyPoints.forEach((point, i) => {
    console.log(`  ${i + 1}. ${point}`);
  });
  console.log('\nContext Metadata:');
  console.log('  Themes:', summary1.contextMeta.dominantThemes.join(', '));
  console.log('  Tone:', summary1.contextMeta.toneSummary);
  if (summary1.contextMeta.unresolvedThreads.length > 0) {
    console.log('  Unresolved:', summary1.contextMeta.unresolvedThreads.join(', '));
  }

  // Example 2: Summarize with specific focus
  console.log('\n\nExample 2: Summarize with Focus on Technical Decisions\n');
  console.log('-'.repeat(60));
  
  const summary2 = await client.summaryAgent.summarizeWithFocus(
    longConversation,
    'technical decisions and architecture choices'
  );
  
  console.log('Focused Summary:', summary2.summary);

  // Example 3: Summarize with Post-Quantum Signature
  console.log('\n\nExample 3: Summarize with Quantum-Resistant Signature\n');
  console.log('-'.repeat(60));
  
  const summary3 = await client.summaryAgent.summarize(longConversation, {
    signatureAlgorithm: 'ml-dsa-65'
  });
  
  console.log('Summary:', summary3.summary);
  console.log('\nSignature Info:');
  console.log(`  Algorithm: ${summary3.signature.algorithm}`);
  console.log(`  Quantum-resistant: ${summary3.signature.quantumResistant}`);
  console.log(`  Signature size: ${summary3.signature.signature.length} chars`);

  // Example 4: Compress multiple conversation windows
  console.log('\n\nExample 4: Rolling Compression (Memory Management)\n');
  console.log('-'.repeat(60));
  
  const window1 = "Discussed project requirements and tech stack selection.";
  const window2 = "Decided on Node.js, MongoDB, and Redis architecture.";
  const window3 = "Reviewed authentication strategy and security measures.";
  
  const rollingMemory = await client.summaryAgent.compress(
    `Previous summaries:\n1. ${window1}\n2. ${window2}\n3. ${window3}\n\nCreate a master summary.`,
    { compressionLevel: 'high' }
  );
  
  console.log('Master Summary:', rollingMemory.summary);

  console.log('\n✓ All examples completed successfully!\n');
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
