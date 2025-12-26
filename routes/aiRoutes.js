const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');

// Configure Multer
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

router.use(authMiddleware);

router.post('/analyze', authMiddleware, aiController.analyzeResume);

router.post('/interview-questions', authMiddleware, aiController.generateInterviewQuestions);
router.post('/interview-answer', authMiddleware, aiController.analyzeInterviewAnswer);
router.post('/voice-answer', authMiddleware, upload.single('audio'), aiController.analyzeVoiceAnswer);


module.exports = router;
