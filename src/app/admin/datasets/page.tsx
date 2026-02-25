'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { addDataset, deleteDataset } from '@/lib/features/adminSlice';
import AdminLayout from '@/components/AdminLayout';
import { ToastContainer, useToast } from '@/components/Toast';
import { Upload, File, Trash2, Eye, X, ChevronDown } from 'lucide-react';

const CATEGORIES = ['Conflict Resolution', 'Performance', 'Health & Safety', 'Discipline', 'Communication', 'Other'];
const STATUS_COLORS: Record<string, string> = { 'Active': 'bg-green-100 text-green-700', 'Processing': 'bg-amber-100 text-amber-700', 'Archived': 'bg-gray-100 text-gray-600' };

export default function DatasetsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { datasets } = useSelector((state: RootState) => state.admin);
    const { toasts, addToast, removeToast } = useToast();
    const [dragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [form, setForm] = useState({ name: '', category: '', description: '' });
    const [viewDataset, setViewDataset] = useState<any>(null);
    const [filterCat, setFilterCat] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && (f.name.endsWith('.csv') || f.name.endsWith('.json'))) {
            setSelectedFile(f);
            if (!form.name) setForm(fm => ({ ...fm, name: f.name.replace(/\.(csv|json)$/, '') }));
        } else {
            addToast('Invalid file format. Only CSV or JSON allowed.', 'error');
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) { setSelectedFile(f); if (!form.name) setForm(fm => ({ ...fm, name: f.name.replace(/\.(csv|json)$/, '') })); }
    };

    const handleUpload = async () => {
        if (!selectedFile || !form.name || !form.category) { addToast('Please fill in all fields and select a file.', 'error'); return; }
        setUploading(true);
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(r => setTimeout(r, 100));
            setProgress(i);
        }
        dispatch(addDataset({ name: form.name, category: form.category, description: form.description, rows: Math.floor(Math.random() * 300 + 50) }));
        setUploading(false);
        setProgress(0);
        setSelectedFile(null);
        setForm({ name: '', category: '', description: '' });
        addToast('Dataset uploaded successfully.', 'success');
    };

    const handleDelete = (id: number) => {
        dispatch(deleteDataset(id));
        addToast('Dataset deleted.', 'info');
    };

    const filtered = datasets.filter(d => !filterCat || d.category === filterCat);

    return (
        <AdminLayout>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upload Datasets</h1>
                    <p className="text-gray-500 text-sm mt-1">Upload and manage top-coach response datasets used to train the AI model.</p>
                </div>

                {/* Upload Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Upload New Dataset</h2>
                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-blue-400 bg-blue-50' : selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40'}`}>
                        {selectedFile ? (
                            <div className="flex items-center justify-center gap-3">
                                <File className="w-8 h-8 text-green-600" />
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-green-700">{selectedFile.name}</p>
                                    <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-gray-700">Drag & drop your file here</p>
                                <p className="text-xs text-gray-400 mt-1">Supported formats: CSV, JSON</p>
                            </>
                        )}
                        <input ref={fileRef} type="file" accept=".csv,.json" onChange={handleFileInput} className="hidden" />
                    </div>

                    {uploading && (
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Uploading…</span><span>{progress}%</span></div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dataset Name *</label>
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Dataset"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                            <div className="relative">
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8">
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description"
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>

                    <button onClick={handleUpload} disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5">
                        <Upload className="w-4 h-4" />Upload Dataset
                    </button>
                </div>

                {/* Dataset List */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900">Uploaded Datasets</h2>
                        <div className="relative">
                            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                <option value="">All Categories</option>
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Dataset Name', 'Category', 'Uploaded On', 'Uploaded By', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((ds, i) => (
                                    <tr key={ds.id} className={`hover:bg-blue-50/20 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 py-3 font-semibold text-gray-900">{ds.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{ds.category}</td>
                                        <td className="px-4 py-3 text-gray-500">{ds.uploaded_on}</td>
                                        <td className="px-4 py-3 text-gray-600">{ds.uploaded_by}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[ds.status]}`}>{ds.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => setViewDataset(ds)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(ds.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View Dataset Modal */}
            {viewDataset && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Dataset Preview — {viewDataset.name}</h3>
                            <button onClick={() => setViewDataset(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[['Category', viewDataset.category], ['Status', viewDataset.status], ['Uploaded', viewDataset.uploaded_on], ['Rows', viewDataset.rows + ' records']].map(([l, v]) => (
                                    <div key={l} className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{l}</p>
                                        <p className="text-sm font-bold text-gray-800 mt-0.5">{v}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-2">Sample Rows (First 5)</h4>
                                <div className="bg-gray-900 rounded-xl p-4 text-xs text-green-300 font-mono space-y-1 overflow-x-auto">
                                    {['{ "situation": "Parent complaint", "tone": "Empathetic", "response": "Dear Parent..." }',
                                        '{ "situation": "Playing time", "tone": "Firm", "response": "We appreciate..." }',
                                        '{ "situation": "Discipline", "tone": "Professional", "response": "Our club policy..." }',
                                        '{ "situation": "Performance", "tone": "Supportive", "response": "I understand..." }',
                                        '{ "situation": "Injury concern", "tone": "Educational", "response": "Regarding health..." }',
                                    ].map((r, i) => <p key={i} className="truncate">{r}</p>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
