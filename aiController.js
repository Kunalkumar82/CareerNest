const aiService = require('../services/aiService');

const analyzeResume = async (req, res) => {
    const { resumeText, jobDescription } = req.body;
    try {
        const result = await aiService.generateResumeFeedback(resumeText, jobDescription);
        res.json(result);
    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ message: err.message || 'AI Analysis Failed' });
    }
};



const generateInterviewQuestions = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const questions = await aiService.generateInterviewQuestions(jobDescription);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const analyzeInterviewAnswer = async (req, res) => {
    try {
        const { question, userAnswer, jobDescription } = req.body;
        const result = await aiService.analyzeInterviewAnswer(question, userAnswer, jobDescription);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fs = require('fs');

const analyzeVoiceAnswer = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file uploaded' });
        }

        const { question, jobDescription } = req.body;

        // 1. Transcribe
        const transcription = await aiService.transcribeAudio(req.file.path);

        // 2. Analyze the transcribed text
        const analysis = await aiService.analyzeInterviewAnswer(question, transcription, jobDescription);

        // 3. Cleanup: Delete uploaded file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting audio file:", err);
        });

        // 4. Return combined result
        res.json({
            transcription,
            ...analysis
        });

    } catch (error) {
        // Cleanup on error too
        if (req.file) {
            fs.unlink(req.file.path, (err) => { if (err) console.error("Error deleting audio file:", err) });
        }
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    analyzeResume,

    generateInterviewQuestions,
    analyzeInterviewAnswer,
    analyzeVoiceAnswer,

};
