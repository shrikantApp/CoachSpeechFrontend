'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ToastContainer, useToast } from '@/components/Toast';
import { CreditCard, Download, ExternalLink, ShieldCheck, Zap, Package, Calendar, Clock } from 'lucide-react';

const BILLING_HISTORY = [
    { id: 'INV-2026-001', date: 'Feb 15, 2026', amount: '$49.00', status: 'Paid', plan: 'Premium (Monthly)' },
    { id: 'INV-2026-002', date: 'Jan 15, 2026', amount: '$49.00', status: 'Paid', plan: 'Premium (Monthly)' },
    { id: 'INV-2025-012', date: 'Dec 15, 2025', amount: '$19.00', status: 'Paid', plan: 'Basic (Monthly)' },
];

export default function BillingPage() {
    const { toasts, addToast, removeToast } = useToast();
    const [usage] = useState({ used: 42, total: 50, percent: 84 });

    const handleDownload = (id: string) => {
        addToast(`Downloading invoice ${id}...`, 'info');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />

            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                <ToastContainer toasts={toasts} removeToast={removeToast} />

                <div className="max-w-5xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900">Billing & Subscription</h1>
                        <p className="text-gray-500 mt-1">Manage your plan, payment methods, and view billing history.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Current Plan Card */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-8 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                                <Zap className="w-8 h-8 fill-emerald-600/20" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h2 className="text-xl font-bold text-gray-900">Premium Plan</h2>
                                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ring-4 ring-emerald-50">Active</span>
                                                </div>
                                                <p className="text-sm text-gray-400 font-medium">Next billing date: March 15, 2026</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-gray-900">$49.00</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase">per month</p>
                                        </div>
                                    </div>

                                    {/* Usage bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-gray-600">AI Response Usage</span>
                                            <span className="text-blue-600 cursor-help" title="Resets on March 15">{usage.used} / {usage.total} used</span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${usage.percent > 90 ? 'bg-red-500' : usage.percent > 70 ? 'bg-amber-500' : 'bg-blue-600'}`}
                                                style={{ width: `${usage.percent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 italic">Usage refreshes in 18 days.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-500 px-4">Need more capacity? View enterprise options.</p>
                                    <button className="text-blue-600 text-xs font-bold hover:underline px-4">Contact Sales</button>
                                </div>
                            </div>

                            {/* Billing details grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 text-blue-600">
                                        <CreditCard className="w-5 h-5" />
                                        <h3 className="font-bold text-gray-800">Payment Method</h3>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-600 text-white w-10 h-6 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                                            <span className="text-sm font-bold text-gray-700">•••• 4242</span>
                                        </div>
                                        <button className="text-xs text-blue-600 font-bold hover:text-blue-800">Update</button>
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                                    <div className="flex items-center gap-3 text-purple-600">
                                        <Package className="w-5 h-5" />
                                        <h3 className="font-bold text-gray-800">Subscription Meta</h3>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Plan Start</span>
                                            <span className="font-bold text-gray-700">Dec 15, 2025</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Renewal Pattern</span>
                                            <span className="font-bold text-gray-700">Monthly</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: History & Actions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" /> Recent History
                                </h3>
                                <div className="space-y-4">
                                    {BILLING_HISTORY.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                                            <div>
                                                <p className="text-sm font-extrabold text-gray-800">{item.amount}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.date}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(item.id)}
                                                className="p-2 text-gray-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-all">
                                    View full history
                                </button>
                            </div>

                            <div className="bg-blue-600 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <h3 className="font-bold text-xl relative">Refer a Coach</h3>
                                <p className="text-sm text-blue-50 relative opacity-90">Get 1 month of Premium free for every coach you invite who signs up.</p>
                                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm relative hover:bg-blue-50 transition-colors">
                                    Copy Invite Link
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 uppercase tracking-wide">
                            <ShieldCheck className="w-3 h-3" /> Secure billing powered by Stripe & PCI Compliance
                        </p>
                        <div className="flex gap-4">
                            <button className="text-sm font-bold text-red-500 hover:underline">Cancel Subscription</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-bold text-gray-500 hover:text-gray-900">Manage Privacy</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
