// controller/formController.js

import Donator from '../models/Donator.js';
import Form from '../models/Form.js';
import ContributionType from '../models/ContributionType.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendEmail } from '../services/emailTransporter.js';

// Create storage directories if they don't exist
const createStorageDirectories = () => {
  const dirs = [
    'src/utils/assets/acquisition_images/images',
    'src/utils/assets/acquisition_images/related_images',
    'src/utils/assets/acquisition_images/documents'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createStorageDirectories();

// Helper function to sanitize filename
const sanitizeFilename = (name) => {
  return name
    .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric characters with underscore
    .replace(/__+/g, '_')        // Replace multiple underscores with single one
    .toLowerCase();              // Convert to lowercase
};

// Configure multer storage inline
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'related_images') {
      cb(null, 'src/utils/assets/acquisition_images/related_images');
    } else if (file.fieldname === 'documents') {
      cb(null, 'src/utils/assets/acquisition_images/documents');
    } else {
      cb(null, 'src/utils/assets/acquisition_images/images');
    }
  },
  filename: (req, file, cb) => {
    // Create counters for file types to track multiple files
    if (!req.fileCounters) {
      req.fileCounters = {
        images: 0,
        related_images: 0,
        documents: 0
      };
    }
    
    // Get artifact name and donator name from the request body
    const artifactName = req.body.artifact_name || 'artifact';
    const donatorName = `${req.body.first_name || ''}_${req.body.last_name || ''}`.trim() || 'donator';
    
    // Sanitize names to make them safe for filenames
    const sanitizedArtifact = sanitizeFilename(artifactName);
    const sanitizedDonator = sanitizeFilename(donatorName);
    
    // Increment counter for the specific field type
    req.fileCounters[file.fieldname]++;
    
    // Create filename: artifactname_donatorname_fieldtype_number.extension
    const fileType = file.fieldname === 'images' ? 'img' : 
                     file.fieldname === 'related_images' ? 'related' : 'doc';
                     
    const fileName = `${sanitizedArtifact}_${sanitizedDonator}_${fileType}_${req.fileCounters[file.fieldname]}${path.extname(file.originalname)}`;
    
    cb(null, fileName);
  }
});

// File filter to accept all file types
const fileFilter = (req, file, cb) => {
  // Accept all file types
  cb(null, true);
};

export const createForm = async (req, res) => {
  try {
    // Initialize multer upload with no file size limit
    const upload = multer({ 
      storage: storage,
      fileFilter: fileFilter
    }).fields([
      { name: 'images', maxCount: 10 },
      { name: 'related_images', maxCount: 10 },
      { name: 'documents', maxCount: 10 }
    ]);

    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("Unknown upload error:", err);
        return res.status(500).json({ message: `Unknown upload error: ${err.message}` });
      }

      // Get relative paths for storage in DB
      const imagePaths = req.files['images']?.map(f => f.path) || [];
      const relatedImagePaths = req.files['related_images']?.map(f => f.path) || [];
      const documentPaths = req.files['documents']?.map(f => ({
        path: f.path,
        originalName: f.originalname,
        size: f.size,
        mimetype: f.mimetype
      })) || [];

      // Check if a Donator with the same firstname, lastname, and email already exists
      const existingDonator = await Donator.findOne({
        where: {
          name: `${req.body.first_name} ${req.body.last_name}`.trim(),
          email: req.body.email
        }
      });

      let donatorId;

      if (existingDonator) {
        donatorId = existingDonator.id;
      } else {
        const newDonator = await Donator.create({
          name: `${req.body.first_name} ${req.body.last_name}`.trim(),
          age: req.body.age,
          sex: req.body.sex,
          email: req.body.email,
          phone: req.body.phone,
          organization: req.body.organization,
          province: req.body.province,
          city: req.body.city_municipality,
          barangay: req.body.barangay,
          street: req.body.street
        });

        donatorId = newDonator.id;
      }

      const newForm = await Form.create({
        donator_id: donatorId,
        artifact_name: req.body.artifact_name,
        description: req.body.description,
        acquired: req.body.acquired,
        additional_info: req.body.additional_info,
        narrative: req.body.narrative,
        images: JSON.stringify(imagePaths),
        documents: JSON.stringify(documentPaths || req.body.documents || []),
        related_images: JSON.stringify(relatedImagePaths),
        donation_date: new Date(),
        accession_status: 'Pending',
        user_id: 1 // Replace with actual user ID from authentication if needed
      });

      // Optionally Create a ContributionType
      if (req.body.formType === 'lending') {
        const newContribution = await ContributionType.create({
          duration_period: req.body.durationPeriod,
          remarks: req.body.remarks,
          condition: req.body.condition,
          reason: req.body.reason,
          status: 'Pending',
          accession_type: 'Lending'
        });

        await newForm.update({ contribution_id: newContribution.id });
      } else {
        const newContribution = await ContributionType.create({
          accession_type: 'Donation',
          status: 'Pending',
          transfer_status: 'On Progress'
        });

        await newForm.update({ contribution_id: newContribution.id });
      }

      return res.status(201).json({
        message: 'Form created successfully',
        formId: newForm.id,
        donatorId: donatorId
      });
    });
  } catch (error) {
    console.error('Error creating form:', error);
    return res.status(500).json({
      message: 'Failed to create form',
      error: error.message
    });
  }
};

