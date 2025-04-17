import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './database.js';
import authRoutes from './route/authRoutes.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import User from './models/Users.js'; 
import Credential from './models/Credential.js';
import Appointment from './models/Appointment.js';
// Import other models you want to track

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const JWT_SECRET = process.env.JWT_SECRET || 'hachsinail';

// Track connections per user
const userConnections = new Map();

// Database change tracking setup
const setupModelHooks = () => {
  const models = [User, Credential, Appointment];
  
  models.forEach(model => {
    model.addHook('afterCreate', (instance, options) => {
      broadcastDataChange({
        table: model.name,
        action: 'create',
        id: instance.id,
        data: instance.get({ plain: true })
      });
    });

    model.addHook('afterUpdate', (instance, options) => {
      broadcastDataChange({
        table: model.name,
        action: 'update',
        id: instance.id,
        data: instance.get({ plain: true }),
        changes: instance._changed
      });
    });

    model.addHook('afterDestroy', (instance, options) => {
      broadcastDataChange({
        table: model.name,
        action: 'delete',
        id: instance.id
      });
    });
  });
};

const broadcastDataChange = (changeData) => {
  const message = JSON.stringify({
    type: 'data-change',
    ...changeData,
    timestamp: new Date().toISOString()
  });

  let totalSent = 0;
  
  userConnections.forEach((connections) => {
    connections.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
        totalSent++;
      }
    });
  });
  
  console.log(`Broadcasted ${changeData.table} ${changeData.action} to ${totalSent} connections`);
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const token = new URL(req.url, `ws://${req.headers.host}`).searchParams.get('token');
  
  if (!token) {
    ws.close(1008, 'Unauthorized: No token provided');
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    
    console.log(`New client connected for user ${userId}`);
    
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    
    userConnections.get(userId).add(ws);

    ws.on('message', (message) => {
      // console.log(`Received message from user ${userId}:`, message.toString());
      if (message.toString() === 'ping') {
        ws.send('pong');
      }
    });

    ws.on('close', () => {
      // console.log(`Connection closed for user ${userId}`);
      if (userConnections.has(userId)) {
        userConnections.get(userId).delete(ws);
        if (userConnections.get(userId).size === 0) {
          userConnections.delete(userId);
        }
      }
    });

    ws.on('error', (error) => {
      // console.error(`WebSocket error for user ${userId}:`, error);
      if (userConnections.has(userId)) {
        userConnections.get(userId).delete(ws);
      }
    });

    ws.send('ping');

  } catch (err) {
    console.error('WebSocket authentication error:', err);
    ws.close(1008, 'Unauthorized: Invalid token');
  }
});

// Keep existing broadcast functions for compatibility
// export const broadcastUpdate = () => {
//   const message = 'refresh';
//   let totalSent = 0;
  
//   userConnections.forEach((connections) => {
//     connections.forEach(ws => {
//       if (ws.readyState === ws.OPEN) {
//         ws.send(message);
//         totalSent++;
//       }
//     });
//   });
  
//   console.log(`Broadcasted update to ${totalSent} connections`);
// };

// export const broadcastToUser = (userId, message = 'refresh') => {
//   if (!userConnections.has(userId)) {
//     console.log(`No active connections for user ${userId}`);
//     return;
//   }

//   let sentCount = 0;
//   userConnections.get(userId).forEach(ws => {
//     if (ws.readyState === ws.OPEN) {
//       ws.send(message);
//       sentCount++;
//     }
//   });
  
//   console.log(`Sent update to ${sentCount}/${userConnections.get(userId).size} connections for user ${userId}`);
// };

// Express middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();  
    await sequelize.sync();
    setupModelHooks(); // Initialize database change tracking
    console.log('Database connected and models synchronized');
    
    server.listen(5000, () => console.log('Server and WebSocket running on port 5000'));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();