/**
 * Schema.ICU SDK - Main Client
 */

const { Config } = require('./utils/config');
const { AuthManager } = require('./auth');
const { BaseAgent } = require('./agents/base');
const { CodeGenerator } = require('./agents/code-generator');
const { SchemaGenerator } = require('./agents/schema-generator');
const { TerminalAgent } = require('./agents/terminal-agent');
const { CodeImprover } = require('./agents/code-improver');
const { DiffImprover } = require('./agents/diff-improver');
const { BoxDesigner } = require('./agents/box-designer');
const { ProjectPlanner } = require('./agents/project-planner');
const { PromptImprover } = require('./agents/prompt-improver');
const { ToolChoice } = require('./agents/tool-choice');
const { GitHubAgent } = require('./agents/github-agent');
const { SummaryAgent } = require('./agents/summary-agent');
const { EmailAgent } = require('./agents/email-agent');
const FutureSelfBridge = require('./core/future-self-bridge');
const FutureSelfWrapper = require('./core/future-self-wrapper');
const MemoryManager = require('./core/memory-manager');

class SchemaICU {
  constructor(options = {}) {
    this.config = new Config(options);
    
    // Initialize authentication
    this.auth = new AuthManager(this.config);
    
    // Initialize all agents
    this.base = new BaseAgent(this.config);
    this.codeGenerator = new CodeGenerator(this.config);
    this.schemaGenerator = new SchemaGenerator(this.config);
    this.terminalAgent = new TerminalAgent(this.config);
    this.codeImprover = new CodeImprover(this.config);
    this.diffImprover = new DiffImprover(this.config);
    this.boxDesigner = new BoxDesigner(this.config);
    this.projectPlanner = new ProjectPlanner(this.config);
    this.promptImprover = new PromptImprover(this.config);
    this.toolChoice = new ToolChoice(this.config);
    this.githubAgent = new GitHubAgent(this.config);
    this.summaryAgent = new SummaryAgent(this.config);
    this.emailAgent = new EmailAgent(this.config);
    
    // Default signature algorithm
    this.signatureAlgorithm = null; // null = API default (ECDSA)
    
    // Future Self Bridge components (lazy initialized)
    this._futureSelfBridge = null;
    this._futureSelfWrapper = null;
    this._memoryManager = null;
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      baseUrl: this.config.baseUrl,
      hasApiKey: !!this.config.apiKey,
      hasJwtToken: !!this.config.jwtToken,
      email: this.config.email
    };
  }

  /**
   * Update configuration
   */
  updateConfig(options) {
    Object.assign(this.config, options);
  }

  /**
   * Use post-quantum signatures (ML-DSA-65 or ML-DSA-87)
   * @param {string} algorithm - 'ml-dsa-65', 'ml-dsa-87', or 'pq' (defaults to ml-dsa-87)
   */
  usePostQuantum(algorithm = 'ml-dsa-87') {
    const validAlgorithms = ['ml-dsa-65', 'ml-dsa-87', 'pq'];
    if (!validAlgorithms.includes(algorithm)) {
      throw new Error(`Invalid post-quantum algorithm. Use: ${validAlgorithms.join(', ')}`);
    }
    this.signatureAlgorithm = algorithm;
    return this;
  }

  /**
   * Use standard ECDSA signatures (default)
   */
  useECDSA() {
    this.signatureAlgorithm = null;
    return this;
  }

  /**
   * Get current signature algorithm
   */
  getSignatureAlgorithm() {
    return this.signatureAlgorithm || 'ecdsa';
  }

  /**
   * Set custom signature algorithm
   * @param {string} algorithm - Signature algorithm ('ecdsa', 'ml-dsa-65', 'ml-dsa-87', 'pq', or null)
   */
  setSignatureAlgorithm(algorithm) {
    this.signatureAlgorithm = algorithm;
    return this;
  }

  /**
   * Enable Future Self Bridge architecture
   * Returns bridge instance for advanced usage
   * @returns {FutureSelfBridge} Bridge instance
   */
  useFutureSelfBridge() {
    if (!this._futureSelfBridge) {
      this._futureSelfBridge = new FutureSelfBridge(this.config);
    }
    return this._futureSelfBridge;
  }

  /**
   * Get Future Self wrapper for wrapping agents
   * @returns {FutureSelfWrapper} Wrapper instance
   */
  getFutureSelfWrapper() {
    if (!this._futureSelfWrapper) {
      this._futureSelfWrapper = new FutureSelfWrapper(this);
    }
    return this._futureSelfWrapper;
  }

  /**
   * Create a memory-aware session
   * @param {Object} options - MemoryManager options
   * @returns {MemoryManager} Memory manager instance
   */
  createMemorySession(options = {}) {
    const memoryOptions = {
      signatureAlgorithm: this.signatureAlgorithm || 'PQ',
      summaryAgent: this.summaryAgent,
      ...options
    };
    
    this._memoryManager = new MemoryManager(memoryOptions);
    return this._memoryManager;
  }

  /**
   * Get current memory session
   * @returns {MemoryManager|null} Memory manager or null if not initialized
   */
  getMemorySession() {
    return this._memoryManager;
  }

  /**
   * Execute agent with Future Self Bridge pattern
   * @param {string} agentType - Type of agent
   * @param {string} query - User query
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Enhanced result
   */
  async executeFutureSelf(agentType, query, options = {}) {
    const bridge = this.useFutureSelfBridge();
    const enhancedOptions = {
      ...options,
      signatureAlgorithm: this.signatureAlgorithm || options.signatureAlgorithm
    };
    return await bridge.execute(agentType, query, enhancedOptions);
  }

  /**
   * Wrap an agent with Future Self pattern
   * @param {string} agentType - Type of agent to wrap
   * @returns {Object} Wrapped agent
   */
  wrapAgent(agentType) {
    const wrapper = this.getFutureSelfWrapper();
    return wrapper.wrap(agentType);
  }

  /**
   * Wrap agent with memory context
   * @param {string} agentType - Type of agent to wrap
   * @param {Object} memoryManager - MemoryManager instance (optional, uses current session if not provided)
   * @returns {Object} Memory-aware wrapped agent
   */
  wrapAgentWithMemory(agentType, memoryManager = null) {
    const wrapper = this.getFutureSelfWrapper();
    const memory = memoryManager || this._memoryManager;
    
    if (!memory) {
      throw new Error('No memory session available. Call createMemorySession() first.');
    }
    
    return wrapper.wrapWithMemory(agentType, memory);
  }

  /**
   * Wrap all agents with Future Self pattern
   * @returns {Object} All wrapped agents
   */
  wrapAllAgents() {
    const wrapper = this.getFutureSelfWrapper();
    return wrapper.wrapAll();
  }
}

module.exports = { SchemaICU };
