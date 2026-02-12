import { useContext } from "react";

import { CartContext } from "../contexts/CartContextProvider.tsx";
import type { Item } from "../contexts/CartContextProvider.tsx";
import CartItem from "./CartItem.tsx";

const CartItems = () => {
  const context = useContext(CartContext);

  if (!context) return null;

  const { cart } = context;

  if (cart.items && cart.items.length > 0) {
    return (
      <>
        <div>
          {cart.items.map((item: Item) => (
            <CartItem item={item} key={item.id} />
          ))}
        </div>
      </>
    );
  } else {
    return <div className="text-center">Your shopping cart is empty.</div>;
  }
};

export default CartItems;
