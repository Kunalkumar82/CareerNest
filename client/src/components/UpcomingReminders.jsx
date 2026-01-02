import React from 'react';

const UpcomingReminders = ({ reminders = [], onViewAll }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Reminders</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                    View All
                </button>
            </div>

            <div className="flex flex-col items-center justify-center h-48 space-y-4">
                {reminders && reminders.length > 0 ? (
                    reminders.slice(0, 3).map((reminder, idx) => (
                        <div key={idx} className="w-full p-3 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500 rounded-r-md">
                            <p className="font-medium text-gray-900 dark:text-white">{reminder.text}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{reminder.date}</p>
                        </div>
                    ))
                ) : (
                    <>
                        <p className="text-gray-500 dark:text-slate-400">No upcoming reminders</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpcomingReminders;
