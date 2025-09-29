import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterSidebar: false,
};

export const shopFilterSlice = createSlice({
  name: "shopFilter",
  initialState,
  reducers: {
    // eslint-disable-next-line no-unused-vars
    handleFilterSidebarOpen: (state, { payload: _payload }) => {
      state.filterSidebar = true
    },
    // eslint-disable-next-line no-unused-vars
    handleFilterSidebarClose: (state, { payload: _payload }) => {
      state.filterSidebar = false
    },
  },
});

export const { handleFilterSidebarOpen,handleFilterSidebarClose } = shopFilterSlice.actions;
export default shopFilterSlice.reducer;
