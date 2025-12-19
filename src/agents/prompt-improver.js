/**
 * Prompt Improver Agent - Optimize prompts for better results
 */

const { HTTPClient } = require('../utils/http');

class PromptImprover {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/prompt-improver';
  }

  /**
   * Improve a prompt
   * @param {string} query - The prompt improvement request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async improve(query, context = {}) {
    // Extract signatureAlgorithm from context if provided
    const { signatureAlgorithm, ...restContext } = context;
    
    const requestBody = {
      query,
      context: restContext
    };
    
    // Add signatureAlgorithm at top level if specified
    if (signatureAlgorithm) {
      requestBody.signatureAlgorithm = signatureAlgorithm;
    }
    
    const response = await this.http.post(this.endpoint, requestBody);

    return response.data;
  }
}

module.exports = { PromptImprover };
