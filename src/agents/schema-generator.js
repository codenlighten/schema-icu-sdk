/**
 * Schema Generator Agent - Create JSON schemas with validation rules
 */

const { HTTPClient } = require('../utils/http');

class SchemaGenerator {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/schema-generator';
  }

  /**
   * Generate JSON schema
   * @param {string} query - The schema generation request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async generate(query, context = {}) {
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

module.exports = { SchemaGenerator };
