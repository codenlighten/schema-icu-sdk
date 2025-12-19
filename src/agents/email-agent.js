/**
 * Email Agent - Compose professional emails
 * 
 * Creates well-structured emails with subject, body, and closing based on
 * user requirements. Supports various tones and contexts.
 */

const { HTTPClient } = require('../utils/http');

class EmailAgent {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
    this.endpoint = '/api/email-agent';
  }

  /**
   * Compose an email
   * @param {string} query - Email composition request (purpose, recipient, key points)
   * @param {object} context - Additional context (can include signatureAlgorithm, tone, style)
   * @returns {Promise<Object>} Structured email with subject, body, and closing
   * 
   * Response structure:
   * {
   *   subject: string,
   *   body: string,
   *   closing: string,
   *   tone: string,
   *   purpose: string
   * }
   */
  async compose(query, context = {}) {
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
   * Compose a formal email
   * @param {string} query - Email composition request
   * @param {object} context - Additional context
   */
  async composeFormal(query, context = {}) {
    return this.compose(query, {
      ...context,
      tone: 'formal',
      style: 'professional'
    });
  }

  /**
   * Compose a casual email
   * @param {string} query - Email composition request
   * @param {object} context - Additional context
   */
  async composeCasual(query, context = {}) {
    return this.compose(query, {
      ...context,
      tone: 'casual',
      style: 'friendly'
    });
  }

  /**
   * Compose a marketing email
   * @param {string} query - Email composition request
   * @param {object} context - Additional context
   */
  async composeMarketing(query, context = {}) {
    return this.compose(query, {
      ...context,
      tone: 'persuasive',
      style: 'marketing',
      callToAction: true
    });
  }

  /**
   * Reply to an email
   * @param {string} originalEmail - The email being replied to
   * @param {string} replyInstructions - How to reply
   * @param {object} context - Additional context
   */
  async reply(originalEmail, replyInstructions, context = {}) {
    return this.compose(`Reply to this email: ${originalEmail}\n\nReply instructions: ${replyInstructions}`, {
      ...context,
      replyMode: true
    });
  }
}

module.exports = { EmailAgent };
