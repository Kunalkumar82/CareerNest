const mongoose = require('mongoose');

const RecruiterProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    companyWebsite: {
        type: String
    },
    companyLogo: {
        type: String
    },
    gstNumber: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    credits: {
        type: Number,
        default: 50 // Introductory free credits
    }
}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', RecruiterProfileSchema);
