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
}

module.exports = { SchemaICU };
