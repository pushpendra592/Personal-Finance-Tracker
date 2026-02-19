import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, DollarSign, Tag, Type } from 'lucide-react';
import { toast } from 'sonner';

const AddTransactionModal = ({ isOpen, onClose, onAddTransaction, transactionToEdit = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense', // 'income' or 'expense'
        category: 'Food', // Changed default category
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                title: transactionToEdit.title,
                amount: transactionToEdit.amount,
                type: transactionToEdit.type,
                category: transactionToEdit.category,
                date: transactionToEdit.date
            });
        } else {
            // Reset to default when opening for new transaction
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                category: 'Food',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [transactionToEdit, isOpen]); // Depend on transactionToEdit and isOpen

    const categories = [
        'Food', 'Transport', 'Entertainment', 'Shopping',
        'Bills', 'Health', 'Salary', 'Education', 'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => { // Removed async
        e.preventDefault();

        // Basic Validation
        if (!formData.title || !formData.amount || !formData.category) {
            toast.error("Please fill in all fields");
            return;
        }

        // Pass data back to parent
        onAddTransaction({
            ...formData,
            amount: parseFloat(formData.amount)
        });

        // Reset and close
        setFormData({
            title: '',
            amount: '',
            type: 'expense',
            category: '',
            date: new Date().toISOString().split('T')[0]
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50">
                                <h2 className="text-xl font-semibold text-white">
                                    {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Type Selector */}
                                <div className="grid grid-cols-2 gap-3 p-1 bg-black rounded-xl border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                                        className={`py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'expense'
                                            ? 'bg-red-500/20 text-red-500 shadow-sm border border-red-500/20'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            } `}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'income' })}
                                        className={`py-2.5 rounded-lg text-sm font-medium transition-all ${formData.type === 'income'
                                            ? 'bg-green-500/20 text-green-500 shadow-sm border border-green-500/20'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                            } `}
                                    >
                                        Income
                                    </button>
                                </div>

                                {/* Title Input */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Title</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="What is this for?"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Amount & Date Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Amount</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                name="amount"
                                                type="number"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            <input
                                                name="date"
                                                type="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Select */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm appearance-none"
                                        >
                                            <option value="" disabled>Select a category</option>
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all mt-4"
                                >
                                    {transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;
