const Contact = require('../models/Contact');
const Job = require('../models/Job');

// Get all contacts for the user
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id })
            .populate('linkedJob', 'role company') // Populate linked job details (role & company)
            .sort({ lastContacted: -1 }); // Most recently contacted first
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new contact
const createContact = async (req, res) => {
    const { name, role, company, email, linkedJob, status, notes, lastContacted } = req.body;

    try {
        const newContact = new Contact({
            user: req.user.id,
            name,
            role,
            company,
            email,
            linkedJob,
            status,
            notes,
            lastContacted
        });

        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a contact
const updateContact = async (req, res) => {
    const { name, role, company, email, linkedJob, status, notes, lastContacted } = req.body;

    // Build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (role) contactFields.role = role;
    if (company) contactFields.company = company;
    if (email) contactFields.email = email;
    if (linkedJob) contactFields.linkedJob = linkedJob;
    if (status) contactFields.status = status;
    if (notes) contactFields.notes = notes;
    if (lastContacted) contactFields.lastContacted = lastContacted;

    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Ensure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true }
        );

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a contact
const deleteContact = async (req, res) => {
    try {
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'Contact not found' });

        // Ensure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Contact removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getContacts,
    createContact,
    updateContact,
    deleteContact
};
