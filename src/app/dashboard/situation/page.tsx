'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import { submitSituation, clearCurrentSituation } from '@/lib/features/situationSlice';
import { saveLocally } from '@/lib/features/savedSlice';
import Navigation from '@/components/Navigation';
import KeywordHighlighter from '@/components/KeywordHighlighter';
import AudioRecorder from '@/components/AudioRecorder';
import { ToastContainer, useToast } from '@/components/Toast';
import {
    MessageSquare, Loader2, Copy, Check, Bookmark, BookmarkCheck,
    ChevronDown, RotateCcw, Sparkles, AlertCircle, Brain, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const SPORTS = ['Basketball', 'Football', 'Soccer', 'Tennis', 'Volleyball', 'Baseball', 'Cricket', 'Rugby'];
const AGE_GROUPS = ['Under 8', '9–12', '13–16', '17–18', 'Adult'];
const SITUATION_TYPES = ['Performance-related concern', 'Discipline / behavior issue', 'Playing time complaint', 'Injury / health concern', 'Parent aggression / anger', 'Miscommunication / misunderstanding', 'Selection / non-selection', 'Other'];
const PARENT_BEHAVIORS = ['Calm but concerned', 'Emotional', 'Angry', 'Aggressive / threatening', 'Repeated complaints'];
const CHANNELS = ['Email', 'WhatsApp / Chat', 'In-person talking points'];
const TONES = ['Calm & empathetic', 'Firm but respectful', 'Educational', 'Supportive', 'Professional & policy-based'];
const URGENCIES = ['Immediate', 'Same day', 'Informational (no urgency)'];

function SelectField({ label, id, value, onChange, onBlur, options, placeholder, error }: any) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label} <span className="text-red-500">*</span></label>
            <div className="relative">
                <select id={id} value={value} onChange={onChange} onBlur={onBlur}
                    className={`w-full px-4 py-2.5 rounded-xl border appearance-none pr-9 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-800 transition-all`}>
                    <option value="">{placeholder}</option>
                    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default function SituationInputPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { currentSituation, isLoading } = useSelector((state: RootState) => state.situation as any);
    const { toasts, addToast, removeToast } = useToast();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

    const [form, setForm] = useState({
        sport_type: '', athlete_age_group: '', situation_type: '', other_description: '',
        description: '', parent_behavior: '', channel: '', tone: '', urgency: ''
    });
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!token) { router.push('/'); return; }
        if (!user) dispatch(fetchCurrentUser());
    }, [token, user, dispatch, router]);

    const isOther = form.situation_type === 'Other';

    const errors: Record<string, string> = {};
    const req = (key: string, msg: string) => { if (touched[key] && !form[key as keyof typeof form]) errors[key] = msg; };
    req('sport_type', 'Please select a sport type.');
    req('athlete_age_group', "Please select the athlete's age group.");
    req('situation_type', 'Please select the situation type.');
    if (isOther && touched.other_description && !form.other_description) errors.other_description = 'Please describe the situation.';
    if (touched.description && !form.description.trim()) errors.description = 'Please provide a complete description of the incident.';
    req('parent_behavior', "Please assess the parent's behavior.");
    req('channel', 'Please select your preferred communication channel.');
    req('tone', 'Please select the desired tone for the response.');
    req('urgency', 'Please select the urgency level.');

    const allValid = form.sport_type && form.athlete_age_group && form.situation_type &&
        (!isOther || form.other_description) && form.description.trim() &&
        form.parent_behavior && form.channel && form.tone && form.urgency;

    const touch = (key: string) => setTouched(t => ({ ...t, [key]: true }));
    const set = (key: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
        setForm(f => ({ ...f, [key]: e.target.value }));
        touch(key);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const allKeys = ['sport_type', 'athlete_age_group', 'situation_type', 'description', 'parent_behavior', 'channel', 'tone', 'urgency'];
        if (isOther) allKeys.push('other_description');
        setTouched(allKeys.reduce((a, k) => ({ ...a, [k]: true }), {}));
        if (!allValid) return;
        const payload = {
            sport_type: form.sport_type, athlete_age_group: form.athlete_age_group,
            situation_type: isOther ? (form.other_description || 'Other') : form.situation_type,
            description: form.description, parent_behavior: form.parent_behavior,
            channel: form.channel, tone: form.tone, urgency: form.urgency
        };
        dispatch(submitSituation(payload));
    };

    const handleReset = () => {
        setForm({ sport_type: '', athlete_age_group: '', situation_type: '', other_description: '', description: '', parent_behavior: '', channel: '', tone: '', urgency: '' });
        setTouched({});
        dispatch(clearCurrentSituation());
    };

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        addToast('Response copied to clipboard ✓', 'success');
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSave = (situation: any) => {
        if (!savedIds.has(situation.id)) {
            dispatch(saveLocally(situation));
            setSavedIds(s => new Set(s).add(situation.id));
            addToast('Response saved successfully.', 'success');
        }
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex-1 md:ml-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Situation Input</h1>
                            <p className="text-xs text-gray-500">Fill in details to get an AI-generated professional response</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.sport_type || 'Coach'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-sm font-bold text-indigo-600">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="p-6 lg:p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* LEFT: Situation Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <MessageSquare className="w-5 h-5" />
                                    <h2 className="font-semibold">Situation Details</h2>
                                </div>
                                <button onClick={handleReset} className="text-indigo-200 hover:text-white transition-colors flex items-center gap-1 text-sm">
                                    <RotateCcw className="w-4 h-4" />Reset
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
                                {/* A. Basic Context */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 flex items-center gap-1.5">
                                        <span className="bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5 font-mono">A</span> Basic Context
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectField label="Sport Type" id="sport" value={form.sport_type} onChange={set('sport_type')} onBlur={() => touch('sport_type')} options={SPORTS} placeholder="Select sport" error={errors.sport_type} />
                                        <SelectField label="Athlete Age Group" id="age" value={form.athlete_age_group} onChange={set('athlete_age_group')} onBlur={() => touch('athlete_age_group')} options={AGE_GROUPS} placeholder="Select age group" error={errors.athlete_age_group} />
                                    </div>
                                </div>

                                {/* B. Situation Type */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 flex items-center gap-1.5">
                                        <span className="bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5 font-mono">B</span> Situation Type
                                    </h3>
                                    <SelectField label="Situation Type" id="sit-type" value={form.situation_type} onChange={set('situation_type')} onBlur={() => touch('situation_type')} options={SITUATION_TYPES} placeholder="Select situation type" error={errors.situation_type} />
                                    {isOther && (
                                        <div className="mt-3 fade-in">
                                            <label htmlFor="other-desc" className="block text-sm font-semibold text-gray-700 mb-1.5">Other Situation Description <span className="text-red-500">*</span></label>
                                            <input id="other-desc" type="text" value={form.other_description} onChange={set('other_description')} onBlur={() => touch('other_description')}
                                                placeholder="Please describe the situation"
                                                className={`w-full px-4 py-2.5 rounded-xl border ${errors.other_description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                                            {errors.other_description && <p className="mt-1 text-xs text-red-500">{errors.other_description}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* C. Description */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 flex items-center gap-1.5">
                                        <span className="bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5 font-mono">C</span> Description of Incident
                                    </h3>
                                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Incident Description <span className="text-red-500">*</span></label>
                                    <textarea id="description" rows={4} value={form.description}
                                        onChange={e => { setForm(f => ({ ...f, description: e.target.value })); touch('description'); }}
                                        onBlur={() => touch('description')}
                                        placeholder="What exactly happened? When did it happen? Was it during training, match, or outside the field?"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all`} />
                                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                                    <AudioRecorder onTranscriptReady={(transcript) => {
                                        setForm(f => ({ ...f, description: (f.description ? f.description + ' ' : '') + transcript }));
                                        touch('description');
                                    }} />
                                </div>

                                {/* D-G */}
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3 flex items-center gap-1.5">
                                        <span className="bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5 font-mono">D–G</span> Assessment & Preferences
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <SelectField label="Parent Behavior" id="parent-beh" value={form.parent_behavior} onChange={set('parent_behavior')} onBlur={() => touch('parent_behavior')} options={PARENT_BEHAVIORS} placeholder="Select behavior" error={errors.parent_behavior} />
                                        <SelectField label="Communication Channel" id="channel" value={form.channel} onChange={set('channel')} onBlur={() => touch('channel')} options={CHANNELS} placeholder="Select channel" error={errors.channel} />
                                        <SelectField label="Tone of Response" id="tone" value={form.tone} onChange={set('tone')} onBlur={() => touch('tone')} options={TONES} placeholder="Select tone" error={errors.tone} />
                                        <SelectField label="Urgency Level" id="urgency" value={form.urgency} onChange={set('urgency')} onBlur={() => touch('urgency')} options={URGENCIES} placeholder="Select urgency" error={errors.urgency} />
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                                    {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating Response…</> : <><Sparkles className="w-5 h-5" />Generate AI Response</>}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: AI Response Panel */}
                        <div className="flex flex-col">
                            {currentSituation ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in flex flex-col">
                                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-white">
                                                <Brain className="w-5 h-5" />
                                                <h2 className="font-semibold">AI Response</h2>
                                            </div>
                                            <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">High Confidence ✓</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                        {/* Primary response */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />AI Suggested
                                                    </span>
                                                    <h3 className="text-sm font-bold text-gray-800">Recommended Response</h3>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleSave(currentSituation)}
                                                        className={`p-2 rounded-lg transition-colors ${savedIds.has(currentSituation.id) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                        {savedIds.has(currentSituation.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                                    </button>
                                                    <button onClick={() => handleCopy(currentSituation.primary_response, 0)}
                                                        className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                                                        {copiedIndex === 0 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                        {copiedIndex === 0 ? 'Copied!' : 'Copy'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                                                <KeywordHighlighter text={currentSituation.primary_response} />
                                            </div>
                                        </div>

                                        {/* Alternate responses */}
                                        {currentSituation.alternate_responses?.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <span className="w-5 h-px bg-gray-300"></span>Alternate Response Options<span className="flex-1 h-px bg-gray-300"></span>
                                                </h3>
                                                <div className="space-y-3">
                                                    {currentSituation.alternate_responses.map((alt: string, idx: number) => {
                                                        const tones = ['More Empathetic', 'Formal / Policy-based', 'Concise & Professional'];
                                                        return (
                                                            <div key={idx} className="bg-white border border-gray-200 hover:border-indigo-200 rounded-xl p-4 transition-colors">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-semibold text-gray-500">Alternate {idx + 1} — {tones[idx] || 'Variation'}</span>
                                                                    <div className="flex gap-1.5">
                                                                        <button onClick={() => handleSave(currentSituation)} className="text-gray-400 hover:text-indigo-500 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                                                                            <Bookmark className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => handleCopy(alt, idx + 1)} className="text-gray-400 hover:text-indigo-500 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                                                                            {copiedIndex === idx + 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-600 leading-relaxed"><KeywordHighlighter text={alt} /></p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Keywords */}
                                        {currentSituation.keywords?.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Empathy Highlights</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {currentSituation.keywords.map((w: string, i: number) => (
                                                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{w}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50/70 rounded-2xl border-2 border-dashed border-gray-200 p-10 h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                        <Brain className="w-8 h-8 text-indigo-200" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Response Panel</h3>
                                    <p className="text-gray-400 text-sm max-w-xs">Complete the situation form on the left and click "Generate AI Response" to see your professional communication here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
