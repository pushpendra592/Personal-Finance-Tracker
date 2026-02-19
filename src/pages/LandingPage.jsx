import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Zap, CheckCircle, Mail, MapPin, Phone, Github, Twitter, Heart } from 'lucide-react';
import ThemeToggler from '../components/ThemeToggler';
import Navbar from '../components/Navbar';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-purple-500/30 scroll-smooth transition-colors duration-300">
            <Navbar isLanding={true} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--accent-color)]/20 rounded-full blur-[120px] -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm text-[var(--accent-color)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            Smart Financial Management
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[var(--text-primary)] to-[var(--text-secondary)]">
                            Master Your Money <br />with Precision
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-[var(--text-secondary)]">
                            Track income, manage expenses, and gain insights into your spending habits.
                            Simple, powerful, and designed for you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-color)] px-8 font-medium text-white transition-all duration-300 hover:bg-[var(--accent-hover)] hover:w-56 w-48"
                            >
                                <span className="mr-2">Start for Free</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-[var(--bg-secondary)]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-[var(--accent-color)]" />}
                            title="Instant Tracking"
                            description="Log transactions in seconds. Categorize and Organize your financial life effortlessly."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-[var(--accent-color)]" />}
                            title="Secure & Private"
                            description="Your financial data is encrypted and stored securely. We prioritize your privacy."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-6 h-6 text-[var(--accent-color)]" />}
                            title="Visual Analytics"
                            description="Understand where your money goes with beautiful, interactive charts and summaries."
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-20 text-center">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-[var(--text-secondary)]">Simple steps to financial freedom</p>
                    </div>

                    {/* Steps with animated wave */}
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-0">

                        {/* Animated connecting line (desktop) */}
                        <svg className="hidden md:block absolute top-[60px] left-[15%] w-[70%] h-[6px] z-0" viewBox="0 0 600 6" preserveAspectRatio="none">
                            {/* Background track */}
                            <line x1="0" y1="3" x2="600" y2="3" stroke="rgba(168,85,247,0.1)" strokeWidth="2" />
                            {/* Animated wave */}
                            <line
                                x1="0" y1="3" x2="600" y2="3"
                                stroke="url(#waveGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="120 480"
                                className="animate-wave"
                            />
                            {/* Glow effect */}
                            <line
                                x1="0" y1="3" x2="600" y2="3"
                                stroke="url(#waveGradient)"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray="120 480"
                                opacity="0.3"
                                className="animate-wave"
                            />
                            <defs>
                                <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="30%" stopColor="#a855f7" />
                                    <stop offset="70%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Animated connecting line (mobile) */}
                        <svg className="md:hidden absolute left-[60px] top-[15%] w-[6px] h-[70%] z-0" viewBox="0 6 600" preserveAspectRatio="none">
                            <line x1="3" y1="0" x2="3" y2="600" stroke="rgba(168,85,247,0.1)" strokeWidth="2" />
                            <line
                                x1="3" y1="0" x2="3" y2="600"
                                stroke="url(#waveGradientV)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="120 480"
                                className="animate-wave-v"
                            />
                            <defs>
                                <linearGradient id="waveGradientV" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="30%" stopColor="#a855f7" />
                                    <stop offset="70%" stopColor="#7c3aed" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {[
                            { num: '01', title: 'Sign Up', desc: 'Create your free account in seconds.' },
                            { num: '02', title: 'Add Info', desc: 'Input your income and daily expenses.' },
                            { num: '03', title: 'Analyze', desc: 'View reports and optimize spending.' }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center flex-1">
                                {/* Animated circle */}
                                <div className="relative mb-6">
                                    {/* Outer pulse ring */}
                                    <div
                                        className="absolute inset-0 rounded-full bg-[var(--accent-color)]/20 animate-ping-slow"
                                        style={{ animationDelay: `${i * 1} s` }}
                                    />
                                    {/* Rotating border */}
                                    <div
                                        className="absolute -inset-1 rounded-full animate-spin-slow"
                                        style={{
                                            background: `conic - gradient(from ${i * 120}deg, transparent, #a855f7, transparent)`,
                                            animationDelay: `${i * 0.5} s`
                                        }}
                                    />
                                    {/* Circle body */}
                                    <div className="relative w-[120px] h-[120px] rounded-full bg-[var(--bg-primary)] border-2 border-[var(--accent-color)]/30 flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/10">
                                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-purple-300 to-purple-600">{step.num}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-[var(--text-secondary)] text-sm max-w-[200px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CSS for animations */}
                <style>{`
@keyframes wave {
    0 % { stroke- dashoffset: 600;
}
100 % { stroke- dashoffset: -600; }
                    }
@keyframes wave - v {
    0 % { stroke- dashoffset: 600;
}
100 % { stroke- dashoffset: -600; }
                    }
@keyframes ping - slow {
    0 % { transform: scale(1); opacity: 0.4; }
    50 % { transform: scale(1.3); opacity: 0; }
    100 % { transform: scale(1); opacity: 0; }
}
@keyframes spin - slow {
    0 % { transform: rotate(0deg); }
    100 % { transform: rotate(360deg); }
}
                    .animate - wave {
    animation: wave 3s linear infinite;
}
                    .animate - wave - v {
    animation: wave - v 3s linear infinite;
}
                    .animate - ping - slow {
    animation: ping - slow 3s ease -in -out infinite;
}
                    .animate - spin - slow {
    animation: spin - slow 8s linear infinite;
}
`}</style>
            </section>

            {/* Comparison */}
            <section id="why-us" className="py-24 bg-[var(--bg-secondary)]/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why We Are Better</h2>
                    </div>

                    <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] overflow-hidden">
                        <div className="grid grid-cols-3 p-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] font-semibold">
                            <div className="text-[var(--text-secondary)]">Feature</div>
                            <div className="text-center text-[var(--text-secondary)]">Others</div>
                            <div className="text-center text-[var(--accent-color)]">FinanceTracker</div>
                        </div>
                        <ComparisonRow feature="Real-time Sync" other={false} us={true} />
                        <ComparisonRow feature="Visual Analytics" other={false} us={true} />
                        <ComparisonRow feature="Dark Mode" other={true} us={true} />
                        <ComparisonRow feature="Export Data" other={false} us={true} />
                        <ComparisonRow feature="Privacy Focused" other="?" us={true} />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="max-w-3xl mx-auto px-4"
                >
                    <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[var(--accent-color)] text-white px-8 py-3 rounded-full font-bold hover:bg-[var(--accent-hover)] transition-all transform hover:scale-105"
                    >
                        Join Now
                    </button>
                </motion.div>
            </section>

            {/* Contact Us */}
            <section id="contact" className="py-24 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[var(--accent-color)]/10 rounded-full blur-[120px] -z-10" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-[var(--text-secondary)] max-w-xl mx-auto">Have questions or feedback? We'd love to hear from you.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                <div className="bg-[var(--accent-color)]/10 p-3 rounded-xl">
                                    <Mail className="w-5 h-5 text-[var(--accent-color)]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Email Us</h4>
                                    <p className="text-[var(--text-secondary)] text-sm">support@financetracker.app</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                <div className="bg-[var(--accent-color)]/10 p-3 rounded-xl">
                                    <Phone className="w-5 h-5 text-[var(--accent-color)]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Call Us</h4>
                                    <p className="text-[var(--text-secondary)] text-sm">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                                <div className="bg-[var(--accent-color)]/10 p-3 rounded-xl">
                                    <MapPin className="w-5 h-5 text-[var(--accent-color)]" />
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Visit Us</h4>
                                    <p className="text-[var(--text-secondary)] text-sm">Bangalore, India</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows={5}
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[var(--accent-color)] text-white py-3 rounded-xl font-semibold hover:bg-[var(--accent-hover)] transition-all transform hover:scale-[1.02] shadow-lg shadow-[var(--accent-color)]/25"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-[var(--accent-color)] rounded-lg flex items-center justify-center">
                                    <BarChart2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-xl tracking-tight">FinanceTracker</span>
                            </div>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">
                                Your smart companion for managing finances. Track, analyze, and optimize your spending habits with ease.
                            </p>
                            <div className="flex gap-3 mt-6">
                                <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all">
                                    <Github className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]/30 transition-all">
                                    <Mail className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--text-primary)] mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Features</a></li>
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Security</a></li>
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Updates</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--text-primary)] mb-4">Support</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Help Center</a></li>
                                <li><a href="#contact" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-[var(--text-secondary)] text-sm hover:text-[var(--accent-color)] transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="py-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--text-secondary)] text-sm">
                            © {new Date().getFullYear()} FinanceTracker. All rights reserved.
                        </p>
                        <p className="text-[var(--text-secondary)] text-sm flex items-center gap-1">
                            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)]/30 transition-colors">
        <div className="mb-4 bg-[var(--accent-color)]/10 w-12 h-12 rounded-xl flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
);


const ComparisonRow = ({ feature, other, us }) => (
    <div className="grid grid-cols-3 p-6 border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]/50 transition-colors items-center">
        <div className="font-medium text-[var(--text-primary)]">{feature}</div>
        <div className="text-center flex justify-center text-[var(--text-secondary)]">
            {other === true ? <CheckCircle className="w-5 h-5" /> : other === false ? "-" : other}
        </div>
        <div className="text-center flex justify-center text-[var(--accent-color)]">
            {us === true ? <CheckCircle className="w-5 h-5" /> : us}
        </div>
    </div>
);

export default LandingPage;
