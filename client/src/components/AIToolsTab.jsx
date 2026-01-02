import React, { useState } from 'react';


const AIToolsTab = () => {
    const [activeTool, setActiveTool] = useState('match'); // 'match' or 'coverLetter'
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [practiceQuestion, setPracticeQuestion] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [answerResult, setAnswerResult] = useState(null);

    const handleAnalyze = async (endpoint) => {
        setLoading(true);
        setResult(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/ai/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ resumeText, jobDescription })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }
            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('AI Service Error:', err);
            alert(`AI Service Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeAnswer = async () => {
        if (!answerText) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ai/interview-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    question: practiceQuestion,
                    userAnswer: answerText,
                    jobDescription
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }
            const data = await response.json();
            setAnswerResult(data);
        } catch (err) {
            console.error('Answer Analysis Failed:', err);
            alert(`Analysis Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openPractice = (question) => {
        setPracticeQuestion(question);
        setAnswerText('');
        setAnswerResult(null);
    };

    const fillSampleData = () => {
        const samples = [
            {
                role: "Senior Frontend Engineer",
                resume: "Senior Frontend Engineer with 6 years of experience. Expert in React, Redux, and TypeScript. Proven track record of improving web performance by 40%. Experience mentoring junior developers and leading architectural decisions. Familiar with Next.js and Tailwind CSS.",
                job: "We are seeking a Senior Frontend Engineer to lead our UI team. \n\nRequirements:\n- 5+ years of experience with React ecosystem\n- Strong TypeScript skills\n- Experience with performance optimization\n- Leadership capabilities\n\nResponsibilities:\n- Architect scalable frontend solutions\n- Mentor team members\n- Drive best practices in code quality"
            },
            {
                role: "Backend Developer",
                resume: "Backend Developer specializing in Python and Django. 4 years of experience building REST APIs and microservices. Strong knowledge of PostgreSQL and Redis. Experience with Docker and AWS deployment pipelines. Contributed to open source projects.",
                job: "Hiring a Backend Developer to build robust API services. \n\nRequirements:\n- 3+ years with Python/Django or Node.js\n- Experience with SQL databases\n- Familiarity with CI/CD\n- Understanding of distributed systems\n\nResponsibilities:\n- Design and implement API endpoints\n- Optimize database queries\n- Ensure system reliability and security"
            },
            {
                role: "Product Manager",
                resume: "Product Manager with a background in SaaS. 5 years of experience driving product strategy and roadmap. Skilled in user research, A/B testing, and data analysis using SQL and Tableau. Strong stakeholder management and communication skills.",
                job: "Looking for a Product Manager to own the user journey. \n\nRequirements:\n- 4+ years in Product Management\n- Experience with B2B SaaS\n- Data-driven decision making\n- Excellent communication skills\n\nResponsibilities:\n- Define product roadmap\n- Conduct user interviews\n- Collaborate with engineering and design teams"
            }
        ];

        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        setResumeText(randomSample.resume);
        setJobDescription(randomSample.job);
    };

    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please check permissions.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleAnalyzeVoice = async () => {
        if (!audioBlob) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('audio', audioBlob, 'answer.webm');
            formData.append('question', practiceQuestion);
            formData.append('jobDescription', jobDescription);

            const response = await fetch('http://localhost:5000/api/ai/voice-answer', {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }
            const data = await response.json();
            setAnswerResult({
                ...data, // Contains score, feedback, improvedAnswer
                transcription: data.transcription
            });
            // Auto-fill the text area with transcription
            setAnswerText(data.transcription);
        } catch (err) {
            console.error('Voice Analysis Failed:', err);
            alert(`Voice Analysis Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Practice Modal Overlay */}
            {practiceQuestion && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 dark:bg-slate-800">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10 dark:bg-slate-800 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Practice Answer</h3>
                            <button onClick={() => { setPracticeQuestion(null); setAudioBlob(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800">
                                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1 block dark:text-indigo-400">Question</span>
                                <p className="text-lg font-medium text-gray-800 dark:text-slate-200">{practiceQuestion}</p>
                            </div>

                            {!answerResult ? (
                                <div className="space-y-4">
                                    <div className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-slate-300">Your Answer</label>

                                            {/* Audio Recording Controls */}
                                            <div className="flex items-center gap-2">
                                                {!isRecording && !audioBlob && (
                                                    <button
                                                        onClick={handleStartRecording}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                        </svg>
                                                        Record Answer
                                                    </button>
                                                )}

                                                {isRecording && (
                                                    <button
                                                        onClick={handleStopRecording}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors animate-pulse"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                                        </svg>
                                                        Stop Recording
                                                    </button>
                                                )}

                                                {audioBlob && !isRecording && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Recorded
                                                        </span>
                                                        <button
                                                            onClick={() => setAudioBlob(null)}
                                                            className="text-xs text-gray-400 underline hover:text-gray-600"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <textarea
                                            value={answerText}
                                            onChange={(e) => setAnswerText(e.target.value)}
                                            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-medium text-gray-600 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                                            placeholder="Type your answer here OR click 'Record Answer' to speak..."
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => { setPracticeQuestion(null); setAudioBlob(null); }}
                                            className="px-6 py-2.5 rounded-xl font-medium text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </button>

                                        {/* Dynamic Submit Button */}
                                        {audioBlob ? (
                                            <button
                                                onClick={handleAnalyzeVoice}
                                                disabled={loading}
                                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:shadow-xl hover:scale-[1.02]'}`}
                                            >
                                                {loading ? 'Analyzing Voice...' : 'Analyze Recording'}
                                                {!loading && (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                                    </svg>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAnalyzeAnswer}
                                                disabled={loading || !answerText.trim()}
                                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${loading || !answerText.trim() ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-xl hover:scale-[1.02]'}`}
                                            >
                                                {loading ? 'Analyzing...' : 'Get Feedback'}
                                                {!loading && (
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner ${answerResult.score >= 7 ? 'bg-green-100 text-green-600' : answerResult.score >= 4 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                            {answerResult.score}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900">Analysis Result</h4>
                                            <p className="text-sm text-gray-500">Here is how you performed</p>
                                        </div>
                                    </div>

                                    {/* Show Transcription if available */}
                                    {answerResult.transcription && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Transcription</span>
                                            <p className="text-gray-700 text-sm italic">"{answerResult.transcription}"</p>
                                        </div>
                                    )}

                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h5 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Feedback
                                        </h5>
                                        <p className="text-gray-600 text-sm leading-relaxed">{answerResult.feedback}</p>
                                    </div>

                                    <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                                        <h5 className="text-sm font-bold text-green-800 mb-2 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Improvised Answer
                                        </h5>
                                        <p className="text-green-700 text-sm leading-relaxed italic">"{answerResult.improvedAnswer}"</p>
                                    </div>

                                    <button
                                        onClick={() => setAnswerResult(null)}
                                        className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Try Another Answer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Inner Tool Switcher */}
            <div className="flex justify-center border-b border-gray-100 pb-6 dark:border-slate-700">
                <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <button
                        onClick={() => { setActiveTool('match'); setResult(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium text-sm ${activeTool === 'match' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resume Matcher
                    </button>

                    <button
                        onClick={() => { setActiveTool('interview'); setResult(null); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all font-medium text-sm ${activeTool === 'interview' ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:ring-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Interview Prep
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button onClick={fillSampleData} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-3 py-1.5 rounded-md transition-colors dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:text-indigo-200">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Auto-Fill Sample Data
                        </button>
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-slate-300">
                            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            Resume Text
                        </label>
                        <textarea
                            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm font-mono text-gray-600 leading-relaxed resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            placeholder="Paste your resume content here..."
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                        />
                    </div>

                    <div className="group">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 dark:text-slate-300">
                            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            Job Description
                        </label>
                        <textarea
                            className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm shadow-sm font-mono text-gray-600 leading-relaxed resize-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                            placeholder="Paste the job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            let endpoint = 'analyze';

                            if (activeTool === 'interview') endpoint = 'interview-questions';

                            handleAnalyze(endpoint);
                        }}
                        disabled={loading || !resumeText || !jobDescription}
                        className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${loading || !resumeText || !jobDescription ? 'bg-indigo-300 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-xl hover:scale-[1.01]'}`}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                {activeTool === 'match' && <span>Analyze Match</span>}

                                {activeTool === 'interview' && <span>Generate Questions</span>}

                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 italic">
                        No API Key? Don't worry, we'll simulate the AI for you!
                    </p>
                </div>

                {/* Results Area */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 min-h-[500px] shadow-inner dark:bg-slate-800 dark:border-slate-700">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-500 mb-1">Ready to Analyze</h3>
                            <p className="text-sm">Select a tool and click generate to see AI magic.</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-500">
                            {activeTool === 'match' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Match Score</h3>
                                        <div className={`text-3xl font-black ${result.matchScore >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                                            {result.matchScore}%
                                        </div>
                                    </div>

                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 dark:text-white">
                                            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            AI Feedback
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed dark:text-slate-400">{result.feedback || "No feedback provided."}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 dark:text-slate-300">Keyword Gap Analysis</h4>
                                        <div className="space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {result.keywordAnalysis?.missing?.map(k => (
                                                    <span key={k} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100 flex items-center shadow-sm">
                                                        <span className="mr-1.5 text-lg leading-none">×</span> {k}
                                                    </span>
                                                )) || <span className="text-gray-400 text-xs">No missing keywords detected.</span>}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {result.keywordAnalysis?.present?.map(k => (
                                                    <span key={k} className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-medium rounded-lg border border-green-100 flex items-center shadow-sm dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                                                        <span className="mr-1.5 text-lg leading-none">✓</span> {k}
                                                    </span>
                                                )) || <span className="text-gray-400 text-xs">No matching keywords found.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {activeTool === 'interview' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">Interpolated Questions</h3>

                                    <div>
                                        <h4 className="text-sm font-bold text-indigo-600 mb-3 uppercase tracking-wider">Technical Questions</h4>
                                        <div className="space-y-3">
                                            {result.technical?.map((q, i) => (
                                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                                                    <p className="text-sm text-gray-800 font-medium flex-1 mr-4">{i + 1}. {q}</p>
                                                    <button
                                                        onClick={() => openPractice(q)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 whitespace-nowrap"
                                                    >
                                                        Practice
                                                    </button>
                                                </div>
                                            )) || <p className="text-gray-500 text-sm">No technical questions generated.</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-purple-600 mb-3 uppercase tracking-wider">Behavioral Questions</h4>
                                        <div className="space-y-3">
                                            {result.behavioral?.map((q, i) => (
                                                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group">
                                                    <p className="text-sm text-gray-800 font-medium flex-1 mr-4">{i + 1}. {q}</p>
                                                    <button
                                                        onClick={() => openPractice(q)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 whitespace-nowrap"
                                                    >
                                                        Practice
                                                    </button>
                                                </div>
                                            )) || <p className="text-gray-500 text-sm">No behavioral questions generated.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIToolsTab;
