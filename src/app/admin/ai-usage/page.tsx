'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { Download, Brain, Clock, TrendingUp, Zap } from 'lucide-react';

const USAGE_CHART = [8, 15, 12, 22, 18, 28, 24, 31, 19, 25, 30, 27, 35, 29];

export default function AIUsagePage() {
    const { aiUsage } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [filterDate, setFilterDate] = useState('');
    const [filterTone, setFilterTone] = useState('');

    const avgTime = (aiUsage.reduce((s, r) => s + r.processing_time, 0) / aiUsage.length).toFixed(1);
    const topCoach = aiUsage.reduce((a, b) => a.coach === b.coach ? a : a, aiUsage[0])?.coach;
    const mostTone = 'Calm & empathetic';

    const filtered = aiUsage.filter(r =>
        (!filterDate || r.date === filterDate) &&
        (!filterTone || r.tone.includes(filterTone))
    );

    const handleExport = () => {
        const csv = ['Date,Coach,Situation Type,Tone,Response Length,Processing Time,Quality Score',
            ...filtered.map(r => `${r.date},${r.coach},${r.situation_type},${r.tone},${r.response_length},${r.processing_time},${r.quality_score}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'ai_usage.csv'; a.click();
        addToast('Report exported successfully.', 'success');
    };

    const max = Math.max(...USAGE_CHART);

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Usage Overview</h1>
                        <p className="text-gray-500 text-sm mt-1">Monitor AI activity, response quality, and usage patterns.</p>
                    </div>
                    <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                        <Download className="w-4 h-4" />Export Report
                    </button>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { icon: <Brain className="w-5 h-5 text-blue-600" />, label: 'Responses This Month', value: '284', color: 'bg-blue-50' },
                        { icon: <Clock className="w-5 h-5 text-purple-600" />, label: 'Avg. Response Time', value: `${avgTime}s`, color: 'bg-purple-50' },
                        { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, label: 'Most Active Coach', value: topCoach || '-', color: 'bg-emerald-50' },
                        { icon: <Zap className="w-5 h-5 text-amber-600" />, label: 'Most Used Tone', value: mostTone, color: 'bg-amber-50' },
                    ].map(m => (
                        <div key={m.label} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex items-center gap-3">
                            <div className={`${m.color} p-2.5 rounded-xl flex-shrink-0`}>{m.icon}</div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                                <p className="text-lg font-bold text-gray-900 truncate">{m.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Line Chart */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                    <h2 className="text-base font-bold text-gray-900 mb-5">Responses Generated Over Time (Last 14 Days)</h2>
                    <div className="relative h-36">
                        <div className="flex items-end gap-1.5 h-full">
                            {USAGE_CHART.map((v, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 hover:from-indigo-600 hover:to-indigo-400 transition-colors cursor-pointer relative group"
                                        style={{ height: `${(v / max) * 100}%` }}>
                                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{v}</div>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
                        <h2 className="font-bold text-gray-900 flex-1">Usage Details</h2>
                        <select value={filterTone} onChange={e => setFilterTone(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">All Tones</option>
                            {['Calm', 'Empathetic', 'Firm', 'Supportive', 'Educational', 'Professional'].map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>{['Date', 'Coach', 'Situation Type', 'Tone', 'Length', 'Proc. Time', 'Quality'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((r, i) => (
                                    <tr key={r.id} className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{r.coach}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.situation_type}</td>
                                        <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">{r.tone}</span></td>
                                        <td className="px-4 py-3 text-gray-600">{r.response_length} chars</td>
                                        <td className="px-4 py-3 text-gray-600">{r.processing_time}s</td>
                                        <td className="px-4 py-3">
                                            <span className={`font-bold ${r.quality_score >= 4.5 ? 'text-green-600' : r.quality_score >= 4 ? 'text-blue-600' : 'text-amber-600'}`}>{r.quality_score}/5</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
