import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { sequelize } from './database.js';
import authRoutes from './route/authRoutes.js';
import http from 'http';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// Import all models
import User from './models/Users.js'; // Ensure you import the models
import Credential from './models/Credential.js';
import Appointment from './models/Appointment.js';
import Invitation from './models/Invitation.js';
import Log from './models/Log.js';

dotenv.config(); 

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


app.set('trust proxy', process.env.NODE_ENV === 'production');

const corsOptions = {
  origin: process.env.CORS_ORIGIN, 
  credentials: process.env.CORS_CREDENTIALS === 'true', 
  methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: process.env.CORS_ALLOWED_HEADERS ? process.env.CORS_ALLOWED_HEADERS.split(',') : ['Content-Type', 'Authorization'],
};

const JWT_SECRET = process.env.JWT_SECRET || 'hachsinail';

const userConnections = new Map();

const setupModelHooks = () => {
  const models = [User, Credential, Appointment, Invitation, Log];
  
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

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, `wss://${req.headers.host}`).searchParams.get('token');
  
  
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
// app.set('trust proxy', 1);

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.get('/api/auth/currentUser', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json({ id: req.user.id });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', cors(corsOptions), express.static(path.join(__dirname, './utils/assets/uploads')));

app.use(express.static(path.join(__dirname, '../../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

console.log("Serving static files from:", path.join(__dirname, '../dist'));


const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    setupModelHooks();

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`HTTP server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

startServer();
import './cronCleanup.js';