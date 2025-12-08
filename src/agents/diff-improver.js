/**
 * Diff Improver Agent - Improve code with unified diffs
 */

const { HTTPClient } = require('../utils/http');

class DiffImprover {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/diff-improver';
  }

  /**
   * Improve code and get diff
   */
  async improve(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { DiffImprover };
