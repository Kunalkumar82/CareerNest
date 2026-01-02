import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsTab = ({ jobs }) => {
    // 1. Calculate Funnel Data
    const funnelData = [
        { name: 'Applied', count: jobs.length, color: '#6366f1' }, // All jobs start as Applied
        { name: 'Interview', count: jobs.filter(j => ['Interview', 'Offer', 'Rejected'].includes(j.status)).length, color: '#8b5cf6' },
        { name: 'Offer', count: jobs.filter(j => j.status === 'Offer').length, color: '#10b981' },
    ];

    // 2. Calculate Rates
    const interviewRate = ((funnelData[1].count / (funnelData[0].count || 1)) * 100).toFixed(1);
    const offerRate = ((funnelData[2].count / (funnelData[1].count || 1)) * 100).toFixed(1);

    // 3. Stalled Jobs Count
    const stalledCount = jobs.filter(j => j.isStalled).length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Interview Rate</p>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{interviewRate}%</span>
                        <span className="ml-2 text-sm text-gray-400 dark:text-slate-500">from applications</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Offer Rate</p>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-emerald-500">{offerRate}%</span>
                        <span className="ml-2 text-sm text-gray-400 dark:text-slate-500">from interviews</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Ghosted / Stalled</p>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-orange-500">{stalledCount}</span>
                        <span className="ml-2 text-sm text-gray-400 dark:text-slate-500">jobs &gt;14 days</span>
                    </div>
                </div>
            </div>

            {/* Funnel Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-800 mb-6 dark:text-white">Application Funnel</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={40}>
                            {funnelData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsTab;
