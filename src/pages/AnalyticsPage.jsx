import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { TransactionService } from '../services/transactionService';
import { formatCurrency } from '../utils/currencyUtils';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const AnalyticsPage = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenueTimeline, setRevenueTimeline] = useState('monthly');

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser?.uid) {
                try {
                    const data = await TransactionService.getTransactions(currentUser.uid);
                    setTransactions(data);
                } catch (error) {
                    console.error("Failed to load transactions", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    // ── Expense Split Data ──
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryData = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});

    const chartData = Object.keys(categoryData).map(category => ({
        name: category,
        value: categoryData[category],
        percentage: ((categoryData[category] / totalExpense) * 100).toFixed(0)
    })).sort((a, b) => b.value - a.value);

    const COLORS = ['#FCD34D', '#F472B6', '#8B5CF6', '#34D399', '#FB923C', '#60A5FA'];

    // ── Revenue Flow Data ──
    const revenueData = useMemo(() => {
        if (transactions.length === 0) return [];

        const now = new Date();

        if (revenueTimeline === 'weekly') {
            // Last 7 days
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayTxns = transactions.filter(t => t.date === dateStr);
                const income = dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                const expense = dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                result.push({
                    name: days[d.getDay()],
                    income,
                    expense,
                    net: income - expense
                });
            }
            return result;
        }

        if (revenueTimeline === 'monthly') {
            // Last 6 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const result = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const month = d.getMonth();
                const year = d.getFullYear();
                const monthTxns = transactions.filter(t => {
                    const td = new Date(t.date);
                    return td.getMonth() === month && td.getFullYear() === year;
                });
                const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                result.push({
                    name: months[month],
                    income,
                    expense,
                    net: income - expense
                });
            }
            return result;
        }

        if (revenueTimeline === 'yearly') {
            // Last 4 years
            const result = [];
            for (let i = 3; i >= 0; i--) {
                const year = now.getFullYear() - i;
                const yearTxns = transactions.filter(t => {
                    const td = new Date(t.date);
                    return td.getFullYear() === year;
                });
                const income = yearTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
                const expense = yearTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
                result.push({
                    name: year.toString(),
                    income,
                    expense,
                    net: income - expense
                });
            }
            return result;
        }

        return [];
    }, [transactions, revenueTimeline]);

    const totalRevenue = revenueData.reduce((sum, d) => sum + d.income, 0);

    // Custom bar shape with rounded top corners
    const RoundedBar = (props) => {
        const { x, y, width, height, fill } = props;
        if (!height || height <= 0) return null;
        const radius = Math.min(8, width / 2);
        return (
            <path
                d={`M${x},${y + height} 
                    L${x},${y + radius} 
                    Q${x},${y} ${x + radius},${y} 
                    L${x + width - radius},${y} 
                    Q${x + width},${y} ${x + width},${y + radius} 
                    L${x + width},${y + height} Z`}
                fill={fill}
            />
        );
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 shadow-lg">
                    <p className="text-[var(--text-primary)] font-semibold text-sm mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-xs" style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const timelineOptions = [
        { key: 'weekly', label: 'Weekly' },
        { key: 'monthly', label: 'Monthly' },
        { key: 'yearly', label: 'Yearly' },
    ];

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
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
                <p className="text-[var(--text-secondary)] mt-1">Visualize your spending habits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expense Split Card */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl text-[var(--text-primary)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Expense split</h3>
                        <div className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-xs font-medium text-[var(--text-secondary)]">
                            Month
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Donut Chart */}
                        <div className="relative w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        cornerRadius={10}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => formatCurrency(value)}
                                        contentStyle={{
                                            backgroundColor: 'var(--bg-card)',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--text-primary)'
                                        }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[var(--text-secondary)] text-sm font-medium">Total</span>
                                <span className="text-2xl font-bold">{formatCurrency(totalExpense)}</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-4">
                            {chartData.map((entry, index) => (
                                <div key={entry.name}>
                                    <p className="text-[var(--text-secondary)] text-xs mb-1 capitalize">{entry.name}</p>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-1 h-4 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="font-bold text-lg">{entry.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Revenue Flow Card */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl text-[var(--text-primary)] shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">Revenue flow</h3>
                            <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ArrowUpRight size={14} />
                                <span>{formatCurrency(totalRevenue)}</span>
                            </div>
                        </div>
                        {/* Timeline Selector */}
                        <div className="flex bg-[var(--bg-secondary)] rounded-full p-1 gap-1">
                            {timelineOptions.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setRevenueTimeline(opt.key)}
                                    className={`
                                        px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                                        ${revenueTimeline === opt.key
                                            ? 'bg-[var(--accent-color)] text-white shadow-md'
                                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }
                                    `}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} barGap={4}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--border-color)"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-secondary)', radius: 8 }} />
                                <Bar
                                    dataKey="income"
                                    name="Income"
                                    fill="#8B5CF6"
                                    shape={<RoundedBar />}
                                    maxBarSize={40}
                                />
                                <Bar
                                    dataKey="expense"
                                    name="Expense"
                                    fill="#C4B5FD"
                                    shape={<RoundedBar />}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-[#8B5CF6]" />
                            <span className="text-xs text-[var(--text-secondary)]">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm bg-[#C4B5FD]" />
                            <span className="text-xs text-[var(--text-secondary)]">Expense</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsPage;
