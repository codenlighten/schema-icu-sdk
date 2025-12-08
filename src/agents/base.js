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
   */
  async query(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { BaseAgent };
