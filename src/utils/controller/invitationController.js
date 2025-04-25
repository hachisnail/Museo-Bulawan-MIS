import Invitation from '../models/Invitation.js';
import User from '../models/Users.js';
import Credential from '../models/Credential.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { sequelize } from '../database.js';
import transporter, { sendEmail } from '../emailTransporter.js';


const formatInvitation = (invitation) => {
  return {
    id: invitation.id,
    email: invitation.email,
    first_name: invitation.first_name,
    last_name: invitation.last_name,
    contact_number: invitation.contact_number || '',
    role: invitation.role,
    position: invitation.position,
    expiresAt: invitation.expiresAt,
    isUsed: invitation.isUsed,
    createdAt: invitation.createdAt,
    deletedAt: invitation.deletedAt
  };
};

export const sendInvitation = async (req, res, next) => {
  console.log('Received invitation request:', req.body);

  try {
    const { first_name, last_name, email, role, position, contact_number } = req.body;

    if (!first_name || !last_name || !email || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingCredential = await Credential.findOne({ where: { email } });
    if (existingCredential) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const existingInvitation = await Invitation.findOne({
      where: {
        email,
        isUsed: false,
        expiresAt: { [sequelize.Sequelize.Op.gt]: new Date() },
      }
    });

    if (existingInvitation) {
      return res.status(400).json({ message: 'Pending invitation already exists' });
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    let invitation;
    try {
      invitation = await Invitation.create({
        email,
        first_name,
        last_name,
        contact_number: contact_number || null,
        token,
        expiresAt,
        role,
        position: position || null
      });
    
      console.log('Invitation created:', invitation);
    
      req.logDetails = {
        new: invitation.dataValues,
        message: `An invitation was created and added to the Invitation table`
      };
    
      res.locals.newRecordId = invitation.id;
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(400).json({
        new: invitation,
        message: 'Invalid data provided',
        details: dbError.message
      });
    }
    
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5000';
    const inviteUrl = `${protocol}://${host}/api/auth/complete-registration/${token}`;

    if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAILS === 'true') {
      console.log('Development email skip:', email);
      return res.status(201).json({
        message: 'Invitation created (email skipped)',
        invitation: formatInvitation(invitation)
      });
    }

    try {
      const emailHtml = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
            <h2 style="color: #6F3FFF;">You're Invited to Museo Bulawan</h2>
            <p>Hello <strong>${first_name}</strong>,</p>
            <p>You have been invited to join <strong>Museo Bulawan</strong> as a <strong>${role}</strong>.</p>
            <p>Please click the button below to complete your registration:</p>
            <a href="${inviteUrl}" style="display: inline-block; padding: 12px 20px; background-color: #6F3FFF; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Complete Registration</a>
            <p style="margin-top: 30px; font-size: 14px; color: #777;">This invitation will expire on <strong>${expiresAt.toDateString()}</strong>.</p>
          </div>
        </div>
      `;

      // Using the sendEmail helper function
      const emailResult = await sendEmail({
        from: '"Museo Bulawan" <museobulawanmis@gmail.com>',
        to: email,
        subject: 'Invitation to join Museo Bulawan',
        html: emailHtml
      });

      if (!emailResult.success) {
        return res.status(201).json({
          message: 'Invitation created but email failed',
          invitation: formatInvitation(invitation)
        });
      }
      
      next();
      return res.status(201).json({
        message: 'Invitation sent',
        invitation: formatInvitation(invitation)
      });
    } catch (emailError) {
      return res.status(201).json({
        message: 'Invitation created but email failed',
        invitation: formatInvitation(invitation)
      });
    }

  } catch (error) {
    console.error('Unhandled Error:', error);
    return res.status(500).json({ message: 'Server error', details: error.message });
  }
};

// Get pending invitations
export const getPendingInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.findAll({
      where: {
        isUsed: false,
        expiresAt: { [sequelize.Sequelize.Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(invitations.map(formatInvitation));
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invitation = await Invitation.findByPk(id);

    if (!invitation) return res.status(404).json({ message: 'Not found' });
    if (invitation.isUsed) return res.status(400).json({ message: 'Already used' });

    const previousState = invitation.toJSON();

    // Update token and expiry
    invitation.token = uuidv4();
    invitation.expiresAt = new Date();
    invitation.expiresAt.setDate(invitation.expiresAt.getDate() + 7);
    await invitation.save();

    const newState = invitation.toJSON();
    const invitationId = invitation.id;

    // Store for logging middleware
    req.logDetails = {
      previous: previousState,
      new: newState,
      message:`Invitation with ID ${invitationId} was resent and updated in the Invitation table`
    };
    res.locals.newRecordId = invitation.id;

    const inviteUrl = `${req.protocol}://${req.get('host')}/api/auth/complete-registration/${invitation.token}`;

    // Using the sendEmail helper function
    const emailResult = await sendEmail({
      from: '"Museo Bulawan" <museobulawanmis@gmail.com>',
      to: invitation.email,
      subject: 'Invitation Reminder',
      html: `<p>Reminder invitation for ${invitation.first_name}.</p><a href="${inviteUrl}">${inviteUrl}</a>`
    });

    if (!emailResult.success) {
      return res.status(500).json({ message: 'Email failed' });
    }
    
    res.json({ message: 'Invitation resent' });
    next();

  } catch (error) {
    console.error('Resend Invitation Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const revokeInvitation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invitation = await Invitation.findByPk(id);

    if (!invitation) return res.status(404).json({ message: 'Not found' });

    const previousState = invitation.toJSON();

    await invitation.destroy(); // Hard delete

    req.logDetails = {
      previous: previousState,
      message: `Invitation with ID ${id} was hard deleted from the Invitation table`
    };

    res.locals.newRecordId = id;

    res.json({ message: 'Invitation permanently deleted' });
    next();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const renderCompleteRegistration = async (req, res) => {
  try {
    const { token } = req.params;
    
    const invitation = await Invitation.findOne({ 
      where: { 
        token,
        isUsed: false,
        expiresAt: { [sequelize.Sequelize.Op.gt]: new Date() }
      }
    });
    
    if (!invitation) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Invalid Invitation</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
              .error { color: #ff0000; }
            </style>
          </head>
          <body>
            <h1 class="error">Invalid or Expired Invitation</h1>
            <p>The invitation link you accessed is invalid or has expired.</p>
            <p>Please contact your administrator for a new invitation.</p>
          </body>
        </html>
      `);
    }
    
    // Send the registration form
    res.send(`
     <html>
  <head>
    <title>Complete Registration</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background: #f4f4f9;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .form-container {
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0,0,0,0.1);
        max-width: 500px;
        width: 100%;
      }
      h1 {
        margin-bottom: 20px;
        color: #6F3FFF;
        text-align: center;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        font-weight: 600;
        margin-bottom: 5px;
      }
      input {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ccc;
      }
      button {
        width: 100%;
        padding: 12px;
        background: #6F3FFF;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 10px;
      }
      .error {
        color: red;
        margin-top: 10px;
        text-align: center;
        display: none;
      }
    </style>
  </head>
  <body>
    <div class="form-container">
      <h1>Complete Your Registration</h1>
      <p>Hello ${invitation.first_name}, please set your password below:</p>
      <form id="registrationForm">
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required minlength="8" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required minlength="8" />
        </div>
        <button type="submit">Submit</button>
        <div id="error" class="error"></div>
      </form>
    </div>

    <script>
      document.getElementById('registrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('error');
        
        if (password !== confirmPassword) {
          errorDiv.textContent = "Passwords do not match.";
          errorDiv.style.display = "block";
          return;
        }

        try {
          const response = await fetch('/api/auth/complete-registration/${token}', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
          });

          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error completing registration');
          } else if (!response.ok) {
            throw new Error("Unexpected server response. Please try again.");
          }

          window.location.href = '/api/auth/registration-success';
        } catch (error) {
          errorDiv.textContent = error.message;
          errorDiv.style.display = "block";
        }
      });
    </script>
  </body>
</html>
    `);
    
  } catch (error) {
    console.error('Error rendering registration form:', error);
    res.status(500).send('Server error. Please try again later.');
  }
};

export const completeRegistration = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const invitation = await Invitation.findOne({ 
      where: { 
        token,
        isUsed: false,
        expiresAt: { [sequelize.Sequelize.Op.gt]: new Date() }
      }
    });

    if (!invitation) {
      return res.status(400).json({ message: 'Invalid or expired invitation' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const credential = await Credential.create({
      first_name: invitation.first_name,
      last_name: invitation.last_name,
      email: invitation.email,
      password: hashedPassword,
      role: invitation.role,
      position: invitation.position,
      contact_number: invitation.contact_number
    });

    await User.create({
      status: 'inactive',
      credential_id: credential.id
    });

    invitation.isUsed = true;
    await invitation.save();

    // Set data for the logging middleware
    req.logDetails = {
      new: credential.dataValues,
      message: `User ${credential.email} has successfully completed registration.`,
    };
    res.locals.newRecordId = credential.id;

    res.status(200).json({ message: 'Registration completed successfully' });

    return next();

  } catch (error) {
    console.error('Error completing registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const registrationSuccess = (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Registration Successful</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #f4f4f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
          }
          .card h1 {
            color: #4CAF50;
            margin-bottom: 16px;
          }
          .card a {
            color: #6F3FFF;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Registration Successful!</h1>
          <p>Your account has been created successfully.</p>
         
          <p>Return to <a href="http://localhost:5173/login">Login</a></p>
        </div>
      </body>
    </html>
  `);
};
