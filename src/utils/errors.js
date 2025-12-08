/**
 * Custom Error Classes for Schema.ICU SDK
 */

class SchemaICUError extends Error {
  constructor(message, statusCode = null, response = null) {
    super(message);
    this.name = 'SchemaICUError';
    this.statusCode = statusCode;
    this.response = response;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthenticationError extends SchemaICUError {
  constructor(message = 'Authentication required', response = null) {
    super(message, 401, response);
    this.name = 'AuthenticationError';
  }
}

class ValidationError extends SchemaICUError {
  constructor(message = 'Validation failed', response = null) {
    super(message, 400, response);
    this.name = 'ValidationError';
  }
}

class RateLimitError extends SchemaICUError {
  constructor(message = 'Rate limit exceeded', response = null) {
    super(message, 429, response);
    this.name = 'RateLimitError';
  }
}

class APIError extends SchemaICUError {
  constructor(message = 'API request failed', statusCode = 500, response = null) {
    super(message, statusCode, response);
    this.name = 'APIError';
  }
}

module.exports = {
  SchemaICUError,
  AuthenticationError,
  ValidationError,
  RateLimitError,
  APIError
};
