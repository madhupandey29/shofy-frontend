'use client';
import React from "react";
const DetailsBottomInfo = ({sku,category,tag}) => {
  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>SKU: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Category: </span>
          <p>{category}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Tag: </span>
          <p>{tag}</p>
        </div>
      </div>
    </>
  );
};

export default DetailsBottomInfo;
