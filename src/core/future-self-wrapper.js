/**
 * Future Self Agent Wrapper
 * 
 * Middleware to wrap existing agents with Future Self Bridge pattern
 * Allows opt-in enhancement without breaking existing functionality
 * 
 * Usage:
 *   const wrapper = new FutureSelfWrapper(client);
 *   const result = await wrapper.wrap('code-generator').execute(query, context);
 */

const FutureSelfBridge = require('./future-self-bridge');

class FutureSelfWrapper {
  constructor(client) {
    this.client = client;
    this.bridge = new FutureSelfBridge(client.config);
  }

  /**
   * Wrap an agent with Future Self Bridge pattern
   * @param {string} agentType - Type of agent to wrap
   * @returns {Object} Wrapped agent with execute method
   */
  wrap(agentType) {
    return {
      /**
       * Execute agent with Future Self Bridge
       * @param {string} query - User query
       * @param {Object} options - Execution options
       * @returns {Promise<Object>} Enhanced result
       */
      execute: async (query, options = {}) => {
        return await this.bridge.execute(agentType, query, options);
      },

      /**
       * Execute with memory context
       * @param {Object} memoryManager - MemoryManager instance
       * @param {string} query - User query
       * @param {Object} options - Execution options
       * @returns {Promise<Object>} Enhanced result with memory
       */
      executeWithMemory: async (memoryManager, query, options = {}) => {
        return await this.bridge.executeWithMemory(memoryManager, agentType, query, options);
      },

      /**
       * Plan schema without execution (useful for debugging)
       * @param {string} query - User query
       * @param {Object} options - Planning options
       * @returns {Promise<Object>} Planned schema
       */
      planSchema: async (query, options = {}) => {
        return await this.bridge.planSchema(agentType, query, options);
      }
    };
  }

  /**
   * Wrap code generator with Future Self pattern
   * @returns {Object} Wrapped code generator
   */
  wrapCodeGenerator() {
    return this.wrap('code-generator');
  }

  /**
   * Wrap schema generator with Future Self pattern
   * @returns {Object} Wrapped schema generator
   */
  wrapSchemaGenerator() {
    return this.wrap('schema-generator');
  }

  /**
   * Wrap code improver with Future Self pattern
   * @returns {Object} Wrapped code improver
   */
  wrapCodeImprover() {
    return this.wrap('code-improver');
  }

  /**
   * Wrap terminal agent with Future Self pattern
   * @returns {Object} Wrapped terminal agent
   */
  wrapTerminal() {
    return this.wrap('terminal');
  }

  /**
   * Wrap diff improver with Future Self pattern
   * @returns {Object} Wrapped diff improver
   */
  wrapDiffImprover() {
    return this.wrap('diff-improver');
  }

  /**
   * Wrap box designer with Future Self pattern
   * @returns {Object} Wrapped box designer
   */
  wrapBoxDesigner() {
    return this.wrap('box-designer');
  }

  /**
   * Wrap project planner with Future Self pattern
   * @returns {Object} Wrapped project planner
   */
  wrapProjectPlanner() {
    return this.wrap('project-planner');
  }

  /**
   * Wrap prompt improver with Future Self pattern
   * @returns {Object} Wrapped prompt improver
   */
  wrapPromptImprover() {
    return this.wrap('prompt-improver');
  }

  /**
   * Wrap tool choice with Future Self pattern
   * @returns {Object} Wrapped tool choice
   */
  wrapToolChoice() {
    return this.wrap('tool-choice');
  }

  /**
   * Wrap GitHub agent with Future Self pattern
   * @returns {Object} Wrapped GitHub agent
   */
  wrapGitHub() {
    return this.wrap('github');
  }

  /**
   * Wrap summary agent with Future Self pattern
   * @returns {Object} Wrapped summary agent
   */
  wrapSummary() {
    return this.wrap('summary');
  }

  /**
   * Wrap email agent with Future Self pattern
   * @returns {Object} Wrapped email agent
   */
  wrapEmail() {
    return this.wrap('email');
  }

  /**
   * Create a memory-aware agent wrapper
   * @param {string} agentType - Type of agent
   * @param {Object} memoryManager - MemoryManager instance
   * @returns {Object} Memory-aware wrapped agent
   */
  wrapWithMemory(agentType, memoryManager) {
    const wrappedAgent = this.wrap(agentType);
    
    return {
      /**
       * Execute with automatic memory integration
       * @param {string} query - User query
       * @param {Object} options - Execution options
       * @returns {Promise<Object>} Enhanced result with memory
       */
      execute: async (query, options = {}) => {
        return await wrappedAgent.executeWithMemory(memoryManager, query, options);
      },

      /**
       * Plan schema (no memory needed)
       * @param {string} query - User query
       * @param {Object} options - Planning options
       * @returns {Promise<Object>} Planned schema
       */
      planSchema: async (query, options = {}) => {
        return await wrappedAgent.planSchema(query, options);
      }
    };
  }

  /**
   * Batch wrap multiple agents
   * @param {Array<string>} agentTypes - Array of agent types
   * @returns {Object} Object with wrapped agents
   */
  wrapMultiple(agentTypes) {
    const wrapped = {};
    
    for (const agentType of agentTypes) {
      wrapped[agentType] = this.wrap(agentType);
    }
    
    return wrapped;
  }

  /**
   * Wrap all available agents
   * @returns {Object} Object with all wrapped agents
   */
  wrapAll() {
    const allAgents = [
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
    
    return this.wrapMultiple(allAgents);
  }
}

module.exports = FutureSelfWrapper;
