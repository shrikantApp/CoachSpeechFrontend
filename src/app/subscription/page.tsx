'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Shield, Zap, Star, Trophy, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const PLANS = [
    {
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
        desc: 'Perfect for new coaches exploring AI assistance.',
        features: [
            { text: '5 AI responses per month', included: true },
            { text: 'Basic empathy analysis', included: true },
            { text: 'Email support', included: true },
            { text: 'Situation history (7 days)', included: true },
            { text: 'Advanced keyword highlighting', included: false },
            { text: 'Custom tone adjustment', included: false },
            { text: 'Priority generations', included: false },
        ],
        cta: 'Get Started',
        color: 'blue'
    },
    {
        name: 'Basic',
        price: { monthly: 19, yearly: 15 },
        desc: 'Ideal for active coaches handling regular parent comms.',
        features: [
            { text: '50 AI responses per month', included: true },
            { text: 'Full empathy & prof. analysis', included: true },
            { text: 'Priority email support', included: true },
            { text: 'Situation history (Unlimited)', included: true },
            { text: 'Advanced keyword highlighting', included: true },
            { text: 'Custom tone adjustment', included: false },
            { text: 'Priority generations', included: false },
        ],
        cta: 'Start Free Trial',
        color: 'indigo'
    },
    {
        name: 'Premium',
        price: { monthly: 49, yearly: 39 },
        desc: 'The complete toolkit for elite coaches and leaders.',
        popular: true,
        features: [
            { text: 'Unlimited AI responses', included: true },
            { text: 'Advanced psychological analysis', included: true },
            { text: '24/7 Chat & Phone support', included: true },
            { text: 'Unlimited saved responses', included: true },
            { text: 'Advanced keyword highlighting', included: true },
            { text: 'Custom tone & personality', included: true },
            { text: 'Instant priority generations', included: true },
        ],
        cta: 'Upgrade to Premium',
        color: 'emerald'
    }
];

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Navigation />

            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Elevate Your <span className="text-blue-600">Communication</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Choose the plan that fits your coaching style. Save up to 20% with annual billing.
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
                            <button
                                onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
                                className="w-14 h-7 bg-gray-200 rounded-full p-1 relative transition-colors hover:bg-gray-300"
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7 bg-blue-600' : ''}`} />
                            </button>
                            <span className={`text-sm font-semibold transition-colors ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                                Yearly <span className="text-emerald-500 font-bold">(Save 20%)</span>
                            </span>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col bg-white rounded-3xl border ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-100 scale-105 z-10' : 'border-gray-100 shadow-sm'} p-8 transition-all hover:translate-y-[-4px]`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <p className="text-sm text-gray-500 mt-2 min-h-[40px]">{plan.desc}</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-extrabold text-gray-900">${plan.price[billingCycle]}</span>
                                        <span className="text-gray-500 ml-1.5 text-sm font-medium">/month</span>
                                    </div>
                                    <p className="text-xs text-blue-600 font-semibold mt-1">
                                        {billingCycle === 'yearly' ? `Billed $${plan.price.yearly * 12} annually` : 'Billed monthly'}
                                    </p>
                                </div>

                                <div className="space-y-4 flex-1 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            {feature.included ? (
                                                <div className="mt-0.5 p-0.5 bg-emerald-100 rounded-full flex-shrink-0">
                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                </div>
                                            ) : (
                                                <div className="mt-0.5 p-0.5 bg-gray-100 rounded-full flex-shrink-0">
                                                    <X className="w-3 h-3 text-gray-400" />
                                                </div>
                                            )}
                                            <span className={`text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400 line-through'}`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href={`/subscription/checkout?plan=${plan.name.toLowerCase()}&cycle=${billingCycle}`}
                                    className={`w-full py-4 rounded-2xl text-center font-bold text-sm transition-all flex items-center justify-center gap-2 ${plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                                            : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    {plan.cta} <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Trust Section */}
                    <div className="bg-white border border-gray-100 rounded-4xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Trusted by 500+ National Level Coaches</h2>
                            <p className="text-gray-600">Join the elite rank of coaches who use data-driven empathy to handle difficult parents and focus on what matters: the athletes.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                            <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Shield className="w-6 h-6 text-blue-600 mb-2" />
                                <span className="text-xs font-bold text-gray-900 uppercase">Secure</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Trophy className="w-6 h-6 text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-gray-900 uppercase">Premium</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
