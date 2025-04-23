// models/ContributionType.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const ContributionType = sequelize.define('ContributionType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  duration_period: {
    type: DataTypes.STRING(255)
  },
  accession_type: {
    type: DataTypes.STRING(50) // e.g., "donation" or "lending"
  },
  remarks: {
    type: DataTypes.TEXT
  },
  condition: {
    type: DataTypes.TEXT
  },
  reason: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.STRING(50) // e.g., "accepted", "declined"
  },
  transfer_status: {
    type: DataTypes.STRING(50) // e.g., "acquired", "on_progress"
  }
}, {
  tableName: 'contribution_type',
  timestamps: false
});

export default ContributionType;
