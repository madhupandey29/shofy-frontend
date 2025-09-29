import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialState = {
  wishlist: [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    add_to_wishlist: (state, { payload }) => {
      try {
        // Ensure we have a valid product ID to work with
        const productId = payload._id || payload.id;
        if (!productId) {
          console.error('Cannot update wishlist: Product ID is missing', payload);
          return;
        }

        // Check if product already exists in wishlist
        const existingIndex = state.wishlist.findIndex(item => 
          (item._id === productId || item.id === productId)
        );

        if (existingIndex === -1) {
          // Add new item to wishlist
          const newItem = {
            ...payload,
            _id: productId, // Ensure _id is set
            id: productId,  // Keep id for backward compatibility
            title: payload.title || payload.name || 'Product',
            price: parseFloat(payload.price) || 0,
            image: payload.image || payload.imageUrl || ''
          };
          
          state.wishlist.push(newItem);
          notifySuccess(`${newItem.title} added to wishlist`);
        } else {
          // Remove item from wishlist if it already exists (toggle behavior)
          const removedItem = state.wishlist[existingIndex];
          state.wishlist.splice(existingIndex, 1);
          notifyError(`${removedItem.title} removed from wishlist`);
        }
        
        // Update local storage
        setLocalStorage("wishlist_items", state.wishlist);
        console.log('Wishlist updated:', state.wishlist);
        
      } catch (error) {
        console.error('Error in add_to_wishlist:', error);
        notifyError("Failed to update wishlist");
      }
    },
    remove_wishlist_product: (state, { payload }) => {
      state.wishlist = state.wishlist.filter((item) => item._id !== payload.id);
      notifyError(`${payload.title} removed from wishlist`);
      setLocalStorage("wishlist_items", state.wishlist);
    },
    // eslint-disable-next-line no-unused-vars
    get_wishlist_products: (state, { payload: _payload }) => {
      state.wishlist = getLocalStorage("wishlist_items");
    },
  },
});

export const {
  add_to_wishlist,
  remove_wishlist_product,
  get_wishlist_products,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
