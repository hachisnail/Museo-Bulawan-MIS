import express from 'express';
import { login,
  logout, 
  auth, 
  refreshToken, 
  verifyCookie, 
  sessionStatus,
  getUserProfile 
} from '../controller/authController.js';
import { displayUsers, 
  displaySpecificUser, 
  getUserLoginLogs, 
  fetchCredential 
} from '../controller/userController.js';
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getAppointmentStats,
  getAttendanceData,
  getVisitorRecords,
  getAttendanceDetail,
  getVisitorRecordDetail,
  sendEmailNotification
} from '../controller/appointmentController.js';
import {
  sendInvitation,
  getPendingInvitations,
  resendInvitation,
  revokeInvitation,
  renderCompleteRegistration,
  completeRegistration,
  registrationSuccess
} from '../controller/invitationController.js';

import {
  createForm,
  getAllForms,
  updateFormStatus,
  updateFormTimestamp,
  updateTransferStatus,
  sendFormStatusEmail
} from '../controller/formController.js';

import { logAction, fetchLog } from '../controller/LogService.js';
import {
  createArticle,
  upload,
  getAllArticles,
  getPublicArticles,
  getPublicArticle,
  uploadContentImages,
  updateArticle
} from '../controller/articleController.js';
import multer from 'multer';
import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  updateScheduleStatus
} from '../controller/scheduleController.js';

import { 
  createArtifact,
  getAllArtifacts,
  getDeletedArtifacts,
  getArtifactById,
  softDeleteArtifact,
  restoreArtifact,
  hardDeleteArtifact,
  updateArtifact,
  batchSoftDelete,
  batchRestore,
  batchHardDelete,
  removeArtifactFile
} from '../controller/artifactController.js';


const router = express.Router();


// Authentication
router.post('/login', login);
router.post('/logout', auth, logout);
router.get('/refresh-token', refreshToken);
router.get('/verify-cookie', verifyCookie);
router.get('/session-status', auth, sessionStatus);
router.post('/refresh-token', refreshToken);
router.get('/profile', auth, getUserProfile);

router.get('/fetchUsers', auth, displayUsers);
router.get('/fetchUser/:id', auth, displaySpecificUser);
router.get('/fetchCredential', auth, fetchCredential);
router.get('/login-logs/:userId', auth, getUserLoginLogs);

// Appointments
router.post('/appointment', createAppointment, logAction('create', 'Appointment'));
router.get('/appointment', auth, getAllAppointments);
router.patch('/appointment/:id/status', auth, updateAppointmentStatus);
router.get('/appointment/stats', auth, getAppointmentStats);
router.get('/attendance', auth, getAttendanceData);
router.get('/visitor-records', auth, getVisitorRecords);
router.get('/attendance/:id', auth, getAttendanceDetail);
router.get('/visitor-record/:visitorId/:appointmentId', auth, getVisitorRecordDetail);
router.post('/send-email-notification', auth, sendEmailNotification);

// Schedules
router.post('/schedules', auth, createSchedule, logAction('create', 'Schedule'));
router.get('/schedules', getSchedules);
router.get('/schedules/:id', auth, getScheduleById);
router.put('/schedules/:id', auth, updateSchedule, logAction('update', 'Schedule'));
router.delete('/schedules/:id', auth, deleteSchedule, logAction('delete', 'Schedule'));
router.patch('/schedules/:id/status', auth, updateScheduleStatus, logAction('update', 'ScheduleStatus'));

router.get('/fetchLogs', auth, fetchLog);

// Invitations
router.post('/invitations', auth, sendInvitation, logAction('create', 'Invitation'));
router.get('/invitations', auth, getPendingInvitations);
router.post('/invitations/:id/resend', auth, resendInvitation, logAction('update', 'Invitation'));
router.delete('/invitations/:id', auth, revokeInvitation, logAction('delete', 'Invitation'));
router.get('/complete-registration/:token', renderCompleteRegistration);
router.post('/complete-registration/:token', completeRegistration, logAction('create', 'Credential'));
router.get('/registration-success', registrationSuccess);

// Acquisition forms
router.post('/form', createForm);
router.get('/form', auth, getAllForms);
router.put('/form/:id/status', updateFormStatus);
router.put('/form/:id/timestamp', updateFormTimestamp);
router.put('/form/:id/transfer_status', updateTransferStatus);
router.post('/form/:id/send-status-email', sendFormStatusEmail);

// Artifact routes
router.post('/artifact', auth, createArtifact, logAction('create', 'Artifact'));
router.get('/artifact', auth, getAllArtifacts);
router.get('/artifact/deleted', auth, getDeletedArtifacts);
router.get('/artifact/:id', auth, getArtifactById);
router.put('/artifact/:id', auth, updateArtifact, logAction('update', 'Artifact'));
router.delete('/artifact/:id', auth, softDeleteArtifact, logAction('delete', 'Artifact'));
router.post('/artifact/:id/restore', auth, restoreArtifact, logAction('restore', 'Artifact'));
router.delete('/artifact/:id/permanent', auth, hardDeleteArtifact, logAction('permanent-delete', 'Artifact'));
router.post('/artifact/:id/remove-file', auth, removeArtifactFile, logAction('update', 'ArtifactFile'));
router.post('/artifact/batch-delete', auth, batchSoftDelete, logAction('batch-delete', 'Artifact'));
router.post('/artifact/batch-restore', auth, batchRestore, logAction('batch-restore', 'Artifact'));
router.post('/artifact/batch-hard-delete', auth, batchHardDelete, logAction('batch-permanent-delete', 'Artifact'));


// Articles
router.get('/articles', auth, getAllArticles);
router.post('/article', (req, res, next) => {
  upload.single('thumbnail')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max size is 5MB.' });
      }
      return res.status(500).json({ message: 'Multer error.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error.', error: err.message });
    }
    next();
  });
}, createArticle);
router.post('/article/content-images', (req, res, next) => {
  upload.array('contentImages', 10)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max size is 5MB.' });
      }
      return res.status(500).json({ message: 'Multer error.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error.', error: err.message });
    }
    next();
  });
}, uploadContentImages);
router.get('/public-articles', getPublicArticles);
router.get('/public-article/:id', getPublicArticle);

// PUT route for updating an article
router.put('/article/:id', (req, res, next) => {
  upload.single('thumbnail')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max size is 5MB.' });
      }
      return res.status(500).json({ message: 'Multer error.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unexpected error.', error: err.message });
    }
    next();
  });
}, updateArticle);


export default router;
