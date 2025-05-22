const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Check if API key is available
if (!process.env.OPENROUTER_API_KEY) {
  console.error('ERROR: OPENROUTER_API_KEY environment variable is not set');
  process.exit(1);
}

// Import API routes
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// For any other route, serve the index.html file (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});
