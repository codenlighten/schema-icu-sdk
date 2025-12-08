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
   */
  async improve(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { CodeImprover };
