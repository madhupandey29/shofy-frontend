import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    // ──────────────── C R U D ────────────────
    addCategory: builder.mutation({
      query: body => ({
        url: "/category/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    /** ─ Get *all* categories  */
    getShowCategory: builder.query({
      query: () => "/category/",
      providesTags: ["Category"],
    }),

    /** ─ Get categories by product-type  */
    getProductTypeCategory: builder.query({
      query: type => `/category/show/${type}`,
      providesTags: (r, _e, type) => [{ type: "Category", id: type }],
    }),

    /** ───── NEW: get a *single* category by its id ───── */
    getCategoryById: builder.query({
      query: id => `/category/${id}`,
      providesTags: (r, _e, id) => [{ type: "Category", id }],
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetShowCategoryQuery,
  useGetProductTypeCategoryQuery,
  useGetCategoryByIdQuery,     //  ←  use this in DetailsTabNav
} = categoryApi;
