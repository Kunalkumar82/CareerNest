const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled Template'
    },
    subject: {
        type: String,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    usageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
