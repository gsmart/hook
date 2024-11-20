const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Middleware for parsing incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3600;

// Ensure logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Route to handle requests
app.all('/hook/listen', (req, res) => {
    const timestamp = new Date();
    const fileName = `log_${timestamp.getDate()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${timestamp.getFullYear()}${timestamp.getHours()}${timestamp.getMinutes()}${timestamp.getSeconds()}.txt`;
    const logFilePath = path.join(logsDir, fileName);

    const logData = {
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        url: req.url,
        timestamp: timestamp.toISOString()
    };

    // Write request data to a log file
    fs.writeFile(logFilePath, JSON.stringify(logData, null, 2), (err) => {
        if (err) {
            console.error(`Failed to write log file: ${err.message}`);
            return res.status(500).send('Internal Server Error');
        }
        console.log(`Log saved to ${fileName}`);
        res.send('Request logged successfully.');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/hook/listen`);
});
