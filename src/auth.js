/**
 * Authentication Module for Schema.ICU SDK
 */

const { HTTPClient } = require('./utils/http');
const { AuthenticationError } = require('./utils/errors');

class AuthManager {
  constructor(config) {
    this.config = config;
    this.http = new HTTPClient(config);
  }

  /**
   * Register a new user
   */
  async register(email, password) {
    const response = await this.http.post('/auth/register', {
      email,
      password
    }, false);

    return response.data;
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(email, otp) {
    const response = await this.http.post('/auth/verify-email', {
      email,
      otp
    }, false);

    if (response.data.success && response.data.apiKey) {
      this.config.apiKey = response.data.apiKey;
    }

    return response.data;
  }

  /**
   * Resend OTP
   */
  async resendOTP(email) {
    const response = await this.http.post('/auth/resend-otp', {
      email
    }, false);

    return response.data;
  }

  /**
   * Login with email and password
   */
  async login(email, password) {
    const response = await this.http.post('/auth/login', {
      email,
      password
    }, false);

    if (response.data.success) {
      this.config.jwtToken = response.data.token;
      this.config.apiKey = response.data.user?.apiKey;
      this.config.email = email;
    }

    return response.data;
  }

  /**
   * Get current user information
   */
  async getMe() {
    const response = await this.http.get('/auth/me', true);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    const response = await this.http.post('/auth/change-password', {
      currentPassword,
      newPassword
    }, true);

    return response.data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const response = await this.http.post('/auth/forgot-password', {
      email
    }, false);

    return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const response = await this.http.post('/auth/reset-password', {
      token,
      newPassword
    }, false);

    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.config.hasCredentials();
  }
}

module.exports = { AuthManager };
