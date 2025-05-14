// services/tokenService.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hachsinail';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'hachsinail_refresh';
const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = '7d'; // Longer-lived refresh token

class TokenService {
  /**
   * Generate an access token
   * @param {Object} payload - Token payload
   * @returns {string} - Signed JWT token
   */
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }
  
  /**
   * Generate a refresh token
   * @param {Object} payload - Minimal required payload
   * @returns {string} - Signed JWT token
   */
  generateRefreshToken(payload) {
    // Only include essential data in refresh token
    const refreshPayload = {
      id: payload.id,
      session_id: payload.session_id,
      tokenVersion: payload.tokenVersion || 0
    };
    return jwt.sign(refreshPayload, REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }
  
  /**
   * Verify an access token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} - Decoded token or null if invalid
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
  
  /**
   * Verify a refresh token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} - Decoded token or null if invalid
   */
  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }
  
  /**
   * Decode a token without verification (for expired tokens)
   * @param {string} token - JWT token to decode
   * @returns {Object|null} - Decoded token or null
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
  
  /**
   * Set access token cookie
   * @param {Object} res - Express response object
   * @param {string} token - Token to set in cookie
   */
  setAccessCookie(res, token) {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
  }
  
  /**
   * Set refresh token cookie
   * @param {Object} res - Express response object
   * @param {string} token - Token to set in cookie
   */
  setRefreshCookie(res, token) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
  
  /**
   * Clear access token cookie
   * @param {Object} res - Express response object
   */
  clearAccessCookie(res) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  /**
   * Clear refresh token cookie
   * @param {Object} res - Express response object
   */
  clearRefreshCookie(res) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
  
  /**
   * Clear all auth cookies
   * @param {Object} res - Express response object
   */
  clearAllAuthCookies(res) {
    this.clearAccessCookie(res);
    this.clearRefreshCookie(res);
    // Clear the old cookie as well for backward compatibility
    res.clearCookie('fallback_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

export default new TokenService();
