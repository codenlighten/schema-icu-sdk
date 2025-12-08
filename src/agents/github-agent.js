/**
 * GitHub Agent - Generate GitHub CLI commands
 */

const { HTTPClient } = require('../utils/http');

class GitHubAgent {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/github-agent';
  }

  /**
   * Generate GitHub CLI commands
   */
  async generate(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { GitHubAgent };
