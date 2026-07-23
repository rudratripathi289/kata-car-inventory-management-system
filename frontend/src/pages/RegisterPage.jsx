import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiAlertCircle, FiArrowRight, FiCheck } from 'react-icons/fi';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const password = watch('password', '');
  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][passwordStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'][passwordStrength];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    const result = await registerUser(data);
    
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.error || 'Failed to register');
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError) =>
    `block w-full pl-12 pr-4 py-3.5 bg-white/[0.06] border ${hasError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : 'border-white/[0.1] focus:border-blue-400 focus:ring-blue-400/20'} rounded-xl text-white placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:bg-white/[0.08]`;

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900">
        {/* Floating orbs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Left panel - Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6 sm:p-12">
        <div
          className={`w-full max-w-lg transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* Glass card */}
          <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/[0.12] shadow-2xl shadow-black/20 p-8 sm:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M12 17h.01M16 17h.01M3 11l2-6h14l2 6M5 17h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">AutoVault</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-slate-400 text-sm">
                Join thousands of dealers managing their inventory smarter
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    step > s ? 'bg-emerald-500 text-white scale-100' : step === s ? 'bg-blue-500 text-white scale-110' : 'bg-white/10 text-slate-500'
                  }`}>
                    {step > s ? <FiCheck className="w-4 h-4" /> : s}
                  </div>
                  {s < 2 && <div className={`flex-1 h-0.5 rounded transition-all duration-500 ${step > 1 ? 'bg-emerald-500' : 'bg-white/10'}`} />}
                </div>
              ))}
              <span className="text-xs text-slate-500 ml-1">{step === 1 ? 'Personal Info' : 'Security'}</span>
            </div>

            {errorMsg && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 animate-[shake_0.5s_ease-in-out]">
                <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0 w-5 h-5" />
                <p className="text-sm text-red-300">{errorMsg}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Personal Info */}
              <div className={`space-y-5 transition-all duration-500 ${step === 1 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 -translate-x-8'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                      First name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className={inputClasses(errors.firstName)}
                        placeholder="John"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <FiAlertCircle className="w-3.5 h-3.5" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                      Last name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className={inputClasses(errors.lastName)}
                        placeholder="Doe"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <FiAlertCircle className="w-3.5 h-3.5" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="phone"
                      type="text"
                      {...register('phone', { required: 'Phone number is required' })}
                      className={inputClasses(errors.phone)}
                      placeholder="(555) 555-5555"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 mt-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  Continue
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Step 2: Security */}
              <div className={`space-y-5 transition-all duration-500 ${step === 2 ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-8'}`}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={inputClasses(errors.email)}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        }
                      })}
                      className={inputClasses(errors.password)}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                  
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength >= level ? strengthColor : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400">Strength: <span className="text-slate-300 font-medium">{strengthLabel}</span></p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 px-6 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] focus:outline-none transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
                        <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
            </div>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Branding */}
      <div className={`hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16 xl:px-24 transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M12 17h.01M16 17h.01M3 11l2-6h14l2 6M5 17h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">AutoVault</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight">
            Start your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              dealership
            </span>
            <br />
            journey today.
          </h1>
          
          <p className="text-lg text-slate-300 max-w-md leading-relaxed">
            Get instant access to powerful inventory tools. Set up your dealership in minutes, not hours.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { value: '10K+', label: 'Vehicles Tracked' },
              { value: '500+', label: 'Dealers Active' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center transition-all duration-700"
                style={{ transitionDelay: `${800 + i * 200}ms`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
