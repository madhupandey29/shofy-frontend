'use client';

import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleFilterSidebarClose } from '@/redux/features/shop-filter-slice';
import ResetButton from '../shop/shop-filter/reset-button';
import ShopSidebarFilters, {
  FilterOnly as MobileFilterFlyout,
  FILTERS_MAP,
} from '../shop/ShopSidebarFilters';

const ShopFilterOffCanvas = ({ all_products, otherProps, right_side = false }) => {
  const { priceFilterValues, selectedFilters, handleFilterChange } = otherProps;
  const { filterSidebar } = useSelector((state) => state.shopFilter);
  const dispatch = useDispatch();

  const wrapperRef = useRef(null);            // <-- portal target for mobile flyout
  const [singleKey, setSingleKey] = useState(null);

  // max price (for ResetButton props)
  const maxPrice = all_products.reduce((max, product) => {
    const val = Number(product?.price ?? 0);
    return val > max ? val : max;
  }, 0);

  const applyAndClose = (nextSelected) => {
    handleFilterChange(nextSelected);
    dispatch(handleFilterSidebarClose());
  };

  return (
    <>
      <div className={`tp-filter-offcanvas-area ${filterSidebar ? 'offcanvas-opened' : ''}`}>
        <div className="tp-filter-offcanvas-wrapper" ref={wrapperRef}>
          <div className="tp-filter-offcanvas-close">
            <button
              type="button"
              onClick={() => {
                if (singleKey) { setSingleKey(null); return; } // back to list if viewing a single filter
                dispatch(handleFilterSidebarClose());
              }}
              className="tp-filter-offcanvas-close-btn filter-close-btn"
              aria-label="Close filters"
              title="Close"
            >
              <i className="fa-solid fa-xmark" /> Close
            </button>
          </div>

          <div className="tp-shop-sidebar" style={{ position: 'relative' }}>
            {singleKey ? (
              <MobileFilterFlyout
                filter={FILTERS_MAP[singleKey]}
                selected={selectedFilters}
                onApply={(nextSelected) => {
                  applyAndClose(nextSelected);
                  setSingleKey(null);
                }}
                onCancel={() => setSingleKey(null)}
                portalTarget={wrapperRef.current /* mount INSIDE drawer */}
              />
            ) : (
              <>
                <ShopSidebarFilters
                  selected={selectedFilters}
                  onFilterChange={applyAndClose}
                  mobile
                  mobileSingle
                  onOpenFilter={(key) => setSingleKey(key)}
                />

                <ResetButton
                  shop_right={right_side}
                  setPriceValues={priceFilterValues?.setPriceValue}
                  maxPrice={maxPrice}
                  handleFilterChange={applyAndClose}
                />
              </>
            )}
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
