'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import KeywordHighlighter from '@/components/KeywordHighlighter';
import { Download, Copy, X, Star } from 'lucide-react';

const URGENCY_COLORS: Record<string, string> = { 'Immediate': 'bg-red-100 text-red-700', 'Same day': 'bg-orange-100 text-orange-700', 'Informational (no urgency)': 'bg-green-100 text-green-700' };
const TONE_COLORS: Record<string, string> = { 'Calm & empathetic': 'bg-blue-100 text-blue-700', 'Firm but respectful': 'bg-indigo-100 text-indigo-700', 'Supportive': 'bg-green-100 text-green-700', 'Educational': 'bg-amber-100 text-amber-700', 'Professional': 'bg-purple-100 text-purple-700' };

export default function ResponsesPage() {
    const { responses } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [viewResp, setViewResp] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [filterCoach, setFilterCoach] = useState('');
    const [filterTone, setFilterTone] = useState('');

    const coaches = Array.from(new Set(responses.map(r => r.coach)));
    const filtered = responses.filter(r =>
        (!filterCoach || r.coach === filterCoach) &&
        (!filterTone || r.tone.includes(filterTone))
    );

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast('Response copied to clipboard.', 'success');
    };

    const handleExport = () => {
        const csv = ['Coach,Situation Type,Tone,Urgency,Date',
            ...filtered.map(r => `${r.coach},${r.situation_type},${r.tone},${r.urgency},${r.date}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'responses.csv'; a.click();
        addToast('Export completed.', 'success');
    };

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Responses by Coaches</h1>
                        <p className="text-gray-500 text-sm mt-1">Review all AI-generated responses associated with coach situations.</p>
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
                    <select value={filterTone} onChange={e => setFilterTone(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">All Tones</option>
                        {['Calm', 'Firm', 'Supportive', 'Educational', 'Professional', 'Policy'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <span className="ml-auto text-xs text-gray-400 self-center">{filtered.length} responses</span>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Coach', 'Situation Type', 'Tone', 'Urgency', 'Response Snippet', 'Date', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((r, i) => (
                                    <tr key={r.id} className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{r.coach}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.situation_type}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${Object.entries(TONE_COLORS).find(([k]) => r.tone.toLowerCase().includes(k.split(' ')[0].toLowerCase()))?.[1] || 'bg-gray-100 text-gray-600'}`}>{r.tone}</span>
                                        </td>
                                        <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${URGENCY_COLORS[r.urgency] || 'bg-gray-100 text-gray-600'}`}>{r.urgency === 'Informational (no urgency)' ? 'Info' : r.urgency}</span></td>
                                        <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.snippet}</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setViewResp(r)} className="text-xs px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors">View</button>
                                                <button onClick={() => handleCopy(r.full_response)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {viewResp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900">{viewResp.situation_type} — {viewResp.coach}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{viewResp.date}</p>
                            </div>
                            <button onClick={() => setViewResp(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${URGENCY_COLORS[viewResp.urgency] || 'bg-gray-100 text-gray-600'}`}>{viewResp.urgency}</span>
                                <span className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold">{viewResp.tone}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Full AI-Generated Response</h4>
                                <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed border border-gray-100">
                                    <KeywordHighlighter text={viewResp.full_response} />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-700 mb-2">Rate this Response</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setRating(s)} className="focus:outline-none">
                                            <Star className={`w-6 h-6 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-300'}`} />
                                        </button>
                                    ))}
                                    {rating > 0 && <button onClick={() => { addToast('Response rated successfully.', 'success'); }} className="ml-2 text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-lg transition-colors">Save Rating</button>}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                                <button onClick={() => handleCopy(viewResp.full_response)} className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"><Copy className="w-4 h-4" />Copy</button>
                                <button onClick={() => { addToast('Marked as High Quality.', 'success'); }} className="text-sm font-semibold px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-colors">Mark High Quality</button>
                                <button onClick={() => { addToast('Flagged for review.', 'info'); }} className="text-sm font-semibold px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-xl transition-colors">Needs Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
