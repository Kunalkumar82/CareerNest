import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobForm from '../components/JobForm';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import AnalyticsTab from '../components/AnalyticsTab';
import AIToolsTab from '../components/AIToolsTab';
import DashboardStats from '../components/DashboardStats';
import RecentApplications from '../components/RecentApplications';
import UpcomingReminders from '../components/UpcomingReminders';
import JobsView from '../components/JobsView';
import { rejectionQuotes } from '../data/quotes';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/jobs';

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('overview'); // Default to overview
    const [motivationQuote, setMotivationQuote] = useState(null);

    const { user } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL, {
                headers: { 'x-auth-token': token }
            });
            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateJob = async (jobData) => {
        try {
            const method = editingJob ? 'PUT' : 'POST';
            const url = editingJob ? `${API_BASE_URL}/${editingJob._id}` : API_BASE_URL;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(jobData),
            });

            if (!response.ok) throw new Error('Failed to save job');

            await fetchJobs();
            setIsFormOpen(false);
            setEditingJob(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job application?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (!response.ok) throw new Error('Failed to delete job');
            setJobs(jobs.filter(job => job._id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        // Rejection Therapy Logic
        if (newStatus === 'Rejected') {
            const randomQuote = rejectionQuotes[Math.floor(Math.random() * rejectionQuotes.length)];
            setMotivationQuote(randomQuote);
        }

        // Optimistic update
        const originalJobs = [...jobs];
        setJobs(jobs.map(job =>
            job._id === id ? { ...job, status: newStatus } : job
        ));

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');
        } catch (err) {
            // Revert on error
            setJobs(originalJobs);
            alert(err.message);
        }
    };

    const handleEditClick = (job) => {
        setEditingJob(job);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredJobs = jobs.filter(job =>
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [reminders, setReminders] = useState([]);

    const stats = {
        total: jobs.length,
        interview: jobs.filter(j => j.status === 'Interviewing').length,
        offers: jobs.filter(j => j.status === 'Offer').length,
        reminders: reminders.length
    };

    useEffect(() => {
        if (location.hash === '#reminders') {
            setViewMode('overview');
            setTimeout(() => {
                const element = document.getElementById('reminders');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    useEffect(() => {
        // Generate reminders from jobs
        const upcomingReminders = jobs.reduce((acc, job) => {
            if (job.followUpDate) {
                const daysUntil = Math.ceil((new Date(job.followUpDate) - new Date()) / (1000 * 60 * 60 * 24));
                if (daysUntil >= 0 && daysUntil <= 14) {
                    acc.push({
                        text: `Follow up with ${job.company}`,
                        date: new Date(job.followUpDate).toLocaleDateString(),
                        type: 'followUp',
                        jobId: job._id
                    });
                }
            }
            // Add interview reminders if status is Interviewing (assuming we track interview date, if not just generic)
            if (job.status === 'Interviewing') {
                acc.push({
                    text: `Interview with ${job.company}`,
                    date: 'Check details', // Placeholder if we don't have explicit interview date field yet
                    type: 'interview',
                    jobId: job._id
                });
            }
            return acc;
        }, []);
        setReminders(upcomingReminders);
    }, [jobs]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            );
        }

        if (viewMode === 'overview') {
            return (
                <div className="animate-in fade-in duration-500">
                    <DashboardStats stats={stats} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <RecentApplications jobs={[...jobs].reverse()} onViewAll={() => setViewMode('grid')} />
                        <div id="reminders" className="scroll-mt-24">
                            <UpcomingReminders reminders={reminders} onViewAll={() => { }} />
                        </div>
                    </div>
                </div>
            );
        }

        if (viewMode === 'grid') {
            return (
                <JobsView
                    jobs={jobs}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteJob}
                    onCreate={() => setIsFormOpen(true)}
                />
            );
        }

        if (viewMode === 'board') {
            return (
                <KanbanBoard
                    jobs={filteredJobs}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteJob}
                />
            );
        }

        if (viewMode === 'analytics') {
            return <AnalyticsTab jobs={jobs} />;
        }

        if (viewMode === 'ai-tools') {
            return <AIToolsTab />;
        }

        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Something went wrong.
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12 dark:bg-slate-900">
            <Navbar onSearch={setSearchTerm} searchTerm={searchTerm} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Motivation Modal */}
                {motivationQuote && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative dark:bg-slate-800">
                            <button
                                onClick={() => setMotivationQuote(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">Keep Your Head Up!</h3>
                                <p className="text-gray-600 italic dark:text-slate-300">"{motivationQuote}"</p>
                                <button
                                    onClick={() => setMotivationQuote(null)}
                                    className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    I'll Keep Going!
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                        <p className="text-gray-500 mt-1 dark:text-slate-400">Welcome back! Here's your job application overview.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {viewMode === 'overview' && (
                            <button
                                onClick={() => {
                                    setEditingJob(null);
                                    setIsFormOpen(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add Job
                            </button>
                        )}
                        <div className="bg-white p-1.5 rounded-xl border border-gray-200 flex shadow-sm overflow-x-auto max-w-[calc(100vw-40px)] dark:bg-slate-800 dark:border-slate-700">
                            <button
                                onClick={() => setViewMode('overview')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${viewMode === 'overview' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Overview
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Jobs
                            </button>
                            <button
                                onClick={() => setViewMode('board')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${viewMode === 'board' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                Board
                            </button>
                            <button
                                onClick={() => setViewMode('analytics')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${viewMode === 'analytics' ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Analytics
                            </button>
                            <button
                                onClick={() => setViewMode('ai-tools')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium text-sm whitespace-nowrap ${viewMode === 'ai-tools' ? 'bg-purple-50 text-purple-700 shadow-sm ring-1 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:ring-purple-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                AI Tools
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Form Section */}
                {isFormOpen && (
                    <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingJob ? 'Edit Application' : 'New Application'}
                            </h3>
                            <button onClick={() => { setIsFormOpen(false); setEditingJob(null); }} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <JobForm
                            onSave={handleCreateOrUpdateJob}
                            initialData={editingJob}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingJob(null);
                            }}
                            embedded={true}
                        />
                    </div>
                )}

                {renderContent()}

            </div>
        </div>
    );
};

export default Dashboard;
