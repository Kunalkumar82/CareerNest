const mongoose = require('mongoose');

const CandidateProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    title: {
        type: String, // e.g. "Senior Frontend Developer"
        default: ''
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    experienceYears: {
        type: Number,
        default: 0
    },
    currentLocation: {
        type: String,
        default: ''
    },
    preferredLocations: {
        type: [String],
        default: []
    },
    completenessScore: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('CandidateProfile', CandidateProfileSchema);
