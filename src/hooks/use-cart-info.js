'use client';
import { useMemo } from "react";
import { useSelector } from "react-redux";

const useCartInfo = () => {
    const { cart_products = [] } = useSelector((state) => state.cart);

    const { total, quantity } = useMemo(() => {
        return cart_products.reduce(
            (cartTotal, cartItem) => {
                const { salesPrice, orderQuantity } = cartItem;
                const itemTotal = (salesPrice || 0) * orderQuantity;
                cartTotal.total += itemTotal;
                cartTotal.quantity += orderQuantity;
                return cartTotal;
            },
            {
                total: 0,
                quantity: 0,
            }
        );
    }, [cart_products]);

    return {
        quantity,
        total: Number(total.toFixed(2)),
    };
}

export default useCartInfo;