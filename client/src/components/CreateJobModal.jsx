import React, { useState } from 'react';

const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        type: 'Full-time',
        minSalary: '',
        maxSalary: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/recruiters/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    ...formData,
                    requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
                    salaryRange: {
                        min: Number(formData.minSalary),
                        max: Number(formData.maxSalary)
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create job');
            }

            const newJob = await response.json();
            onJobCreated(newJob);
            onClose();
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Error creating job');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-slate-800">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10 dark:bg-slate-800 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 font-display dark:text-white">Post a New Job</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors dark:text-slate-500 dark:hover:text-slate-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Job Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Senior React Developer"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. Remote / New York"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Internship</option>
                                <option>Remote</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Min Salary</label>
                            <input
                                type="number"
                                name="minSalary"
                                value={formData.minSalary}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="50000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Max Salary</label>
                            <input
                                type="number"
                                name="maxSalary"
                                value={formData.maxSalary}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="80000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="input-field"
                            placeholder="Describe the role and responsibilities..."
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Requirements (One per line)</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            rows="4"
                            className="input-field"
                            placeholder="- 3+ years of React experience&#10;- Knowledge of Node.js&#10;- Strong communication skills"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors mr-3 dark:text-slate-400 dark:hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateJobModal;
