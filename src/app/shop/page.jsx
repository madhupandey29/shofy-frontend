// app/shop/page.tsx (or app/(root)/shop/page.tsx)
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopArea from "@/components/shop/shop-area";

/* ---------------------------------------------
   Force SSR for this route (no caching)
---------------------------------------------- */
export const dynamic = "force-dynamic";       // render on server on every request
export const revalidate = 0;                   // opt out of ISR entirely
export const fetchCache = "default-no-store";  // don't cache fetch() calls on this page

export const metadata = {
  title: "Shofy - Shop Page",
};

/* ---------------------------------------------
   Helpers
---------------------------------------------- */
function buildApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  if (apiKey) headers["x-api-key"] = apiKey;
  if (adminEmail) headers["x-admin-email"] = adminEmail;
  return headers;
}

function trimEndSlash(s: string) {
  return s.replace(/\/+$/, "");
}

/**
 * Fetch products on the server (SSR).
 * Adjust the endpoint if your API differs (e.g., /product or /catalog).
 */
async function fetchProductsSSR() {
  const RAW_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/landing";
  const API_BASE = trimEndSlash(RAW_BASE);

  // Try common endpoints in order, stop at the first that returns OK
  const candidates = [
    `${API_BASE}/products?limit=24`,
    `${API_BASE}/product?limit=24`,
    `${API_BASE}/catalog/products?limit=24`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: buildApiHeaders(),
        cache: "no-store",           // SSR: no HTTP caching
        next: { revalidate: 0 },     // SSR: no Next cache
      });
      if (!res.ok) continue;

      const payload = await res.json();

      // Normalize common shapes:
      // { data: [...] } or { data: { items: [...] } } or just [...]
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

  // Final fallback
  return [];
}

/* ---------------------------------------------
   Page (Server Component)
---------------------------------------------- */
export default async function ShopPage() {
  // ✅ Runs on the server; fetches fresh data each request
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

      {/* When breadcrumb is removed, keep spacing wrapper */}
      <div className="shop-page-spacing">
        {/* Pass SSR data down; if ShopArea ignores it, no harm done */}
        <ShopArea initialProducts={initialProducts} />
      </div>

      <Footer primary_style />
    </Wrapper>
  );
}
