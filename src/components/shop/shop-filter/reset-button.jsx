import { useRouter } from "next/navigation";
import React from "react";

const ResetButton = ({ shop_right = false,setPriceValues,maxPrice,handleFilterChange }) => {
  const router = useRouter();

  const handleReset = () => {
    setPriceValues([0, maxPrice]);
    if(handleFilterChange) {
      handleFilterChange({});
    }
    router.push(`/${shop_right ? "shop-right-sidebar" : "shop"}`);
  };
  return (
    <div className="tp-shop-widget mb-20"><button
        onClick={handleReset}
        className="tp-btn" >
        Reset Filter
      </button>
    </div>
  );
};

export default ResetButton;
