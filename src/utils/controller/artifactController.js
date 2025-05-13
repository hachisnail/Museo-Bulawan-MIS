import { Artifact, ArtifactDescription } from "../models/Artifacts.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Op } from 'sequelize';
import { sequelize } from "../database.js";

// Get the directory of the current module
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
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("Unknown upload error:", err);
        return res.status(500).json({ message: `Unknown upload error: ${err.message}` });
      }
      
      // Parse form data
      const {
        artifact_creator,
        artifact_type,
        creation_date,
        upload_date,
        accession_type,
        artifact_condition,
        modified_date,
        donation_date,
        display_status
      } = req.body;
      
      // Parse nested objects (they come as strings via FormData)
      const lending_duration = JSON.parse(req.body.lending_duration || '{}');
      const description = JSON.parse(req.body.description || '{}');

      console.log('📝 Incoming artifact POST request');
      console.log('Request Body:', req.body);
      console.log('Files received:', req.files);

      // Process uploaded files
      let related_files = {
        pictures: [],
        documents: []
      };

      // If pictures were uploaded, process them
      if (req.files && req.files['pictures']) {
        const API_URL = process.env.VITE_API_URL;
        
        related_files.pictures = req.files['pictures'].map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          path: `${API_URL}/uploads/artifacts/pictures/${file.filename}`,
          mimetype: file.mimetype
        }));
      }

      // If documents were uploaded, process them
      if (req.files && req.files['documents']) {
        const API_URL = process.env.VITE_API_URL;
        
        related_files.documents = req.files['documents'].map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          path: `${API_URL}/uploads/artifacts/documents/${file.filename}`,
          mimetype: file.mimetype
        }));
      }

      // Validate required fields
      if (!artifact_creator || !artifact_type || !accession_type || !artifact_condition || !display_status) {
        return res.status(400).json({ message: 'Required fields are missing.' });
      }

      try {
        // Use a transaction to ensure database consistency
        const result = await sequelize.transaction(async (t) => {
          // We need to handle the circular dependency differently
          // Create both records with allowNull temporarily set to true
          
          // Create a temporary description_id
          const tempDescId = 'temp_' + Date.now();
          
          // Create artifact with temporary description_id
          const newArtifact = await Artifact.create({
            artifact_creator,
            artifact_type,
            creation_date: creation_date || null,
            upload_date: upload_date || new Date(),
            accession_type,
            artifact_condition,
            modified_date: modified_date || null,
            donation_date: donation_date || null,
            display_status,
            lending_duration,
            related_files,
            // Set a temporary value to satisfy the constraint
            description_id: tempDescId,
            deleted_at: null // For soft deletion support
          }, { 
            transaction: t,
            // Override validation for this operation
            validate: false
          });

          // Create artifact description with the new artifact's ID
          const artifactDescription = await ArtifactDescription.create({
            origin: description.origin || { country: '', region: '' },
            culture: description.culture || { name: '' },
            period: description.period || { name: '' },
            discovery_details: description.discovery_details || { discoverer: '', discovery_date: '' },
            excavation_site: description.excavation_site || { site_name: '', location: '' },
            accession_no: description.accession_no || { number: '' },
            aquisition_history: description.aquisition_history || { provenance: '' },
            artifact_id: newArtifact.id
          }, { transaction: t });

          // Now update the artifact with the real description_id
          await newArtifact.update({
            description_id: artifactDescription.id
          }, { transaction: t });

          return { newArtifact, artifactDescription };
        });

        console.log('Artifact successfully created:', result.newArtifact.id);

        return res.status(201).json({
          message: 'Artifact created successfully',
          artifact: result.newArtifact,
          description: result.artifactDescription
        });
      } catch (dbError) {
        console.error('Database error creating artifact:', dbError);
        return res.status(500).json({ message: 'Database error', error: dbError.message });
      }
    });
  } catch (error) {
    console.error('Error creating artifact:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller to get all non-deleted artifacts
export const getAllArtifacts = async (req, res) => {
  try {
    const artifacts = await Artifact.findAll({
      where: {
        deleted_at: null // Only fetch non-deleted artifacts
      },
      include: ArtifactDescription,
      order: [['id', 'DESC']]
    });
    
    return res.json(artifacts);
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    return res.status(500).json({ message: 'Server error retrieving artifacts.' });
  }
};

// Controller to get all deleted artifacts (for admins to view or restore)
export const getDeletedArtifacts = async (req, res) => {
  try {
    const artifacts = await Artifact.findAll({
      where: {
        deleted_at: { [Op.ne]: null } // Only fetch soft-deleted artifacts
      },
      include: ArtifactDescription,
      order: [['deleted_at', 'DESC']]
    });
    
    return res.json(artifacts);
  } catch (error) {
    console.error('Error fetching deleted artifacts:', error);
    return res.status(500).json({ message: 'Server error retrieving deleted artifacts.' });
  }
};

// Controller to get a specific artifact by ID (including deleted ones if specified)
export const getArtifactById = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeDeleted } = req.query; // Optional query param to include deleted artifacts

    if (!id) {
      return res.status(400).json({ message: 'Artifact ID is required.' });
    }

    // Set up where clause based on whether deleted artifacts should be included
    const whereClause = includeDeleted === 'true' ? 
      { id } : 
      { id, deleted_at: null };

    const artifact = await Artifact.findOne({
      where: whereClause,
      include: ArtifactDescription
    });

    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found.' });
    }

    return res.json(artifact);
  } catch (error) {
    console.error('Error fetching artifact:', error);
    return res.status(500).json({ message: 'Server error retrieving artifact.' });
  }
};

