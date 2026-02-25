'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import { removeLocally } from '@/lib/features/savedSlice';
import Navigation from '@/components/Navigation';
import KeywordHighlighter from '@/components/KeywordHighlighter';
import { ToastContainer, useToast } from '@/components/Toast';
import { BookmarkCheck, Search, ChevronDown, Copy, Check, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

const URGENCY_COLORS: Record<string, string> = {
    'Immediate': 'bg-red-100 text-red-700',
    'Same day': 'bg-orange-100 text-orange-700',
    'Informational (no urgency)': 'bg-green-100 text-green-700',
};
const BEHAVIOR_COLORS: Record<string, string> = {
    'Calm but concerned': 'bg-blue-100 text-blue-700',
    'Emotional': 'bg-yellow-100 text-yellow-700',
    'Angry': 'bg-orange-100 text-orange-700',
    'Aggressive / threatening': 'bg-red-100 text-red-700',
    'Repeated complaints': 'bg-purple-100 text-purple-700',
};

export default function SavedPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { savedItems } = useSelector((state: RootState) => state.saved);
    const { toasts, addToast, removeToast } = useToast();
    const [selected, setSelected] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [search, setSearch] = useState('');
    const [filterSport, setFilterSport] = useState('');
    const [filterUrgency, setFilterUrgency] = useState('');

    useEffect(() => {
        if (!token) { router.push('/'); return; }
        if (!user) dispatch(fetchCurrentUser());
    }, [token, user, dispatch, router]);

    const sports = Array.from(new Set(savedItems.map((s: any) => s.sport_type)));

    const filtered = savedItems.filter((s: any) => {
        const q = search.toLowerCase();
        return (!search || s.description?.toLowerCase().includes(q) || s.situation_type?.toLowerCase().includes(q))
            && (!filterSport || s.sport_type === filterSport)
            && (!filterUrgency || s.urgency === filterUrgency);
    });

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        addToast('Response copied to clipboard ✓', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRemove = (id: number) => {
        dispatch(removeLocally(id));
        addToast('Removed from saved responses.', 'info');
        setSelected(null);
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex-1 md:ml-64 p-6 lg:p-8">
                {selected ? (
                    /* Detail View */
                    <div className="fade-in max-w-3xl mx-auto">
                        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-5 text-sm font-medium hover:bg-indigo-50 px-3 py-2 rounded-xl transition-colors -ml-1">
                            <ArrowLeft className="w-4 h-4" />Back to Saved Responses
                        </button>

                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
                                <h2 className="text-lg font-bold text-white">{selected.situation_type}</h2>
                                <p className="text-indigo-200 text-sm mt-1">{new Date(selected.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Sport', value: selected.sport_type },
                                        { label: 'Age Group', value: selected.athlete_age_group },
                                        { label: 'Channel', value: selected.channel },
                                        { label: 'Urgency', value: selected.urgency },
                                    ].map(i => (
                                        <div key={i.label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">{i.label}</p>
                                            <p className="text-sm font-semibold text-gray-800">{i.value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${BEHAVIOR_COLORS[selected.parent_behavior] || 'bg-gray-100 text-gray-600'}`}>Parent: {selected.parent_behavior}</span>
                                    <span className="text-xs px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">Tone: {selected.tone}</span>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Description of Incident</h4>
                                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 italic leading-relaxed border border-gray-100">"{selected.description}"</div>
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>AI Suggested Response
                                        </h4>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleCopy(selected.primary_response)}
                                                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </button>
                                            <button onClick={() => handleRemove(selected.id)}
                                                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                                <Trash2 className="w-3.5 h-3.5" />Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50/50 rounded-xl p-5 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed border border-indigo-100">
                                        <KeywordHighlighter text={selected.primary_response} />
                                    </div>
                                </div>

                                {selected.keywords?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Empathy Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selected.keywords.map((w: string, i: number) => (
                                                <span key={i} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">{w}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Cards List */
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <BookmarkCheck className="w-6 h-6 text-indigo-500" />Saved Responses
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">View and revisit your saved situations and AI-generated responses.</p>
                            </div>
                            <span className="text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-1.5">{filtered.length} saved</span>
                        </div>

                        {/* Filters */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-wrap gap-3">
                            <div className="flex-1 min-w-[200px] relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search saved responses…"
                                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div className="relative">
                                <select value={filterSport} onChange={e => setFilterSport(e.target.value)}
                                    className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                                    <option value="">All Sports</option>
                                    {sports.map((s: any) => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)}
                                    className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
                                    <option value="">All Urgencies</option>
                                    {['Immediate', 'Same day', 'Informational (no urgency)'].map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                                <BookmarkCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No saved responses yet</h3>
                                <p className="text-gray-500 text-sm">Save responses from the Dashboard or History page to see them here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map((s: any) => (
                                    <div key={s.id} onClick={() => setSelected(s)} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer p-5 flex flex-col gap-3 hover:-translate-y-0.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-sm font-bold text-gray-900 leading-tight">{s.situation_type}</span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${URGENCY_COLORS[s.urgency] || 'bg-gray-100 text-gray-600'}`}>
                                                {s.urgency === 'Informational (no urgency)' ? 'Informational' : s.urgency}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                            <span className="font-medium text-gray-600">Incident: </span>{s.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BEHAVIOR_COLORS[s.parent_behavior] || 'bg-gray-100 text-gray-600'}`}>{s.parent_behavior}</span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">{s.tone}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
