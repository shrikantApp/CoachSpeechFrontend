'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { toggleCoachStatus, addCoach } from '@/lib/features/adminSlice';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { Search, Plus, X, Eye, Edit2, UserCheck, UserX, ChevronDown } from 'lucide-react';

const EXPERIENCE_COLORS: Record<string, string> = {
    'New': 'bg-green-100 text-green-700',
    'Intermediate': 'bg-blue-100 text-blue-700',
    'Senior': 'bg-purple-100 text-purple-700',
};

function Modal({ title, onClose, children }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

export default function ManageCoachesPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { coaches } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [viewCoach, setViewCoach] = useState<any>(null);
    const [newCoach, setNewCoach] = useState({ name: '', email: '', password: '', sport_type: 'Basketball', experience_level: 'New', organization: '' });
    const [addErrors, setAddErrors] = useState<any>({});

    const filtered = coaches.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.sport_type.toLowerCase().includes(search.toLowerCase()) ||
        c.organization.toLowerCase().includes(search.toLowerCase())
    );

    const validateAdd = () => {
        const errs: any = {};
        if (!newCoach.name.trim()) errs.name = 'Name is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCoach.email)) errs.email = newCoach.email ? 'Invalid email format.' : 'Email is required.';
        if (!newCoach.password || newCoach.password.length < 6) errs.password = 'Password must be at least 6 characters.';
        if (!newCoach.organization.trim()) errs.organization = 'Organization is required.';
        setAddErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleAddCoach = () => {
        if (!validateAdd()) return;
        dispatch(addCoach(newCoach));
        setShowAddModal(false);
        setNewCoach({ name: '', email: '', password: '', sport_type: 'Basketball', experience_level: 'New', organization: '' });
        addToast('Coach added successfully.', 'success');
    };

    const handleToggle = (id: number, currentStatus: string) => {
        dispatch(toggleCoachStatus(id));
        addToast(`Coach ${currentStatus === 'Active' ? 'deactivated' : 'activated'}.`, currentStatus === 'Active' ? 'info' : 'success');
    };

    const inputCls = (err?: string) => `w-full px-3 py-2.5 rounded-xl border ${err ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`;

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Coaches</h1>
                        <p className="text-gray-500 text-sm mt-1">View, add, edit, and manage all registered coaches.</p>
                    </div>
                    <button onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" />Add New Coach
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, sport, or organization…"
                        className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400" />
                    <span className="text-xs text-gray-400 flex-shrink-0">{filtered.length} coach{filtered.length !== 1 ? 'es' : ''}</span>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Coach Name', 'Email', 'Sport Type', 'Level', 'Organization', 'Status', 'Joined', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((coach, i) => (
                                    <tr key={coach.id} className={`hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {coach.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-900 whitespace-nowrap">{coach.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{coach.email}</td>
                                        <td className="px-4 py-3 text-gray-700 font-medium">{coach.sport_type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${EXPERIENCE_COLORS[coach.experience_level] || 'bg-gray-100 text-gray-600'}`}>{coach.experience_level}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{coach.organization}</td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => handleToggle(coach.id, coach.status)}
                                                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${coach.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'}`}>
                                                {coach.status === 'Active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}{coach.status}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{coach.joined}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setViewCoach(coach)} title="View Details" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button title="Edit" className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Coach Modal */}
            {showAddModal && (
                <Modal title="Add New Coach" onClose={() => setShowAddModal(false)}>
                    <div className="space-y-4">
                        {[
                            { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Coach Name' },
                            { id: 'email', label: 'Email Address', type: 'email', placeholder: 'coach@example.com' },
                            { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
                            { id: 'organization', label: 'Organization / Club', type: 'text', placeholder: 'Club Name' },
                        ].map(f => (
                            <div key={f.id}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label} *</label>
                                <input type={f.type} value={(newCoach as any)[f.id]} placeholder={f.placeholder}
                                    onChange={e => setNewCoach(n => ({ ...n, [f.id]: e.target.value }))}
                                    className={inputCls(addErrors[f.id])} />
                                {addErrors[f.id] && <p className="mt-1 text-xs text-red-500">{addErrors[f.id]}</p>}
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sport Type *</label>
                                <div className="relative">
                                    <select value={newCoach.sport_type} onChange={e => setNewCoach(n => ({ ...n, sport_type: e.target.value }))} className={`${inputCls()} appearance-none pr-8`}>
                                        {['Basketball', 'Football', 'Soccer', 'Tennis', 'Cricket', 'Running', 'Baseball'].map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience *</label>
                                <div className="relative">
                                    <select value={newCoach.experience_level} onChange={e => setNewCoach(n => ({ ...n, experience_level: e.target.value }))} className={`${inputCls()} appearance-none pr-8`}>
                                        {['New', 'Intermediate', 'Senior'].map(l => <option key={l}>{l}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={handleAddCoach} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm">Save Coach</button>
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-all text-sm">Cancel</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* View Coach Modal */}
            {viewCoach && (
                <Modal title={`Coach Details — ${viewCoach.name}`} onClose={() => setViewCoach(null)}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xl font-bold">{viewCoach.name.charAt(0)}</div>
                            <div>
                                <p className="font-bold text-gray-900">{viewCoach.name}</p>
                                <p className="text-sm text-gray-500">{viewCoach.email}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${viewCoach.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{viewCoach.status}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[['Sport', viewCoach.sport_type], ['Level', viewCoach.experience_level], ['Organization', viewCoach.organization], ['Joined', viewCoach.joined]].map(([l, v]) => (
                                <div key={l} className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{l}</p>
                                    <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-xl">
                            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-1">Summary</p>
                            <p className="text-sm text-indigo-800">14 situations submitted · 42 AI responses generated · 8 saved responses</p>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout>
    );
}
