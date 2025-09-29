/* eslint-disable no-unused-vars */
'use client';
import React, { useState, useEffect } from 'react';
import Pagination       from '@/ui/Pagination';
import ProductItem      from '../products/fashion/product-item';
import ShopTopLeft      from './shop-top-left';
import ShopTopRight     from './shop-top-right';

const ShopHiddenSidebarArea = ({
  all_products = [],
  products     = [],
  otherProps,
}) => {
  const { selectHandleFilter, currPage, setCurrPage } = otherProps;
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart,    setPageStart]    = useState(0);
  const [countOfPage,  setCountOfPage]  = useState(12);

  // sync when products change
  useEffect(() => {
    setFilteredRows(products);
    setPageStart(0);
    setCurrPage(1);
  }, [products, setCurrPage]);

  const paginatedData = (items, start, cnt) => {
    setFilteredRows(items);
    setPageStart(start);
    setCountOfPage(cnt);
  };

  return (
    <section className="tp-shop-area pb-120">
      <div className="container">
        <div className="tp-shop-main-wrapper">
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

          {filteredRows.length === 0 ? (
            <h2 className="text-center">No products found</h2>
          ) : (
            <div className="tp-shop-items-wrapper tp-shop-item-primary">
              {/* ✅ Only one (grid) slider now */}
              <div className="row">
                {filteredRows.slice(pageStart, pageStart + countOfPage).map((item) => (
                  <div key={item._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                    <ProductItem product={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredRows.length > 0 && (
            <div className="tp-shop-pagination mt-20">
              <Pagination
                items={filteredRows}
                countOfPage={countOfPage}
                paginatedData={paginatedData}
                currPage={currPage}
                setCurrPage={setCurrPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hide any List-view toggle button that may still render in the toolbar */}
      <style jsx>{`
        [data-bs-target="#list-tab-pane"],
        #list-tab { display: none !important; }
      `}</style>
    </section>
  );
};

export default ShopHiddenSidebarArea;
