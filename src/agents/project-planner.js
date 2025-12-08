/**
 * Project Planner Agent - Break down projects with time estimates
 */

const { HTTPClient } = require('../utils/http');

class ProjectPlanner {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/project-planner';
  }

  /**
   * Plan a project
   */
  async plan(query, context = {}) {
    const response = await this.http.post(this.endpoint, {
      query,
      context
    });

    return response.data;
  }
}

module.exports = { ProjectPlanner };
