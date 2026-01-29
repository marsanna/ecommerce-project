import { useContext } from "react";

import { CartContext } from "../contexts/CartContextProvider.tsx";
import type { Item } from "../contexts/CartContextProvider.tsx";

function CartItem({ item }: { item: Item }) {
  const context = useContext(CartContext);

  if (!context) {
    return null;
  }

  const { dispatch, formatCurrency } = context;
  const { id, title, image, description, price, quantity } = item;

  return (
    <>
      <div className="grid-row grid items-center gap-4 border-b border-gray-300 p-4 text-sm hover:bg-gray-100 md:grid-cols-5">
        <div className="flex items-center justify-start md:justify-center">
          <img
            src={image}
            alt={title.trim()}
            className="block max-h-20 max-w-[100px] rounded object-contain"
          />
        </div>
        <div className="flex flex-col">
          <b className="text-gray-800">{title}</b>
          <span className="text-gray-600">
            Unit price: {formatCurrency(price)}
          </span>
        </div>
        <div className="truncate text-gray-700">{description}</div>
        <div className="flex items-center justify-start gap-2 md:justify-center">
          <button
            className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: id })}
          >
            -
          </button>
          <div className="w-6 text-center font-semibold">{quantity}</div>
          <button
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: item })}
            className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
          >
            +
          </button>
        </div>
        <div className="text-right font-semibold text-gray-800">
          {formatCurrency(price * quantity)}
        </div>
      </div>
    </>
  );
}

export default CartItem;
