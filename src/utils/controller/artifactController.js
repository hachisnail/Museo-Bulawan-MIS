import { 
  Artifact, 
  ArtifactDetails, 
  ArtifactFiles, 
  ArtifactLending, 
  Donator
} from "../models/Artifacts.js";
import { sequelize } from "../database.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directories
const uploadDir = path.resolve(__dirname, '..', 'assets', 'uploads', 'artifacts');
const picturesDir = path.join(uploadDir, 'pictures');
const documentsDir = path.join(uploadDir, 'documents');

// Create necessary directories if they don't exist
const createStorageDirectories = () => {
  const dirs = [uploadDir, picturesDir, documentsDir];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createStorageDirectories();

// Helper function to sanitize filenames
const sanitizeFilename = (name) => {
  return name
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pictures') {
      cb(null, picturesDir);
    } else if (file.fieldname === 'documents') {
      cb(null, documentsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    // Create counters for file types to track multiple files
    if (!req.fileCounters) {
      req.fileCounters = {
        pictures: 0,
        documents: 0
      };
    }
    
    // Get artifact name from the request body
    const artifactName = req.body.artifact_creator || 'artifact';
    
    // Sanitize names
    const sanitizedArtifact = sanitizeFilename(artifactName);
    
    // Increment counter for the specific field type
    req.fileCounters[file.fieldname]++;
    
    // Create filename: artifactname_fieldtype_number_timestamp.extension
    const timestamp = Date.now();
    const fileType = file.fieldname === 'pictures' ? 'img' : 'doc';
    const fileName = `${sanitizedArtifact}_${fileType}_${req.fileCounters[file.fieldname]}_${timestamp}${path.extname(file.originalname)}`;
    
    cb(null, fileName);
  }
});

// Configure multer upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).fields([
  { name: 'pictures', maxCount: 10 },
  { name: 'documents', maxCount: 10 }
]);

export { upload };

// Controller to handle artifact creation
export const createArtifact = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    }

    const t = await sequelize.transaction();
    
    try {
      // Add logging to debug the received data
      console.log('Received form data:', req.body);
      console.log('Received files:', req.files);

      // Parse form data with validation
      const name = req.body.name || req.body.artifact_creator;
      if (!name) {
        throw new Error('Artifact name/creator is required');
      }

      // Create base artifact
      const newArtifact = await Artifact.create({
        name,
        artifact_type: req.body.artifact_type,
        creation_date: req.body.creation_date || null,
        accession_type: req.body.accession_type,
        condition: req.body.condition || req.body.artifact_condition,
        display_status: req.body.display_status || 'stored',
        description: req.body.description || null,
        modified_date: new Date(),
        upload_date: new Date()
      }, { transaction: t });

      // Parse JSON strings with error handling
      let artifactDetails, donorInformation, lendingInformation;
      
      try {
        artifactDetails = req.body.artifact_details ? JSON.parse(req.body.artifact_details) : {};
        donorInformation = req.body.donor_information ? JSON.parse(req.body.donor_information) : {};
        lendingInformation = req.body.lending_information ? JSON.parse(req.body.lending_information) : {};
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Invalid JSON data provided');
      }

      // Create artifact details
      await ArtifactDetails.create({
        artifact_id: newArtifact.id,
        country: artifactDetails.country || null,
        region: artifactDetails.region || null,
        culture: artifactDetails.culture || null,
        period: artifactDetails.period || null,
        discoverer: artifactDetails.discoverer || null,
        discovery_date: artifactDetails.discovery_date || null,
        excavation_site: artifactDetails.excavation_site || null,
        site_location: artifactDetails.site_location || null
      }, { transaction: t });

      // Handle donor information if present
      if (donorInformation.donor_name) {
        try {
          const [donor] = await Donator.findOrCreate({
            where: { 
              email: donorInformation.donor_email || '' 
            },
            defaults: {
              name: donorInformation.donor_name,
              email: donorInformation.donor_email || '',
              phone: donorInformation.donor_phone || '',
              organization: donorInformation.donor_organization || '',
              sex: donorInformation.sex || null,
              age: donorInformation.age ? parseInt(donorInformation.age) : null,
              province: donorInformation.province || null,
              city: donorInformation.city || null,
              barangay: donorInformation.barangay || null,
              street: donorInformation.street || null
            },
            transaction: t
          });

          await newArtifact.update({
            donator_id: donor.id
          }, { transaction: t });
        } catch (donorError) {
          console.error('Error creating donor:', donorError);
          throw new Error('Failed to process donor information');
        }
      }

      // Handle lending information
      if (req.body.accession_type === 'lend' && lendingInformation.lender_name) {
        await ArtifactLending.create({
          artifact_id: newArtifact.id,
          lender_name: lendingInformation.lender_name,
          start_date: lendingInformation.start_date || null,
          end_date: lendingInformation.end_date || null
        }, { transaction: t });
      }

      // Handle file uploads
      if (req.files) {
        const baseUrl = process.env.VITE_API_URL || `${req.protocol}://${req.get('host')}`;

        for (const fileType of ['pictures', 'documents']) {
          if (req.files[fileType]) {
            const files = Array.isArray(req.files[fileType]) ? 
                         req.files[fileType] : [req.files[fileType]];

            for (const file of files) {
              await ArtifactFiles.create({
                artifact_id: newArtifact.id,
                file_type: fileType === 'pictures' ? 'picture' : 'document',
                filename: file.filename,
                original_name: file.originalname,
                file_path: `${baseUrl}/uploads/artifacts/${fileType}/${file.filename}`,
                file_size: file.size,
                mimetype: file.mimetype
              }, { transaction: t });
            }
          }
        }
      }

      await t.commit();
      
      return res.status(201).json({
        success: true,
        message: 'Artifact added successfully',
        artifact_id: newArtifact.id
      });

    } catch (error) {
      await t.rollback();
      console.error('Error creating artifact:', error);
      return res.status(500).json({
        success: false,
        message: 'Error adding artifact',
        error: error.message,
        details: error.stack // Add stack trace for debugging
      });
    }
  });
};

