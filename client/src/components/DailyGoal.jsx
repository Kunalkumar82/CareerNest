import React, { useEffect, useState } from 'react';

const DailyGoal = ({ jobs }) => {
    const [todayCount, setTodayCount] = useState(0);
    const GOAL = 3;

    useEffect(() => {
        if (!jobs) return;
        const today = new Date().toDateString();
        const count = jobs.filter(job =>
            new Date(job.dateApplied).toDateString() === today
        ).length;
        setTodayCount(count);
    }, [jobs]);

    const progress = Math.min((todayCount / GOAL) * 100, 100);

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white shadow-lg mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 transform rotate-12 -mr-8 -mt-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-100 mb-1">Daily Goal</h3>
            <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold">{todayCount}<span className="text-lg text-indigo-200 font-medium">/{GOAL}</span></span>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">
                    {todayCount >= GOAL ? 'On Fire! 🔥' : 'Keep going!'}
                </span>
            </div>

            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-white/90 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-xs text-indigo-200 mt-3 font-medium">
                {todayCount >= GOAL
                    ? "You've hit your daily target!"
                    : `${GOAL - todayCount} more to hit your target`}
            </p>
        </div>
    );
};

export default DailyGoal;
