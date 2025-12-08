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
   */
  async design(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { BoxDesigner };
