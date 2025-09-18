'use client';
import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  useGetSessionInfoQuery,
  useUpdateProfileMutation,
  useLogoutUserMutation,
} from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';
/* import ErrorMsg from '@/components/common/error-msg';
 */
/* helpers */
const pickInitialUser = (reduxUser) => {
  if (reduxUser) return reduxUser;
  const cookie = Cookies.get('userInfo');
  if (!cookie) return null;
  try { return JSON.parse(cookie)?.user || null; } catch { return null; }
};
const initials = (name = '') =>
  name.split(' ').filter(Boolean).map(s => s[0]?.toUpperCase()).slice(0,2).join('') || 'U';

const editSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  organisation: Yup.string().nullable(),
  phone: Yup.string().nullable(),
  address: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
  pincode: Yup.string().nullable(),
});

/* portal (for modal always on top) */
function BodyPortal({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  if (!ready) return null;
  return ReactDOM.createPortal(children, document.body);
}

export default function UserProfile() {
  const authUser = useSelector((s) => s?.auth?.user);
  const cookieUser = useMemo(() => pickInitialUser(authUser), [authUser]);

  const userId = (authUser?._id || cookieUser?._id);
  const {
    data: sessionData,
    refetch: refetchSession,
  } = useGetSessionInfoQuery({ userId }, { skip: !userId, refetchOnFocus: true, refetchOnReconnect: true });

  const user = authUser || sessionData?.session?.user || cookieUser;
  const [logoutUser] = useLogoutUserMutation();

  const [isEditing, setEditing] = useState(false);
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(editSchema),
    values: {
      name:         user?.name || '',
      email:        user?.email || '',
      organisation: user?.organisation || '',
      phone:        user?.phone || '',
      address:      user?.address || '',
      city:         user?.city || '',
      state:        user?.state || '',
      country:      user?.country || '',
      pincode:      user?.pincode || '',
    },
  });

  useEffect(() => {
    reset({
      name:         user?.name || '',
      email:        user?.email || '',
      organisation: user?.organisation || '',
      phone:        user?.phone || '',
      address:      user?.address || '',
      city:         user?.city || '',
      state:        user?.state || '',
      country:      user?.country || '',
      pincode:      user?.pincode || '',
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const {  ...payload } = data;
      const updated = await updateProfile({ id: userId, ...payload }).unwrap();
      Cookies.set('userInfo', JSON.stringify({ user: updated }), { expires: 0.5 });
      refetchSession();
      notifySuccess('Profile updated');
      setEditing(false);
    } catch (err) {
      notifyError(err?.data?.message || err?.error || 'Update failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser({ userId }).unwrap();
      Cookies.remove('userInfo');
      window.location.href = '/login'; // Redirect to login page
    } catch (err) {
      notifyError(err?.data?.message || 'Logout failed');
    }
  };

  if (!user) return <div className="auth-message">Not logged in.</div>;

  return (
    <div className="profile-container">
      {/* Floating Background Elements */}
      <div className="bg-blur-circle-1"></div>
      <div className="bg-blur-circle-2"></div>
      
      {/* Main Profile Section */}
      <div className="profile-card glassmorphism">
        <div className="profile-header">
          <div className="avatar-circle gradient-bg">
            <span className="avatar-text">{initials(user?.name)}</span>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{user?.name || 'Unnamed User'}</h1>
            <p className="profile-email">{user?.email}</p>
            {user?.organisation && (
              <div className="profile-org-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 15H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{user.organisation}</span>
              </div>
            )}
          </div>
          
          <div className="profile-actions">
            <button 
              className="edit-button"
              onClick={() => setEditing(true)}
              aria-haspopup="dialog"
              aria-expanded={isEditing}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Profile
            </button>
            
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-details-grid">
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H19C18.45 20.92 18 20.47 18 19.92V16.92C18 16.37 18.45 15.92 19 15.92H21C21.55 15.92 22 16.37 22 16.92Z" fill="currentColor"/>
                <path d="M10.02 4.47L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2L13.99 4.47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.91 7.8C3.8 9.28 3 11.06 3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.09 7.8C20.2 9.28 21 11.06 21 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 13H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 13H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 22C8 19 6 17 6 17H18C18 17 16 19 16 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15.5V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Phone"
            value={user?.phone}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Address"
            value={user?.address}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="City"
            value={user?.city}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 3H9C7.05 8.84 7.05 15.16 9 21H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3C16.95 8.84 16.95 15.16 15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9C8.84 7.05 15.16 7.05 21 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="State"
            value={user?.state}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 3C16.95 8.84 16.95 15.16 15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 8.99999C8.84 7.04999 15.16 7.04999 21 8.99999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Country"
            value={user?.country}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Pincode"
            value={user?.pincode}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Joined"
            value={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          />
          
          <DetailItem 
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            label="Last Update"
            value={new Date(user?.updatedAt || Date.now()).toLocaleString()}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <BodyPortal>
          <div className="modal-overlay" onClick={() => setEditing(false)}>
            <div className="modal-content glassmorphism" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Profile</h2>
                <button 
                  className="close-button"
                  onClick={() => setEditing(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
                <FormField 
                  id="name"
                  label="Name"
                  type="text"
                  placeholder="Your Name"
                  register={register('name')}
                  error={errors.name?.message}
                  required
                />

                <FormField 
                  id="email"
                  label="Email"
                  type="email"
                  register={register('email')}
                  disabled
                  note="Email can't be changed"
                />

                <FormField 
                  id="organisation"
                  label="Organisation"
                  type="text"
                  placeholder="Your Organisation"
                  register={register('organisation')}
                  error={errors.organisation?.message}
                />

                <FormField 
                  id="phone"
                  label="Phone"
                  type="text"
                  placeholder="Phone Number"
                  register={register('phone')}
                  error={errors.phone?.message}
                />

                <FormField 
                  id="address"
                  label="Address"
                  type="text"
                  placeholder="Your Address"
                  register={register('address')}
                  error={errors.address?.message}
                />

                <div className="form-row">
                  <FormField 
                    id="city"
                    label="City"
                    type="text"
                    placeholder="City"
                    register={register('city')}
                    error={errors.city?.message}
                  />
                  <FormField 
                    id="state"
                    label="State"
                    type="text"
                    placeholder="State"
                    register={register('state')}
                    error={errors.state?.message}
                  />
                </div>

                <div className="form-row">
                  <FormField 
                    id="country"
                    label="Country"
                    type="text"
                    placeholder="Country"
                    register={register('country')}
                    error={errors.country?.message}
                  />
                  <FormField 
                    id="pincode"
                    label="Pincode"
                    type="text"
                    placeholder="Pincode"
                    register={register('pincode')}
                    error={errors.pincode?.message}
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </BodyPortal>
      )}

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        .bg-blur-circle-1 {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: rgba(74, 108, 247, 0.1);
          filter: blur(80px);
          z-index: -1;
        }

        .bg-blur-circle-2 {
          position: absolute;
          bottom: -150px;
          left: -100px;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: rgba(167, 119, 227, 0.1);
          filter: blur(80px);
          z-index: -1;
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
        }

        .profile-card {
          border-radius: 20px;
          overflow: hidden;
          padding: 2.5rem;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .profile-card:hover {
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.15);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
          font-weight: 600;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .gradient-bg {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
        }

        .profile-info {
          flex: 1;
          min-width: 200px;
        }

        .profile-name {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.25rem;
          color: #1a1a1a;
          background: linear-gradient(90deg, #4a6cf7, #a777e3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        .profile-email {
          color: #666;
          margin: 0 0 0.5rem;
          font-size: 1rem;
        }

        .profile-org-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(74, 108, 247, 0.1);
          color: #4a6cf7;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .profile-org-chip svg {
          color: #4a6cf7;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
          align-self: flex-start;
          margin-left: auto;
        }

        .edit-button, .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .edit-button {
          background: #4a6cf7;
          color: white;
        }

        .edit-button:hover {
          background: #3a5bd9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
        }

        .logout-button {
          background: rgba(255, 255, 255, 0.9);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.3);
        }

        .logout-button:hover {
          background: #f44336;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
        }

        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          border-radius: 20px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-size: 1.75rem;
          margin: 0;
          color: #1a1a1a;
          background: linear-gradient(90deg, #4a6cf7, #a777e3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          padding: 0.25rem;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          color: #f44336;
          transform: rotate(90deg);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .cancel-button {
          background: #f5f5f5;
          color: #666;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }

        .save-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #4a6cf7;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-button:hover:not(:disabled) {
          background: #3a5bd9;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
        }

        .save-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          
          .profile-actions {
            width: 100%;
            margin-left: 0;
          }
          
          .edit-button, .logout-button {
            width: 100%;
            justify-content: center;
          }
          
          .form-row {
            flex-direction: column;
            gap: 1.5rem;
          }
          
          .profile-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// Reusable components
function DetailItem({ icon, label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-icon">
        {icon}
      </div>
      <div className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value || '—'}</span>
      </div>
      
      <style jsx>{`
        .detail-item {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 14px;
          padding: 1.25rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .detail-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        
        .detail-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(74, 108, 247, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #4a6cf7;
        }
        
        .detail-content {
          flex: 1;
        }
        
        .detail-label {
          display: block;
          font-size: 0.8125rem;
          color: #666;
          margin-bottom: 0.25rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}

function FormField({ id, label, type, placeholder, register, error, disabled, note, required }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="required-star">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`field-input ${error ? 'error' : ''}`}
        disabled={disabled}
        {...register}
      />
      {note && <p className="field-note">{note}</p>}
      {error && <p className="field-error">{error}</p>}
      
      <style jsx>{`
        .form-field {
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .field-label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #444;
          font-size: 0.9375rem;
        }
        
        .required-star {
          color: #f44336;
          margin-left: 0.25rem;
        }
        
        .field-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.7);
        }
        
        .field-input:focus {
          border-color: #4a6cf7;
          outline: none;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
          background: white;
        }
        
        .field-input.error {
          border-color: #f44336;
        }
        
        .field-input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        .field-note {
          margin: 0.5rem 0 0;
          font-size: 0.8125rem;
          color: #888;
        }
        
        .field-error {
          margin: 0.5rem 0 0;
          font-size: 0.8125rem;
          color: #f44336;
          position: absolute;
        }
      `}</style>
    </div>
  );
}