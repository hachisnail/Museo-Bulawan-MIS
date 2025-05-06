// models/Appointment.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; 
import Visitor from './Visitors.js';           // Make sure the path/file name matches your real file

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  visitor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Visitor,
      key: 'visitor_id'
    },
    onDelete: 'CASCADE'
  },
  purpose_of_visit: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  population_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  preferred_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,  // Can be null for "Flexible" time
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true,  // Can be null for "Flexible" time
  },
  /**
   * Store creation_date with date & time
   */
  creation_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  additional_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointment',
  timestamps: false
});

// Relationship: One visitor has many appointments
Visitor.hasMany(Appointment, { foreignKey: 'visitor_id' });
Appointment.belongsTo(Visitor, { foreignKey: 'visitor_id' });

export default Appointment;
