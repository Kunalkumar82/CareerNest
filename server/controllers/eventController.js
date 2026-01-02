const Event = require('../models/Event');

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id })
            .populate('attendees', 'name role company')
            .sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create event
const createEvent = async (req, res) => {
    const { title, date, location, type, notes, attendees } = req.body;

    try {
        const newEvent = new Event({
            user: req.user.id,
            title,
            date,
            location,
            type,
            notes,
            attendees
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update event
const updateEvent = async (req, res) => {
    const { title, date, location, type, notes, attendees } = req.body;

    const eventFields = {};
    if (title) eventFields.title = title;
    if (date) eventFields.date = date;
    if (location) eventFields.location = location;
    if (type) eventFields.type = type;
    if (notes) eventFields.notes = notes;
    if (attendees) eventFields.attendees = attendees;

    try {
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true }
        ).populate('attendees', 'name role company');

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};
