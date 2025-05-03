const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Read hospitals data
const hospitalsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'hospitals.json'), 'utf8'));

/**
 * GET /api/hospitals
 * Returns a list of all hospitals with their tests and services
 */
app.get('/api/hospitals', (req, res) => {
  res.json(hospitalsData.hospitals);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 