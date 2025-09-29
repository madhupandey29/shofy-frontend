import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CartArea from "@/components/cart-wishlist/cart-area";

export const metadata = {
  title: "Shofy - Cart Page",
};

export default function CartPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Shopping Cart - Review Your Items</h1>
      <CommonBreadcrumb title="Shopping Cart" subtitle="Shopping Cart" />
      <CartArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
