/**
 * Terminal Agent - Generate optimal shell commands
 */

const { HTTPClient } = require('../utils/http');

class TerminalAgent {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/terminal-agent';
  }

  /**
   * Generate terminal command
   */
  async generate(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { TerminalAgent };
