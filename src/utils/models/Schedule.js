// models/Schedule.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js'; 

const Schedule = sequelize.define('Schedule', {
  schedule_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Required field
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // DATE type para sa petsa ng schedule
  date: {
    type: DataTypes.DATEONLY, // Para sa petsa lang
    allowNull: false,
  },
  // TIME type para sa oras
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  availability: {
    type: DataTypes.ENUM('SHARED', 'EXCLUSIVE'),
    allowNull: false,
    defaultValue: 'SHARED', // Default availability
  },
}, {
  tableName: 'schedules',
  timestamps: true, // Para sa createdAt at updatedAt
});

export default Schedule;
