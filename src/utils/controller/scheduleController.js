// controllers/scheduleController.js

import Schedule from '../models/Schedule.js';
import { Op } from 'sequelize';

/**
 * Create a new schedule
 */
export const createSchedule = async (req, res) => {
  try {
    // Extract data from request body
    const { title, description, date, start_time, end_time, availability } = req.body;

    // Validate required fields
    if (!title || !date || !start_time || !end_time) {
      return res.status(400).json({
        message: 'Missing required fields: title, date, start_time, end_time'
      });
    }

    // Optional: Validate time (ensure start_time is before end_time)
    if (start_time >= end_time) {
      return res.status(400).json({
        message: 'start_time must be earlier than end_time'
      });
    }

    // Create schedule entry
    const schedule = await Schedule.create({
      title,
      description, // Optional field
      date,
      start_time,
      end_time,
      availability: availability || 'SHARED', // Default to 'SHARED' if not provided
    });

    // Return success response with created schedule
    return res.status(201).json({
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({
      message: 'Server error creating schedule',
      error: error.message
    });
  }
};

/**
 * Get schedules with optional date filtering
 */
export const getSchedules = async (req, res) => {
  try {
    // Extract date from query parameters if provided
    const { date } = req.query;

    // Build where clause
    let whereClause = {};
    if (date) {
      whereClause.date = date;
    }

    // Fetch schedules from database
    const schedules = await Schedule.findAll({
      where: whereClause,
      order: [
        ['date', 'ASC'],
        ['start_time', 'ASC']
      ]
    });

    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({
      message: 'Server error fetching schedules',
      error: error.message
    });
  }
};

/**
 * Get schedule by ID
 */
export const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ 
        message: 'Schedule not found' 
      });
    }
    
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error fetching schedule by ID:', error);
    return res.status(500).json({
      message: 'Server error fetching schedule',
      error: error.message
    });
  }
};

/**
 * Update a schedule
 */
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, start_time, end_time, availability } = req.body;
    
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ 
        message: 'Schedule not found' 
      });
    }
    
    // Update the schedule
    await schedule.update({
      title: title || schedule.title,
      description: description !== undefined ? description : schedule.description,
      date: date || schedule.date,
      start_time: start_time || schedule.start_time,
      end_time: end_time || schedule.end_time,
      availability: availability || schedule.availability,
    });
    
    return res.status(200).json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({
      message: 'Server error updating schedule',
      error: error.message
    });
  }
};

/**
 * Delete a schedule
 */
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const schedule = await Schedule.findByPk(id);
    
    if (!schedule) {
      return res.status(404).json({ 
        message: 'Schedule not found' 
      });
    }
    
    // Delete the schedule
    await schedule.destroy();
    
    return res.status(200).json({
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({
      message: 'Server error deleting schedule',
      error: error.message
    });
  }
};
