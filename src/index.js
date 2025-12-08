/**
 * @team-watson/schema-icu-sdk
 * 
 * Production-ready SDK for Schema.ICU
 * Structured AI with cryptographic verification
 */

const { SchemaICU } = require('./client');
const { AuthManager } = require('./auth');
const { Config } = require('./utils/config');
const { 
  SchemaICUError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
} = require('./utils/errors');

// Export main client
module.exports = {
  SchemaICU,
  AuthManager,
  Config,
  // Errors
  SchemaICUError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
};

// Default export
module.exports.default = SchemaICU;
