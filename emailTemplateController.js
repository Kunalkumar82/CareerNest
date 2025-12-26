const EmailTemplate = require('../models/EmailTemplate');

// Get all templates for the user
const getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find({ user: req.user.id })
            .sort({ usageCount: -1, updatedAt: -1 }); // Most used/recent first
        res.json(templates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new template
const createTemplate = async (req, res) => {
    const { name, subject, body, tags } = req.body;

    try {
        const newTemplate = new EmailTemplate({
            user: req.user.id,
            name,
            subject,
            body,
            tags
        });

        const template = await newTemplate.save();
        res.json(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a template
const updateTemplate = async (req, res) => {
    const { name, subject, body, tags } = req.body;

    // Build object
    const templateFields = {};
    if (name) templateFields.name = name;
    if (subject) templateFields.subject = subject;
    if (body) templateFields.body = body;
    if (tags) templateFields.tags = tags;

    try {
        let template = await EmailTemplate.findById(req.params.id);

        if (!template) return res.status(404).json({ msg: 'Template not found' });

        // Ensure user owns template
        if (template.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        template = await EmailTemplate.findByIdAndUpdate(
            req.params.id,
            { $set: templateFields },
            { new: true }
        );

        res.json(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Increment usage count
const incrementUsage = async (req, res) => {
    try {
        let template = await EmailTemplate.findById(req.params.id);
        if (!template) return res.status(404).json({ msg: 'Template not found' });

        if (template.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        template.usageCount += 1;
        await template.save();
        res.json(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a template
const deleteTemplate = async (req, res) => {
    try {
        let template = await EmailTemplate.findById(req.params.id);

        if (!template) return res.status(404).json({ msg: 'Template not found' });

        // Ensure user owns template
        if (template.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await EmailTemplate.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Template removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getTemplates,
    createTemplate,
    updateTemplate,
    incrementUsage,
    deleteTemplate
};
