// Local development server that handles API routes
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_PORT_ATTEMPTS = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Spawn local auth server is running'
  });
});

// Admin authentication endpoint
app.post('/api/auth', (req, res) => {
  try {
    const { password } = req.body;
    
    // Get password from environment variable (without VITE_ prefix)
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Validate password
    if (password === adminPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to try starting the server on different ports if needed
function startServer(port, maxAttempts) {
  const server = app.listen(port, () => {
    console.log(`Local auth server running at http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`  - GET  /api/v1/health`);
    console.log(`  - POST /api/auth`);
    console.log(`Note: Activity invite APIs will use the production backend.`);
    
    // Write the actual port to a file for Vite to read
    fs.writeFileSync('./.api-port', port.toString());
    
    // Set environment variable for the actual port
    process.env.ACTUAL_API_PORT = port.toString();
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && maxAttempts > 0) {
      console.warn(`Port ${port} is in use, trying port ${port + 1}`);
      startServer(port + 1, maxAttempts - 1);
    } else {
      console.error('Failed to start server:', error.message);
      process.exit(1);
    }
  });
}

// Start the server with retry mechanism
startServer(PORT, MAX_PORT_ATTEMPTS);