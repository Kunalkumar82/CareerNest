import React from 'react';

const RecentApplications = ({ jobs, onViewAll }) => {
    const recentJobs = jobs.slice(0, 3); // Display only top 3

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Interviewing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Offer': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Applications</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {recentJobs.length > 0 ? (
                    recentJobs.map((job) => (
                        <div key={job._id} className="p-4 border border-gray-100 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">{job.company}</h3>
                                    <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">{job.position}</p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500">
                                        {new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                                    {job.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                        No applications yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentApplications;
