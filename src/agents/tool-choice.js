/**
 * Tool Choice Agent - Select the best agent for your task
 */

const { HTTPClient } = require('../utils/http');

class ToolChoice {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/tool-choice';
  }

  /**
   * Get tool recommendation
   * @param {string} query - The tool recommendation request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async recommend(query, context = {}) {
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

module.exports = { ToolChoice };
