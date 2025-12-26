const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String, // e.g., Recruiter, Hiring Manager, Peer, Referrer
        default: 'Recruiter'
    },
    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    linkedJob: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job' // Link to a specific job application
    },
    lastContacted: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Responded', 'Ghosted', 'Meeting Scheduled'],
        default: 'New'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
