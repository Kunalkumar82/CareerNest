const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Updated path if needed, check existing
const { createJob, getMyJobs, getAllJobs } = require('../controllers/jobPostingController');

// Recruiter Routes
router.post('/', auth, createJob);
router.get('/my-jobs', auth, getMyJobs);

// Public/Seeker Routes
router.get('/feed', getAllJobs);

module.exports = router;
