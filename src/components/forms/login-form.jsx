'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter, useSearchParams } from 'next/navigation';
import ErrorMsg from '../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';

// validation schemas
const passwordSchema = Yup.object().shape({
  email:    Yup.string().required('Email is required').email('Enter a valid email'),
  password: Yup.string().required('Password is required').min(6, 'At least 6 characters'),
});
const otpRequestSchema = Yup.object().shape({
  email: Yup.string().required('Email is required').email('Enter a valid email'),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  // modes: 'password' | 'otpRequest' | 'otpVerify'
  const [mode,       setMode]       = useState('password');
  const [savedEmail, setSavedEmail] = useState('');
  const [otp,        setOtp]        = useState('');

  // ✅ missing pieces for ESLint errors
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  // password form
  const {
    register: regPass,
    handleSubmit: onPassSubmit,
    formState: { errors: passErr },
    reset: resetPass
  } = useForm({ resolver: yupResolver(passwordSchema) });

  // OTP request form
  const {
    register: regOtp,
    handleSubmit: onOtpReqSubmit,
    formState: { errors: otpErrReq },
    reset: resetOtpReq
  } = useForm({ resolver: yupResolver(otpRequestSchema) });

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const KEY = process.env.NEXT_PUBLIC_API_KEY;

  // 1️⃣ Email/password login
  const handlePasswordLogin = async (data) => {
    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type':'application/json', 'x-api-key':KEY },
        body: JSON.stringify({ identifier: data.email, password: data.password })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message||'Login failed');

      Cookies.set('userInfo', JSON.stringify({ user: json.user }), { expires: 0.5 });
      notifySuccess(json.message);
      resetPass();
      router.push(redirect);
    } catch(err) {
      notifyError(err.message);
    }
  };

  // 2️⃣ Request OTP
  const handleOtpRequest = async (data) => {
    try {
      setSavedEmail(data.email);
      const res = await fetch(`${API}/users/login/otp/request`, {
        method:'POST', credentials:'include',
        headers:{ 'Content-Type':'application/json', 'x-api-key':KEY },
        body: JSON.stringify({ email: data.email })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message||'OTP send failed');

      notifySuccess('OTP sent to your email');
      setMode('otpVerify');
      resetOtpReq();
    } catch(err) {
      notifyError(err.message);
    }
  };

  // 3️⃣ Verify OTP & login
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API}/users/login/otp/verify`, {
        method:'POST', credentials:'include',
        headers:{ 'Content-Type':'application/json', 'x-api-key':KEY },
        body: JSON.stringify({ email: savedEmail, otp })
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message||'Invalid OTP');

      Cookies.set('userInfo', JSON.stringify({ user: json.user }), { expires: 0.5 });
      notifySuccess('Logged in successfully');
      setOtp('');
      if (redirect) {
        window.location.href = redirect;
      } else {
        router.push('/');
      }
    } catch(err) {
      console.error('Login error:', err);
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ───────── Email & Password Login ───────────── */}
      {mode === 'password' && (
        <form onSubmit={onPassSubmit(handlePasswordLogin)} className="space-y-4">

          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...regPass('email')} type="email" placeholder="Your Email" />
            </div>
            <div className="tp-login-input-title"><label>Email</label></div>
            <ErrorMsg msg={passErr.email?.message}/>
          </div>

          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...regPass('password')} type="password" placeholder="Your Password" />
            </div>
            <div className="tp-login-input-title"><label>Password</label></div>
            <ErrorMsg msg={passErr.password?.message}/>
          </div>

          <div className="tp-login-bottom">
            <button type="submit" className="tp-login-btn w-100">Login</button>
          </div>
        </form>
      )}

      {/* ───────── Divider + Toggle ────────────────── */}
      <div className="tp-login-mail text-center my-6">
        {mode === 'password' ? (
          <button
            onClick={() => setMode('otpRequest')}
            className="text-gray-500 underline focus:outline-none"
            type="button"
          >
            or login with OTP
          </button>
        ) : (
          <button
            onClick={() => setMode('password')}
            className="text-gray-500 underline focus:outline-none"
            type="button"
          >
            or Sign in with Email
          </button>
        )}
      </div>

      {/* ───────── OTP Request ────────────────────── */}
      {mode === 'otpRequest' && (
        <form onSubmit={onOtpReqSubmit(handleOtpRequest)} className="space-y-4 mb-6">
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...regOtp('email')} type="email" placeholder="Your Email" />
            </div>
            <div className="tp-login-input-title"><label>Email</label></div>
            <ErrorMsg msg={otpErrReq.email?.message}/>
          </div>

          <div className="tp-login-bottom">
            <button type="submit" className="tp-login-btn w-100">Get OTP</button>
          </div>
        </form>
      )}

      {/* ───────── OTP Verify ─────────────────────── */}
      {mode === 'otpVerify' && (
        <form onSubmit={handleOtpVerify} className="space-y-4 mb-6">
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            <div className="tp-login-input-title"><label>OTP</label></div>
          </div>

          {error ? <ErrorMsg msg={error} /> : null}

          <div className="tp-login-bottom">
            <button
              type="submit"
              disabled={loading}
              className="tp-login-btn w-100"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setMode('password')}
              className="text-gray-500 underline focus:outline-none"
              type="button"
            >
              back to password login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
