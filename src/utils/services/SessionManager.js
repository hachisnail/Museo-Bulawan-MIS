// services/SessionManager.js
import { sequelize } from '../database.js';
import Credential from '../models/Credential.js';
import LoginLog from '../models/LoginLogs.js';
import User from '../models/Users.js';

class SessionManager {
  /**
   * Checks if a user has an active session
   * @param {number} credentialId - User's credential ID
   * @returns {Promise<Object|null>} - Active session or null
   */
  async getActiveSession(credentialId) {
    return await LoginLog.findOne({
      where: { 
        credential_id: credentialId, 
        end: null 
      },
      order: [['start', 'DESC']]
    });
  }
  
  /**
   * Updates the user's status
   * @param {number} credentialId - User's credential ID
   * @param {string} status - New status ('active' or 'inactive')
   * @param {Transaction} transaction - Optional transaction object
   */
  async updateUserStatus(credentialId, status, transaction = null) {
    try {
      // First, check if user exists
      let user = await User.findOne({ 
        where: { credential_id: credentialId },
        ...(transaction ? { transaction } : {})
      });
      
      // If no user exists, create one with the provided status
      if (!user) {
        console.log(`No user found for credential ID ${credentialId}, creating new user entry`);
        user = await User.create({
          credential_id: credentialId,
          status: status,
          creation_date: new Date(),
          modified_date: new Date()
        }, transaction ? { transaction } : {});
        console.log(`Created new user for credential ID ${credentialId} with status ${status}`);
      } else {
        // Update existing user status
        console.log(`Updating user ${credentialId} status to ${status}`);
        await user.update({ 
          status, 
          modified_date: new Date() 
        }, transaction ? { transaction } : {});
      }
      
      return user;
    } catch (error) {
      console.error(`Error updating user ${credentialId} status:`, error);
      throw error;
    }
  }
  
  /**
   * Creates a new session after closing any existing ones
   * @param {Object} sessionData - Session data
   */
  async createSession(sessionData) {
    const { credentialId, ipAddress, userAgent } = sessionData;
    const transaction = await sequelize.transaction();
    
    try {
      // First ensure the user exists in the users table
      let user = await User.findOne({ 
        where: { credential_id: credentialId },
        transaction
      });
      
      // If no user exists yet with this credential ID, create one
      if (!user) {
        console.log(`No user found for credential ID ${credentialId}. Creating new user entry.`);
        const credential = await Credential.findByPk(credentialId, { transaction });
        
        if (!credential) {
          throw new Error(`Credential with ID ${credentialId} not found`);
        }
        
        user = await User.create({
          credential_id: credentialId,
          status: 'inactive', // Initial status is inactive until we activate it below
          creation_date: new Date(),
          modified_date: new Date()
        }, { transaction });
        
        console.log(`Created new user for credential ID ${credentialId}`);
      }
      
      // End any existing sessions for this user
      await this.endAllSessions(credentialId, 'New login from another device', transaction);
      
      // Create a new session
      const newSession = await LoginLog.create({
        credential_id: credentialId,
        start: new Date(),
        end: null,
        last_activity: new Date(),
        ip_address: ipAddress,
        user_agent: userAgent
      }, { transaction });
      
      console.log(`Created new session with ID ${newSession.id}`);
      
      // Update user status to active
      await this.updateUserStatus(credentialId, 'active', transaction);
      
      await transaction.commit();
      return newSession;
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating session:', error);
      throw error;
    }
  }
  
  /**
   * Updates the last activity timestamp for a session
   * @param {number} credentialId - User's credential ID
   * @param {number} sessionId - Optional session ID to update specific session
   */
  async updateActivity(credentialId, sessionId = null) {
    if (sessionId) {
      const session = await LoginLog.findOne({
        where: { 
          id: sessionId,
          credential_id: credentialId,
          end: null 
        }
      });
      
      if (session) {
        await session.update({ last_activity: new Date() });
      }
      return session;
    } else {
      const session = await this.getActiveSession(credentialId);
      if (session) {
        await session.update({ last_activity: new Date() });
      }
      return session;
    }
  }
  
