/**
 * Box Designer Agent - Design modular components (Alan Kay philosophy)
 */

const { HTTPClient } = require('../utils/http');

class BoxDesigner {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/box';
  }

  /**
   * Design a box/component
   * @param {string} query - The box/component design request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async design(query, context = {}) {
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

module.exports = { BoxDesigner };
