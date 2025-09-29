import { apiSlice } from "../api/apiSlice";

export const motifSizeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMotifSizeById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/motif/${id}`,
      providesTags: (result, error, id) => [{ type: "MotifSize", id }],
    }),
  }),
});

export const { 
  useGetMotifSizeByIdQuery,
} = motifSizeApi; 