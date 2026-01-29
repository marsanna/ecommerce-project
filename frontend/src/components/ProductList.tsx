import { useContext } from "react";

import { CartContext } from "../contexts/CartContextProvider.tsx";
import type { Item } from "../contexts/CartContextProvider.tsx";
import Product from "./Product.tsx";

const ProductList = () => {
  const context = useContext(CartContext);

  if (!context) return null;

  const { products } = context;

  if (!products) return <div className="text-center">Loading...</div>;
  if (products && products.length > 0) {
    return (
      <>
        <div className="mx-5 grid grid-cols-1 gap-5 md:grid-cols-4">
          {products.map((product: Item) => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      </>
    );
  } else {
    return <div className="text-center">Keine Produkte sind verfügbar.</div>;
  }
};

export default ProductList;
