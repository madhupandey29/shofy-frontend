'use client'

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

import BackToTopCom from "@/components/common/back-to-top";
import ProductModal from "@/components/common/product-modal";
import { get_cart_products, initialOrderQuantity } from "@/redux/features/cartSlice";
import { get_wishlist_products } from "@/redux/features/wishlist-slice";
import { get_compare_products } from "@/redux/features/compareSlice";
import useAuthCheck from "@/hooks/use-auth-check";
import Loader from "@/components/loader/loader";

const Wrapper = ({ children }) => {
  const { productItem } = useSelector((state) => state.productModal);
  const dispatch = useDispatch();
  const authChecked = useAuthCheck();

  useEffect(() => {
    dispatch(get_cart_products());
    dispatch(get_wishlist_products());
    dispatch(get_compare_products());
    dispatch(initialOrderQuantity());
  }, [dispatch]);

  if (!authChecked) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <Loader spinner="fade" loading />
      </div>
    );
  }

  return (
    <div id="wrapper">
      {children}
      <BackToTopCom />
      <ToastContainer position="top-right" autoClose={3000} />
      {productItem && <ProductModal />}
    </div>
  );
};

export default Wrapper;
