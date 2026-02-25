'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { registerUser } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, ArrowLeft, Eye, EyeOff, Lock, Loader2, CheckCircle, Phone } from 'lucide-react';

function getPasswordStrength(p: string) {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
}

const strengthLabel = ['', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-green-500'];
const strengthText = ['', 'text-red-400', 'text-amber-400', 'text-blue-400', 'text-green-400'];

function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function validatePhone(p: string) { return /^[+\d][\d\s\-().]{6,20}$/.test(p); }
function validateName(n: string) { return /^[a-zA-Z\s\-']{2,}$/.test(n); }
function validateOrg(o: string) { return /^[a-zA-Z0-9\s\-&.']{2,}$/.test(o); }

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '',
        sport_type: 'Basketball', experience_level: 'New', organization: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [termsChecked, setTermsChecked] = useState(false);
    const [termsTouched, setTermsTouched] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const strength = getPasswordStrength(form.password);

    const errors: Record<string, string> = {};
    if (touched.name && !validateName(form.name)) errors.name = form.name ? 'Name must contain only letters, spaces, or hyphens.' : 'Full name is required.';
    if (touched.email && !validateEmail(form.email)) errors.email = form.email ? 'Please enter a valid email address.' : 'Email is required.';
    if (touched.password) {
        if (!form.password) errors.password = 'Password is required.';
        else if (strength < 3) errors.password = 'Password must be at least 8 chars with uppercase, number & special character.';
    }
    if (touched.phone && !validatePhone(form.phone)) errors.phone = form.phone ? 'Enter a valid phone number (e.g. +1 555 123 4567).' : 'Phone number is required.';
    if (touched.organization && !validateOrg(form.organization)) errors.organization = form.organization ? 'Enter a valid organization name.' : 'Organization name is required.';

    const allValid = validateName(form.name) && validateEmail(form.email) && strength >= 3 && validatePhone(form.phone) && validateOrg(form.organization) && termsChecked;

    const field = (id: string) => ({
        onBlur: () => setTouched(t => ({ ...t, [id]: true })),
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setForm(f => ({ ...f, [id]: e.target.value }));
            if (!touched[id]) setTouched(t => ({ ...t, [id]: true }));
        },
    });

    const inputCls = (err?: string) =>
        `w-full px-4 py-3 rounded-xl bg-white/5 border ${err ? 'border-red-400/60 focus:ring-red-400' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 transition-all duration-200`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true, phone: true, organization: true });
        setTermsTouched(true);
        if (!allValid) return;
        const result = await dispatch(registerUser(form));
        if (registerUser.fulfilled.match(result)) {
            setSuccessMsg('Account created successfully! Redirecting to login…');
            setTimeout(() => router.push('/'), 2500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 p-4 py-10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

            <div className="max-w-2xl w-full relative fade-in">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-8 rounded-3xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-start mb-8">
                        <Link href="/" className="text-indigo-200 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/10">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex-1 text-center pr-7">
                            <div className="bg-indigo-500 p-3 rounded-2xl inline-block mb-3 shadow-lg shadow-indigo-500/40">
                                <Dumbbell className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-1">Create Your Account</h1>
                            <p className="text-indigo-200 text-sm">Join Coach Speech and elevate your communication.</p>
                        </div>
                    </div>

                    {/* Success */}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-200 text-sm text-center flex items-center gap-2 justify-center">
                            <CheckCircle className="w-5 h-5" />{successMsg}
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-indigo-100 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                                <input id="name" type="text" value={form.name} placeholder="Enter your full name" className={inputCls(errors.name)} {...field('name')} />
                                {errors.name && <p className="mt-1.5 text-xs text-red-300">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="reg-email" className="block text-sm font-medium text-indigo-100 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                                <input id="reg-email" type="email" value={form.email} placeholder="coach@example.com" className={inputCls(errors.email)} {...field('email')} />
                                {errors.email && <p className="mt-1.5 text-xs text-red-300">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="reg-password" className="block text-sm font-medium text-indigo-100 mb-1.5">Password <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <input id="reg-password" type={showPass ? 'text' : 'password'} value={form.password} placeholder="Create a secure password" className={`${inputCls(errors.password)} pr-12`} {...field('password')} />
                                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors">
                                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {/* Strength meter */}
                                {form.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-white/10'}`} />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${strengthText[strength]}`}>{strengthLabel[strength]}</p>
                                    </div>
                                )}
                                {errors.password && <p className="mt-1 text-xs text-red-300">{errors.password}</p>}
                                <p className="mt-1 text-xs text-indigo-300/60">Min 8 chars · Uppercase · Number · Special character</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-indigo-100 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/60" />
                                    <input id="phone" type="tel" value={form.phone} placeholder="+1 555 123 4567" className={`${inputCls(errors.phone)} pl-10`} {...field('phone')} />
                                </div>
                                {errors.phone && <p className="mt-1.5 text-xs text-red-300">{errors.phone}</p>}
                            </div>

                            {/* Sport Type */}
                            <div>
                                <label htmlFor="sport" className="block text-sm font-medium text-indigo-100 mb-1.5">Sport Type <span className="text-red-400">*</span></label>
                                <select id="sport" value={form.sport_type} onChange={e => setForm(f => ({ ...f, sport_type: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                                    {['Basketball', 'Football', 'Soccer', 'Tennis', 'Volleyball', 'Baseball', 'Cricket', 'Rugby', 'Swimming', 'Athletics'].map(s => (
                                        <option key={s} value={s} className="text-gray-900">{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-medium text-indigo-100 mb-1.5">Experience Level <span className="text-red-400">*</span></label>
                                <div className="flex gap-2">
                                    {['New', 'Intermediate', 'Senior'].map(lvl => (
                                        <button key={lvl} type="button" onClick={() => setForm(f => ({ ...f, experience_level: lvl }))}
                                            className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${form.experience_level === lvl ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10'}`}>
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Organization */}
                        <div>
                            <label htmlFor="org" className="block text-sm font-medium text-indigo-100 mb-1.5">Organization / Club Name <span className="text-red-400">*</span></label>
                            <input id="org" type="text" value={form.organization} placeholder="Enter your organization or club name" className={inputCls(errors.organization)} {...field('organization')} />
                            {errors.organization && <p className="mt-1.5 text-xs text-red-300">{errors.organization}</p>}
                        </div>

                        {/* Terms */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" checked={termsChecked} onChange={e => { setTermsChecked(e.target.checked); setTermsTouched(true); }}
                                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500 cursor-pointer" />
                                <span className="text-sm text-indigo-200">
                                    I agree to the{' '}
                                    <Link href="#" className="text-indigo-300 underline underline-offset-2 hover:text-white">Terms of Service</Link>
                                    {' '}and{' '}
                                    <Link href="#" className="text-indigo-300 underline underline-offset-2 hover:text-white">Privacy Policy</Link>
                                </span>
                            </label>
                            {termsTouched && !termsChecked && <p className="mt-1.5 text-xs text-red-300">You must agree to the terms before registering.</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit" disabled={isLoading || (!allValid && Object.keys(touched).length > 0)}
                            className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                            {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Creating Account…</> : 'Create Account'}
                        </button>
                    </form>

                    {/* Security */}
                    <div className="mt-5 flex items-center justify-center gap-2 text-indigo-300/70 text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Your data is encrypted and securely transmitted</span>
                    </div>

                    <p className="text-center text-sm text-indigo-200 mt-4">
                        Already have an account?{' '}
                        <Link href="/" className="text-white font-semibold hover:text-indigo-200 transition-colors">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
