const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Sample users (use DB in production)
const users = {
    'user@example.com': 'password123'
};

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    if (users[email] && users[email] === password) {
        req.session.user = { email };
        return res.status(200).json({ message: 'Login successful!' });
    } else {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
});

app.post('/submit-request', (req, res) => {
    const { name, email, location, latitude, longitude, message } = req.body;

    if (!name || !email || !location || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const requestData = {
        name,
        email,
        location,
        latitude,
        longitude,
        message,
        time: new Date().toISOString()
    };

    // Save to file (or replace with DB insert)
    const logFile = path.join(__dirname, 'requests.json');
    const existing = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile)) : [];
    existing.push(requestData);
    fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));

    res.status(200).json({ message: 'Request submitted successfully.' });
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
