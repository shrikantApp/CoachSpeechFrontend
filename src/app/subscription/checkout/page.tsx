'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, ChevronLeft, Check, Lock, Info } from 'lucide-react';
import Link from 'next/link';
import { ToastContainer, useToast } from '@/components/Toast';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toasts, addToast, removeToast } = useToast();

    const plan = searchParams.get('plan') || 'basic';
    const cycle = searchParams.get('cycle') || 'monthly';

    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'upi'>('card');
    const [formData, setFormData] = useState({ name: '', email: '', cardNo: '', expiry: '', cvv: '' });

    const price = plan === 'premium' ? (cycle === 'monthly' ? 49 : 39) : plan === 'basic' ? (cycle === 'monthly' ? 19 : 15) : 0;
    const total = cycle === 'yearly' ? price * 12 : price;

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 2000));
        setSubmitting(false);
        addToast('Payment successful! Redirecting to dashboard...', 'success');
        setTimeout(() => router.push('/dashboard'), 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Plan Summary */}
                <div className="space-y-6">
                    <Link href="/subscription" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to plans
                    </Link>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8 text-gray-900">
                        <div>
                            <h1 className="text-2xl font-bold">Review your plan</h1>
                            <p className="text-gray-500 mt-1">Confirm your selection before proceeding.</p>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <div>
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Selected Plan</p>
                                <h2 className="text-2xl font-extrabold capitalize">{plan} Plan</h2>
                                <p className="text-sm text-blue-800 opacity-70">{cycle === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black text-blue-600">${price}<span className="text-sm font-medium opacity-60">/mo</span></p>
                                {cycle === 'yearly' && <p className="text-xs font-bold text-emerald-600">Save 20% applied</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-bold uppercase tracking-wider text-gray-400">What's included</p>
                            {[
                                plan === 'premium' ? 'Unlimited AI Responses' : '50 AI Responses Monthly',
                                'Full Situation Analysis',
                                'Unlimited History Access',
                                'Saved Responses Library',
                                'Priority Support'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-gray-700 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-500">Subtotal ({cycle})</span>
                                <span className="font-bold">${total}.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500">Tax</span>
                                <span className="font-bold">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-extrabold pt-4 border-t border-gray-100">
                                <span>Total to pay</span>
                                <span className="text-blue-600">${total}.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Payment Form */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-8 flex flex-col items-center">
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-center text-black">Payment Details</h2>
                        <p className="text-gray-400 text-sm text-center mt-1">Secure encrypted checkout</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex w-full bg-gray-50 p-1 rounded-2xl gap-1">
                        {(['card', 'paypal', 'upi'] as const).map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${paymentMethod === method ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {method === 'card' ? 'Credit Card' : method.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSumbit} className="w-full space-y-5">
                        {paymentMethod === 'card' && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Cardholder Name</label>
                                    <div className="relative">
                                        <input required type="text" placeholder="John Doe"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-4 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase px-1">Card Number</label>
                                    <div className="relative flex items-center">
                                        <input required type="text" placeholder="0000 0000 0000 0000"
                                            value={formData.cardNo} onChange={e => setFormData({ ...formData, cardNo: e.target.value })}
                                            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                                        />
                                        <CreditCard className="absolute right-4 w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase px-1">Expiry Date</label>
                                        <input required type="text" placeholder="MM/YY"
                                            value={formData.expiry} onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase px-1">CVV</label>
                                        <div className="relative flex items-center">
                                            <input required type="password" placeholder="•••" maxLength={4}
                                                value={formData.cvv} onChange={e => setFormData({ ...formData, cvv: e.target.value })}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                                            />
                                            <Lock className="absolute right-4 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {paymentMethod !== 'card' && (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Info className="w-8 h-8 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Redirecting to {paymentMethod.toUpperCase()}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Click pay to complete transaction externally.</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 space-y-4">
                            <button
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>Pay ${total}.00 Now</>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                                <ShieldCheck className="w-3 h-3" /> PCI DSS COMPLIANT · 256-BIT SSL ENCRYPTION
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
