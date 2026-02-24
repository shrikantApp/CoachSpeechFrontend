'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { registerUser } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        sport_type: 'Basketball',
        experience_level: 'New',
        organization: ''
    });
    const [successMsg, setSuccessMsg] = useState('');

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
            setSuccessMsg('Profile created successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-4 py-12">
            <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                <div className="flex items-center mb-8">
                    <Link href="/" className="text-indigo-200 hover:text-white transition-colors p-2 -ml-2 rounded-lg hover:bg-white/10">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex-1 text-center pr-8">
                        <div className="bg-indigo-500 p-3 rounded-full inline-block mb-3 shadow-lg shadow-indigo-500/30">
                            <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Profile</h2>
                        <p className="text-indigo-200 text-sm">Join Coach Speech to elevate your communication.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm text-center font-medium">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="Coach Carter"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="coach@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Organization / Club</label>
                            <input
                                type="text"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                                placeholder="Richmond High"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Sport Type</label>
                            <select
                                value={formData.sport_type}
                                onChange={(e) => setFormData({ ...formData, sport_type: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 appearance-none"
                            >
                                <option value="Basketball" className="text-gray-900">Basketball</option>
                                <option value="Football" className="text-gray-900">Football</option>
                                <option value="Soccer" className="text-gray-900">Soccer</option>
                                <option value="Tennis" className="text-gray-900">Tennis</option>
                                <option value="Volleyball" className="text-gray-900">Volleyball</option>
                                <option value="Baseball" className="text-gray-900">Baseball</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-2">Experience Level</label>
                            <select
                                value={formData.experience_level}
                                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 appearance-none"
                            >
                                <option value="New" className="text-gray-900">New (0-2 years)</option>
                                <option value="Intermediate" className="text-gray-900">Intermediate (3-5 years)</option>
                                <option value="Senior" className="text-gray-900">Senior (5+ years)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 mt-8 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}
