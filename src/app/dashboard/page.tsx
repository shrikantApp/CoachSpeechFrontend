'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import { submitSituation } from '@/lib/features/situationSlice';
import Navigation from '@/components/Navigation';
import AudioRecorder from '@/components/AudioRecorder';
import { MessageSquare, AlertCircle, Copy, Check, Lightbulb } from 'lucide-react';

export default function DashboardPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { currentSituation, isLoading, error } = useSelector((state: RootState) => state.situation as any);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        sport_type: 'Basketball',
        athlete_age_group: '13-16',
        situation_type: 'Performance-related concern',
        description: '',
        parent_behavior: 'Calm but concerned',
        channel: 'Email',
        tone: 'Professional & policy-based',
        urgency: 'Same day'
    });

    useEffect(() => {
        if (!token) {
            router.push('/');
        } else if (!user) {
            dispatch(fetchCurrentUser());
        }
    }, [token, user, dispatch, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(submitSituation(formData));
    };

    const handleCopy = (text: string, index: number) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    const handleTranscriptReady = (transcript: string) => {
        setFormData(prev => ({
            ...prev,
            description: prev.description ? `${prev.description} ${transcript}` : transcript
        }));
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <div className="flex-1 md:ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Coach Dashboard</h1>
                    <p className="text-gray-500 mt-2">Welcome back, Coach {user.name}. Generate professional responses below.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                            <MessageSquare className="w-5 h-5 mr-2 text-indigo-500" />
                            Describe Situation
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        value={formData.sport_type}
                                        onChange={(e) => setFormData({ ...formData, sport_type: e.target.value })}
                                    >
                                        <option>Cricket</option>
                                        <option>Basketball</option>
                                        <option>Football</option>
                                        <option>Soccer</option>
                                        <option>Tennis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        value={formData.athlete_age_group}
                                        onChange={(e) => setFormData({ ...formData, athlete_age_group: e.target.value })}
                                    >
                                        <option>Under 8</option>
                                        <option>9-12</option>
                                        <option>13-16</option>
                                        <option>17-18</option>
                                        <option>Adult</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Situation Type</label>
                                <select
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                    value={formData.situation_type}
                                    onChange={(e) => setFormData({ ...formData, situation_type: e.target.value })}
                                >
                                    <option>Performance-related concern</option>
                                    <option>Discipline / behavior issue</option>
                                    <option>Playing time complaint</option>
                                    <option>Injury / health concern</option>
                                    <option>Parent aggression / anger</option>
                                    <option>Miscommunication / misunderstanding</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="What exactly happened? When did it happen?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <AudioRecorder onTranscriptReady={handleTranscriptReady} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent Behavior</label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        value={formData.parent_behavior}
                                        onChange={(e) => setFormData({ ...formData, parent_behavior: e.target.value })}
                                    >
                                        <option>Calm but concerned</option>
                                        <option>Emotional</option>
                                        <option>Angry</option>
                                        <option>Aggressive / threatening</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel</label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 py-2.5 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                        value={formData.channel}
                                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                    >
                                        <option>Email</option>
                                        <option>WhatsApp / Chat</option>
                                        <option>In-person talking points</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !formData.description.trim()}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4"
                            >
                                {isLoading ? 'Generating Professional Response...' : 'Generate Response'}
                            </button>
                        </form>
                    </div>

                    {/* Result Section */}
                    <div className="flex flex-col">
                        {currentSituation ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold flex items-center text-gray-800">
                                        <AlertCircle className="w-5 h-5 mr-2 text-green-500" />
                                        Recommended Response
                                    </h2>
                                    <div className="relative group">
                                        <button
                                            onClick={() => handleCopy(currentSituation.primary_response || '', 0)}
                                            className="flex items-center space-x-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-lg relative z-10"
                                            aria-label="Copy primary response"
                                        >
                                            {copiedIndex === 0 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            <span>{copiedIndex === 0 ? 'Copied!' : 'Copy'}</span>
                                        </button>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                            {copiedIndex === 0 ? 'Success!' : 'Copy to clipboard'}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100 mb-6">
                                    {currentSituation.primary_response}
                                </div>

                                {currentSituation.alternate_responses && currentSituation.alternate_responses.length > 0 && (
                                    <div className="mt-2 mb-6 space-y-4 border-t border-gray-100 pt-6">
                                        <div className="flex items-center text-gray-600 mb-3">
                                            <Lightbulb className="w-4 h-4 mr-2" />
                                            <h3 className="text-sm font-semibold uppercase tracking-wider">Alternate Variations</h3>
                                        </div>
                                        {currentSituation.alternate_responses.map((alt: string, idx: number) => (
                                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 relative group hover:border-indigo-200 transition-colors">
                                                <p className="text-sm text-gray-600 pr-12">{alt}</p>
                                                <div className="absolute right-3 top-3 group">
                                                    <button
                                                        onClick={() => handleCopy(alt, idx + 1)}
                                                        className="text-gray-400 hover:text-indigo-600 p-2 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                                                        aria-label="Copy alternate variation"
                                                    >
                                                        {copiedIndex === idx + 1 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                        {copiedIndex === idx + 1 ? 'Copied' : 'Copy'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentSituation.keywords && currentSituation.keywords.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Key Empathy Highlights</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentSituation.keywords.map((word: string, i: number) => (
                                                <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                    {word}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 p-8 h-full flex flex-col items-center justify-center text-center">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                    <MessageSquare className="w-8 h-8 text-indigo-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No active situation</h3>
                                <p className="text-gray-500 max-w-sm">Fill out the form on the left to receive a state-of-the-art, professionally crafted response.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
