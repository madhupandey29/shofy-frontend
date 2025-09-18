'use client';
import React, { useState, useEffect } from 'react';
/* import Pagination from '@/ui/Pagination'; */
import ProductItem from '../products/fashion/product-item';
import ShopListItem from './shop-list-item';
import ShopTopLeft from './shop-top-left';
import ShopTopRight from './shop-top-right';
import ShopSidebarFilters from './ShopSidebarFilters';
import ResetButton from './shop-filter/reset-button';
import EmptyState from '@/components/common/empty-state';

const ShopContent = ({
  all_products = [],
  products = [],
  otherProps,
  shop_right,
  hidden_sidebar,
}) => {
  const {
    priceFilterValues,
    selectHandleFilter,
    setCurrPage,
    selectedFilters,
    handleFilterChange,
  } = otherProps;

  const { setPriceValue, priceValue } = priceFilterValues || {};
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage] = useState(12);

  // measure header + toolbar to center the empty state in remaining viewport
  const [centerOffset, setCenterOffset] = useState(140);
  useEffect(() => {
    const calc = () => {
      const header =
        document.querySelector('.tp-header-area') ||
        document.querySelector('.tp-header-style-primary');
      const toolbar = document.querySelector('.shop-toolbar-sticky');
      const h = header ? header.getBoundingClientRect().height : 0;
      const t = toolbar ? toolbar.getBoundingClientRect().height : 0;
      setCenterOffset(h + t);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    setFilteredRows(products);
    setPageStart(0);
    setCurrPage(1);
  }, [products, setCurrPage]);

  const maxPrice = all_products.reduce(
    (m, p) => Math.max(m, +p.salesPrice || +p.price || 0),
    1000
  );

  // any active?
  const pv = Array.isArray(priceValue) ? priceValue : [0, maxPrice];
  const priceActive = pv[0] > 0 || pv[1] < maxPrice;
  const facetsActive =
    selectedFilters && Object.values(selectedFilters).some((v) =>
      Array.isArray(v) ? v.length > 0 : !!v
    );
  const anyActive = !!(priceActive || facetsActive);

  // reset handler for EmptyState CTA
  const resetAll = () => {
    setPriceValue?.([0, maxPrice]);
    handleFilterChange?.({});
    setCurrPage?.(1);
  };

  return (
    <section className="tp-shop-area pb-120">
      <div className="container">
        <div className="row">
          {/* desktop sidebar */}
          {!shop_right && !hidden_sidebar && (
            <aside className="col-xl-3 col-lg-4 d-none d-lg-block">
              <div className="sticky-filter">
                <div className="filter-header d-flex align-items-center justify-content-between">
                  <h3 className="tp-shop-widget-title mb-0">Filter</h3>
                  <ResetButton
                    className="filter-reset-btn"
                    active={anyActive}
                    setPriceValues={setPriceValue}
                    maxPrice={maxPrice}
                    handleFilterChange={handleFilterChange}
                    aria-label="Reset all filters"
                  />
                </div>

                <ShopSidebarFilters
                  selected={selectedFilters}
                  onFilterChange={handleFilterChange}
                  hideTitle={true}
                />
              </div>
            </aside>
          )}

          {/* main */}
          <div className={hidden_sidebar ? 'col-xl-12 col-lg-12' : 'col-xl-9 col-lg-8 col-12'}>
            <div className="tp-shop-main-wrapper">
              <div className="shop-toolbar-sticky">
                <div className="tp-shop-top mb-45">
                  <div className="row">
                    <div className="col-xl-6">
                      <ShopTopLeft
                        showing={filteredRows.slice(pageStart, pageStart + countOfPage).length}
                        total={all_products.length}
                      />
                    </div>
                    <div className="col-xl-6">
                      <ShopTopRight selectHandleFilter={selectHandleFilter} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="tp-shop-items-wrapper tp-shop-item-primary">
                {filteredRows.length === 0 ? (
                  <div
                    className="shop-empty"
                    style={{ ['--page-offset']: `${centerOffset}px` }}
                  >
                    <EmptyState
                      title="No products match your filters"
                      subtitle="Try adjusting your filters or explore more categories."
                      tips={['Clear some filters', 'Try a different category', 'Widen the price range']}
                      primaryAction={{ label: 'Reset all filters', onClick: resetAll }}
                      secondaryAction={{ label: 'Browse all products', href: '/fabric' }}
                    />
                  </div>
                ) : (
                  <div className="tab-content" id="productTabContent">
                    <div
                      className="tab-pane fade show active"
                      id="grid-tab-pane"
                      role="tabpanel"
                      aria-labelledby="grid-tab"
                    >
                      <div className="row g-4">
                        {filteredRows
                          .slice(pageStart, pageStart + countOfPage)
                          .map((item) => (
                            <div key={item._id} className="col-xl-4 col-md-6 col-sm-6">
                              <ProductItem product={item} />
                            </div>
                          ))}
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="list-tab-pane"
                      role="tabpanel"
                      aria-labelledby="list-tab"
                    >
                      <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                        {filteredRows
                          .slice(pageStart, pageStart + countOfPage)
                          .map((item) => (
                            <ShopListItem key={item._id} product={item} />
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {shop_right && <aside className="col-xl-3 col-lg-4 d-none d-lg-block"></aside>}
        </div>
      </div>

      <style jsx>{`
        .shop-empty {
          /* viewport height minus header + toolbar, measured in JS */
          min-height: calc(100vh - var(--page-offset, 140px));
          display: grid;
          place-items: center; /* perfectly center */
          padding: 8px 0;
        }
      `}</style>
    </section>
  );
};

export default ShopContent;