// Controller to soft delete an artifact
export const softDeleteArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artifact = await Artifact.findByPk(id);
    
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found.' });
    }
    
    // If already deleted, return appropriate message
    if (artifact.deleted_at) {
      return res.status(400).json({ message: 'Artifact is already deleted.' });
    }
    
    // Update the deleted_at field to current timestamp
    await artifact.update({
      deleted_at: new Date()
    });
    
    return res.json({
      message: 'Artifact soft deleted successfully',
      artifact_id: id,
      deleted_at: artifact.deleted_at
    });
  } catch (error) {
    console.error('Error soft deleting artifact:', error);
    return res.status(500).json({ message: 'Server error soft deleting artifact.' });
  }
};

// Controller to restore a soft deleted artifact
export const restoreArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artifact = await Artifact.findByPk(id);
    
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found.' });
    }
    
    // If not deleted, return appropriate message
    if (!artifact.deleted_at) {
      return res.status(400).json({ message: 'Artifact is not deleted.' });
    }
    
    // Set deleted_at to null to restore the artifact
    await artifact.update({
      deleted_at: null
    });
    
    return res.json({
      message: 'Artifact restored successfully',
      artifact_id: id
    });
  } catch (error) {
    console.error('Error restoring artifact:', error);
    return res.status(500).json({ message: 'Server error restoring artifact.' });
  }
};

