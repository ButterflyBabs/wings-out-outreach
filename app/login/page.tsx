'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');

      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        // Sign up
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        
        setSuccess('Account created! Please check your email to confirm.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccess('');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin() {
    setLoading(true);
    setError('');
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      // First try to sign in (user might already exist)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo.user@example.com',
        password: 'demo123456'
      });

      if (!signInError) {
        // Login successful
        setSuccess('Demo mode activated! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
        return;
      }

      // If login failed, try to create the user
      // Wait a bit to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { error: signUpError } = await supabase.auth.signUp({
        email: 'demo.user@example.com',
        password: 'demo123456'
      });
      
      if (signUpError) {
        // If user already exists, just try logging in again
        if (signUpError.message.includes('already registered')) {
          const { error: finalLoginError } = await supabase.auth.signInWithPassword({
            email: 'demo.user@example.com',
            password: 'demo123456'
          });
          
          if (finalLoginError) throw finalLoginError;
          
          setSuccess('Demo mode activated! Redirecting...');
          setTimeout(() => router.push('/'), 1000);
          return;
        }
        throw signUpError;
      }
      
      // Sign up successful, now log in
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: 'demo.user@example.com',
        password: 'demo123456'
      });
      
      if (loginError) throw loginError;
      
      setSuccess('Demo mode activated! Redirecting...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: any) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-sacred-teal/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🦋</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-warm-gold">Wings Out</h1>
          <p className="text-ivory-light/60 mt-2">Babs & Beau Partnership System</p>
        </div>

        {/* Form Card */}
        <div className="bg-royal-plum/10 border border-warm-gold/10 rounded-2xl p-8">
          <h2 className="font-serif text-2xl font-bold text-ivory-light mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-ivory-light/60 mb-6">
            {isLogin ? 'Sign in to manage your outreach' : 'Start your ambassador journey'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ivory-light/70 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ivory-light/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-light/40 hover:text-ivory-light"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-ivory-light/70 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory-light/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-royal-plum/20 border border-warm-gold/20 rounded-xl text-ivory-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-ivory-light/60">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className="ml-2 text-sacred-teal hover:text-sacred-teal/80 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-warm-gold/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-royal-plum/10 text-ivory-light/40">or</span>
              </div>
            </div>
            
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 font-medium hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="text-xl">🚀</span>
                  Try Demo (No Login Required)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-ivory-light/50 hover:text-ivory-light text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
