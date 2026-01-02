import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
    const [companyName, setCompanyName] = useState('');

    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const payload = {
                name,
                email,
                password,
                role,
                ...(role === 'recruiter' && { companyName })
            };

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Registration failed');

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-md w-full glass-card p-8 animate-fade-in-up border border-slate-200 shadow-xl bg-white dark:bg-slate-800 dark:border-slate-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 font-display mb-2 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Join our platform to find or post jobs</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm dark:bg-rose-900/20 dark:text-rose-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('seeker')}
                            className={`p-3 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${role === 'seeker'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20 dark:bg-indigo-900/30 dark:border-indigo-500/50 dark:text-indigo-400'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500'
                                }`}
                        >
                            <span className="text-2xl">👨‍💻</span>
                            Job Seeker
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('recruiter')}
                            className={`p-3 rounded-xl border text-sm font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${role === 'recruiter'
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-2 ring-indigo-500/20 dark:bg-indigo-900/30 dark:border-indigo-500/50 dark:text-indigo-400'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500'
                                }`}
                        >
                            <span className="text-2xl">🏢</span>
                            Recruiter
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    {role === 'recruiter' && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Company Name</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="input-field"
                                placeholder="Acme Corp"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            role === 'recruiter' ? 'Join as Recruiter' : 'Join as Candidate'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition duration-200 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
