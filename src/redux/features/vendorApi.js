
import { apiSlice } from "../api/apiSlice";

export const vendorApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllVendors: builder.query({
      query: () =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vendor/`,
      providesTags: ["Vendor"],
    }),

    getVendorById: builder.query({                   
      query: (id) =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/vendor/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Vendor", id }],
    }),
  }),
});

export const {
  useGetAllVendorsQuery,
  useGetVendorByIdQuery,          
} = vendorApi;
