import { apiSlice } from "../api/apiSlice";

export const finishApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFinishById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/finish/${id}`,
      providesTags: (result, error, id) => [{ type: "Finish", id }],
    }),
  }),
});

export const { 
  useGetFinishByIdQuery,
} = finishApi; 