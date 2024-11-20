const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware for parsing JSON
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

// Loggly configuration
const LOGGLY_TOKEN = 'a8dd9373-27c2-4457-b0cd-5b4a7d19e272'; // Replace with your Loggly token
const LOGGLY_URL = `https://logs-01.loggly.com/inputs/${LOGGLY_TOKEN}/tag/http/`;

// Catch-all route for debugging
app.all('*', (req, res, next) => {
    console.log('Catch-all route triggered:');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    next(); // Pass the request to the next route if this isn't /api/hook/listen
});

// Primary route
app.all('/api/hook/listen', (req, res) => {
    console.log('Received request at /api/hook/listen');

    // Extract log data
    const logData = {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        url: req.url,
        timestamp: new Date().toISOString()
    };

    console.log('Log data:', logData); // Log to the console for debugging

    // Send log data to Loggly
    axios.post(LOGGLY_URL, logData)
        .then(response => {
            console.log('Log sent to Loggly:', response.data);
            res.status(200).send('Request logged successfully.');
        })
        .catch(error => {
            console.error('Failed to send log to Loggly:', error.message);
            res.status(500).send('Failed to log request.');
        });
});

// Fallback route for unhandled paths
app.all('*', (req, res) => {
    res.status(404).send('Route not found.');
});

module.exports = app;
