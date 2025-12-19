/**
 * Future Self Bridge Architecture
 * 
 * Revolutionary pattern where "current self" plans the schema,
 * and "future self" executes with self-aware context detection.
 * 
 * Flow:
 * 1. Current Self (Planning) - Analyze query and generate schema
 * 2. Schema Generation - Define expected response structure
 * 3. External Actions - Execute agent with schema guidance
 * 4. Future Self (Execution) - Deliver response with missing context detection
 * 5. Cryptographic Signature - Sign with ML-DSA post-quantum algorithm
 * 6. Memory Storage - Store signed interaction for future reference
 * 
 * This makes Schema.ICU the ONLY SDK with both:
 * - Post-quantum cryptography (ML-DSA-65/87)
 * - Future Self Bridge pattern (self-aware schema planning)
 */

const { HTTPClient } = require('../utils/http');

class FutureSelfBridge {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.baseUrl = config.baseUrl || 'https://api.schema.icu';
    this.schemaEndpoint = `${this.baseUrl}/schema/generate`;
    this.executeEndpoint = `${this.baseUrl}/agent/execute`;
  }

  /**
   * Execute agent with Future Self Bridge pattern
   * 
   * @param {string} agentType - Type of agent to execute (e.g., 'code-generator', 'email')
   * @param {string} query - User query
   * @param {Object} options - Execution options
   * @param {Object} options.context - Additional context
   * @param {string} options.signatureAlgorithm - Signature algorithm (ML-DSA-65, ML-DSA-87, PQ, ECDSA)
   * @param {boolean} options.autoRetry - Auto-retry if missing context detected (default: true)
   * @param {number} options.maxRetries - Maximum retry attempts (default: 3)
   * @param {Object} options.schemaHints - Hints for schema generation
   * @returns {Promise<Object>} Enhanced response with schema awareness
   */
  async execute(agentType, query, options = {}) {
    const {
      context = {},
      signatureAlgorithm = 'PQ', // Default to ML-DSA-87
      autoRetry = true,
      maxRetries = 3,
      schemaHints = {}
    } = options;

    let attempt = 0;
    let accumulatedContext = { ...context };

    while (attempt <= maxRetries) {
      try {
        // STEP 1: Current Self - Plan the schema
        console.log(`🧠 Step 1/${attempt + 1}: Current Self planning schema...`);
        const schema = await this.planSchema(agentType, query, {
          context: accumulatedContext,
          hints: schemaHints
        });

        // STEP 2: Future Self - Execute with schema guidance
        console.log(`🚀 Step 2/${attempt + 1}: Future Self executing with schema...`);
        const execution = await this.executeWithSchema(agentType, query, {
          schema,
          context: accumulatedContext,
          signatureAlgorithm
        });

        // STEP 3: Self-awareness check
        console.log(`🔍 Step 3/${attempt + 1}: Checking for missing context...`);
        const awareness = this.analyzeSelfAwareness(execution);

        // If execution is complete, return result
        if (awareness.complete) {
          console.log(`✅ Execution complete!`);
          return {
            ...execution,
            futureSelfBridge: {
              schemaPlanned: schema,
              selfAwareness: awareness,
              attempts: attempt + 1,
              complete: true
            }
          };
        }

        // If auto-retry disabled or max retries reached, return partial result
        if (!autoRetry || attempt >= maxRetries) {
          console.log(`⚠️  Execution incomplete after ${attempt + 1} attempt(s)`);
          return {
            ...execution,
            futureSelfBridge: {
              schemaPlanned: schema,
              selfAwareness: awareness,
              attempts: attempt + 1,
              complete: false,
              reason: attempt >= maxRetries ? 'max_retries_reached' : 'auto_retry_disabled'
            }
          };
        }

        // Accumulate missing context for next iteration
        console.log(`🔄 Retry ${attempt + 2}: Adding missing context...`);
        accumulatedContext = {
          ...accumulatedContext,
          previousAttempts: (accumulatedContext.previousAttempts || 0) + 1,
          missingContextFromPreviousRun: awareness.missingContext,
          previousSchema: schema,
          previousResponse: execution.response
        };

        attempt++;
      } catch (error) {
        throw new Error(`Future Self Bridge execution failed: ${error.message}`);
      }
    }
  }

  /**
   * Plan schema for agent execution (Current Self)
   * 
   * @param {string} agentType - Type of agent
   * @param {string} query - User query
   * @param {Object} options - Planning options
   * @returns {Promise<Object>} Generated schema
   */
  async planSchema(agentType, query, options = {}) {
    const { context = {}, hints = {} } = options;

    const schemaQuery = `Generate a JSON schema for ${agentType} agent to respond to this query: "${query}"`;

    const requestBody = {
      query: schemaQuery,
      context: {
        agentType,
        originalQuery: query,
        ...context,
        schemaHints: {
          includeResponseField: true,
          includeIncludesCodeField: agentType.includes('code') || agentType.includes('generator'),
          includeCodeField: agentType.includes('code') || agentType.includes('generator'),
          includeContinueField: true,
          includeQuestionForUserField: true,
          includeMissingContextField: true, // Self-awareness
          ...hints
        }
      }
    };

    try {
      const response = await this.http.post(this.schemaEndpoint, requestBody);
      return response.data.schema || this.getDefaultSchema(agentType);
    } catch (error) {
      console.warn(`Schema planning failed, using default schema: ${error.message}`);
      return this.getDefaultSchema(agentType);
    }
  }

  /**
   * Execute agent with schema guidance (Future Self)
   * 
   * @param {string} agentType - Type of agent
   * @param {string} query - User query
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result
   */
  async executeWithSchema(agentType, query, options = {}) {
    const { schema, context = {}, signatureAlgorithm } = options;

    const requestBody = {
      query,
      context: {
        ...context,
        expectedSchema: schema,
        selfAwareMode: true // Enable self-awareness
      }
    };

    // Add signature algorithm at top level (not nested in context)
    if (signatureAlgorithm) {
      requestBody.signatureAlgorithm = signatureAlgorithm;
    }

    const agentEndpoint = `${this.baseUrl}/${this.getAgentEndpointPath(agentType)}`;

    try {
      const response = await this.http.post(agentEndpoint, requestBody);
      return response.data;
    } catch (error) {
      throw new Error(`Agent execution failed: ${error.message}`);
    }
  }

  /**
   * Analyze self-awareness in execution result
   * 
   * @param {Object} execution - Execution result
   * @returns {Object} Self-awareness analysis
   */
  analyzeSelfAwareness(execution) {
    const missingContext = execution.missingContext || [];
    const needsContinue = execution.continue === true;
    const hasQuestion = execution.questionForUser === true;

    return {
      complete: missingContext.length === 0 && !needsContinue && !hasQuestion,
      missingContext,
      needsContinue,
      hasQuestion,
      question: execution.question || null,
      confidence: this.calculateConfidence(execution)
    };
  }

  /**
   * Calculate confidence score based on response completeness
   * 
   * @param {Object} execution - Execution result
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(execution) {
    let score = 1.0;

    // Reduce confidence for missing context
    if (execution.missingContext && execution.missingContext.length > 0) {
      score -= 0.2 * Math.min(execution.missingContext.length, 3);
    }

    // Reduce confidence if needs continuation
    if (execution.continue === true) {
      score -= 0.15;
    }

    // Reduce confidence if has questions
    if (execution.questionForUser === true) {
      score -= 0.15;
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get default schema for agent type
   * 
   * @param {string} agentType - Type of agent
   * @returns {Object} Default schema
   */
  getDefaultSchema(agentType) {
    const baseSchema = {
      type: 'object',
      properties: {
        response: { type: 'string', description: 'Main response to the query' },
        includesCode: { type: 'boolean', description: 'Whether response includes code' },
        code: { type: 'string', description: 'Code snippet if applicable' },
        continue: { type: 'boolean', description: 'Whether agent needs to continue' },
        questionForUser: { type: 'boolean', description: 'Whether agent has a question' },
        question: { type: 'string', description: 'Follow-up question if applicable' },
        missingContext: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'List of missing information needed for perfection'
        }
      },
      required: ['response', 'includesCode', 'code', 'continue', 'questionForUser', 'missingContext']
    };

    // Customize schema based on agent type
    if (agentType.includes('email')) {
      baseSchema.properties.subject = { type: 'string', description: 'Email subject line' };
      baseSchema.properties.tone = { type: 'string', description: 'Email tone (formal, casual, etc.)' };
      baseSchema.required.push('subject', 'tone');
    }

    if (agentType.includes('summary')) {
      baseSchema.properties.keyPoints = { 
        type: 'array', 
        items: { type: 'string' },
        description: 'Key points from the content'
      };
      baseSchema.required.push('keyPoints');
    }

    return baseSchema;
  }

  /**
   * Get agent endpoint path from agent type
   * 
   * @param {string} agentType - Type of agent
   * @returns {string} Endpoint path
   */
  getAgentEndpointPath(agentType) {
    const pathMap = {
      'code-generator': 'code/generate',
      'code-improver': 'code/improve',
      'schema-generator': 'schema/generate',
      'terminal': 'terminal',
      'diff-improver': 'diff/improve',
      'box-designer': 'box/design',
      'project-planner': 'project/plan',
      'prompt-improver': 'prompt/improve',
      'tool-choice': 'tool/choice',
      'github': 'github',
      'summary': 'summary',
      'email': 'email'
    };

    return pathMap[agentType] || agentType;
  }

  /**
   * Create a memory-aware execution context
   * 
   * @param {Object} memoryManager - MemoryManager instance
   * @param {string} agentType - Type of agent
   * @param {string} query - User query
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution result with memory storage
   */
  async executeWithMemory(memoryManager, agentType, query, options = {}) {
    // Add memory context to execution
    const memoryContext = memoryManager ? memoryManager.buildContext() : {};
    const enhancedOptions = {
      ...options,
      context: {
        ...options.context,
        memory: memoryContext
      }
    };

    // Execute with Future Self Bridge
    const result = await this.execute(agentType, query, enhancedOptions);

    // Store interaction in memory if manager provided
    if (memoryManager) {
      await memoryManager.addInteraction({
        role: 'user',
        text: query,
        ts: Date.now()
      });

      await memoryManager.addInteraction({
        role: 'assistant',
        text: result.response,
        ts: Date.now(),
        metadata: {
          agentType,
          signature: result.signature,
          signatureAlgorithm: result.signatureAlgorithm,
          futureSelfBridge: result.futureSelfBridge
        }
      });
    }

    return result;
  }
}

module.exports = FutureSelfBridge;
