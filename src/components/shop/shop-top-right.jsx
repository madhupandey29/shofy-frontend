'use client';

import React from "react";
import { useDispatch } from "react-redux";
import { Filter } from "@/svg";
import { handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";

// ✅ Reuse the same header search component so it inherits the exact header CSS
/* import HeaderSearchForm from "@/components/forms/header-search-form"; // adjust path if needed
 */
const ShopTopRight = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="tp-shop-top-right shop-toolbar mb-20"
      role="region"
      aria-label="Search and filter toolbar"
    >
      {/* Search (same markup/classes as header) */}
      <div className="shop-toolbar__search">
       {/*  <HeaderSearchForm /> */}
      </div>

      {/* Filter */}
      <div className="shop-toolbar__filter">
        <button
          type="button"
          className="tp-filter-btn"
          onClick={() => dispatch(handleFilterSidebarOpen())}
          aria-label="Open filters"
        >
          <span className="tp-filter-icon"><Filter /></span>
          <span className="tp-filter-label">Filter</span>
        </button>
      </div>
    </div>
  );
};

export default ShopTopRight;
