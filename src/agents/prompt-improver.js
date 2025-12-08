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
   */
  async improve(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { PromptImprover };
