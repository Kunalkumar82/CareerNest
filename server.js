const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job_tracker_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes configuration
// Routes configuration
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const aiRoutes = require('./routes/aiRoutes');
const contactRoutes = require('./routes/contactRoutes');
const emailTemplateRoutes = require('./routes/emailTemplateRoutes');
const eventRoutes = require('./routes/eventRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/email-templates', emailTemplateRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Job Tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Trigger Restart
