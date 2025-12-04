import { useContext } from "react";

import { CartContext } from "../contexts/CartReducerContext.jsx";
import CartItem from "./CartItem.jsx";

const CartItems = () => {
  const { cart, dispatch } = useContext(CartContext);
  console.log(cart);
  return (
    <>
      <div>
        {cart.items.map((item) => (
          <CartItem item={item} key={item.id} />
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white"
          onClick={() => dispatch({ type: "EMPTY_CART" })}
        >
          Reset cart
        </button>
        <button
          type="button"
          className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white"
          onClick={() =>
            alert("Payment process is not implemented yet. But coming soon!")
          }
        >
          Checkout: {cart.total}
        </button>
      </div>
    </>
  );
};

export default CartItems;
