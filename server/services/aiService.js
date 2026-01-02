const natural = require('natural');
const stopword = require('stopword');
const stringSimilarity = require('string-similarity');

// --- Helper Functions ---

const tokenizer = new natural.WordTokenizer();

const preprocessText = (text) => {
    if (!text) return [];
    // 1. Tokenize (split into words)
    const tokens = tokenizer.tokenize(text.toLowerCase());
    // 2. Remove Stopwords (common words like 'the', 'and')
    return stopword.removeStopwords(tokens);
};

const calculateJaccardSimilarity = (setA, setB) => {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return (intersection.size / union.size) * 100;
};

// --- Static Question Bank ---
const QUESTION_BANK = {
    'javascript': [
        "Explain the difference between 'var', 'let', and 'const'.",
        "What is the Event Loop in JavaScript?",
        "Explain the concept of Closures.",
        "What is the difference between '==' and '==='?"
    ],
    'react': [
        "What are React Hooks and why do we use them?",
        "Explain the Virtual DOM.",
        "What is the difference between specific state and props?",
        "How do you handle side effects in React components?"
    ],
    'node': [
        "Explain the concept of middleware in Express.",
        "What is the difference between process.nextTick() and setImmediate()?",
        "How does Node.js handle concurrency?"
    ],
    'python': [
        "What are decorators in Python?",
        "Explain the difference between lists and tuples.",
        "How is memory managed in Python?"
    ],
    'sql': [
        "What is the difference between INNER JOIN and LEFT JOIN?",
        "Explain ACID properties.",
        "How do you optimize a slow query?"
    ],
    'css': [
        "Explain the Box Model.",
        "What is the difference between Flexbox and Grid?",
        "How does CSS specificity work?"
    ],
    'default': [ // General Tech Questions
        "Describe a challenging technical problem you solved recently.",
        "How do you stay updated with the latest technologies?",
        "Explain a project architecture you designed.",
        "How do you handle code reviews?"
    ],
    'behavioral': [
        "Tell me about a time you failed and how you handled it.",
        "Describe a situation where you had a conflict with a colleague.",
        "What is your biggest professional achievement?",
        "How do you prioritize multiple deadlines?",
        "Why do you want to join our company?"
    ]
};

// --- Exported Services ---

const generateResumeFeedback = async (resumeText, jobDescription) => {
    try {
        const resumeTokens = new Set(preprocessText(resumeText));
        const jobTokens = new Set(preprocessText(jobDescription));
        const jobTokensArr = Array.from(jobTokens);

        // 1. Calculate Similarity Score (Jaccard Index)
        // We boost it slightly because purely unique word overlap is harsh
        let matchScore = Math.round(calculateJaccardSimilarity(resumeTokens, jobTokens));

        // Boost score based on keyword coverage (intersection / job_keywords)
        // This is fairer: "How many of the JOB words did I have?" rather than "Do I look exactly like the JD?"
        const intersection = new Set([...resumeTokens].filter(x => jobTokens.has(x)));
        const coverage = (intersection.size / jobTokens.size) * 100;

        // Weighted Score: 70% coverage, 30% Jaccard
        let finalScore = Math.min(100, Math.round((coverage * 0.7) + (matchScore * 0.3) + 20)); // +20 baseline boost

        // 2. Keyword Analysis
        const present = Array.from(intersection);
        const missing = jobTokensArr.filter(x => !resumeTokens.has(x));

        // Filter missing to only "significant" words (simple heuristic: length > 2)
        const significantMissing = missing.filter(w => w.length > 2).slice(0, 10); // Top 10 missing
        const significantPresent = present.filter(w => w.length > 2).slice(0, 10);

        // 3. Feedback Generation
        let feedback = "";
        if (finalScore > 75) {
            feedback = "Excellent match! Your resume covers most of the key requirements found in the job description.";
        } else if (finalScore > 50) {
            feedback = "Good match. You have many of the required skills, but there are some gaps. Consider adding the missing keywords listed below.";
        } else {
            feedback = "Low match. Your resume seems to be missing significant keywords from the job description. Tailor it by including the missing terms.";
        }

        return {
            matchScore: finalScore,
            keywordAnalysis: {
                present: significantPresent,
                missing: significantMissing
            },
            feedback: feedback
        };

    } catch (error) {
        console.error("NLP Analysis Error:", error);
        throw new Error("Failed to analyze resume.");
    }
};

