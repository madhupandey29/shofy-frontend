'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
/* import PriceFilter from "../shop/shop-filter/price-filter";
import StatusFilter from "../shop/shop-filter/status-filter"; */
import {
  handleFilterSidebarClose,
  // handleFilterSidebarOpen,  // not needed for the Close button
} from '@/redux/features/shop-filter-slice';
import ResetButton from '../shop/shop-filter/reset-button';
import ShopSidebarFilters from '../shop/ShopSidebarFilters';

const ShopFilterOffCanvas = ({ all_products, otherProps, right_side = false }) => {
  const { priceFilterValues, selectedFilters, handleFilterChange } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();

  // max price (for ResetButton props)
  const maxPrice = all_products.reduce((max, product) => {
    const val = Number(product?.price ?? 0);
    return val > max ? val : max;
  }, 0);

  // 🔑 Wrap the filter change to also close the panel
  const onFilterChangeAndClose = (nextSelected) => {
    handleFilterChange(nextSelected);
    dispatch(handleFilterSidebarClose());
  };

  return (
    <>
      <div className={`tp-filter-offcanvas-area ${filterSidebar ? 'offcanvas-opened' : ''}`}>
        <div className="tp-filter-offcanvas-wrapper">
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              // ✅ actually CLOSE on click
              onClick={() => dispatch(handleFilterSidebarClose())}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
              aria-label="Close filters"
              title="Close"
            >
              <i className="fa-solid fa-xmark" /> Close
            </button>
          </div>

          <div className="tp-shop-sidebar">
            {/* Price filter (kept commented) */}
            {/* <PriceFilter priceFilterValues={priceFilterValues} maxPrice={maxPrice} /> */}

            {/* Status filter (kept commented) */}
            {/* <StatusFilter setCurrPage={setCurrPage} shop_right={right_side} /> */}

            {/* Main filters — will close drawer after any change */}
            <ShopSidebarFilters
              selected={selectedFilters}
              onFilterChange={onFilterChangeAndClose}
            />

            {/* Reset filter — also closes drawer after reset */}
            <ResetButton
              shop_right={right_side}
              setPriceValues={priceFilterValues?.setPriceValue}
              maxPrice={maxPrice}
              handleFilterChange={onFilterChangeAndClose}
            />
          </div>
        </div>
      </div>

      {/* overlay click closes */}
      <div
        onClick={() => dispatch(handleFilterSidebarClose())}
        className={`body-overlay ${filterSidebar ? 'opened' : ''}`}
      />
    </>
  );
};

export default ShopFilterOffCanvas;
