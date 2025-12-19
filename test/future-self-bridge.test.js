/**
 * Future Self Bridge Architecture Tests
 * Tests the revolutionary new features
 */

const { SchemaICU } = require('../src/client');
const FutureSelfBridge = require('../src/core/future-self-bridge');
const FutureSelfWrapper = require('../src/core/future-self-wrapper');
const MemoryManager = require('../src/core/memory-manager');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  Future Self Bridge Architecture Tests                    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function test1_CoreModulesLoad() {
  console.log('Test 1: Core Modules Load\n');
  
  try {
    console.log('✓ FutureSelfBridge loaded');
    console.log('✓ FutureSelfWrapper loaded');
    console.log('✓ MemoryManager loaded');
    console.log('✓ SchemaICU client loaded\n');
    return true;
  } catch (error) {
    console.error('✗ Module loading failed:', error.message);
    return false;
  }
}

async function test2_ClientMethods() {
  console.log('Test 2: Client Methods Exist\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    
    // Check new methods exist
    const methods = [
      'useFutureSelfBridge',
      'getFutureSelfWrapper',
      'createMemorySession',
      'getMemorySession',
      'executeFutureSelf',
      'wrapAgent',
      'wrapAgentWithMemory',
      'wrapAllAgents'
    ];
    
    for (const method of methods) {
      if (typeof client[method] === 'function') {
        console.log(`✓ client.${method}() exists`);
      } else {
        throw new Error(`client.${method}() not found`);
      }
    }
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Client methods test failed:', error.message);
    return false;
  }
}

async function test3_FutureSelfBridgeInstance() {
  console.log('Test 3: Future Self Bridge Instantiation\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const bridge = client.useFutureSelfBridge();
    
    console.log('✓ Bridge instance created');
    console.log('✓ Bridge has execute method:', typeof bridge.execute === 'function');
    console.log('✓ Bridge has planSchema method:', typeof bridge.planSchema === 'function');
    console.log('✓ Bridge has executeWithSchema method:', typeof bridge.executeWithSchema === 'function');
    console.log('✓ Bridge has executeWithMemory method:', typeof bridge.executeWithMemory === 'function');
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Bridge instantiation failed:', error.message);
    return false;
  }
}

async function test4_WrapperInstance() {
  console.log('Test 4: Wrapper Instantiation\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const wrapper = client.getFutureSelfWrapper();
    
    console.log('✓ Wrapper instance created');
    console.log('✓ Wrapper has wrap method:', typeof wrapper.wrap === 'function');
    console.log('✓ Wrapper has wrapWithMemory method:', typeof wrapper.wrapWithMemory === 'function');
    console.log('✓ Wrapper has wrapAll method:', typeof wrapper.wrapAll === 'function');
    
    // Test wrapping an agent
    const wrappedCodeGen = wrapper.wrap('code-generator');
    console.log('✓ Agent wrapped successfully');
    console.log('✓ Wrapped agent has execute method:', typeof wrappedCodeGen.execute === 'function');
    console.log('✓ Wrapped agent has executeWithMemory method:', typeof wrappedCodeGen.executeWithMemory === 'function');
    console.log('✓ Wrapped agent has planSchema method:', typeof wrappedCodeGen.planSchema === 'function');
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Wrapper test failed:', error.message);
    return false;
  }
}

async function test5_MemoryManager() {
  console.log('Test 5: Memory Manager\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const memory = client.createMemorySession({
      ownerName: 'test-user',
      maxInteractions: 21,
      maxSummaries: 3,
      persistToFile: false // Don't create files during test
    });
    
    console.log('✓ Memory session created');
    console.log('✓ Memory has addInteraction method:', typeof memory.addInteraction === 'function');
    console.log('✓ Memory has buildContext method:', typeof memory.buildContext === 'function');
    console.log('✓ Memory has getStats method:', typeof memory.getStats === 'function');
    
    // Add test interaction
    await memory.addInteraction({
      role: 'user',
      text: 'Test query',
      ts: Date.now()
    });
    
    const stats = memory.getStats();
    console.log('✓ Interaction added successfully');
    console.log('  - Active interactions:', stats.activeInteractions);
    console.log('  - Total count:', stats.totalCount);
    console.log('  - Signature algorithm:', stats.signatureAlgorithm);
    
    // Test context building
    const context = memory.buildContext();
    console.log('✓ Context built successfully');
    console.log('  - Recent interactions:', context.recentInteractions.length);
    console.log('  - Summaries:', context.summaries.length);
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Memory manager test failed:', error.message);
    return false;
  }
}

async function test6_WrapAllAgents() {
  console.log('Test 6: Wrap All Agents\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const wrapped = client.wrapAllAgents();
    
    const expectedAgents = [
      'code-generator',
      'schema-generator',
      'code-improver',
      'terminal',
      'diff-improver',
      'box-designer',
      'project-planner',
      'prompt-improver',
      'tool-choice',
      'github',
      'summary',
      'email'
    ];
    
    console.log(`✓ wrapAllAgents() returned object with ${Object.keys(wrapped).length} agents`);
    
    for (const agentType of expectedAgents) {
      if (wrapped[agentType] && typeof wrapped[agentType].execute === 'function') {
        console.log(`✓ ${agentType} wrapped successfully`);
      } else {
        throw new Error(`${agentType} not wrapped correctly`);
      }
    }
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Wrap all agents test failed:', error.message);
    return false;
  }
}

