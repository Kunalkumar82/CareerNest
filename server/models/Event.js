const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    location: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Conference', 'Meetup', 'Social', 'Career Fair', 'Webinar', 'Other'],
        default: 'Meetup'
    },
    notes: {
        type: String
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