  /**
   * Ends all active sessions for a user
   * @param {number} credentialId - User's credential ID
   * @param {string} reason - Reason for ending the session
   */
  async endAllSessions(credentialId, reason = 'User logout', transaction = null) {
    const localTransaction = transaction || await sequelize.transaction();
    
    try {
      console.log(`Ending all sessions for user ${credentialId}`);
      
      // Find all active sessions first to check
      const activeSessions = await LoginLog.findAll({
        where: { credential_id: credentialId, end: null },
        transaction: localTransaction
      });
      
      console.log(`Found ${activeSessions.length} active sessions to end`);
      
      // Update all active sessions to be ended
      const [updatedCount] = await LoginLog.update(
        { 
          end: new Date(),
          terminated_reason: reason
        },
        { 
          where: { credential_id: credentialId, end: null },
          transaction: localTransaction
        }
      );
      
      console.log(`Updated ${updatedCount} sessions to ended status`);
      
      // Only update user status if not in a transaction (meaning this is a standalone call)
      if (!transaction) {
        await this.updateUserStatus(credentialId, 'inactive', localTransaction);
        await localTransaction.commit();
      }
      
      return updatedCount > 0;
    } catch (error) {
      if (!transaction) {
        await localTransaction.rollback();
      }
      console.error('Error ending sessions:', error);
      throw error;
    }
  }
  
  /**
   * Ends a specific session
   * @param {number} sessionId - Session ID to end
   * @param {number} credentialId - User's credential ID
   * @param {string} reason - Reason for ending the session
   */
  async endSession(sessionId, credentialId, reason = 'User logout') {
    const transaction = await sequelize.transaction();
    
    try {
      console.log(`Ending specific session ${sessionId} for user ${credentialId}`);
      
      const session = await LoginLog.findOne({
        where: { 
          id: sessionId,
          credential_id: credentialId,
          end: null
        },
        transaction
      });
      
      if (!session) {
        console.log(`No active session found with ID ${sessionId}`);
        await transaction.rollback();
        return false;
      }
      
      await session.update({ 
        end: new Date(),
        terminated_reason: reason
      }, { transaction });
      
      console.log(`Session ${sessionId} marked as ended`);
      
      await this.updateUserStatus(credentialId, 'inactive', transaction);
      
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error(`Error ending session ${sessionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Validates if a specific user session is active
   * @param {number} credentialId - User's credential ID
   * @param {number} sessionId - Session ID to validate (optional)
   */
  async validateSession(credentialId, sessionId = null) {
    // If we have a session ID, validate that specific session
    if (sessionId) {
      const session = await LoginLog.findOne({
        where: { 
          id: sessionId,
          credential_id: credentialId, 
          end: null 
        }
      });
      
      if (!session) {
        console.log(`Session ${sessionId} not found or is already ended`);
        return false;
      }
      
      await session.update({ last_activity: new Date() });
      return true;
    } else {
      // Otherwise, just check if any session is active (fallback)
      const session = await this.getActiveSession(credentialId);
      if (!session) {
        console.log(`No active sessions found for user ${credentialId}`);
        return false;
      }
      
      await session.update({ last_activity: new Date() });
      return true;
    }
  }
  // Add these methods to your SessionManager class

/**
 * Increment token version to invalidate all existing refresh tokens
 * @param {number} credentialId - User's credential ID
 * @param {number} sessionId - Session ID
 * @returns {number} - New token version
 */
async incrementTokenVersion(credentialId, sessionId) {
  try {
    const session = await LoginLog.findOne({
      where: { 
        id: sessionId,
        credential_id: credentialId, 
        end: null 
      }
    });
    
    if (!session) return null;
    
    // Set up default tokenVersion if it doesn't exist
    const currentVersion = session.tokenVersion || 0;
    const newVersion = currentVersion + 1;
    
    await session.update({ 
      tokenVersion: newVersion,
      last_activity: new Date()
    });
    
    return newVersion;
  } catch (error) {
    console.error('Error incrementing token version:', error);
    return null;
  }
}

/**
 * Get current token version
 * @param {number} credentialId - User's credential ID
 * @param {number} sessionId - Session ID
 * @returns {number|null} - Current token version or null
 */
async getTokenVersion(credentialId, sessionId) {
  try {
    const session = await LoginLog.findOne({
      where: { 
        id: sessionId,
        credential_id: credentialId
      }
    });
    
    return session ? (session.tokenVersion || 0) : null;
  } catch (error) {
    console.error('Error getting token version:', error);
    return null;
  }
}

}

export default new SessionManager();
