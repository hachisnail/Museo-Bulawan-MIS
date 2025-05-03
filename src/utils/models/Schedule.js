// models/Schedule.js - Add status field

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
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
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
    defaultValue: 'SHARED',
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'ACTIVE', // Default status is ACTIVE
  },
}, {
  tableName: 'schedules',
  timestamps: true,
});

export default Schedule;
