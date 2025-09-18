import { apiSlice } from "../api/apiSlice";

export const designApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDesignById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/design/${id}`,
      providesTags: (result, error, id) => [{ type: "Design", id }],
    }),
  }),
});

export const { 
  useGetDesignByIdQuery,
} = designApi; 