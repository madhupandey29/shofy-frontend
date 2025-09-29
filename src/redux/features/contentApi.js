import { apiSlice } from "../api/apiSlice";

export const contentApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getContentById: builder.query({
      query: (id) => `/content/${id}`,
      providesTags: (result, error, id) => [{ type: "Content", id }],
    }),
  }),
});

export const { 
  useGetContentByIdQuery,
} = contentApi; 