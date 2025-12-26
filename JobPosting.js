const mongoose = require('mongoose');

const JobPostingSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String, // De-normalized for easier querying
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        default: 'Full-time'
    },
    salaryRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'INR' }
    },
    experienceRange: {
        min: Number,
        max: Number
    },
    skills: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['Active', 'Closed', 'Draft'],
        default: 'Active'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    screeningQuestions: [{
        question: String,
        type: { type: String, default: 'text' } // text, yes/no
    }],
    applicantsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('JobPosting', JobPostingSchema);
