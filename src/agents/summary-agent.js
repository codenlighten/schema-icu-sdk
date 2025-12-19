/**
 * Summary Agent - Compress conversations into structured summaries
 * 
 * Designed for rolling conversation memory compression with key points,
 * dominant themes, unresolved threads, and tone analysis.
 */

const { HTTPClient } = require('../utils/http');

class SummaryAgent {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/summary-agent';
  }

  /**
   * Summarize conversation or text
   * @param {string} query - The text/conversation to summarize
   * @param {object} context - Additional context (can include signatureAlgorithm)
   * @returns {Promise<Object>} Structured summary with key points and metadata
   * 
   * Response structure:
   * {
   *   summary: string,
   *   keyPoints: string[],
   *   contextMeta: {
   *     dominantThemes: string[],
   *     unresolvedThreads: string[],
   *     toneSummary: string
   *   }
   * }
   */
  async summarize(query, context = {}) {
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

  /**
   * Alias for summarize - for better API clarity
   */
  async compress(query, context = {}) {
    return this.summarize(query, context);
  }

  /**
   * Summarize with specific focus
   * @param {string} query - The text to summarize
   * @param {string} focus - What to focus on (e.g., 'technical', 'decisions', 'action-items')
   * @param {object} context - Additional context
   */
  async summarizeWithFocus(query, focus, context = {}) {
    return this.summarize(query, {
      ...context,
      focus,
      instructions: `Focus specifically on ${focus} aspects`
    });
  }
}

module.exports = { SummaryAgent };
