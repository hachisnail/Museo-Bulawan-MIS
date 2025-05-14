// authController.js
import bcrypt from 'bcrypt';
import Credential from '../models/Credential.js';
import User from '../models/Users.js';
import sessionManager from '../services/SessionManager.js';
import tokenService from '../services/TokenService.js';
import axios from 'axios';

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await Credential.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'first_name', 'last_name', 'position'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Encode the user profile using btoa
    const userProfile = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      position: user.position,
    };
    const encodedProfile = btoa(JSON.stringify(userProfile));

    return res.status(200).json({ profile: encodedProfile });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const getClientIP = (req) => {
  let clientIP = '0.0.0.0'; // Initialize with a default value
  
  if (req.headers['cf-connecting-ip']) {
    clientIP = req.headers['cf-connecting-ip'];
  } else if (req.headers['true-client-ip']) {
    clientIP = req.headers['true-client-ip'];
  } else if (req.headers['x-forwarded-for']) {
    clientIP = req.headers['x-forwarded-for'].split(',')[0].trim();
  } else if (req.headers['x-real-ip']) {
    clientIP = req.headers['x-real-ip'];
  } else if (req.connection?.remoteAddress) {
    clientIP = req.connection.remoteAddress;
  } else if (req.socket?.remoteAddress) {
    clientIP = req.socket.remoteAddress;
  } else if (req.ip) {
    clientIP = req.ip;
  }
  
  return clientIP;
};


