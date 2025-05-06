// services/tokenService.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hachsinail';
const TOKEN_EXPIRY = '4h';

class TokenService {
  /**
   * Generate a new JWT token
   * @param {Object} payload - Token payload
   * @returns {string} - Signed JWT token
   */
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }
  
  /**
   * Verify a JWT token
   * @param {string} token - JWT token to verify
   * @returns {Object|null} - Decoded token or null if invalid
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
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
   * Set authentication cookie
   * @param {Object} res - Express response object
   * @param {string} token - Token to set in cookie
   */
  setAuthCookie(res, token) {
    res.cookie('fallback_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 4 * 60 * 60 * 1000 // 4 hours
    });
  }
  
  /**
   * Clear authentication cookie
   * @param {Object} res - Express response object
   */
  clearAuthCookie(res) {
    res.clearCookie('fallback_token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}

export default new TokenService();
