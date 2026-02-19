import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Plus,
    Wallet,
    TrendingUp,
    TrendingDown,
    Search,
    Filter,
    Trash2,
    Pencil,
    ArrowUpRight,
    ArrowDownRight,
    X,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddTransactionModal from '../components/AddTransactionModal';
import { toast } from 'sonner';
import { TransactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/currencyUtils';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Salary', 'Education', 'Other'];

    // Fetch Transactions on Load
    useEffect(() => {
        const fetchTransactions = async () => {
            if (currentUser?.uid) {
                try {
                    const data = await TransactionService.getTransactions(currentUser.uid);
                    setTransactions(data);
                } catch (error) {
                    toast.error("Failed to load transactions.");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [currentUser]);

    // Derived State
    const filteredTransactions = transactions
        .filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
            return matchesSearch && matchesType && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') return new Date(b.date) - new Date(a.date);
            if (sortOrder === 'oldest') return new Date(a.date) - new Date(b.date);
            if (sortOrder === 'highest') return b.amount - a.amount;
            if (sortOrder === 'lowest') return a.amount - b.amount;
            return 0;
        });

    const activeFilterCount = (filterType !== 'all' ? 1 : 0) + (filterCategory !== 'all' ? 1 : 0) + (sortOrder !== 'newest' ? 1 : 0);

    const summary = filteredTransactions.reduce((acc, curr) => {
        if (curr.type === 'income') {
            acc.income += curr.amount;
            acc.balance += curr.amount;
        } else {
            acc.expense += curr.amount;
            acc.balance -= curr.amount;
        }
        return acc;
    }, { balance: 0, income: 0, expense: 0 });

    const handleSaveTransaction = async (transactionData) => {
        try {
            if (editingTransaction) {
                const updatedTx = await TransactionService.updateTransaction(currentUser.uid, editingTransaction.id, transactionData);
                setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updatedTx : t));
                toast.success("Transaction updated successfully!");
                setEditingTransaction(null);
            } else {
                const addedTx = await TransactionService.addTransaction(currentUser.uid, transactionData);
                setTransactions(prev => [addedTx, ...prev]);
                toast.success("Transaction added successfully!");
            }
        } catch (error) {
            console.error("Dashboard Save Error:", error);
            toast.error(error.message || (editingTransaction ? "Failed to update transaction." : "Failed to add transaction."));
        }
    };

    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleDeleteTransaction = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                await TransactionService.deleteTransaction(currentUser.uid, id);
                setTransactions(prev => prev.filter(t => t.id !== id));
                toast.success("Transaction deleted.");
            } catch (error) {
                toast.error("Failed to delete transaction.");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                        Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Welcome back, {currentUser?.displayName || 'User'}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingTransaction(null);
                        setIsModalOpen(true);
                    }}
                    className="
                        bg-[var(--accent-color)] text-white px-6 py-3 rounded-xl font-medium 
                        flex items-center gap-2 hover:bg-[var(--accent-hover)] transition-all 
                        shadow-lg shadow-[var(--accent-color)]/20
                    "
                >
                    <Plus className="w-5 h-5" />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Total Balance"
                    amount={summary.balance}
                    icon={<Wallet className="w-6 h-6 text-purple-400" />}
                    trend="+2.5%"
                    isPositive={true}
                    colorClass="bg-purple-500/10 text-purple-500"
                />
                <SummaryCard
                    title="Total Income"
                    amount={summary.income}
                    icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                    trend="+12%"
                    isPositive={true}
                    colorClass="bg-emerald-500/10 text-emerald-500"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={summary.expense}
                    icon={<TrendingDown className="w-6 h-6 text-rose-400" />}
                    trend="-5%"
                    isPositive={false}
                    colorClass="bg-rose-500/10 text-rose-500"
                />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full bg-[var(--bg-card)] border border-[var(--border-color)] 
                            text-[var(--text-primary)] text-sm rounded-xl pl-10 pr-4 py-3 
                            focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50
                            placeholder-[var(--text-secondary)]
                        "
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
                            flex items-center gap-2 bg-[var(--bg-card)] border px-4 py-3 rounded-xl 
                            hover:bg-[var(--bg-secondary)] transition-colors text-sm font-medium
                            ${activeFilterCount > 0
                                ? 'border-[var(--accent-color)] text-[var(--accent-color)]'
                                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                            }
                        `}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-[var(--accent-color)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                        <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Dropdown */}
                    <AnimatePresence>
                        {showFilters && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowFilters(false)}
                                    className="fixed inset-0 z-30"
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: 'easeOut' }}
                                    className="absolute right-0 top-14 z-40 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-[var(--accent-color)]" />
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">Filters</span>
                                            {activeFilterCount > 0 && (
                                                <span className="bg-[var(--accent-color)] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-1 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-5 space-y-5">
                                        {/* Type Filter */}
                                        <div>
                                            <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2.5 block">Transaction Type</label>
                                            <div className="flex gap-2">
                                                {[
                                                    { key: 'all', label: 'All' },
                                                    { key: 'income', label: 'Income' },
                                                    { key: 'expense', label: 'Expense' }
                                                ].map(type => (
                                                    <button
                                                        key={type.key}
                                                        onClick={() => setFilterType(type.key)}
                                                        className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${filterType === type.key
                                                            ? 'bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-color)]/25'
                                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)]'
                                                            }`}
                                                    >
                                                        <span>{type.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Category Filter - Pill Grid */}
                                        <div>
                                            <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2.5 block">Category</label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setFilterCategory('all')}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${filterCategory === 'all'
                                                        ? 'bg-[var(--accent-color)] text-white shadow-sm'
                                                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                                                        }`}
                                                >
                                                    All
                                                </button>
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setFilterCategory(cat)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${filterCategory === cat
                                                            ? 'bg-[var(--accent-color)] text-white shadow-sm'
                                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Sort - Pill Grid */}
                                        <div>
                                            <label className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2.5 block">Sort By</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {[
                                                    { key: 'newest', label: 'Newest First' },
                                                    { key: 'oldest', label: 'Oldest First' },
                                                    { key: 'highest', label: 'Highest ₹' },
                                                    { key: 'lowest', label: 'Lowest ₹' }
                                                ].map(opt => (
                                                    <button
                                                        key={opt.key}
                                                        onClick={() => setSortOrder(opt.key)}
                                                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${sortOrder === opt.key
                                                            ? 'bg-[var(--accent-color)] text-white shadow-sm'
                                                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex gap-3 px-5 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
                                        <button
                                            onClick={() => {
                                                setFilterType('all');
                                                setFilterCategory('all');
                                                setSortOrder('newest');
                                            }}
                                            className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors border border-[var(--border-color)]"
                                        >
                                            Reset All
                                        </button>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-colors shadow-md shadow-[var(--accent-color)]/25"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h2 className="font-bold text-lg text-[var(--text-primary)]">Detailed Transactions</h2>
                </div>

                <div className="hidden md:grid grid-cols-6 gap-4 p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-color)]">
                    <div className="col-span-2">Transaction</div>
                    <div className="text-right">Amount</div>
                    <div className="text-center">Category</div>
                    <div className="text-right">Date</div>
                    <div className="text-center">Actions</div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border-color)]">
                        <AnimatePresence mode='popLayout'>
                            {filteredTransactions.map((t) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    key={t.id}
                                    className="group p-4 hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    {/* Desktop Row */}
                                    <div className="hidden md:grid grid-cols-6 gap-4 items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[var(--text-primary)]">{t.title}</p>
                                            <p className="text-xs text-[var(--text-secondary)] capitalize">{t.type}</p>
                                        </div>
                                        <div className={`text-right font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </div>
                                        <div className="text-center">
                                            <span className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-3 py-1 rounded-full text-xs border border-[var(--border-color)]">
                                                {t.category}
                                            </span>
                                        </div>
                                        <div className="text-right text-sm text-[var(--text-secondary)]">{t.date}</div>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTransaction(t.id)}
                                                className="p-2 text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile Card */}
                                    <div className="flex md:hidden items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {t.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)] text-sm">{t.title}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">{t.category} • {t.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-500' : 'text-[var(--text-primary)]'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </div>
                                            <button
                                                onClick={() => handleEditClick(t)}
                                                className="p-1 px-2 text-[var(--text-secondary)] hover:text-[var(--accent-color)]"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTransaction(t.id)}
                                                className="p-1 px-2 text-[var(--text-secondary)] hover:text-rose-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State (Hidden if has data) */}
                {!loading && filteredTransactions.length === 0 && (
                    <div className="p-12 text-center text-[var(--text-secondary)]">
                        <p>No transactions found. Add one to get started!</p>
                    </div>
                )}
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onAddTransaction={handleSaveTransaction}
                transactionToEdit={editingTransaction}
            />
        </motion.div>
    );
};

// Summary Card Component
const SummaryCard = ({ title, amount, icon, isPositive, colorClass }) => (
    <div className="
        bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl 
        relative overflow-hidden group hover:border-[var(--accent-color)]/30 transition-all
        shadow-sm hover:shadow-md
    ">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1 text-[var(--text-primary)]">
                    {formatCurrency(amount)}
                </h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} transition-colors`}>
                {icon}
            </div>
        </div>
    </div>
);

export default Dashboard;
