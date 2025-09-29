import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productItem: null,
  isModalOpen: false,
  nonce: 0, // forces a fresh render each open/switch
};

export const productModalSlice = createSlice({
  name: 'productModal',
  initialState,
  reducers: {
    handleProductModal: (state, { payload }) => {
      state.productItem = payload;   // product card’s payload
      state.isModalOpen = true;
      state.nonce += 1;              // bump key so modal remounts
    },
    handleModalClose: (state) => {
      state.isModalOpen = false;
      state.productItem = null;
    },
  },
});

export const { handleProductModal, handleModalClose } = productModalSlice.actions;
export default productModalSlice.reducer;
