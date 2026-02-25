'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, CheckCircle, Dumbbell } from 'lucide-react';

function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [touched, setTouched] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const emailError = touched && !validateEmail(email) ? (email ? 'Please enter a valid email.' : 'Email is required.') : '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (!validateEmail(email)) return;
        setLoading(true);
        await new Promise(r => setTimeout(r, 1500)); // simulate API call
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

            <div className="max-w-md w-full fade-in">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-start mb-8">
                        <Link href="/" className="text-indigo-200 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex-1 text-center pr-7">
                            <div className="bg-indigo-500 p-3 rounded-2xl inline-block mb-3 shadow-lg shadow-indigo-500/40">
                                <Dumbbell className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Forgot Password?</h1>
                            <p className="text-indigo-200 text-sm">Enter your email to receive reset instructions.</p>
                        </div>
                    </div>

                    {submitted ? (
                        <div className="text-center fade-in">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
                            <p className="text-indigo-200 text-sm mb-6">
                                If an account exists for <strong className="text-white">{email}</strong>, you'll receive a password reset link shortly.
                            </p>
                            <Link href="/" className="inline-block px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div>
                                <label htmlFor="forgot-email" className="block text-sm font-medium text-indigo-100 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300/60" />
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onBlur={() => setTouched(true)}
                                        placeholder="coach@example.com"
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border ${emailError ? 'border-red-400/60 focus:ring-red-400' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 transition-all`}
                                    />
                                </div>
                                {emailError && <p className="mt-1.5 text-sm text-red-300">{emailError}</p>}
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Sending…</> : 'Send Reset Instructions'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
