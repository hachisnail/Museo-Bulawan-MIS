// routes/authRoutes.js

import express from 'express';
import { login, logout, autoLogout, refreshToken, verifyCookie } from '../controller/authController.js';
import { displayUsers, displaySpecificUser, getUserLoginLogs, fetchCredential } from '../controller/userController.js';
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

import{
  createForm,
  getAllForms,
  updateFormStatus,
  updateFormTimestamp,
  updateTransferStatus
} from '../controller/formController.js';

import { logAction, fetchLog } from '../controller/LogService.js';
import { createArticle, upload, getAllArticles, getPublicArticles, getPublicArticle} from '../controller/articleController.js';
import multer from 'multer';
import { 
  createSchedule, 
  getSchedules, 
  getScheduleById, 
  updateSchedule, 
  deleteSchedule 
} from '../controller/scheduleController.js';





const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

router.get('/fetchUsers', autoLogout, displayUsers);
router.get('/fetchUser/:id', autoLogout, displaySpecificUser);
router.get('/fetchCredential', autoLogout, fetchCredential);
router.get('/login-logs/:userId', autoLogout, getUserLoginLogs);

// appointments routes #rhettrina
router.post('/appointment', createAppointment, logAction('create','Appointment'));
router.get('/appointment', autoLogout, getAllAppointments);
router.patch('/appointment/:id/status', autoLogout, updateAppointmentStatus);
router.get('/appointment/stats', autoLogout, getAppointmentStats);
router.get('/attendance', autoLogout, getAttendanceData);
router.get('/visitor-records', autoLogout, getVisitorRecords);
router.get('/attendance/:id', autoLogout, getAttendanceDetail);
router.get('/visitor-record/:visitorId/:appointmentId', autoLogout, getVisitorRecordDetail);
router.post('/send-email-notification', autoLogout, sendEmailNotification);

// Schedule routes
router.post('/schedules', autoLogout, createSchedule, logAction('create', 'Schedule'));
router.get('/schedules', autoLogout, getSchedules);
router.get('/schedules/:id', autoLogout, getScheduleById);
router.put('/schedules/:id', autoLogout, updateSchedule, logAction('update', 'Schedule'));
router.delete('/schedules/:id', autoLogout, deleteSchedule, logAction('delete', 'Schedule'));


router.get('/fetchLogs', autoLogout, fetchLog);
router.get('/refresh-token', refreshToken);
router.get('/verify-cookie', verifyCookie);

// Invitation endpoints
router.post('/invitations', autoLogout, sendInvitation, logAction('create', 'Invitation'));
router.get('/invitations', autoLogout, getPendingInvitations);
router.post('/invitations/:id/resend', autoLogout, resendInvitation, logAction('update', 'Invitation'));
router.delete('/invitations/:id', autoLogout, revokeInvitation, logAction('delete', 'Invitation'));

// Registration completion endpoints
router.get('/complete-registration/:token', renderCompleteRegistration);
router.post('/complete-registration/:token', completeRegistration, logAction('create', 'Credential'));
router.get('/registration-success', registrationSuccess);

//Acquisition 
router.post('/form', createForm);     // existing route for creating a form
router.get('/form', autoLogout, getAllForms);  // new route for fetching all forms
router.put('/form/:id/status', updateFormStatus);
router.put('/form/:id/timestamp', updateFormTimestamp);
router.put('/form/:id/transfer_status', updateTransferStatus); // New route for updating transfer status


router.get('/articles', autoLogout, getAllArticles);
  
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

router.get('/public-articles', getPublicArticles);
router.get('/public-article/:id', getPublicArticle);


export default router;
