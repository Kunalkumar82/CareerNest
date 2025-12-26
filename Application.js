const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobPosting',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruiter: { // Denormalized for easier querying by recruiter
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Viewed', 'Shortlisted', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    resumeUrl: {
        type: String
    },
    coverLetter: {
        type: String
    },
    screeningAnswers: [{
        question: String,
        answer: String
    }],
    timeline: [{
        status: String,
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
