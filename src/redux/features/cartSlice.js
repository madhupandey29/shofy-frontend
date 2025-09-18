import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialState = {
  cart_products: [],
  orderQuantity: 1,
  cartMiniOpen:false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add_cart_product: (state, { payload }) => {
      try {
        // Ensure we have a valid product ID to work with
        const productId = payload._id || payload.id;
        if (!productId) {
          console.error('Cannot add to cart: Product ID is missing', payload);
          return;
        }

        // Find if product already exists in cart
        const existingIndex = state.cart_products.findIndex(item => 
          (item._id === productId || item.id === productId)
        );

        if (existingIndex === -1) {
          // Add new item to cart
          const newItem = {
            ...payload,
            _id: productId, // Ensure _id is set
            id: productId,  // Keep id for backward compatibility
            orderQuantity: state.orderQuantity || 1,
            quantity: payload.quantity || 1,
            title: payload.title || payload.name || 'Product',
            price: parseFloat(payload.price) || 0,
            image: payload.image || payload.imageUrl || ''
          };
          
          state.cart_products.push(newItem);
          notifySuccess(`${newItem.orderQuantity} ${newItem.title} added to cart`);
        } else {
          // Update existing item quantity
          const item = state.cart_products[existingIndex];
          const newQty = (item.orderQuantity || 1) + (state.orderQuantity || 1);
          
          if (item.quantity >= newQty) {
            item.orderQuantity = newQty;
            notifySuccess(`${item.title} quantity updated to ${newQty}`);
          } else {
            notifyError("No more quantity available for this product!");
          }
        }
        
        // Update local storage
        setLocalStorage("cart_products", state.cart_products);
        console.log('Cart updated:', state.cart_products);
        
      } catch (error) {
        console.error('Error in add_cart_product:', error);
        notifyError("Failed to add item to cart");
      }
    },
    // eslint-disable-next-line no-unused-vars
    increment: (state, { payload: _payload }) => {
      state.orderQuantity = state.orderQuantity + 1;
    },
    // eslint-disable-next-line no-unused-vars
    decrement: (state, { payload: _payload }) => {
      state.orderQuantity =
        state.orderQuantity > 1
          ? state.orderQuantity - 1
          : (state.orderQuantity = 1);
    },
    quantityDecrement: (state, { payload }) => {
      state.cart_products.map((item) => {
        if (item._id === payload._id) {
          if (item.orderQuantity > 1) {
            item.orderQuantity = item.orderQuantity - 1;
          }
        }
        return { ...item };
      });
      setLocalStorage("cart_products", state.cart_products);
    },
    remove_product: (state, { payload }) => {
      state.cart_products = state.cart_products.filter(
        (item) => item._id !== payload.id
      );
      setLocalStorage("cart_products", state.cart_products);
      notifyError(`${payload.title} Remove from cart`);
    },
    get_cart_products: (state) => {
      state.cart_products = getLocalStorage("cart_products");
    },
    // eslint-disable-next-line no-unused-vars
    initialOrderQuantity: (state, { payload: _payload }) => {
      state.orderQuantity = 1;
    },
    clearCart:(state) => {
      const isClearCart = window.confirm('Are you sure you want to remove all items ?');
      if(isClearCart){
        state.cart_products = []
      }
      setLocalStorage("cart_products", state.cart_products);
    },
    // eslint-disable-next-line no-unused-vars
    openCartMini:(state,{ payload: _payload }) => {
      state.cartMiniOpen = true
    },
    // eslint-disable-next-line no-unused-vars
    closeCartMini:(state,{ payload: _payload }) => {
      state.cartMiniOpen = false
    },
  },
});

export const {
  add_cart_product,
  increment,
  decrement,
  get_cart_products,
  remove_product,
  quantityDecrement,
  initialOrderQuantity,
  clearCart,
  closeCartMini,
  openCartMini,
} = cartSlice.actions;
export default cartSlice.reducer;
