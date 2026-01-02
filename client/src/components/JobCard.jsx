import React from 'react';

const JobCard = ({ job, onEdit, onDelete }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Offer': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
            case 'Interviewing': return 'bg-violet-50 text-violet-700 border-violet-200 ring-violet-500/20 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800';
            case 'Applied': return 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-cyan-500/20 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800';
            default: return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        }
    };

    const getRiskStatus = (updatedAt, status) => {
        if (!['Applied', 'Interviewing'].includes(status)) return null;
        const daysSinceUpdate = Math.floor((new Date() - new Date(updatedAt)) / (1000 * 60 * 60 * 24));

        if (daysSinceUpdate > 14) {
            return {
                label: 'Ghosting?',
                className: 'bg-rose-100 text-rose-600 border-rose-200'
            };
        } else if (daysSinceUpdate > 7) {
            return {
                label: 'Stalled',
                className: 'bg-amber-100 text-amber-600 border-amber-200'
            };
        }
        return null;
    };

    const risk = getRiskStatus(job.updatedAt, job.status);


    return (
        <div className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full hover:border-emerald-300 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-600">
            {/* Header: Company & Position */}
            <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 pr-4">
                    <h3 className="text-lg font-bold text-slate-900 truncate tracking-tight font-display dark:text-white">{job.company}</h3>
                    <p className="text-slate-500 font-medium text-sm truncate dark:text-slate-400">{job.position}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border shadow-sm ring-1 ring-inset ${getStatusStyles(job.status)}`}>
                    {job.status}
                </span>
            </div>

            {/* Info */}
            <div className="mb-6 space-y-2 flex-1">
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Applied: </span>
                        {new Date(job.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Method: </span>
                        {job.source || 'Company Website'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center dark:border-slate-700">
                <button
                    onClick={() => onEdit(job)}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                </button>
                <button
                    onClick={() => onDelete(job._id)}
                    className="text-red-500 hover:text-red-600 text-sm font-semibold flex items-center transition-colors dark:text-red-400 dark:hover:text-red-300"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default JobCard;

