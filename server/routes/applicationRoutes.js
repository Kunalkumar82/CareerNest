const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { applyForJob, getMyApplications } = require('../controllers/applicationController');

router.post('/', auth, applyForJob);
router.get('/my-applications', auth, getMyApplications);

module.exports = router;
