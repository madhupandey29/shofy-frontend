'use client';

import React from 'react';
import Link from 'next/link';

const MessageIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="url(#chatGradient)"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="chatGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path
      d="M4 4H20V16H5.17L4 17.17V4Z"
      stroke="url(#chatGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StickyMessageIcon = () => {
  return (
    <div className="fixed bottom-6 left-6 z-50 animate-slide-in">
      <Link
        href="/contact"
        aria-label="Chat With Us"
        className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <MessageIcon />
      </Link>

      {/* Custom animation via Tailwind plugin or manually */}
      <style jsx>{`
        @keyframes slide-in {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StickyMessageIcon;
