'use client';
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm }      from 'react-hook-form';
import { useSelector }  from 'react-redux';
import * as Yup         from 'yup';

// internal
import ErrorMsg                 from '../common/error-msg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';

// validation schema
const schema = Yup.object().shape({
  name:    Yup.string().required('Name is required'),
  email:   Yup.string().required('Email is required').email(),
  phone:   Yup.string().required('Phone is required').min(10),
  address: Yup.string().required('Address is required'),
  bio:     Yup.string().required('Bio is required').min(20),
});

export default function ProfileInfo() {
  const { user } = useSelector((s) => s.auth);

  // Hook must live here, inside this component
  const [updateProfile, { isLoading, error }] =
    useUpdateProfileMutation();

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    updateProfile({ id: user._id, ...data })
      .unwrap()
      .then((res) => notifySuccess(res.message))
      .catch((err) => notifyError(err.data?.message || err.message));
    reset();
  };

  return (
    <div className="profile__info">
      <h3>Personal Details</h3>
      {isLoading && <p>Updating…</p>}
      {error     && <ErrorMsg msg="Update failed" />}

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('name')}
          defaultValue={user?.name}
          placeholder="Your Name"
        />
        <ErrorMsg msg={errors.name?.message} />

        <input
          {...register('email')}
          defaultValue={user?.email}
          placeholder="Your Email"
        />
        <ErrorMsg msg={errors.email?.message} />

        <input
          {...register('phone')}
          defaultValue={user?.phone}
          placeholder="Your Phone"
        />
        <ErrorMsg msg={errors.phone?.message} />

        <input
          {...register('address')}
          defaultValue={user?.address}
          placeholder="Your Address"
        />
        <ErrorMsg msg={errors.address?.message} />

        <textarea
          {...register('bio')}
          defaultValue={user?.bio}
          placeholder="Your Bio"
        />
        <ErrorMsg msg={errors.bio?.message} />

        <button type="submit" className="tp-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
}
