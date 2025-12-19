/**
 * Future Self Bridge Architecture Examples
 * 
 * The revolutionary pattern that makes Schema.ICU unique:
 * 1. Current Self (Planning) - Generate schema before execution
 * 2. Future Self (Execution) - Execute with self-aware context detection
 * 3. Memory Integration - Store signed interactions
 * 4. Post-Quantum Signatures - ML-DSA-65/87 cryptographic verification
 * 
 * This is the ONLY SDK with both PQ crypto AND Future Self Bridge!
 */

const { SchemaICU } = require('../src/client');

async function example1_BasicFutureSelf() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 1: Basic Future Self Bridge Execution');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  // Enable post-quantum signatures
  client.usePostQuantum();

  // Execute with Future Self Bridge pattern
  const result = await client.executeFutureSelf('code-generator', 
    'Create a Python function to calculate Fibonacci numbers', 
    {
      context: {
        language: 'python',
        style: 'recursive'
      },
      autoRetry: true,
      maxRetries: 3
    }
  );

  console.log('📊 Result:', {
    response: result.response?.substring(0, 200) + '...',
    code: result.code?.substring(0, 100) + '...',
    futureSelfBridge: result.futureSelfBridge
  });

  console.log('\n🧠 Future Self Bridge Details:');
  console.log('- Schema Planned:', !!result.futureSelfBridge.schemaPlanned);
  console.log('- Self Awareness:', result.futureSelfBridge.selfAwareness);
  console.log('- Attempts:', result.futureSelfBridge.attempts);
  console.log('- Complete:', result.futureSelfBridge.complete);

  if (result.signature) {
    console.log('\n🔐 Cryptographic Signature:');
    console.log('- Algorithm:', result.signatureAlgorithm);
    console.log('- Signature Length:', result.signature.length);
  }
}

async function example2_WrapperPattern() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 2: Future Self Wrapper Pattern');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  client.usePostQuantum('ml-dsa-87');

  // Wrap code generator with Future Self pattern
  const futureCodeGen = client.wrapAgent('code-generator');

  console.log('🚀 Executing wrapped agent...\n');

  const result = await futureCodeGen.execute(
    'Generate a REST API endpoint for user authentication',
    {
      context: {
        framework: 'Express.js',
        authentication: 'JWT'
      },
      signatureAlgorithm: 'PQ'
    }
  );

  console.log('📊 Result:', {
    response: result.response?.substring(0, 150) + '...',
    includesCode: result.includesCode,
    complete: result.futureSelfBridge.complete,
    confidence: result.futureSelfBridge.selfAwareness.confidence
  });

  console.log('\n🔍 Self-Awareness Check:');
  console.log('- Missing Context:', result.futureSelfBridge.selfAwareness.missingContext);
  console.log('- Needs Continue:', result.futureSelfBridge.selfAwareness.needsContinue);
  console.log('- Has Question:', result.futureSelfBridge.selfAwareness.hasQuestion);
  console.log('- Confidence Score:', result.futureSelfBridge.selfAwareness.confidence);
}

async function example3_MemoryIntegration() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 3: Memory-Aware Future Self Bridge');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  client.usePostQuantum();

  // Create memory session
  const memory = client.createMemorySession({
    ownerName: 'demo-user',
    maxInteractions: 21,
    maxSummaries: 3,
    persistToFile: true,
    memoryDir: './demo-memory'
  });

  console.log('📁 Memory session created\n');

  // Wrap email agent with memory
  const futureEmailAgent = client.wrapAgentWithMemory('email');

  // First interaction
  console.log('📧 Interaction 1: Compose formal email\n');
  const email1 = await futureEmailAgent.execute(
    'Compose a formal email to introduce our new product',
    {
      context: {
        productName: 'Schema.ICU SDK',
        tone: 'professional'
      }
    }
  );

  console.log('Result 1:', {
    subject: email1.subject,
    tone: email1.tone,
    hasMemory: !!email1.futureSelfBridge
  });

  // Second interaction with memory context
  console.log('\n📧 Interaction 2: Follow-up email (with memory)\n');
  const email2 = await futureEmailAgent.execute(
    'Write a follow-up email',
    {
      context: {
        referencePrevious: true
      }
    }
  );

  console.log('Result 2:', {
    subject: email2.subject,
    memoryStats: memory.getStats()
  });

  console.log('\n💾 Memory Stats:');
  console.log(memory.getStats());
}

async function example4_MultiAgentOrchestration() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 4: Multi-Agent Future Self Orchestration');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  client.usePostQuantum('ml-dsa-87');

  // Wrap multiple agents
  const wrapper = client.getFutureSelfWrapper();
  const agents = wrapper.wrapMultiple([
    'project-planner',
    'code-generator',
    'summary'
  ]);

  console.log('🎯 Step 1: Plan project structure\n');
  const plan = await agents['project-planner'].execute(
    'Plan a microservices architecture for e-commerce',
    {
      context: {
        services: ['user', 'product', 'order', 'payment'],
        framework: 'Node.js'
      }
    }
  );

  console.log('Plan created:', {
    complete: plan.futureSelfBridge.complete,
    confidence: plan.futureSelfBridge.selfAwareness.confidence
  });

  console.log('\n🚀 Step 2: Generate code for first service\n');
  const code = await agents['code-generator'].execute(
    'Generate user service with authentication',
    {
      context: {
        projectPlan: plan.response,
        service: 'user'
      }
    }
  );

  console.log('Code generated:', {
    includesCode: code.includesCode,
    complete: code.futureSelfBridge.complete
  });

  console.log('\n📝 Step 3: Summarize the session\n');
  const summary = await agents['summary'].execute(
    'Summarize the project planning and code generation',
    {
      context: {
        plan: plan.response,
        code: code.response
      }
    }
  );

  console.log('Summary:', {
    keyPoints: summary.keyPoints?.length || 0,
    complete: summary.futureSelfBridge.complete
  });
}

