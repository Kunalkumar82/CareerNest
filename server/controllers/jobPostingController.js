const JobPosting = require('../models/JobPosting');
const RecruiterProfile = require('../models/RecruiterProfile');

// @route   POST api/recruiters/jobs
// @desc    Create a new job posting
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
    try {
        // Ensure user is a Recruiter
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({ msg: 'Access denied. Recruiters only.' });
        }

        const profile = await RecruiterProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ msg: 'Recruiter profile not found' });
        }

        const newJob = new JobPosting({
            recruiter: req.user.id,
            company: profile.companyName,
            ...req.body
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/recruiters/jobs
// @desc    Get all jobs posted by the logged-in recruiter
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await JobPosting.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/jobs (Public Feed)
// @desc    Get all active job postings
// @access  Public
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await JobPosting.find({ status: 'Active' }).sort({ isPremium: -1, createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
