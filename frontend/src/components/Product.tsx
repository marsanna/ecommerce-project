import { useContext } from "react";

import { CartContext } from "../contexts/CartContextProvider.tsx";
import type { Item } from "../contexts/CartContextProvider.tsx";

function Product({ product }: { product: Item }) {
  const context = useContext(CartContext);

  if (!context) {
    return null;
  }

  const { dispatch, formatCurrency } = context;
  const { id, title, image, description, price, quantity } = product;

  return (
    <>
      <article className="rounded-lg bg-white pt-4 pr-4 pb-14 pl-4 shadow-md transition-shadow hover:shadow-lg">
        <div className="relative flex h-full flex-col items-start space-y-3">
          <b className="text-lg font-semibold text-gray-800">{title.trim()}</b>
          <img
            src={image}
            alt={title.trim()}
            className="mx-auto block max-h-[200px] w-full rounded object-contain py-2"
          />
          <div
            id="description_2"
            className="d-1 cursor-pointer text-sm text-gray-600"
          >
            {description.trim()}
          </div>
          <div className="text-xl font-bold text-gray-900">
            {formatCurrency(price)}
          </div>
          {quantity === 0 ? (
            <button
              onClick={() =>
                dispatch({ type: "ADD_TO_CART", payload: product })
              }
              className="add-to-cart absolute -bottom-10 cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-800"
            >
              Add to cart
            </button>
          ) : (
            <div className="flex max-w-[200px] items-center justify-between gap-2">
              <button
                className="cursor-pointer rounded bg-red-500 px-3 py-1 text-white hover:bg-red-700"
                onClick={() =>
                  dispatch({ type: "REMOVE_FROM_CART", payload: id })
                }
              >
                -
              </button>
              <div className="text-center">{quantity}</div>
              <button
                onClick={() =>
                  dispatch({ type: "ADD_TO_CART", payload: product })
                }
                className="cursor-pointer rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-700"
              >
                +
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
}

export default Product;