// Remaining controller functions unchanged...

export const getAllForms = async (req, res) => {
  try {
    const forms = await Form.findAll({
      include: [
        {
          model: Donator,
        },
        {
          model: ContributionType,
        },
      ],
    });

    return res.status(200).json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return res.status(500).json({
      message: 'Failed to fetch forms',
      error: error.message,
    });
  }
};

export const updateFormStatus = async (req, res) => {
  try {
    const { id } = req.params; // Form ID
    const { status } = req.body; // New status (e.g., "accepted" or "rejected")

    // Find the form by ID
    const form = await Form.findByPk(id, {
      include: ContributionType, // Include the related ContributionType
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Update the form's status and updated_at timestamp
    await form.update({
      accession_status: status,
      updated_at: new Date(), // Update the timestamp
    });

    // Optionally, update the ContributionType status if needed
    if (form.ContributionType) {
      await form.ContributionType.update({
        status: status, // Sync the status with the form
      });
    }

    return res.status(200).json({
      message: `Form status updated to ${status} successfully`,
      form,
    });
  } catch (error) {
    console.error('Error updating form status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateFormTimestamp = async (req, res) => {
  try {
    const { id } = req.params; // Get the form ID from the request parameters

    // Find the form by ID
    const form = await Form.findByPk(id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Update the `updated_at` field
    await form.update({
      updated_at: new Date(),
    });

    return res.status(200).json({
      message: 'Form timestamp updated successfully',
      form,
    });
  } catch (error) {
    console.error('Error updating form timestamp:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to update transfer status
export const updateTransferStatus = async (req, res) => {
  const { id } = req.params; // Get the form ID from the request parameters
  const { transfer_status } = req.body; // Get the new transfer status from the request body

  try {
    // Find the form by ID and include the associated ContributionType
    const form = await Form.findByPk(id, {
      include: ContributionType, // Include the related ContributionType
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Check if the form has an associated ContributionType
    if (!form.ContributionType) {
      return res.status(404).json({ message: 'ContributionType not found for this form' });
    }

    // Update the transfer_status of the associated ContributionType
    await form.ContributionType.update({ transfer_status });

    res.status(200).json({ message: 'Transfer status updated successfully', form });
  } catch (error) {
    console.error('Error updating transfer status:', error);
    res.status(500).json({ message: 'Failed to update transfer status', error });
  }
};
// Add this new controller function
export const sendFormStatusEmail = async (req, res) => {
  try {
    const { id } = req.params;  // Form ID
    const { status, message } = req.body;  // Status and email message

    // Validate the message
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email message cannot be empty'
      });
    }

    // Find the form with the donator information
    const form = await Form.findByPk(id, {
      include: [
        { model: Donator },
        { model: ContributionType }
      ]
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Create a professional email based on status
    const statusAction = status === 'accepted' ? 'Approved' : 'Rejected';
    const emailSubject = `${statusAction}: Your Artifact Submission - ${form.artifact_name}`;

    // Create HTML content for email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Artifact ${statusAction}</h2>
        <p>Dear ${form.Donator.name},</p>
        <p>We are writing to inform you about your submitted artifact "${form.artifact_name}".</p>
        <div style="padding: 15px; background-color: ${status === 'accepted' ? '#e8f5e9' : '#ffebee'}; border-radius: 5px; margin: 20px 0;">
          <p style="font-weight: bold; color: ${status === 'accepted' ? '#2e7d32' : '#c62828'};">
            Status: ${statusAction}
          </p>
          <p>Message from our team:</p>
          <blockquote style="border-left: 3px solid #ccc; padding-left: 15px; font-style: italic;">
            ${message}
          </blockquote>
        </div>
        <p>
          ${status === 'accepted' 
            ? 'We will be in touch with you shortly to coordinate the next steps for your artifact.'
            : 'Thank you for your interest in contributing to our collection.'}
        </p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>Museum Collection Management Team</p>
      </div>
    `;

    // Send the email using the existing emailTransporter
    const emailResult = await sendEmail({
      from: 'museobulawanmis@gmail.com',
      to: form.Donator.email,
      subject: emailSubject,
      html: htmlContent
    });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: emailResult.error
      });
    }

    // If email was sent successfully, update the form status
    await form.update({
      accession_status: status,
      updated_at: new Date()
    });

    // Update ContributionType status
    if (form.ContributionType) {
      await form.ContributionType.update({
        status: status
      });

      // If rejected, set transfer status to Failed
      if (status === 'rejected') {
        await form.ContributionType.update({
          transfer_status: 'Failed'
        });
      } else if (status === 'accepted') {
        await form.ContributionType.update({
          transfer_status: 'On Progress'
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent and status updated successfully'
    });
    
  } catch (error) {
    console.error('Error sending status email:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};