import React, { useState, useEffect } from 'react';

const JobForm = ({ onSave, initialData, onCancel, embedded = false }) => {
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'Pending',
        dateApplied: new Date().toISOString().split('T')[0],
        followUpDate: '',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                dateApplied: initialData.dateApplied ? new Date(initialData.dateApplied).toISOString().split('T')[0] : '',
                followUpDate: initialData.followUpDate ? new Date(initialData.followUpDate).toISOString().split('T')[0] : ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={embedded ? "" : "bg-white p-6 rounded-lg shadow-md mb-6 dark:bg-slate-800"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Company Name</label>
                    <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Google"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Job Position</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Senior Developer"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Application Status</label>
                    <div className="relative">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="input-field appearance-none"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Date Applied</label>
                    <input
                        type="date"
                        name="dateApplied"
                        value={formData.dateApplied}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Follow Up Date</label>
                    <input
                        type="date"
                        name="followUpDate"
                        value={formData.followUpDate}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-semibold mb-2 dark:text-slate-300">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-field"
                        rows="3"
                        placeholder="Add any details about the job, interview process, or contacts..."
                    ></textarea>
                </div>
            </div>
            <div className="flex items-center justify-end mt-8 border-t border-gray-100 pt-6">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-6 rounded-xl mr-3 transition duration-200 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition duration-200"
                >
                    Save Application
                </button>
            </div>
        </form>
    );
};

export default JobForm;
