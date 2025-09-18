'use client';
import React, { useState } from 'react';
import { useForm }          from 'react-hook-form';
import { yupResolver }      from '@hookform/resolvers/yup';
import * as Yup             from 'yup';
import { useRouter }        from 'next/navigation';
import ErrorMsg             from '../common/error-msg';
import { notifyError, notifySuccess } from '@/utils/toast';

const schema = Yup.object().shape({
  name:          Yup.string().required('Name is required'),
  email:         Yup.string().required('Email is required').email('Enter a valid email'),
  password:      Yup.string().min(8, 'At least 8 characters').required('Password is required'),
  organisation:  Yup.string().required('Organisation is required'),
  phone:         Yup.string().required('Phone number is required'),
  address:       Yup.string().required('Address is required'),
  city:          Yup.string().required('City is required'),
  state:         Yup.string().required('State is required'),
  country:       Yup.string().required('Country is required'),
  remember:      Yup.bool().oneOf([true], 'You must accept the terms'),
});

export default function RegisterForm() {
  const router = useRouter();
  const [stage, setStage]       = useState('form'); // 'form' or 'otp'
  const [savedEmail, setEmail]  = useState('');
  const [otp, setOtp]           = useState('');

  const { register, handleSubmit, formState:{ errors }, reset } =
    useForm({ resolver: yupResolver(schema) });

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY  = process.env.NEXT_PUBLIC_API_KEY;

  // Send OTP
  const onFormSubmit = async (data) => {
    try {
      setEmail(data.email);
      const res = await fetch(`${API_BASE}/users/send-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(data), // includes password too
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send OTP');
      notifySuccess(json.message);
      setStage('otp');
    } catch (err) {
      notifyError(err.message);
    }
  };

  // Verify OTP & register
  const onOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/verify-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({ email: savedEmail, otp }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'OTP verification failed');
      notifySuccess(json.message);
      reset();
      router.push('/login');
    } catch (err) {
      notifyError(err.message);
    }
  };

  return (
    <>
      {stage === 'form' && (
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Name */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('name')} id="name" type="text" placeholder="Your Name" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="name">Name</label>
            </div>
            <ErrorMsg msg={errors.name?.message}/>
          </div>

          {/* Email */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('email')} id="email" type="email" placeholder="Your Email" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="email">Email</label>
            </div>
            <ErrorMsg msg={errors.email?.message}/>
          </div>

          {/* Password (new) */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Create Password"
                autoComplete="new-password"
              />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Password</label>
            </div>
            <ErrorMsg msg={errors.password?.message}/>
          </div>

          {/* Organisation */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('organisation')} id="organisation" type="text" placeholder="Your Organisation" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="organisation">Organisation</label>
            </div>
            <ErrorMsg msg={errors.organisation?.message}/>
          </div>

          {/* Phone */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('phone')} id="phone" type="text" placeholder="Your Phone Number" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="phone">Phone</label>
            </div>
            <ErrorMsg msg={errors.phone?.message}/>
          </div>

          {/* Address */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('address')} id="address" type="text" placeholder="Your Address" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="address">Address</label>
            </div>
            <ErrorMsg msg={errors.address?.message}/>
          </div>

          {/* City */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('city')} id="city" type="text" placeholder="Your City" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="city">City</label>
            </div>
            <ErrorMsg msg={errors.city?.message}/>
          </div>

          {/* State */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('state')} id="state" type="text" placeholder="Your State" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="state">State</label>
            </div>
            <ErrorMsg msg={errors.state?.message}/>
          </div>

          {/* Country */}
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input {...register('country')} id="country" type="text" placeholder="Your Country" />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="country">Country</label>
            </div>
            <ErrorMsg msg={errors.country?.message}/>
          </div>

          {/* Terms */}
          <div className="tp-login-input-box">
            <label>
              <input {...register('remember')} type="checkbox" /> Accept Terms
            </label>
            <ErrorMsg msg={errors.remember?.message}/>
          </div>

          <button type="submit" className="tp-login-btn w-100">Send OTP</button>
        </form>
      )}

      {stage === 'otp' && (
        <form onSubmit={onOtpSubmit}>
          <div className="tp-login-input-box">
            <div className="tp-login-input">
              <input id="otp" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" required />
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="otp">OTP</label>
            </div>
          </div>
          <button type="submit" className="tp-login-btn w-100">Verify & Register</button>
        </form>
      )}
    </>
  );
}
