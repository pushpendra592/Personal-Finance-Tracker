import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SavingsService } from '../services/savingsService';
import { TransactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/currencyUtils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { PiggyBank, Target, Banknote, Save } from 'lucide-react';

const SavingsPage = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [income, setIncome] = useState('');
    const [targetSavings, setTargetSavings] = useState('');
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.uid) {
                try {
                    setLoading(true);

                    // Fetch Settings
                    const settings = await SavingsService.getSavingsSettings(currentUser.uid);
                    setIncome(settings.income || 0);
                    setTargetSavings(settings.targetSavings || 0);

                    // Fetch Transactions for Expense Calculation
                    const transactions = await TransactionService.getTransactions(currentUser.uid);
                    const expenses = transactions
                        .filter(t => t.type === 'expense')
                        .reduce((sum, t) => sum + t.amount, 0);

                    setTotalExpenses(expenses);
                } catch (error) {
                    toast.error("Failed to load savings data.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const numIncome = parseFloat(income);
            const numTarget = parseFloat(targetSavings);

            if (isNaN(numIncome) || isNaN(numTarget)) {
                toast.error("Please enter valid numbers.");
                return;
            }

            await SavingsService.updateSavingsSettings(currentUser.uid, {
                income: numIncome,
                targetSavings: numTarget
            });

            toast.success("Savings settings updated!");
        } catch (error) {
            toast.error("Failed to update settings.");
        }
    };

    // Calculations
    const numIncome = parseFloat(income) || 0;
    const numTarget = parseFloat(targetSavings) || 0;
    const remainingBalance = numIncome - totalExpenses;
    const actualSavings = remainingBalance;
    const isTargetMet = actualSavings >= numTarget;
    const progressPercentage = numTarget > 0 ? Math.min((actualSavings / numTarget) * 100, 100) : 0;
    // Just handling edge case where actual savings could be negative if expenses > income
    const displaySavings = Math.max(actualSavings, 0);
    const displayProgress = Math.max(progressPercentage, 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Savings Goal</h1>
                <p className="text-[var(--text-secondary)] mt-1">Plan and track your monthly savings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Form */}
                <div className="lg:col-span-1 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl p-6 h-fit">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <Save className="w-5 h-5 text-[var(--accent-color)]" />
                        Settings
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Monthly Income
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">₹</span>
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-8 pr-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                                Target Savings
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">₹</span>
                                <input
                                    type="number"
                                    value={targetSavings}
                                    onChange={(e) => setTargetSavings(e.target.value)}
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-3 pl-8 pr-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-[var(--accent-color)]/20"
                        >
                            Save Settings
                        </button>
                    </form>
                </div>

                {/* Statistics & Overview */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Estimated Savings</p>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    {formatCurrency(actualSavings)}
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Income - Expenses</p>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${isTargetMet ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Goal Status</p>
                                <h3 className={`text-2xl font-bold ${isTargetMet ? 'text-emerald-500' : 'text-orange-500'}`}>
                                    {displayProgress.toFixed(1)}%
                                </h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">of {formatCurrency(numTarget)} goal</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-2xl">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-[var(--text-primary)]">Savings Progress</h3>
                                <p className="text-[var(--text-secondary)] text-sm">Keep it up! You're doing great.</p>
                            </div>
                            <PiggyBank className="w-8 h-8 text-[var(--accent-color)] opacity-50" />
                        </div>

                        <div className="h-4 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${displayProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${isTargetMet ? 'bg-emerald-500' : 'bg-[var(--accent-color)]'}`}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs font-medium text-[var(--text-secondary)]">
                            <span>₹0</span>
                            <span>Target: {formatCurrency(numTarget)}</span>
                        </div>
                    </div>

                    {/* Expenses Summary (Mini) */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl">
                        <h3 className="font-bold text-[var(--text-primary)] mb-2">Detailed Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                                <span className="text-[var(--text-secondary)]">Income</span>
                                <span className="font-semibold text-emerald-500">+{formatCurrency(numIncome)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                                <span className="text-[var(--text-secondary)]">Total Expenses</span>
                                <span className="font-semibold text-rose-500">-{formatCurrency(totalExpenses)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 pt-4">
                                <span className="font-medium text-[var(--text-primary)]">Net Balance</span>
                                <span className={`font-bold ${remainingBalance >= 0 ? 'text-[var(--text-primary)]' : 'text-rose-500'}`}>
                                    {formatCurrency(remainingBalance)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SavingsPage;
