import { useContext } from "react";

import { CartContext } from "../contexts/CartReducerContext.jsx";
import Product from "./Product.jsx";

const ProductList = () => {
  const { products } = useContext(CartContext);
  if (!products) return <div className="text-center">Loading...</div>;
  if (products && products.length > 0) {
    return (
      <>
        <div className="mx-5 grid grid-cols-1 gap-5 md:grid-cols-4">
          {products.map((product) => (
            <Product product={product} key={product.id} />
          ))}
        </div>
      </>
    );
  } else {
    return <div className="text-center">No products found</div>;
  }
};

export default ProductList;
