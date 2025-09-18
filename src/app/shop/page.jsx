import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
// import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb"; // breadcrumb removed
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "Shofy - Shop Page",
};

export default function ShopPage() {
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

      {/* Wrapper that adds spacing when breadcrumb is not used */}
      <div className="shop-page-spacing">
        <ShopArea />
      </div>

      <Footer primary_style={true} />
    </Wrapper>
  );
}
