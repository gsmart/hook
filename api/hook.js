const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Loggly configuration
const LOGGLY_TOKEN = 'a8dd9373-27c2-4457-b0cd-5b4a7d19e272'; // Replace with your Loggly token
const LOGGLY_URL = `https://logs-01.loggly.com/inputs/${LOGGLY_TOKEN}/tag/http/`;

app.all('/api/hook/listen', (req, res) => {
    const logData = {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        url: req.url,
        timestamp: new Date().toISOString()
    };

    // Send log data to Loggly
    axios.post(LOGGLY_URL, logData)
        .then(response => {
            console.log('Log sent to Loggly:', response.data);
            res.send('Request logged successfully.');
        })
        .catch(error => {
            console.error('Failed to send log to Loggly:', error.message);
            res.status(500).send('Failed to log request.');
        });
});

module.exports = app;
