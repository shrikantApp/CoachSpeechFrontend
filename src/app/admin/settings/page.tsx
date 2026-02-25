'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { Save, Bell, Shield, Key, Globe, Mail, Eye, EyeOff, RefreshCcw } from 'lucide-react';

export default function AdminSettingsPage() {
    const { toasts, addToast, removeToast } = useToast();
    const [saving, setSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'Coach Speech AI',
        adminEmail: 'admin@coachspeech.com',
        allowNewRegistrations: true,
        emailNotifications: true,
        flaggedAlerts: true,
        maintenanceMode: false,
        apiKey: 'cs_live_51PqJ8kLx9w2mN7vR0z3x5c6vB7n8M9q0Wz...'
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1200));
        setSaving(false);
        addToast('System settings updated successfully.', 'success');
    };

    const handleRegenerateKey = () => {
        const newKey = 'cs_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        setSettings({ ...settings, apiKey: newKey });
        addToast('New API Key generated. Remember to update your integrations.', 'info');
    };

    const inputCls = "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all text-gray-900";

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                        <p className="text-gray-500 text-sm mt-1">Global configuration for the Coach Speech platform.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
                    >
                        {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Sections */}
                    <div className="md:col-span-2 space-y-6">
                        {/* General */}
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">General Settings</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Application Name</label>
                                    <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} className={inputCls} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Support Email</label>
                                    <input type="email" value={settings.adminEmail} onChange={e => setSettings({ ...settings, adminEmail: e.target.value })} className={inputCls} />
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Security & API</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Production API Key</label>
                                    <div className="relative flex items-center">
                                        <input
                                            readOnly
                                            type={showApiKey ? 'text' : 'password'}
                                            value={settings.apiKey}
                                            className={`${inputCls} pr-24 font-mono text-xs`}
                                        />
                                        <div className="absolute right-2 flex items-center gap-1">
                                            <button onClick={() => setShowApiKey(!showApiKey)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
                                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                            <button onClick={handleRegenerateKey} title="Regenerate" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg">
                                                <RefreshCcw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic px-1">Warning: Regenerating the key will break existing API integrations.</p>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                                    <div>
                                        <p className="text-sm font-bold text-red-900">Maintenance Mode</p>
                                        <p className="text-xs text-red-700 opacity-70">Prevent all non-admin users from accessing the app.</p>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Notifications */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Notifications</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { id: 'emailNotifications', label: 'Email Reports', desc: 'Weekly usage analytics' },
                                    { id: 'flaggedAlerts', label: 'Flagged Content', desc: 'Real-time alerts for low quality' },
                                    { id: 'allowNewRegistrations', label: 'Public Join', desc: 'Allow new coaches to register' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{item.label}</p>
                                            <p className="text-[10px] text-gray-400">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setSettings({ ...settings, [item.id]: !(settings as any)[item.id] })}
                                            className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${(settings as any)[item.id] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${(settings as any)[item.id] ? 'left-5.5' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="bg-indigo-600 rounded-3xl p-6 text-white space-y-4 shadow-xl shadow-indigo-100 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-8 -translate-y-8 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold relative">Support Channel</h4>
                            <p className="text-xs text-indigo-100 relative opacity-80">Connected to Zendesk instance #CS-AI-882</p>
                            <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-xs relative hover:bg-indigo-50 transition-colors">
                                Marketplace Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
