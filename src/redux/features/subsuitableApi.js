import { apiSlice } from "../api/apiSlice";

export const subsuitableApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSubsuitables: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/subsuitable/`,
      providesTags: ["Subsuitable"],
    }),

    getSubsuitable: builder.query({
      query: (id) =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subsuitable/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Subsuitable", id }],
    }),
  }),
});

export const {
  useGetAllSubsuitablesQuery,
  useGetSubsuitableQuery,
} = subsuitableApi;