// Controller to hard delete an artifact (permanent deletion)
export const hardDeleteArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const artifact = await Artifact.findByPk(id, {
      include: ArtifactDescription
    });
    
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found.' });
    }
    
    // Delete associated files
    if (artifact.related_files) {
      // Delete pictures
      if (artifact.related_files.pictures) {
        for (const picture of artifact.related_files.pictures) {
          try {
            const filePath = picture.filename ? 
              path.join(picturesDir, picture.filename) :
              picture.path?.replace(/.*\/uploads\/artifacts\/pictures\//, path.join(picturesDir, '/'));
              
            if (filePath && fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          } catch (fileError) {
            console.error(`Error deleting picture file: ${fileError.message}`);
            // Continue with deletion even if file removal fails
          }
        }
      }
      
      // Delete documents
      if (artifact.related_files.documents) {
        for (const doc of artifact.related_files.documents) {
          try {
            const filePath = doc.filename ? 
              path.join(documentsDir, doc.filename) :
              doc.path?.replace(/.*\/uploads\/artifacts\/documents\//, path.join(documentsDir, '/'));
              
            if (filePath && fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          } catch (fileError) {
            console.error(`Error deleting document file: ${fileError.message}`);
            // Continue with deletion even if file removal fails
          }
        }
      }
    }
    
    // Delete the artifact (this will cascade delete the description due to the model association)
    await artifact.destroy();
    
    return res.json({
      message: 'Artifact permanently deleted successfully',
      artifact_id: id
    });
  } catch (error) {
    console.error('Error hard deleting artifact:', error);
    return res.status(500).json({ message: 'Server error hard deleting artifact.' });
  }
};

// Controller to update an artifact
export const updateArtifact = async (req, res) => {
  try {
    const { id } = req.params;
    
    upload(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      
      // Find the artifact, including soft-deleted ones
      const artifact = await Artifact.findByPk(id, {
        include: ArtifactDescription
      });
      
      if (!artifact) {
        return res.status(404).json({ message: 'Artifact not found.' });
      }
      
      // If artifact is soft-deleted, prevent updates unless explicitly restoring
      if (artifact.deleted_at && req.body.restore !== 'true') {
        return res.status(400).json({ 
          message: 'Cannot update a deleted artifact. Restore the artifact first.' 
        });
      }
      
      // Parse form data
      const {
        artifact_creator,
        artifact_type,
        creation_date,
        accession_type,
        artifact_condition,
        modified_date,
        donation_date,
        display_status
      } = req.body;
      
      // Parse nested objects if provided
      const lending_duration = req.body.lending_duration ? 
        JSON.parse(req.body.lending_duration) : undefined;
      const description = req.body.description ? 
        JSON.parse(req.body.description) : undefined;
      
      // Update related files if new ones were uploaded
      let related_files = artifact.related_files || { pictures: [], documents: [] };
      
      if (req.files) {
        const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';
        
        if (req.files['pictures']) {
          const newPictures = req.files['pictures'].map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: `${API_URL}/uploads/artifacts/pictures/${file.filename}`,
            mimetype: file.mimetype
          }));
          
          // Append new pictures to existing ones
          related_files.pictures = [...related_files.pictures, ...newPictures];
        }
        
        if (req.files['documents']) {
          const newDocuments = req.files['documents'].map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            path: `${API_URL}/uploads/artifacts/documents/${file.filename}`,
            mimetype: file.mimetype
          }));
          
          // Append new documents to existing ones
          related_files.documents = [...related_files.documents, ...newDocuments];
        }
      }
      
      // Update artifact
      await artifact.update({
        artifact_creator: artifact_creator || artifact.artifact_creator,
        artifact_type: artifact_type || artifact.artifact_type,
        creation_date: creation_date || artifact.creation_date,
        accession_type: accession_type || artifact.accession_type,
        artifact_condition: artifact_condition || artifact.artifact_condition,
        modified_date: modified_date || new Date(),
        donation_date: donation_date || artifact.donation_date,
        display_status: display_status || artifact.display_status,
        lending_duration: lending_duration || artifact.lending_duration,
        related_files,
        // If restoring, set deleted_at to null
        deleted_at: req.body.restore === 'true' ? null : artifact.deleted_at
      });
      
      // Update artifact description if provided
      if (description && artifact.ArtifactDescription) {
        await artifact.ArtifactDescription.update({
          origin: description.origin || artifact.ArtifactDescription.origin,
          culture: description.culture || artifact.ArtifactDescription.culture,
          period: description.period || artifact.ArtifactDescription.period,
          discovery_details: description.discovery_details || artifact.ArtifactDescription.discovery_details,
          excavation_site: description.excavation_site || artifact.ArtifactDescription.excavation_site,
          accession_no: description.accession_no || artifact.ArtifactDescription.accession_no,
          aquisition_history: description.aquisition_history || artifact.ArtifactDescription.aquisition_history
        });
      }
      
      return res.json({
        message: 'Artifact updated successfully',
        artifact
      });
    });
  } catch (error) {
    console.error('Error updating artifact:', error);
    return res.status(500).json({ message: 'Server error updating artifact.' });
  }
};

// Controller to batch soft delete multiple artifacts
export const batchSoftDelete = async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of IDs
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No artifact IDs provided for deletion.' });
    }
    
    // Update all specified artifacts to set deleted_at
    const result = await Artifact.update(
      { deleted_at: new Date() },
      { 
        where: { 
          id: { [Op.in]: ids },
          deleted_at: null // Only update artifacts that aren't already deleted
        } 
      }
    );
    
    return res.json({
      message: `${result[0]} artifacts soft deleted successfully`,
      count: result[0],
      artifact_ids: ids
    });
  } catch (error) {
    console.error('Error batch soft deleting artifacts:', error);
    return res.status(500).json({ message: 'Server error batch soft deleting artifacts.' });
  }
};

