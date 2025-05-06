// models/Form.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../database.js';
import Donator from './Donator.js';
import ContributionType from './ContributionType.js';

const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  donator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Donator,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  contribution_id: {
    type: DataTypes.INTEGER,
    references: {
      model: ContributionType,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  accession_status: {
    type: DataTypes.STRING(50)
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  artifact_name: {
    type: DataTypes.STRING(255)
  },
  donation_date: {
    type: DataTypes.DATE
  },
  description: {
    type: DataTypes.TEXT
  },
  acquired: {
    type: DataTypes.STRING(255)
  },
  additional_info: {
    type: DataTypes.TEXT
  },
  narrative: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.TEXT
  },
  documents: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('documents');
      if (!rawValue) return [];
      
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return rawValue; // Return as-is if parsing fails
      }
    },
    set(value) {
      if (typeof value === 'object') {
        this.setDataValue('documents', JSON.stringify(value));
      } else {
        this.setDataValue('documents', value);
      }
    }
  },
  related_images: {
    type: DataTypes.TEXT
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'form',
  timestamps: false
});

// Define relationships
Donator.hasMany(Form, { foreignKey: 'donator_id' });
Form.belongsTo(Donator, { foreignKey: 'donator_id' });

ContributionType.hasMany(Form, { foreignKey: 'contribution_id' });
Form.belongsTo(ContributionType, { foreignKey: 'contribution_id' });

export default Form;
