'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { FileText, Download, Flag, X } from 'lucide-react';

const URGENCY_COLORS: Record<string, string> = {
    'Immediate': 'bg-red-100 text-red-700',
    'Same day': 'bg-orange-100 text-orange-700',
    'Informational (no urgency)': 'bg-green-100 text-green-700',
};

export default function SituationsPage() {
    const { situations } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [viewSit, setViewSit] = useState<any>(null);
    const [filterCoach, setFilterCoach] = useState('');
    const [filterUrgency, setFilterUrgency] = useState('');
    const coaches = Array.from(new Set(situations.map(s => s.coach)));

    const filtered = situations.filter(s =>
        (!filterCoach || s.coach === filterCoach) &&
        (!filterUrgency || s.urgency === filterUrgency)
    );

    const handleExport = () => {
        const csv = ['Coach,Sport Type,Situation Type,Urgency,Date',
            ...filtered.map(s => `${s.coach},${s.sport_type},${s.situation_type},${s.urgency},${s.date}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'situations.csv'; a.click();
        addToast('Situation exported successfully.', 'success');
    };

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileText className="w-7 h-7 text-blue-600" />All Submitted Situations</h1>
                        <p className="text-gray-500 text-sm mt-1">Browse and manage all coach-submitted situations.</p>
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                        <Download className="w-4 h-4" />Export CSV
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-3 shadow-sm">
                    <select value={filterCoach} onChange={e => setFilterCoach(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Coaches</option>
                        {coaches.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Urgencies</option>
                        {['Immediate', 'Same day', 'Informational (no urgency)'].map(u => <option key={u}>{u}</option>)}
                    </select>
                    {(filterCoach || filterUrgency) && <button onClick={() => { setFilterCoach(''); setFilterUrgency(''); }} className="text-sm text-gray-500 hover:text-gray-700 px-2 py-2 rounded-xl hover:bg-gray-100 transition-colors">Clear filters</button>}
                    <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} results</span>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p className="text-sm">No situations found for current filters.</p>
                    </div>
                )}

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Coach Name', 'Sport Type', 'Situation Type', 'Urgency', 'Date', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((s, i) => (
                                    <tr key={s.id} className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{s.coach}</td>
                                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">{s.sport_type}</span></td>
                                        <td className="px-4 py-3 text-gray-700">{s.situation_type}</td>
                                        <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${URGENCY_COLORS[s.urgency] || 'bg-gray-100 text-gray-600'}`}>{s.urgency === 'Informational (no urgency)' ? 'Informational' : s.urgency}</span></td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.date}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => setViewSit(s)} className="text-xs px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors">View</button>
                                                <button onClick={() => addToast('Flagged for follow-up.', 'info')} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Flag className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewSit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">{viewSit.situation_type}</h3>
                            <button onClick={() => setViewSit(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[['Coach', viewSit.coach], ['Sport', viewSit.sport_type], ['Urgency', viewSit.urgency], ['Date', viewSit.date]].map(([l, v]) => (
                                    <div key={l} className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{l}</p>
                                        <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Parent Behavior</p>
                                <span className="text-sm font-semibold text-gray-800">{viewSit.parent_behavior}</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Desired Tone</p>
                                <span className="text-sm font-semibold text-gray-800">{viewSit.tone}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">Full Description of Incident</p>
                                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 italic leading-relaxed border border-gray-100">"{viewSit.description}"</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
