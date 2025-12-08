/**
 * HTTP Request Utility for Schema.ICU SDK
 */

const https = require('https');
const { APIError, AuthenticationError, ValidationError, RateLimitError } = require('./errors');

class HTTPClient {
  constructor(config) {
    this.config = config;
  }

  /**
   * Make an HTTP request
   */
  request(endpoint, data = null, method = 'POST', useAuth = true) {
    return new Promise((resolve, reject) => {
      const payload = data ? JSON.stringify(data) : null;

      const headers = {
        'Content-Type': 'application/json'
      };

      // Add authentication headers
      if (useAuth) {
        if (this.config.apiKey) {
          headers['X-API-Key'] = this.config.apiKey;
        }
        if (this.config.jwtToken) {
          headers['Authorization'] = `Bearer ${this.config.jwtToken}`;
        }
      }

      if (payload) {
        headers['Content-Length'] = Buffer.byteLength(payload);
      }

      const options = {
        hostname: this.config.baseUrl,
        port: this.config.port,
        path: endpoint,
        method: method,
        headers: headers,
        timeout: this.config.timeout
      };

      const req = https.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
          responseBody += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseBody);
            
            // Handle error status codes
            if (res.statusCode >= 400) {
              this._handleErrorResponse(res.statusCode, parsed, reject);
              return;
            }

            resolve({
              statusCode: res.statusCode,
              data: parsed,
              headers: res.headers
            });
          } catch (error) {
            // Handle non-JSON responses
            if (res.statusCode >= 400) {
              reject(new APIError(responseBody, res.statusCode));
              return;
            }
            
            resolve({
              statusCode: res.statusCode,
              data: responseBody,
              headers: res.headers
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new APIError(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new APIError('Request timeout'));
      });

      if (payload) {
        req.write(payload);
      }
      
      req.end();
    });
  }

  /**
   * Handle error responses
   */
  _handleErrorResponse(statusCode, response, reject) {
    const message = response.message || response.error || 'Request failed';

    switch (statusCode) {
      case 401:
        reject(new AuthenticationError(message, response));
        break;
      case 400:
        reject(new ValidationError(message, response));
        break;
      case 429:
        reject(new RateLimitError(message, response));
        break;
      default:
        reject(new APIError(message, statusCode, response));
    }
  }

  /**
   * Make a GET request
   */
  get(endpoint, useAuth = true) {
    return this.request(endpoint, null, 'GET', useAuth);
  }

  /**
   * Make a POST request
   */
  post(endpoint, data, useAuth = true) {
    return this.request(endpoint, data, 'POST', useAuth);
  }

  /**
   * Make a PUT request
   */
  put(endpoint, data, useAuth = true) {
    return this.request(endpoint, data, 'PUT', useAuth);
  }

  /**
   * Make a DELETE request
   */
  delete(endpoint, useAuth = true) {
    return this.request(endpoint, null, 'DELETE', useAuth);
  }
}

module.exports = { HTTPClient };
