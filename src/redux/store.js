import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { seoApi } from "./features/seoApi";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import orderSlice from "./features/order/orderSlice";


// Optional dev logger
const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info("Dispatching:", action);
  console.log("Previous state:", store.getState());
  const result = next(action);
  console.log("Next state:", store.getState());
  console.groupEnd();
  return result;
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [seoApi.reducerPath]: seoApi.reducer,
    auth: authSlice,
    productModal: productModalSlice,
    shopFilter: shopFilterSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    compare: compareSlice,
    order: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // these are yours — kept as-is
        ignoredActions: [
          "cart/add_cart_product",
          "wishlist/add_to_wishlist",

          // RTK Query async actions (by reducerPath = "api")
          "api/executeQuery/fulfilled",
          "api/executeQuery/rejected",
          "api/executeMutation/fulfilled",
          "api/executeMutation/rejected",
        ],
        ignoredActionPaths: [
          "payload.product",
          "payload.prd",

          // ✅ ignore the entire non-serializable meta branch from RTK Query
          "meta.baseQueryMeta",           // <— important
          "meta.arg.originalArgs",        // (often contains complex objects)
        ],
        ignoredPaths: [
          "cart.cart_products",
          "wishlist.wishlist",

          // if any response meta leaks into state (rare), ignore it too
          "meta.baseQueryMeta",
        ],
      },
    }).concat([apiSlice.middleware, seoApi.middleware, logger]),
  devTools: process.env.NODE_ENV !== "production",
});

// (Optional) small dev-only initial log
if (process.env.NODE_ENV !== "production") {
  console.log("Initial state:", store.getState());
}

export default store;
