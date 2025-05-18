import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import LoginLog from './LoginLogs.js';

const Credential = sequelize.define('Credential', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {  
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  contact_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    allowNull: false,
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  modified_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  // ← Add these two:
  resetToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  resetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  }

}, {
  tableName: 'credentials',
  timestamps: false,
});

Credential.hasMany(LoginLog, { foreignKey: 'credential_id' });
LoginLog.belongsTo(Credential,   { foreignKey: 'credential_id' });

export default Credential;
