'use client';
import React from 'react';
import Wrapper from '@/layout/wrapper';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import UserProfile from '@/components/profile/UserProfile';

export default function ProfilePage() {
  return (
    <Wrapper>
      <HeaderTwo />
      <UserProfile />
      <Footer />
    </Wrapper>
  );
}
