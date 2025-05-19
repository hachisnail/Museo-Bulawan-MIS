import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database.js';

// Artifact Model
class Artifact extends Model {}
Artifact.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  artifact_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  creation_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  upload_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  accession_type: {
    type: DataTypes.ENUM('lend', 'donated', 'purchased'),
    allowNull: false
  },
  condition: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  modified_date: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW
  },
  donation_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  display_status: {
    type: DataTypes.ENUM('stored', 'displayed'),
    allowNull: false,
    defaultValue: 'stored'
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  accession_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  acquisition_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'artifacts',
  timestamps: false,
  indexes: [
    { fields: ['artifact_type'] },
    { fields: ['condition'] },
    { fields: ['accession_type'] }
  ]
});

// Artifact Details Model
class ArtifactDetails extends Model {}
ArtifactDetails.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifacts',
      key: 'id'
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  culture: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  period: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  discoverer: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  discovery_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  excavation_site: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  site_location: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'artifact_details',
  timestamps: false,
  indexes: [
    { fields: ['artifact_id'] },
    { fields: ['culture'] },
    { fields: ['period'] }
  ]
});

// Artifact Files Model
class ArtifactFiles extends Model {}
ArtifactFiles.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifacts',
      key: 'id'
    }
  },
  file_type: {
    type: DataTypes.ENUM('picture', 'document'),
    allowNull: false
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING(512),
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mimetype: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  upload_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'artifact_files',
  timestamps: false,
  indexes: [{ fields: ['artifact_id'] }]
});

// Artifact Lending Model
class ArtifactLending extends Model {}
ArtifactLending.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifacts',
      key: 'id'
    }
  },
  lender_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'artifact_lending',
  timestamps: false,
  indexes: [{ fields: ['start_date', 'end_date'] }]
});

// Donator Model
class Donator extends Model {}
Donator.init({
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
    type: DataTypes.INTEGER,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  sex: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  organization: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  province: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  barangay: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  street: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'donator',
  timestamps: false
});

// Duration Logs Model (for completeness)
class DurationLogs extends Model {}
DurationLogs.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifacts',
      key: 'id'
    }
  },
  display_start: {
    type: DataTypes.DATE,
    allowNull: true
  },
  display_end: {
    type: DataTypes.DATE,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'duration_logs',
  timestamps: false
});

// Define associations
Artifact.belongsTo(Donator, { foreignKey: 'donator_id' });
Donator.hasMany(Artifact, { foreignKey: 'donator_id' });

Artifact.hasOne(ArtifactDetails, { foreignKey: 'artifact_id' });
ArtifactDetails.belongsTo(Artifact, { foreignKey: 'artifact_id' });

Artifact.hasMany(ArtifactFiles, { foreignKey: 'artifact_id' });
ArtifactFiles.belongsTo(Artifact, { foreignKey: 'artifact_id' });

Artifact.hasMany(ArtifactLending, { foreignKey: 'artifact_id' });
ArtifactLending.belongsTo(Artifact, { foreignKey: 'artifact_id' });

Artifact.hasMany(DurationLogs, { foreignKey: 'artifact_id' });
DurationLogs.belongsTo(Artifact, { foreignKey: 'artifact_id' });

export { 
  Artifact, 
  ArtifactDetails, 
  ArtifactFiles, 
  ArtifactLending, 
  Donator,
  DurationLogs 
};
