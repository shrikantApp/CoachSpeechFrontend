'use client';

import AdminLayout from '@/components/AdminLayout';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Users, MessageSquare, Brain, TrendingUp, AlertTriangle, CheckCircle, UserPlus, Upload } from 'lucide-react';

const TONE_DATA = [
    { label: 'Calm & Empathetic', value: 35, color: 'bg-blue-500' },
    { label: 'Firm but Respectful', value: 25, color: 'bg-indigo-500' },
    { label: 'Supportive', value: 20, color: 'bg-green-500' },
    { label: 'Educational', value: 12, color: 'bg-amber-500' },
    { label: 'Policy-based', value: 8, color: 'bg-purple-500' },
];

const ACTIVITY_FEED = [
    { icon: <UserPlus className="w-4 h-4 text-green-500" />, msg: 'New coach registered: Lisa Brown', time: '2 minutes ago' },
    { icon: <Upload className="w-4 h-4 text-blue-500" />, msg: 'Dataset "Conflict Responses v2" uploaded', time: '1 hour ago' },
    { icon: <AlertTriangle className="w-4 h-4 text-amber-500" />, msg: 'AI flagged a low-quality response for review', time: '3 hours ago' },
    { icon: <Brain className="w-4 h-4 text-indigo-500" />, msg: '48 AI responses generated today', time: '5 hours ago' },
    { icon: <CheckCircle className="w-4 h-4 text-green-500" />, msg: 'Response quality review completed by Admin', time: '1 day ago' },
];

// Sparkline bars (last 7 days mock)
const CHART_DATA = [12, 19, 8, 24, 31, 18, 27];

function MetricCard({ icon, label, value, sub, color }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
            <div className={`${color} p-3 rounded-xl flex-shrink-0`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const { coaches, aiUsage } = useSelector((state: RootState) => state.admin);
    const activeCoaches = coaches.filter(c => c.status === 'Active').length;
    const avgQuality = (aiUsage.reduce((s, r) => s + r.quality_score, 0) / aiUsage.length).toFixed(1);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening on Coach Speech.</p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <MetricCard icon={<Users className="w-5 h-5 text-blue-600" />} label="Total Coaches" value={coaches.length} sub={`${activeCoaches} active`} color="bg-blue-50" />
                    <MetricCard icon={<MessageSquare className="w-5 h-5 text-purple-600" />} label="Situations Submitted" value="284" sub="This month" color="bg-purple-50" />
                    <MetricCard icon={<Brain className="w-5 h-5 text-emerald-600" />} label="Responses Generated" value="1,247" sub="All time" color="bg-emerald-50" />
                    <MetricCard icon={<TrendingUp className="w-5 h-5 text-amber-600" />} label="AI Quality Score" value={`${avgQuality}/5`} sub="Average rating" color="bg-amber-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar chart - Situations per day */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Situations Submitted — Last 7 Days</h2>
                        <div className="flex items-end gap-3 h-32">
                            {CHART_DATA.map((v, i) => {
                                const max = Math.max(...CHART_DATA);
                                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-gray-500 font-medium">{v}</span>
                                        <div className="w-full rounded-t-lg bg-indigo-500 hover:bg-indigo-600 transition-colors" style={{ height: `${(v / max) * 80}%` }} />
                                        <span className="text-xs text-gray-400">{days[i]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie chart - Tone distribution */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Response Tone Distribution</h2>
                        <div className="space-y-3">
                            {TONE_DATA.map(t => (
                                <div key={t.label}>
                                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                                        <span>{t.label}</span><span>{t.value}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${t.color} rounded-full transition-all duration-500`} style={{ width: `${t.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Activity Feed */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {ACTIVITY_FEED.map((a, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">{a.icon}</div>
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">{a.msg}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-base font-bold text-gray-900 mb-4">Alerts & Notifications</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-sm text-green-800 font-medium">New coach registered</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                <Upload className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <p className="text-sm text-blue-800 font-medium">Dataset uploaded successfully</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <p className="text-sm text-amber-800 font-medium">AI flagged a low-quality response</p>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-800 font-medium">3 situations require follow-up</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