// Get all artifacts with filtering and pagination
export const getAllArtifacts = async (req, res) => {
  try {
    const { 
      search, 
      display_status, 
      artifact_type, 
      date_from, 
      date_to,
      accession_type,
      page = 1,
      limit = 10
    } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the where clause for filtering
    let whereClause = {
      deleted_at: null
    };

    // Add filters if they exist
    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { artifact_type: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    if (display_status && display_status !== 'all') {
      whereClause.display_status = display_status;
    }

    if (artifact_type && artifact_type !== 'all') {
      whereClause.artifact_type = artifact_type;
    }

    if (accession_type && accession_type !== 'all') {
      whereClause.accession_type = accession_type;
    }

    // Date filtering
    if (date_from || date_to) {
      whereClause.creation_date = {};
      
      if (date_from) {
        whereClause.creation_date[Op.gte] = new Date(date_from);
      }
      
      if (date_to) {
        whereClause.creation_date[Op.lte] = new Date(date_to);
      }
    }

    // Get total count for pagination info
    const totalCount = await Artifact.count({
      where: whereClause
    });

    // Find artifacts with filters and pagination
    const artifacts = await Artifact.findAll({
      where: whereClause,
      include: [
        {
          model: ArtifactDetails,
          attributes: ['country', 'region', 'culture', 'period', 'discoverer', 
                      'discovery_date', 'excavation_site', 'site_location']
        },
        {
          model: ArtifactFiles,
          attributes: ['file_type', 'file_path', 'filename']
        },
        {
          model: ArtifactLending,
          attributes: ['lender_name', 'start_date', 'end_date']
        },
        {
          model: Donator,
          attributes: ['name', 'organization', 'email']
        }
      ],
      order: [['modified_date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Return the artifacts with pagination metadata
    return res.status(200).json({
      artifacts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        pageSize: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching artifacts',
      error: error.message
    });
  }
};

// Get a single artifact by ID
export const getArtifactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artifact = await Artifact.findOne({
      where: { 
        id: id,
        deleted_at: null
      },
      include: [
        {
          model: ArtifactDetails
        },
        {
          model: ArtifactFiles
        },
        {
          model: ArtifactLending
        },
        {
          model: Donator
        }
      ]
    });
    
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: 'Artifact not found'
      });
    }
    
    return res.status(200).json(artifact);
    
  } catch (error) {
    console.error('Error fetching artifact by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching artifact',
      error: error.message
    });
  }
};
