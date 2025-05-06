import Credential from '../models/Credential.js';
import LoginLog from '../models/LoginLogs.js';
import User from '../models/Users.js'

export const displayUsers = async (req, res) => {

    try {
        const users = await User.findAll({
            include: [{
                model: Credential,
                required: true  
            }],
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }

}

export const displaySpecificUser = async (req, res) => {
    const { id } = req.params;  
  
    try {
      const user = await User.findOne({
        include: [{
          model: Credential,
          required: true,
          where: { id }  
        }],
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user.' });
    }
  };

  export const fetchCredential = async (req, res) => {
  
    try {
      const user = await Credential.findAll({});

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user.' });
    }
  };

  // export const getUserLoginLogs = async (req, res) => {
  //   const { userId } = req.params;
  
  //   try {
  //     const user = await User.findOne({
  //       where: { id: userId },
  //       include: {
  //         model: Credential,
  //         include: {
  //           model: LoginLog,
  //           order: [['start', 'DESC']],
  //         },
  //       },
  //     });
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found.' });
  //     }
  
  //     res.json({
  //       userId: user.id,
  //       name: `${user.Credential.first_name} ${user.Credential.last_name}`,
  //       logs: user.Credential.LoginLogs,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Failed to fetch login logs.' });
  //   }
  // };
  

  export const getUserLoginLogs = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // First check if credential exists
      const credential = await Credential.findByPk(userId);
      if (!credential) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if user exists in User table, create if not
      let user = await User.findOne({
        where: { credential_id: userId }
      });
  
      if (!user) {
        // Create missing user entry
        user = await User.create({
          credential_id: userId,
          status: 'inactive',
          creation_date: new Date(),
          modified_date: new Date()
        });
        console.log(`Created missing user entry for credential ID ${userId}`);
      }
  
      // Get user with credential and login logs
      const userWithLogs = await User.findOne({
        where: { credential_id: userId },
        include: {
          model: Credential,
          include: {
            model: LoginLog,
            order: [['start', 'DESC']],
          },
        },
      });
  
      if (!userWithLogs) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({
        userId: userWithLogs.id,
        name: `${userWithLogs.Credential.first_name} ${userWithLogs.Credential.last_name}`,
        logs: userWithLogs.Credential.LoginLogs || [],
      });
    } catch (error) {
      console.error('Error fetching login logs:', error);
      res.status(500).json({ message: 'Failed to fetch login logs.' });
    }
  };
  