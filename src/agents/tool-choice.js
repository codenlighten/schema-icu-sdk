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
   */
  async recommend(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { ToolChoice };
