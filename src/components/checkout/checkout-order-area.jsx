// CHECKOUT ORDER/PAYMENT AREA DISABLED: The entire CheckoutOrderArea component is commented out as per request.
/*
'use client';
import { CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";

// Main CheckoutOrderArea component
const CheckoutOrderArea = ({ checkoutData }) => {
  // Destructure checkout data, including Stripe and payment state
  const {
    handleShippingCost,
    cartTotal = 0,
    stripe,
    isCheckoutSubmit,
    register,
    errors,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount
  } = checkoutData;

  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();

  return (
    <div className="tp-checkout-place white-bg">
      // Order summary and payment options (commented out)
    </div>
  );
};

export default CheckoutOrderArea;
*/
