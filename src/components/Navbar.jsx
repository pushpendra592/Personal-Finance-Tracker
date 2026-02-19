import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    PiggyBank,
    LogOut,
    Menu,
    X,
    Wallet,
    PieChart,
    Zap,
    BarChart2,
    Shield,
    Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggler from './ThemeToggler';

const Navbar = ({ isLanding = false }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            navigate('/');
            setTimeout(async () => {
                await logout();
            }, 100);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const dashboardNavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/savings', label: 'Savings', icon: PiggyBank },
    ];

    const landingNavItems = [
        { path: '#features', label: 'Features', icon: Zap },
        { path: '#how-it-works', label: 'How It Works', icon: BarChart2 },
        { path: '#why-us', label: 'Why Us', icon: Shield },
        { path: '#contact', label: 'Contact', icon: Mail }
    ];

    const navItems = isLanding ? landingNavItems : dashboardNavItems;

    return (
        <nav className="sticky top-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-hover)] flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/20">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-[var(--text-primary)] hidden sm:block">
                            FinanceTracker
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            isLanding ? (
                                <a
                                    key={item.path}
                                    href={item.path}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </a>
                            ) : (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive
                                            ? 'text-[var(--accent-color)] bg-[var(--accent-color)]/10'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                                        }
                                    `}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </NavLink>
                            )
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggler />

                        {isLanding ? (
                            <div className="flex items-center gap-2 md:gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-xs md:text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 md:px-3 md:py-2 whitespace-nowrap"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-[var(--accent-color)] text-white px-3 py-1.5 md:px-5 md:py-2 rounded-xl text-xs md:text-sm font-semibold hover:bg-[var(--accent-hover)] transition-all shadow-lg shadow-[var(--accent-color)]/20 whitespace-nowrap"
                                >
                                    Get Started
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* User Profile */}
                                <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                                        {currentUser?.photoURL ? (
                                            <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[var(--text-primary)] font-bold">
                                                {currentUser?.email?.[0].toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 rounded-full bg-[var(--bg-secondary)] text-rose-500 hover:bg-rose-500/10 transition-all duration-200"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-card)]"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {!isLanding && (
                                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                                        <span className="text-[var(--text-primary)] font-bold">
                                            {currentUser?.email?.[0].toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--text-primary)]">{currentUser?.displayName || 'User'}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{currentUser?.email}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    isLanding ? (
                                        <a
                                            key={item.path}
                                            href={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all duration-200"
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </a>
                                    ) : (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={({ isActive }) => `
                                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                                ${isActive
                                                    ? 'bg-[var(--accent-color)] text-white'
                                                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                                }
                                            `}
                                        >
                                            <item.icon size={20} />
                                            <span className="font-medium">{item.label}</span>
                                        </NavLink>
                                    )
                                ))}
                            </div>


                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
