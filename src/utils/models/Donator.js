// models/Donator.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';

const Donator = sequelize.define('Donator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER
  },
  phone: {
    type: DataTypes.STRING(20),  // or however many characters you need
    allowNull: true
  },
  sex: {
    type: DataTypes.STRING(10)
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  organization: {
    type: DataTypes.STRING(100)
  },
  province: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  barangay: {
    type: DataTypes.STRING(100)
  },
  street: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'donator',
  timestamps: false
});

export default Donator;
