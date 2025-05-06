// authController.js
import bcrypt from 'bcrypt';
import Credential from '../models/Credential.js';
import User from '../models/Users.js';
import sessionManager from '../services/SessionManager.js';
import tokenService from '../services/TokenService.js';

// Dedicated helper function to extract real client IP in Coolify environment
const getClientIP = (req) => {
  // Debug logging to see what headers are available
  console.log('===== IP DETECTION DEBUG INFO =====');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('req.ip:', req.ip);
  console.log('req.connection.remoteAddress:', req.connection?.remoteAddress);
  console.log('req.socket.remoteAddress:', req.socket?.remoteAddress);
  
  // Coolify uses either x-forwarded-for or x-real-ip
  // We need to force this regardless of trust proxy setting
  const realIP = (
    req.headers['x-forwarded-for'] ? 
      req.headers['x-forwarded-for'].split(',')[0].trim() : 
      null
    ) ||
    req.headers['x-real-ip'] ||
    req.headers['cf-connecting-ip'] || 
    (req.connection ? req.connection.remoteAddress : null) ||
    (req.socket ? req.socket.remoteAddress : null) ||
    req.ip ||
    '0.0.0.0'; // Last resort fallback
  
  console.log('Detected client IP:', realIP);
  console.log('=================================');
  
  return realIP;
};

export const login = async (req, res) => {
  const { email, password } = req.body;

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

    // Force override any trust proxy settings to get the real client IP
    const realClientIP = getClientIP(req);
    
    // Create a new session with the real client IP
    const session = await sessionManager.createSession({
      credentialId: credential.id,
      ipAddress: realClientIP,
      userAgent: req.headers['user-agent']
    });

    console.log(`Created new session ${session.id} for user ${credential.id} from IP ${realClientIP}`);

    // Generate token with session ID included
    const payload = {
      id: credential.id,
      email: credential.email,
      role: credential.role,
      first_name: credential.first_name,
      last_name: credential.last_name,
      position: credential.position,
      session_id: session.id // Include session ID in token
    };

    const token = tokenService.generateToken(payload);
    
    // Set auth cookie
    tokenService.setAuthCookie(res, token);

    return res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = tokenService.verifyToken(token);
    
    if (!decoded) {
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

    // Clear cookie
    tokenService.clearAuthCookie(res);

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const autoLogout = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = tokenService.verifyToken(token);
  
  if (!decoded) {
    // Token is invalid or expired
    // Try to decode it anyway to get the user ID
    const decodedToken = tokenService.decodeToken(token);
    
    if (decodedToken && decodedToken.id) {
      console.log(`Token expired for user ${decodedToken.id}, ending all sessions`);
      // End all sessions for this user
      await sessionManager.endAllSessions(
        decodedToken.id, 
        'Token expired or invalid'
      );
    }

    tokenService.clearAuthCookie(res);
    
    if (decodedToken) {
      return res.status(401).json({ 
        message: 'Session expired, you have been logged out automatically.',
        reason: 'TOKEN_EXPIRED'
      });
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
  
  // Token is valid, check if the specific session is still active
  const isSessionValid = await sessionManager.validateSession(
    decoded.id,
    decoded.session_id  // Pass session ID to check that specific session
  );
  
  if (!isSessionValid) {
    console.log(`Session ${decoded.session_id} for user ${decoded.id} is no longer valid`);
    tokenService.clearAuthCookie(res);
    return res.status(401).json({ 
      message: 'Session has been invalidated',
      reason: 'SESSION_INVALIDATED'
    });
  }

  req.user = decoded;
  next();
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.fallback_token;
  if (!token) {
    return res.status(401).json({ message: 'No fallback token found' });
  }

  const decoded = tokenService.verifyToken(token);
  
  if (!decoded) {
    tokenService.clearAuthCookie(res);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  // Verify the specific session is still active
  const isSessionValid = await sessionManager.validateSession(
    decoded.id,
    decoded.session_id
  );
  
  if (!isSessionValid) {
    tokenService.clearAuthCookie(res);
    return res.status(401).json({ 
      message: 'Session has been invalidated',
      reason: 'SESSION_INVALIDATED'
    });
  }
  
  return res.status(200).json({ token });
};

export const verifyCookie = async (req, res) => {
  const token = req.cookies.fallback_token;

  if (!token) {
    return res.status(401).json({ message: 'No cookie token found' });
  }

  const decoded = tokenService.verifyToken(token);
  
  if (!decoded) {
    tokenService.clearAuthCookie(res);
    return res.status(401).json({ message: 'Invalid or expired cookie token' });
  }
  
  // Verify the specific session is still active
  const isSessionValid = await sessionManager.validateSession(
    decoded.id,
    decoded.session_id
  );
  
  if (!isSessionValid) {
    tokenService.clearAuthCookie(res);
    return res.status(401).json({ 
      message: 'Session has been invalidated',
      reason: 'SESSION_INVALIDATED'
    });
  }

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