// Controller to batch restore multiple artifacts
export const batchRestore = async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of IDs
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No artifact IDs provided for restoration.' });
    }
    
    // Update all specified artifacts to set deleted_at to null
    const result = await Artifact.update(
      { deleted_at: null },
      { 
        where: { 
          id: { [Op.in]: ids },
          deleted_at: { [Op.ne]: null } // Only update artifacts that are deleted
        } 
      }
    );
    
    return res.json({
      message: `${result[0]} artifacts restored successfully`,
      count: result[0],
      artifact_ids: ids
    });
  } catch (error) {
    console.error('Error batch restoring artifacts:', error);
    return res.status(500).json({ message: 'Server error batch restoring artifacts.' });
  }
};

// Controller to batch hard delete multiple artifacts
export const batchHardDelete = async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of IDs
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No artifact IDs provided for permanent deletion.' });
    }
    
    // Find all specified artifacts first to get file info
    const artifacts = await Artifact.findAll({
      where: { id: { [Op.in]: ids } }
    });
    
    // Delete associated files for each artifact
    for (const artifact of artifacts) {
      if (artifact.related_files) {
        // Delete pictures
        if (artifact.related_files.pictures) {
          for (const picture of artifact.related_files.pictures) {
            try {
              const filePath = picture.filename ? 
                path.join(picturesDir, picture.filename) :
                picture.path?.replace(/.*\/uploads\/artifacts\/pictures\//, path.join(picturesDir, '/'));
                
              if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (fileError) {
              console.error(`Error deleting file for artifact ${artifact.id}: ${fileError.message}`);
              // Continue with next file even if this one fails
            }
          }
        }
        
        // Delete documents
        if (artifact.related_files.documents) {
          for (const doc of artifact.related_files.documents) {
            try {
              const filePath = doc.filename ? 
                path.join(documentsDir, doc.filename) :
                doc.path?.replace(/.*\/uploads\/artifacts\/documents\//, path.join(documentsDir, '/'));
                
              if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            } catch (fileError) {
              console.error(`Error deleting document for artifact ${artifact.id}: ${fileError.message}`);
              // Continue with next file even if this one fails
            }
          }
        }
      }
    }
    
    // Delete all specified artifacts (cascade will delete their descriptions)
    const result = await Artifact.destroy({
      where: { id: { [Op.in]: ids } }
    });
    
    return res.json({
      message: `${result} artifacts permanently deleted successfully`,
      count: result,
      artifact_ids: ids
    });
  } catch (error) {
    console.error('Error batch hard deleting artifacts:', error);
    return res.status(500).json({ message: 'Server error batch hard deleting artifacts.' });
  }
};

// Controller to remove a specific file from an artifact
export const removeArtifactFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileType, fileIndex } = req.body;
    
    if (!fileType || !['pictures', 'documents'].includes(fileType) || fileIndex === undefined) {
      return res.status(400).json({ message: 'Invalid file information provided.' });
    }
    
    const artifact = await Artifact.findByPk(id);
    
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found.' });
    }
    
    if (artifact.deleted_at) {
      return res.status(400).json({ 
        message: 'Cannot modify files of a deleted artifact. Restore the artifact first.' 
      });
    }
    
    if (!artifact.related_files || !artifact.related_files[fileType] || 
        !artifact.related_files[fileType][fileIndex]) {
      return res.status(404).json({ message: 'File not found in artifact.' });
    }
    
    // Get file to delete
    const fileToDelete = artifact.related_files[fileType][fileIndex];
    
    // Delete the physical file
    const baseDir = fileType === 'pictures' ? picturesDir : documentsDir;
    const filename = fileToDelete.filename || path.basename(fileToDelete.path);
    const filePath = path.join(baseDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Update the artifact's related_files by removing the file
    artifact.related_files[fileType].splice(fileIndex, 1);
    
    await artifact.update({
      related_files: artifact.related_files
    });
    
    return res.json({
      message: 'File removed successfully',
      artifact
    });
  } catch (error) {
    console.error('Error removing artifact file:', error);
    return res.status(500).json({ message: 'Server error removing file.' });
  }
};
