import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import WishlistArea from "@/components/cart-wishlist/wishlist-area";

export const metadata = {
  title: "Shofy - Wishlist Page",
};

export default function WishlistPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Wishlist - Your Saved Products</h1>
      <CommonBreadcrumb title="Wishlist" subtitle="Wishlist" />
      <WishlistArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
