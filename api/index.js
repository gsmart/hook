const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Landing Page!');
});

module.exports = app;