const generateInterviewQuestions = async (jobDescription) => {
    try {
        const jobTokens = preprocessText(jobDescription);
        const uniqueTokens = new Set(jobTokens);

        let technicalQuestions = [];

        // Scan for keywords in our bank
        for (const [key, questions] of Object.entries(QUESTION_BANK)) {
            if (key === 'behavioral' || key === 'default') continue;

            // If the job description contains the technology (e.g., 'react'), add those questions
            if (uniqueTokens.has(key)) {
                technicalQuestions.push(...questions);
            }
        }

        // Fill with default if empty or shuffle/slice
        if (technicalQuestions.length === 0) {
            technicalQuestions = QUESTION_BANK['default'];
        }

        // Shuffle and pick 5
        technicalQuestions = technicalQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

        // Always get 5 random behavioral questions
        const behavioralQuestions = QUESTION_BANK['behavioral'].sort(() => 0.5 - Math.random()).slice(0, 5);

        return {
            technical: technicalQuestions,
            behavioral: behavioralQuestions
        };

    } catch (error) {
        console.error("NLP Question Generation Error:", error);
        throw new Error("Failed to generate questions.");
    }
};

const analyzeInterviewAnswer = async (question, userAnswer, jobDescription) => {
    try {
        if (!userAnswer || userAnswer.trim().length === 0) {
            return {
                score: 0,
                feedback: "Please provide an answer.",
                improvedAnswer: "N/A"
            };
        }

        // 1. Similarity Check
        // Compare answer to the question itself (relevance) + job description (context)
        // This is a naive heuristic: "Does the answer contain words from the context?"
        const contextText = `${question} ${jobDescription}`;
        const similarity = stringSimilarity.compareTwoStrings(userAnswer.toLowerCase(), contextText.toLowerCase());

        // 2. Length Check (Naive "depth" check)
        const wordCount = userAnswer.split(" ").length;
        let lengthScore = Math.min(10, Math.ceil(wordCount / 10)); // Cap at 10 (approx 100 words = max score)

        // 3. Final Score
        // Similarity is usually low (0.2-0.4 for good answers), so we normalize it
        // A similarity of 0.2 is actually decent for Jaccard/Dice in this context
        let relevanceScore = Math.min(10, Math.round(similarity * 20));

        let finalScore = Math.round((lengthScore * 0.4) + (relevanceScore * 0.6));
        finalScore = Math.max(1, Math.min(10, finalScore)); // Clamp 1-10

        // 4. Feedback
        let feedback = "";
        if (finalScore >= 7) {
            feedback = "Great answer! You covered the topic well and included relevant keywords.";
        } else if (finalScore >= 4) {
            feedback = "Decent answer. Try to expand more on the details and use specific terminology from the job description.";
        } else {
            feedback = "Your answer is a bit short or off-topic. Try to use the STAR method (Situation, Task, Action, Result) and include more specific keywords.";
        }

        return {
            score: finalScore,
            feedback: feedback,
            improvedAnswer: "To improve, ensure you directly address the 'Action' you took and the 'Result' you achieved. Use technical terms from the question."
        };

    } catch (error) {
        console.error("NLP Answer Analysis Error:", error);
        throw new Error("Failed to analyze answer.");
    }
};

const transcribeAudio = async (filePath) => {
    console.warn("Audio transcription requires external API. Returning mock.");
    return "This is a simulated transcription. Local NLP cannot transcribe audio without heavy models.";
};

module.exports = {
    generateResumeFeedback,
    generateInterviewQuestions,
    analyzeInterviewAnswer,
    transcribeAudio
};
