/**
 * Code Improver Agent - Optimize existing code without breaking changes
 */

const { HTTPClient } = require('../utils/http');

class CodeImprover {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/code-improver';
  }

  /**
   * Improve code
   * @param {string} query - The code improvement request
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

module.exports = { CodeImprover };