async function example5_SelfAwareRetry() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 5: Self-Aware Retry with Missing Context Detection');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  client.usePostQuantum();

  // Execute with intentionally vague query
  console.log('🤔 Query: Vague request to test self-awareness\n');
  
  const result = await client.executeFutureSelf('code-generator',
    'Generate some code',  // Intentionally vague
    {
      autoRetry: true,
      maxRetries: 3
    }
  );

  console.log('📊 Result after retries:', {
    attempts: result.futureSelfBridge.attempts,
    complete: result.futureSelfBridge.complete,
    missingContext: result.futureSelfBridge.selfAwareness.missingContext,
    hasQuestion: result.futureSelfBridge.selfAwareness.hasQuestion,
    question: result.futureSelfBridge.selfAwareness.question
  });

  if (!result.futureSelfBridge.complete) {
    console.log('\n⚠️  Agent detected missing information:');
    result.futureSelfBridge.selfAwareness.missingContext.forEach((item, i) => {
      console.log(`  ${i + 1}. ${item}`);
    });
  }
}

async function example6_SchemaPlanning() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 6: Schema Planning (Current Self)');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  const bridge = client.useFutureSelfBridge();

  // Plan schema without execution
  console.log('🧠 Planning schema for email composition...\n');
  
  const schema = await bridge.planSchema('email', 
    'Compose marketing email for product launch',
    {
      hints: {
        includeSubject: true,
        includeTone: true,
        includeCallToAction: true
      }
    }
  );

  console.log('📋 Planned Schema:', JSON.stringify(schema, null, 2));

  // Now execute with the planned schema
  console.log('\n🚀 Executing with planned schema...\n');
  
  const result = await bridge.executeWithSchema('email',
    'Compose marketing email for Schema.ICU SDK launch',
    {
      schema,
      context: {
        product: 'Schema.ICU SDK',
        features: ['Post-quantum crypto', 'Future Self Bridge', '13 agents']
      },
      signatureAlgorithm: 'PQ'
    }
  );

  console.log('📧 Result:', {
    subject: result.subject,
    tone: result.tone,
    bodyLength: result.body?.length || 0,
    signature: result.signature?.substring(0, 50) + '...'
  });
}

async function example7_AdvancedBridge() {
  console.log('\n════════════════════════════════════════════════════════════');
  console.log('Example 7: Advanced Future Self Bridge Features');
  console.log('════════════════════════════════════════════════════════════\n');

  const client = new SchemaICU({
    apiKey: process.env.SCHEMA_ICU_API_KEY
  });

  client.usePostQuantum('ml-dsa-87');

  // Create memory session
  const memory = client.createMemorySession({
    ownerName: 'advanced-demo'
  });

  const bridge = client.useFutureSelfBridge();

  console.log('🔄 Executing with full Future Self Bridge + Memory...\n');

  const result = await bridge.executeWithMemory(
    memory,
    'code-generator',
    'Create a blockchain smart contract',
    {
      context: {
        blockchain: 'Ethereum',
        language: 'Solidity',
        features: ['token transfer', 'access control']
      },
      signatureAlgorithm: 'PQ',
      autoRetry: true,
      maxRetries: 2,
      schemaHints: {
        includeSecurityNotes: true,
        includeTestCases: true
      }
    }
  );

  console.log('📊 Comprehensive Result:', {
    complete: result.futureSelfBridge.complete,
    attempts: result.futureSelfBridge.attempts,
    confidence: result.futureSelfBridge.selfAwareness.confidence,
    hasCode: result.includesCode,
    signatureAlgorithm: result.signatureAlgorithm,
    signatureLength: result.signature?.length || 0,
    memoryInteractions: memory.getStats().activeInteractions
  });

  console.log('\n💾 Memory Status:', memory.getStats());
}

// Run examples
async function runAllExamples() {
  try {
    await example1_BasicFutureSelf();
    await example2_WrapperPattern();
    await example3_MemoryIntegration();
    await example4_MultiAgentOrchestration();
    await example5_SelfAwareRetry();
    await example6_SchemaPlanning();
    await example7_AdvancedBridge();

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('🎉 All Future Self Bridge examples completed!');
    console.log('════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples();
}

module.exports = {
  example1_BasicFutureSelf,
  example2_WrapperPattern,
  example3_MemoryIntegration,
  example4_MultiAgentOrchestration,
  example5_SelfAwareRetry,
  example6_SchemaPlanning,
  example7_AdvancedBridge
};
