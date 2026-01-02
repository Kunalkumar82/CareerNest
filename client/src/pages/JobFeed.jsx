import React, { useState, useEffect } from 'react';

const JobFeed = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [applying, setApplying] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recruiters/jobs/feed');
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        setApplying(jobId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to apply');
                return;
            }

            const response = await fetch('http://localhost:5000/api/applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ jobId })
            });

            if (response.ok) {
                alert('Application submitted successfully!');
            } else {
                const data = await response.json();
                alert(data.msg || 'Failed to apply');
            }
        } catch (error) {
            console.error('Error applying:', error);
            alert('Error applying to job');
        } finally {
            setApplying(null);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800 font-display mb-3 dark:text-white">Find Your Next Dream Job</h1>
                <p className="text-slate-500 max-w-2xl mx-auto dark:text-slate-400">Browse thousands of job openings from top companies and startups. Apply with a single click.</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 dark:focus:ring-indigo-500/50"
                    placeholder="Search by job title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-48"></div>
                    ))}
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-indigo-900/40">
                        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">No jobs found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredJobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all hover:border-indigo-200 group dark:bg-slate-800 dark:border-slate-700 dark:hover:border-indigo-500/50">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                                            {job.title}
                                        </h3>
                                        {job.isPremium && (
                                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                Featured
                                            </span>
                                        )}
                                        {Date.now() - new Date(job.createdAt).getTime() < 86400000 && (
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-slate-600 font-medium mb-4 flex flex-wrap gap-x-6 gap-y-2 text-sm dark:text-slate-300">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            {job.company}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {job.salaryRange?.min ? `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}` : 'Salary not disclosed'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {job.type}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requirements.slice(0, 3).map((req, idx) => (
                                            <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md dark:bg-slate-700 dark:text-slate-300">
                                                {req}
                                            </span>
                                        ))}
                                        {job.requirements.length > 3 && (
                                            <span className="text-slate-400 text-xs py-1">+{job.requirements.length - 3} more</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 min-w-[140px]">
                                    <button
                                        onClick={() => handleApply(job._id)}
                                        disabled={applying === job._id}
                                        className={`btn-primary w-full text-center py-2.5 ${applying === job._id ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {applying === job._id ? 'Applying...' : 'Apply Now'}
                                    </button>
                                    <button className="text-slate-500 hover:text-indigo-600 text-sm font-medium flex items-center justify-center gap-1 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        Save Job
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobFeed;
