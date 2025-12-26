const Application = require('../models/Application');
const JobPosting = require('../models/JobPosting');

// @route   POST api/applications
// @desc    Apply for a job
// @access  Private (Seeker)
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, coverLetter, screeningAnswers } = req.body;

        // Check if job exists
        const job = await JobPosting.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            job: jobId,
            applicant: req.user.id,
            recruiter: job.recruiter,
            coverLetter,
            screeningAnswers,
            timeline: [{ status: 'Applied' }]
        });

        await newApplication.save();

        // Increment applicant count
        job.applicantsCount += 1;
        await job.save();

        res.json(newApplication);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/applications/my-applications
// @desc    Get all applications for the logged-in seeker
// @access  Private (Seeker)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title company location type salaryRange status')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
