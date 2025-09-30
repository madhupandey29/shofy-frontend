import React from "react";

const Share = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    className={className}
    {...props}
  >
    {/* Three dots */}
    <circle cx="18" cy="5" r="2" fill="currentColor" />
    <circle cx="6" cy="12" r="2" fill="currentColor" />
    <circle cx="18" cy="19" r="2" fill="currentColor" />

    {/* Connecting lines */}
    <path
      d="M8 12l8-7M8 12l8 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Share;
