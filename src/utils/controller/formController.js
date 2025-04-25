// controller/formController.js

import Donator from '../models/Donator.js';
import Form from '../models/Form.js';
import ContributionType from '../models/ContributionType.js';

export const createForm = async (req, res) => {
  try {
    // 1) Check if a Donator with the same firstname, lastname, and email already exists
    const existingDonator = await Donator.findOne({
      where: {
        name: `${req.body.first_name} ${req.body.last_name}`.trim(),
        email: req.body.email
      }
    });

    let donatorId;

    if (existingDonator) {
      // If the donator exists, use their ID
      donatorId = existingDonator.id;
    } else {
      // If the donator does not exist, create a new one
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

    // 2) Create the Form
    const newForm = await Form.create({
      donator_id: donatorId,
      artifact_name: req.body.artifact_name,
      description: req.body.description,
      acquired: req.body.acquired,
      additional_info: req.body.additional_info,
      narrative: req.body.narrative,
      images: req.body.images,
      documents: req.body.documents,
      related_images: req.body.related_images,
      donation_date: new Date(),
      accession_status: 'Pending',
      user_id: 1 // Replace with actual user ID from authentication if needed
    });

    // 3) Optionally Create a ContributionType
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
  } catch (error) {
    console.error('Error creating form:', error);
    return res.status(500).json({
      message: 'Failed to create form',
      error: error.message
    });
  }
};

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

    return res.status(200).json(forms); // Ensure this returns the updated_at field
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


