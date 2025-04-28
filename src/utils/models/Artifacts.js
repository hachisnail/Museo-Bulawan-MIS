import { DataTypes } from 'sequelize';
import sequelize from './database'; // assuming database.js initializes Sequelize


const Artifact = sequelize.define('Artifact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  artifact_type: {
    type: DataTypes.ENUM(
      'tools',
      'weapons',
      'personal adornment',
      'ceremonial objects',
      'art',
      'historic document',
      'military artifacts',
      'scientific specimens',
      'everyday objects'
    ),
    allowNull: false,
  },
  artifact_creator: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  creation_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  upload_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  accession_type: {
    type: DataTypes.ENUM('lend', 'donated', 'purchased'),
    allowNull: false,
  },
  artifact_condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'fragmentary', 'unstable', 'deteriorated'),
    allowNull: false,
  },
  modified_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  donation_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  display_status: {
    type: DataTypes.ENUM('stored', 'displayed'),
    allowNull: false,
  },
  lending_duration: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  related_files: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  description_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifact_description', // referencing the ArtifactDescription table
      key: 'id',
    },
  },
}, {
  tableName: 'artifacts',
  timestamps: false,
});

// Artifact Description model
const ArtifactDescription = sequelize.define('ArtifactDescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  origin: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  culture: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  period: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  discovery_details: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  excavation_site: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  accession_no: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  aquisition_history: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'artifact_description',
  timestamps: false,
});

// Duration Logs model
const DurationLog = sequelize.define('DurationLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  display_end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  display_start: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  artifact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'artifacts', // referencing the Artifact table
      key: 'id',
    },
  },
}, {
  tableName: 'duration_logs',
  timestamps: false,
});


// An Artifact belongs to an ArtifactDescription
Artifact.belongsTo(ArtifactDescription, {
  foreignKey: 'description_id',
  targetKey: 'id',
  onDelete: 'CASCADE', 
});

// An Artifact has many DurationLogs
Artifact.hasMany(DurationLog, {
  foreignKey: 'artifact_id',
  sourceKey: 'id',
  onDelete: 'CASCADE', 
});

// A DurationLog belongs to an Artifact
DurationLog.belongsTo(Artifact, {
  foreignKey: 'artifact_id',
  targetKey: 'id',
  onDelete: 'CASCADE', 
});

export { Artifact, ArtifactDescription, DurationLog };
