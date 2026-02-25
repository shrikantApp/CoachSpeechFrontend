'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { markFlaggedReviewed, archiveFlagged } from '@/lib/features/adminSlice';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { Star, X, CheckCircle, Flag, ArchiveIcon } from 'lucide-react';

const TONE_DATA = [
    { label: 'Calm & Empathetic', value: 35, color: 'bg-blue-500' },
    { label: 'Firm but Respectful', value: 25, color: 'bg-indigo-500' },
    { label: 'Supportive', value: 20, color: 'bg-green-500' },
    { label: 'Educational', value: 12, color: 'bg-amber-500' },
    { label: 'Policy-based', value: 8, color: 'bg-purple-500' },
];
const QUALITY_TREND = [3.8, 4.0, 3.9, 4.2, 4.1, 4.4, 4.3, 4.5, 4.2, 4.6, 4.5, 4.8, 4.6, 4.7];

export default function AnalyticsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { flagged, aiUsage } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [reviewItem, setReviewItem] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const avgRating = (aiUsage.reduce((s, r) => s + r.quality_score, 0) / aiUsage.length).toFixed(2);
    const flaggedCount = flagged.filter(f => f.status === 'Pending').length;
    const reviewedPct = Math.round((flagged.filter(f => f.status === 'Reviewed').length / (flagged.length || 1)) * 100);

    const filteredFlagged = flagged.filter(f => !filterStatus || f.status === filterStatus);
    const maxQ = Math.max(...QUALITY_TREND);

    const handleReview = () => {
        if (reviewItem) {
            dispatch(markFlaggedReviewed(reviewItem.id));
            addToast('Response marked as reviewed.', 'success');
            if (rating) addToast('Rating saved successfully.', 'success');
            setReviewItem(null); setRating(0); setFeedback('');
        }
    };

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Quality Control</h1>
                    <p className="text-gray-500 text-sm mt-1">Assess AI response quality, tone balance, and coach feedback trends.</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                        <p className="text-sm text-gray-500 font-medium">Average Quality Rating</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{avgRating}<span className="text-lg text-gray-400 font-normal">/5</span></p>
                        <div className="flex gap-1 mt-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                        <p className="text-sm text-gray-500 font-medium">Flagged Responses</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{flaggedCount}</p>
                        <p className="text-xs text-gray-400 mt-2">Pending review</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                        <p className="text-sm text-gray-500 font-medium">Reviewed Responses</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">{reviewedPct}%</p>
                        <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${reviewedPct}%` }} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quality Trend */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Quality Score Trend (14 Days)</h2>
                        <div className="flex items-end gap-1 h-28">
                            {QUALITY_TREND.map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                                    <div className="w-full rounded-t-md bg-gradient-to-t from-green-600 to-emerald-400 relative"
                                        style={{ height: `${((v - 3.5) / (maxQ - 3.5)) * 100}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">{v}</div>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tone Distribution */}
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Tone Distribution</h2>
                        <div className="space-y-3">
                            {TONE_DATA.map(t => (
                                <div key={t.label}>
                                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1"><span>{t.label}</span><span>{t.value}%</span></div>
                                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Flagged Table */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2"><Flag className="w-4 h-4 text-red-500" />Flagged Responses</h2>
                        <div className="flex items-center gap-2">
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">All Statuses</option>
                                <option>Pending</option><option>Reviewed</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Coach', 'Situation Type', 'Snippet', 'Flag Reason', 'Date', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredFlagged.map((f, i) => (
                                    <tr key={f.id} className={`hover:bg-red-50/20 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{f.coach}</td>
                                        <td className="px-4 py-3 text-gray-600">{f.situation_type}</td>
                                        <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{f.snippet}</td>
                                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">{f.flag_reason}</span></td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{f.date}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${f.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{f.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => setReviewItem(f)} title="Manual Review" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><CheckCircle className="w-4 h-4" /></button>
                                                <button onClick={() => { dispatch(archiveFlagged(f.id)); addToast('Flagged response archived.', 'info'); }} title="Archive" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><ArchiveIcon className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Manual Review Modal */}
            {reviewItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Manual Review</h3>
                            <button onClick={() => setReviewItem(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 italic">"{reviewItem.snippet}…"</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">Rate this response:</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setRating(s)} className="focus:outline-none">
                                            <Star className={`w-7 h-7 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 hover:text-amber-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Feedback</label>
                                <textarea rows={3} value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Provide feedback on this response…"
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleReview} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all text-sm">Approve</button>
                                <button onClick={() => { addToast('Flagged for improvement.', 'info'); setReviewItem(null); }} className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 font-semibold rounded-xl transition-all text-sm">Needs Improvement</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
