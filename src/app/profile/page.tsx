'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/features/authSlice';
import Navigation from '@/components/Navigation';
import { UserCircle, Loader2, CheckCircle, Save, ChevronDown } from 'lucide-react';
import { useToast, ToastContainer } from '@/components/Toast';

function validateName(n: string) { return /^[a-zA-Z\s\-']{2,}$/.test(n); }
function validateOrg(o: string) { return /^[a-zA-Z0-9\s\-&.']{2,}$/.test(o); }

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { toasts, addToast, removeToast } = useToast();
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({ name: '', sport_type: 'Basketball', experience_level: 'New', organization: '' });
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!token) { router.push('/'); return; }
        if (!user) dispatch(fetchCurrentUser());
        else setForm({
            name: user.name || '',
            sport_type: user.sport_type || 'Basketball',
            experience_level: user.experience_level || 'New',
            organization: user.organization || '',
        });
    }, [token, user, dispatch, router]);

    const errors: Record<string, string> = {};
    if (touched.name && !validateName(form.name)) errors.name = form.name ? 'Name must contain only letters, spaces, or hyphens.' : 'Coach name is required.';
    if (touched.sport_type && !form.sport_type) errors.sport_type = 'Please select your sport type.';
    if (touched.experience_level && !form.experience_level) errors.experience_level = 'Please choose your experience level.';
    if (touched.organization && !validateOrg(form.organization)) errors.organization = form.organization ? 'Enter a valid organization or club name.' : 'Organization is required.';

    const allValid = validateName(form.name) && !!form.sport_type && !!form.experience_level && validateOrg(form.organization);

    const touch = (id: string) => setTouched(t => ({ ...t, [id]: true }));
    const inputCls = (err?: string) =>
        `w-full px-4 py-3 rounded-xl border ${err ? 'border-red-300 focus:ring-red-400 bg-red-50' : 'border-gray-200 focus:ring-indigo-500 bg-gray-50'} focus:outline-none focus:ring-2 text-gray-900 transition-all`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, sport_type: true, experience_level: true, organization: true });
        if (!allValid) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 1200));
        setSaving(false);
        addToast('Profile saved successfully!', 'success');
        setTimeout(() => router.push('/dashboard'), 1500);
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    const sports = ['Basketball', 'Football', 'Soccer', 'Tennis', 'Volleyball', 'Baseball', 'Cricket', 'Rugby', 'Swimming', 'Athletics'];
    const levels = ['New', 'Intermediate', 'Senior'];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="flex-1 md:ml-64 p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <UserCircle className="w-7 h-7 text-indigo-500" />
                            Coach Profile Management
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage your coaching profile details. All fields are required.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-lg font-bold text-indigo-600">
                            {user.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Coach Name */}
                            <div>
                                <label htmlFor="p-name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Coach Name <span className="text-red-500">*</span>
                                </label>
                                <input id="p-name" type="text" value={form.name} placeholder="Enter your full name"
                                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); touch('name'); }}
                                    onBlur={() => touch('name')}
                                    className={inputCls(errors.name)} />
                                {errors.name && <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Sport Type */}
                            <div>
                                <label htmlFor="p-sport" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Sport Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select id="p-sport" value={form.sport_type}
                                        onChange={e => { setForm(f => ({ ...f, sport_type: e.target.value })); touch('sport_type'); }}
                                        onBlur={() => touch('sport_type')}
                                        className={`${inputCls(errors.sport_type)} appearance-none pr-10`}>
                                        <option value="">Select your sport</option>
                                        {sports.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.sport_type && <p className="mt-1.5 text-sm text-red-500">{errors.sport_type}</p>}
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Experience Level <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    {levels.map(lvl => (
                                        <button key={lvl} type="button"
                                            onClick={() => { setForm(f => ({ ...f, experience_level: lvl })); touch('experience_level'); }}
                                            className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${form.experience_level === lvl
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                                {errors.experience_level && <p className="mt-1.5 text-sm text-red-500">{errors.experience_level}</p>}
                            </div>

                            {/* Organization */}
                            <div>
                                <label htmlFor="p-org" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Organization / Club Name <span className="text-red-500">*</span>
                                </label>
                                <input id="p-org" type="text" value={form.organization} placeholder="Enter your organization or club name"
                                    onChange={e => { setForm(f => ({ ...f, organization: e.target.value })); touch('organization'); }}
                                    onBlur={() => touch('organization')}
                                    className={inputCls(errors.organization)} />
                                {errors.organization && <p className="mt-1.5 text-sm text-red-500">{errors.organization}</p>}
                            </div>

                            {/* Hint */}
                            <p className="text-xs text-gray-400"><span className="text-red-500">*</span> All fields are required.</p>

                            {/* Submit */}
                            <button type="submit" disabled={saving}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                {saving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving…</> : <><Save className="w-5 h-5" />Save Profile</>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
