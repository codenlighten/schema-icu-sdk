/**
 * Base Agent - General purpose agent with code generation support
 */

const { HTTPClient } = require('../utils/http');

class BaseAgent {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/query';
  }

  /**
   * Query the base agent
   * @param {string} query - The query/request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async query(query, context = {}) {
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

module.exports = { BaseAgent };
