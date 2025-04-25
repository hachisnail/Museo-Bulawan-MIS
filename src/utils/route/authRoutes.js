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
  getVisitorRecords,getAttendanceDetail,getVisitorRecordDetail 
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
import { logAction, fetchLog } from '../controller/LogService.js';
import { createArticle, upload, getAllArticles} from '../controller/articleController.js';
import multer from 'multer';



const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);

router.get('/fetchUsers', autoLogout, displayUsers);
router.get('/fetchUser/:id', autoLogout, displaySpecificUser);
router.get('/fetchCredential', autoLogout, fetchCredential);
router.get('/login-logs/:userId', autoLogout, getUserLoginLogs);

router.post('/appointment', createAppointment, logAction('create','Appointment'));
router.get('/appointment', autoLogout, getAllAppointments);
router.patch('/appointment/:id/status', autoLogout, updateAppointmentStatus);
router.get('/appointment/stats', autoLogout, getAppointmentStats);
router.get('/attendance', autoLogout, getAttendanceData);
router.get('/visitor-records', autoLogout, getVisitorRecords);

router.get('/attendance/:id', autoLogout, getAttendanceDetail);

// Get visitor record detail by visitor ID and appointment ID
router.get('/visitor-record/:visitorId/:appointmentId', autoLogout, getVisitorRecordDetail);


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


router.get('/articles', autoLogout, getAllArticles);
  
router.post('/article', (req, res, next) => {
  upload.single('thumbnail')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer-specific error occurred
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Max size is 5MB.' });
      }
      return res.status(500).json({ message: 'Multer error.', error: err.message });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: 'Unexpected error.', error: err.message });
    }
    // If everything went fine, proceed to controller
    next();
  });
}, createArticle);


export default router;
