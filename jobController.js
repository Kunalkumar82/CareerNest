const Job = require('../models/Job');

// Get all jobs for the logged-in user
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });

        // Add "isStalled" flag dynamically
        const enhancedJobs = jobs.map(job => {
            const lastUpdate = new Date(job.updatedAt || job.createdAt);
            const daysSinceUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);
            return {
                ...job.toObject(),
                isStalled: daysSinceUpdate >= 14 && job.status === 'Applied' // Only flag if still 'Applied'
            };
        });

        res.json(enhancedJobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new job for the logged-in user
exports.createJob = async (req, res) => {
    const { company, position, status, dateApplied, followUpDate, notes } = req.body;
    try {
        const newJob = new Job({
            company,
            position,
            status,
            dateApplied,
            followUpDate,
            notes,
            user: req.user.id
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a job
exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
