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
    
    // Default signature algorithm
    this.signatureAlgorithm = null; // null = API default (ECDSA)
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
}

module.exports = { SchemaICU };
