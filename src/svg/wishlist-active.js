import React from "react";

/**
 * Solid red heart icon for active wishlist state.
 * Uses currentColor so you can color via CSS.
 */
const WishlistActive = () => {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.7-9.6-8.3C.8 10.1 1.4 7 4 5.8 6.1 4.8 8.6 5.5 10 7c1.4-1.5 3.9-2.2 6-1.2 2.6 1.2 3.2 4.3 1.6 6.9C19.5 16.3 12 21 12 21z" />
    </svg>
  );
};

export default WishlistActive;
