import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onSearch, searchTerm }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            CareerNest
                        </Link>
                    </div>

                    <div className="flex-1 max-w-lg mx-8 hidden md:block">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                placeholder="Search jobs by company or position..."
                                value={searchTerm}
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/" className="text-gray-500 hover:text-indigo-600 font-medium transition duration-150">
                            Dashboard
                        </Link>
                        <Link to="/networking" className="text-gray-500 hover:text-indigo-600 font-medium transition duration-150">
                            Networking
                        </Link>
                        <button onClick={() => window.location.href = '/#reminders'} className="text-gray-500 hover:text-indigo-600 font-medium transition duration-150">
                            Reminders
                        </button>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {user?.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile Search - Visible only on small screens */}
                <div className="md:hidden py-3 border-t border-gray-100">
                    <input
                        type="text"
                        className="block w-full pl-4 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
