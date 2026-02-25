'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store';
import { loginUser } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const emailError = touched.email && !validateEmail(email) ? (email ? 'Please enter a valid email address.' : 'Email is required.') : '';
  const passwordError = touched.password && !password ? 'Password is required.' : touched.password && password.length < 6 ? 'Password must be at least 6 characters.' : '';
  const isValid = validateEmail(email) && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      <div className="max-w-md w-full relative fade-in">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/15 p-8 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-500 p-3 rounded-2xl mb-4 shadow-lg shadow-indigo-500/40">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-indigo-200 text-center text-sm">Sign in to your Coach Speech account</p>
          </div>

          {/* Server error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-100 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${emailError ? 'border-red-400/60 focus:ring-red-400' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 transition-all duration-200`}
                placeholder="coach@example.com"
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && <p id="email-error" className="mt-1.5 text-sm text-red-300" role="alert">{emailError}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo-100 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border ${passwordError ? 'border-red-400/60 focus:ring-red-400' : 'border-white/10 focus:ring-indigo-500'} text-white placeholder-indigo-300/60 focus:outline-none focus:ring-2 transition-all duration-200`}
                  placeholder="••••••••"
                  aria-describedby={passwordError ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && <p id="password-error" className="mt-1.5 text-sm text-red-300" role="alert">{passwordError}</p>}
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-xs text-indigo-300 hover:text-indigo-100 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-indigo-300">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              {/* Google SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="hidden sm:inline">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-gray-900 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              {/* Apple SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
              </svg>
              <span className="hidden sm:inline">Apple</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1877f2] hover:bg-[#166fe5] rounded-xl text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-sm">
              {/* Facebook SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </button>
          </div>

          {/* Register link */}
          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
            <p className="text-indigo-200 text-sm mb-2.5">New here? Don't have an account?</p>
            <Link
              href="/register"
              className="inline-block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Create an Account
            </Link>
          </div>

          {/* Secure session indicator */}
          <div className="mt-5 flex items-center justify-center gap-2 text-indigo-300/70 text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>Your information is securely handled with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
