// app/shop/page.jsx
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopArea from "@/components/shop/shop-area";

/* ---------------------------------------------
   Force SSR for this route (no caching)
---------------------------------------------- */
export const dynamic = "force-dynamic";       // render on the server every request
export const revalidate = 0;                   // disable ISR
export const fetchCache = "default-no-store";  // don't cache fetch() calls

export const metadata = {
  title: "Shofy - Shop Page",
};

/* ---------------------------------------------
   Helpers (plain JS, no TS types)
---------------------------------------------- */
function buildApiHeaders() {
  const headers = { "Content-Type": "application/json" };
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
  if (apiKey) headers["x-api-key"] = apiKey;
  if (adminEmail) headers["x-admin-email"] = adminEmail;
  return headers;
}

function trimEndSlash(s = "") {
  return s.replace(/\/+$/, "");
}

/**
 * Fetch products on the server (SSR).
 * Adjust the endpoint if your API differs.
 */
async function fetchProductsSSR() {
  const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
  const API_BASE = trimEndSlash(RAW_BASE);

  const candidates = [
    `${API_BASE}/products?limit=24`,
    `${API_BASE}/product?limit=24`,
    `${API_BASE}/catalog/products?limit=24`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: buildApiHeaders(),
        cache: "no-store",        // SSR: no HTTP cache
        next: { revalidate: 0 },  // SSR: no Next cache
      });
      if (!res.ok) continue;

      const payload = await res.json();
      const data =
        (Array.isArray(payload?.data) && payload.data) ||
        (Array.isArray(payload) && payload) ||
        (Array.isArray(payload?.data?.items) && payload.data.items) ||
        [];

      return Array.isArray(data) ? data : [];
    } catch {
      // try next candidate
    }
  }

  return [];
}

/* ---------------------------------------------
   Page (Server Component)
---------------------------------------------- */
export default async function ShopPage() {
  // Runs on the server; fetches fresh data every request
  const initialProducts = await fetchProductsSSR();

  return (
    <Wrapper>
      <HeaderTwo style_2 />

      {/* SR-only heading for SEO */}
      <h1
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        Shop - Browse All Products
      </h1>

      {/* Keep spacing wrapper when breadcrumb is removed */}
      <div className="shop-page-spacing">
        {/* Pass SSR data down; ShopArea can hydrate / paginate client-side */}
        <ShopArea initialProducts={initialProducts} />
      </div>

      <Footer primary_style />
    </Wrapper>
  );
}
