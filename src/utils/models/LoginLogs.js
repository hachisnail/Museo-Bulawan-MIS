// LoginLogs.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const LoginLog = sequelize.define('LoginLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  credential_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'credentials',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  last_login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  start: {
    type: 'TIMESTAMP', 
    allowNull: false,
  },
  end: {
    type: 'TIMESTAMP', 
    allowNull: true,   
  },
  // New fields below
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  last_activity: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  terminated_reason: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'login_logs',
  timestamps: false,
});

export default LoginLog;
