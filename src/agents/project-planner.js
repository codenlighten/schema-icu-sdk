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
   * @param {string} query - The project planning request
   * @param {object} context - Additional context (can include signatureAlgorithm)
   */
  async plan(query, context = {}) {
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

module.exports = { ProjectPlanner };