export const login = async (req, res) => {
  const { email, password, clientIP: providedClientIP } = req.body;

  try {
    // Verify credentials
    const credential = await Credential.findOne({ where: { email } });
    if (!credential) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, credential.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log(`User ${credential.id} (${email}) authenticated successfully`);

    // Get the client IP using our IP detection function
    const detectedIP = getClientIP(req);
    const clientIP = providedClientIP || detectedIP;
    
    console.log(`User ${credential.id} logging in from IP: ${clientIP}`);

    // Create a new session (this will end any existing sessions)
    const session = await sessionManager.createSession({
      credentialId: credential.id,
      ipAddress: clientIP,
      userAgent: req.headers['user-agent']
    });

    console.log(`Created new session ${session.id} for user ${credential.id}`);

    // Generate token with session ID included
    const payload = {
      id: credential.id,
      email: credential.email,
      role: credential.role,
      first_name: credential.first_name,
      last_name: credential.last_name,
      position: credential.position,
      session_id: session.id, // Include session ID in token
      tokenVersion: 0         // Initial token version
    };

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);
    
    // Set auth cookies
    tokenService.setAccessCookie(res, accessToken);
    tokenService.setRefreshCookie(res, refreshToken);

    // Return access token for backward compatibility
    // This will be removed in the future when all clients move to HTTP-only cookies
    return res.status(200).json({ token: accessToken });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    // Get token from Authorization header or cookie
    let token = null;
    let decoded = null;
    
    // Try cookie first
    if (req.cookies.auth_token) {
      token = req.cookies.auth_token;
      decoded = tokenService.verifyAccessToken(token);
    }
    
    // Fallback to Authorization header
    if (!decoded && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      token = authHeader.split(' ')[1];
      decoded = tokenService.verifyAccessToken(token);
    }
    
    if (!decoded) {
      tokenService.clearAllAuthCookies(res);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log(`User ${decoded.id} (${decoded.email}) logging out`);

    // End the session
    const sessionId = decoded.session_id;
    if (sessionId) {
      console.log(`Ending session ${sessionId}`);
      await sessionManager.endSession(sessionId, decoded.id, 'User logout');
    } else {
      // Fallback for tokens without session_id (backward compatibility)
      console.log(`No session ID in token, ending all sessions for user ${decoded.id}`);
      await sessionManager.endAllSessions(decoded.id, 'User logout');
    }

    // Clear cookies
    tokenService.clearAllAuthCookies(res);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    tokenService.clearAllAuthCookies(res);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const auth = async (req, res, next) => {
  // Try cookie first, then Authorization header
  let token = null;
  
  if (req.cookies.auth_token) {
    token = req.cookies.auth_token;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    token = authHeader.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = tokenService.verifyAccessToken(token);
  
  if (!decoded) {
    // Token is invalid or expired, but don't auto-logout
    // because the client may be able to refresh the token
    return res.status(401).json({ 
      message: 'Access token expired or invalid',
      reason: 'TOKEN_EXPIRED'
    });
  }
  
  // Token is valid, check if the specific session is still active
  const isSessionValid = await sessionManager.validateSession(
    decoded.id,
    decoded.session_id
  );
  
  if (!isSessionValid) {
    console.log(`Session ${decoded.session_id} for user ${decoded.id} is no longer valid`);
    tokenService.clearAllAuthCookies(res);
    return res.status(401).json({ 
      message: 'Session has been invalidated',
      reason: 'SESSION_INVALIDATED'
    });
  }

  req.user = decoded;
  next();
};

export const refreshToken = async (req, res) => {
  // Get refresh token from cookie
  const token = req.cookies.refresh_token;
  
  if (!token) {
    return res.status(401).json({ message: 'No refresh token found' });
  }

  try {
    // Verify refresh token
    const decoded = tokenService.verifyRefreshToken(token);
    
    if (!decoded) {
      tokenService.clearAllAuthCookies(res);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    
    // Check if the session is still valid
    const isSessionValid = await sessionManager.validateSession(
      decoded.id,
      decoded.session_id
    );
    
    if (!isSessionValid) {
      tokenService.clearAllAuthCookies(res);
      return res.status(401).json({ 
        message: 'Session has been invalidated',
        reason: 'SESSION_INVALIDATED'
      });
    }
    
    // Verify token version
    const currentTokenVersion = await sessionManager.getTokenVersion(
      decoded.id, 
      decoded.session_id
    );
    
    if (currentTokenVersion === null || decoded.tokenVersion !== currentTokenVersion) {
      tokenService.clearAllAuthCookies(res);
      return res.status(401).json({ 
        message: 'Refresh token has been revoked',
        reason: 'TOKEN_REVOKED'
      });
    }
    
    // Get the user data to include in the new token
    const user = await Credential.findByPk(decoded.id);
    if (!user) {
      tokenService.clearAllAuthCookies(res);
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Increment token version (token rotation for security)
    const newTokenVersion = await sessionManager.incrementTokenVersion(
      decoded.id, 
      decoded.session_id
    );
    
    // Generate new tokens
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      position: user.position,
      session_id: decoded.session_id,
      tokenVersion: newTokenVersion
    };
    
    const newAccessToken = tokenService.generateAccessToken(payload);
    const newRefreshToken = tokenService.generateRefreshToken(payload);
    
    // Set new cookies
    tokenService.setAccessCookie(res, newAccessToken);
    tokenService.setRefreshCookie(res, newRefreshToken);
    
    // Return the new access token for backward compatibility
    return res.status(200).json({
      token: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Token refresh error:', err);
    tokenService.clearAllAuthCookies(res);
    return res.status(500).json({ message: 'Server error during token refresh' });
  }
};

export const verifyCookie = async (req, res) => {
  // Try the new auth_token cookie first, then fallback to old cookie
  const token = req.cookies.auth_token || req.cookies.fallback_token;

  if (!token) {
    return res.status(401).json({ message: 'No cookie token found' });
  }

  const decoded = tokenService.verifyAccessToken(token);
  
  if (!decoded) {
    tokenService.clearAllAuthCookies(res);
    return res.status(401).json({ message: 'Invalid or expired cookie token' });
  }
  
  // Verify the specific session is still active
  const isSessionValid = await sessionManager.validateSession(
    decoded.id,
    decoded.session_id
  );
  
  if (!isSessionValid) {
    tokenService.clearAllAuthCookies(res);
    return res.status(401).json({ 
      message: 'Session has been invalidated',
      reason: 'SESSION_INVALIDATED'
    });
  }

  // Return token for backward compatibility
  return res.status(200).json({ token });
};

export const sessionStatus = async (req, res) => {
  try {
    // Update session activity timestamp
    if (req.user && req.user.session_id) {
      await sessionManager.updateActivity(req.user.id, req.user.session_id);
    }
    
    return res.status(200).json({ 
      isValid: true, 
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    console.error('Session status error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
