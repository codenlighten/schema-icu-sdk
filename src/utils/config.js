/**
 * Configuration Management for Schema.ICU SDK
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DEFAULT_CONFIG = {
  API_BASE_URL: 'schema.icu',
  API_PORT: 443,
  TIMEOUT: 60000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

class Config {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.SCHEMA_ICU_API_KEY || null;
    this.jwtToken = options.jwtToken || process.env.SCHEMA_ICU_JWT_TOKEN || null;
    this.email = options.email || process.env.SCHEMA_ICU_EMAIL || null;
    this.baseUrl = options.baseUrl || process.env.SCHEMA_ICU_BASE_URL || DEFAULT_CONFIG.API_BASE_URL;
    this.port = options.port || process.env.SCHEMA_ICU_PORT || DEFAULT_CONFIG.API_PORT;
    this.timeout = options.timeout || DEFAULT_CONFIG.TIMEOUT;
    this.retryAttempts = options.retryAttempts || DEFAULT_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = options.retryDelay || DEFAULT_CONFIG.RETRY_DELAY;
  }

  /**
   * Check if SDK is configured with credentials
   */
  hasCredentials() {
    return !!(this.apiKey || this.jwtToken);
  }

  /**
   * Load configuration from .env file
   */
  static loadFromEnv(envPath = null) {
    if (envPath && fs.existsSync(envPath)) {
      require('dotenv').config({ path: envPath });
    }
    return new Config();
  }

  /**
   * Save configuration to .env file
   */
  saveToEnv(envPath = null) {
    const targetPath = envPath || path.join(process.cwd(), '.env');
    
    const envContent = [
      `# Schema.ICU SDK Configuration`,
      `# Generated on ${new Date().toISOString()}`,
      ``,
      `SCHEMA_ICU_API_KEY=${this.apiKey || ''}`,
      `SCHEMA_ICU_JWT_TOKEN=${this.jwtToken || ''}`,
      `SCHEMA_ICU_EMAIL=${this.email || ''}`,
      `SCHEMA_ICU_BASE_URL=${this.baseUrl}`,
      `SCHEMA_ICU_PORT=${this.port}`,
      ``
    ].join('\n');

    fs.writeFileSync(targetPath, envContent);
    return targetPath;
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];

    if (!this.hasCredentials()) {
      errors.push('API Key or JWT Token is required');
    }

    if (!this.baseUrl) {
      errors.push('Base URL is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = { Config, DEFAULT_CONFIG };
