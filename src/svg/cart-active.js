import React from "react";

/**
 * Cart “added” icon with a checkmark inside a circle.
 * Uses currentColor so you can color via CSS.
 */
const CartActive = () => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M6.8 10.4l2.1 2.1 4.9-5.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CartActive;
