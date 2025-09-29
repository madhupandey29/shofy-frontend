'use client';
import Link from 'next/link';
import React from 'react';

const MessageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="url(#chatGradient)" xmlns="http://www.w3.org/2000/svg">
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

const Message = () => {
  return (
    <>
      <Link href="/contact" className="sticky-chat-icon" aria-label="Chat With Us">
        <MessageIcon />
      </Link>

      <style jsx>{`
        .sticky-chat-icon {
          position: fixed;
          bottom: 90px;
          left: 20px;
          background: white;
          padding: 14px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          transition: transform 0.3s ease;
          animation: slideInUp 1s ease forwards;
        }

        .sticky-chat-icon:hover {
          transform: scale(1.1);
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .sticky-chat-icon {
            left: 10px;
            bottom: 80px;
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Message;