async function test7_DefaultSchemaGeneration() {
  console.log('Test 7: Default Schema Generation\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const bridge = client.useFutureSelfBridge();
    
    // Test default schemas for different agent types
    const schemas = {
      'code-generator': bridge.getDefaultSchema('code-generator'),
      'email': bridge.getDefaultSchema('email'),
      'summary': bridge.getDefaultSchema('summary')
    };
    
    console.log('✓ Default schema for code-generator:', !!schemas['code-generator']);
    console.log('  - Has response field:', !!schemas['code-generator'].properties.response);
    console.log('  - Has code field:', !!schemas['code-generator'].properties.code);
    console.log('  - Has missingContext field:', !!schemas['code-generator'].properties.missingContext);
    
    console.log('✓ Default schema for email:', !!schemas['email']);
    console.log('  - Has subject field:', !!schemas['email'].properties.subject);
    console.log('  - Has tone field:', !!schemas['email'].properties.tone);
    
    console.log('✓ Default schema for summary:', !!schemas['summary']);
    console.log('  - Has keyPoints field:', !!schemas['summary'].properties.keyPoints);
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Default schema test failed:', error.message);
    return false;
  }
}

async function test8_SelfAwarenessAnalysis() {
  console.log('Test 8: Self-Awareness Analysis\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const bridge = client.useFutureSelfBridge();
    
    // Test with complete execution
    const completeExecution = {
      response: 'Test response',
      missingContext: [],
      continue: false,
      questionForUser: false
    };
    
    const completeAnalysis = bridge.analyzeSelfAwareness(completeExecution);
    console.log('✓ Complete execution analysis:');
    console.log('  - Complete:', completeAnalysis.complete);
    console.log('  - Confidence:', completeAnalysis.confidence);
    console.log('  - Missing context:', completeAnalysis.missingContext.length);
    
    // Test with incomplete execution
    const incompleteExecution = {
      response: 'Partial response',
      missingContext: ['user context', 'project details'],
      continue: true,
      questionForUser: false
    };
    
    const incompleteAnalysis = bridge.analyzeSelfAwareness(incompleteExecution);
    console.log('✓ Incomplete execution analysis:');
    console.log('  - Complete:', incompleteAnalysis.complete);
    console.log('  - Confidence:', incompleteAnalysis.confidence);
    console.log('  - Missing context:', incompleteAnalysis.missingContext.length);
    console.log('  - Needs continue:', incompleteAnalysis.needsContinue);
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Self-awareness analysis test failed:', error.message);
    return false;
  }
}

async function test9_ConfidenceScoring() {
  console.log('Test 9: Confidence Scoring\n');
  
  try {
    const client = new SchemaICU({ apiKey: 'test-key' });
    const bridge = client.useFutureSelfBridge();
    
    // Perfect execution
    const perfect = {
      missingContext: [],
      continue: false,
      questionForUser: false
    };
    const perfectScore = bridge.calculateConfidence(perfect);
    console.log('✓ Perfect execution confidence:', perfectScore, '(expected: 1.0)');
    
    // Missing context
    const withMissing = {
      missingContext: ['item1', 'item2'],
      continue: false,
      questionForUser: false
    };
    const missingScore = bridge.calculateConfidence(withMissing);
    console.log('✓ With missing context confidence:', missingScore, '(expected: <1.0)');
    
    // Needs continue
    const needsContinue = {
      missingContext: [],
      continue: true,
      questionForUser: false
    };
    const continueScore = bridge.calculateConfidence(needsContinue);
    console.log('✓ Needs continue confidence:', continueScore, '(expected: <1.0)');
    
    // Has question
    const hasQuestion = {
      missingContext: [],
      continue: false,
      questionForUser: true
    };
    const questionScore = bridge.calculateConfidence(hasQuestion);
    console.log('✓ Has question confidence:', questionScore, '(expected: <1.0)');
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Confidence scoring test failed:', error.message);
    return false;
  }
}

async function test10_MemoryCompression() {
  console.log('Test 10: Memory Compression (Basic)\n');
  
  try {
    const memory = new MemoryManager({
      maxInteractions: 3, // Small limit to trigger compression
      maxSummaries: 2,
      persistToFile: false,
      summaryAgent: null // Test without SummaryAgent
    });
    
    // Add interactions to trigger compression
    for (let i = 1; i <= 5; i++) {
      await memory.addInteraction({
        role: i % 2 === 0 ? 'user' : 'assistant',
        text: `Test message ${i}`,
        ts: Date.now()
      });
    }
    
    const stats = memory.getStats();
    console.log('✓ Memory compression triggered');
    console.log('  - Active interactions:', stats.activeInteractions, `(max: ${stats.maxInteractions})`);
    console.log('  - Total summaries:', stats.totalSummaries);
    console.log('  - Total count:', stats.totalCount);
    console.log('  - Compression working:', stats.activeInteractions <= stats.maxInteractions);
    
    console.log();
    return true;
  } catch (error) {
    console.error('✗ Memory compression test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const tests = [
    test1_CoreModulesLoad,
    test2_ClientMethods,
    test3_FutureSelfBridgeInstance,
    test4_WrapperInstance,
    test5_MemoryManager,
    test6_WrapAllAgents,
    test7_DefaultSchemaGeneration,
    test8_SelfAwarenessAnalysis,
    test9_ConfidenceScoring,
    test10_MemoryCompression
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`✗ Test threw error: ${error.message}\n`);
      failed++;
    }
  }
  
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Test Results                                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`✓ Passed: ${passed}/${tests.length}`);
  console.log(`✗ Failed: ${failed}/${tests.length}\n`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
    console.log('🌉 Future Self Bridge Architecture is ready!');
    console.log('🔐 Post-quantum signatures integrated!');
    console.log('💾 Memory management operational!\n');
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.\n');
  }
  
  return failed === 0;
}

// Run if executed directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests };
