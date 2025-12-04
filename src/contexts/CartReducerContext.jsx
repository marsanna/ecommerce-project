import { createContext, useEffect, useReducer, useState } from "react";

import { fetchProducts } from "../data/network.js";
import { loadStorage, writeStorage } from "../data/storage.js";

export const CartContext = createContext();

const formatCurrency = (amount) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

const initialState = {
  items: loadStorage(),
  itemCount: loadStorage().reduce((acc, item) => acc + item.quantity, 0),
  total: formatCurrency(
    loadStorage().reduce((acc, item) => acc + item.price * item.quantity, 0),
  ),
};

const cartReducer = (state, action) => {
  const recalculateCart = (items) => {
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const total = formatCurrency(
      items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    );
    return { ...state, items, itemCount, total };
  };

  switch (action.type) {
    case "ADD_TO_CART": {
      const existingProduct = state.items.find(
        (item) => item.id === action.payload.id,
      );
      let newItems;
      if (existingProduct) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      writeStorage(newItems);
      return recalculateCart(newItems);
    }

    case "REMOVE_FROM_CART": {
      const existingProduct = state.items.find(
        (item) => item.id === action.payload,
      );
      let newItems;
      if (existingProduct.quantity === 1) {
        newItems = state.items.filter((item) => item.id !== action.payload);
      } else {
        newItems = state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        );
      }
      writeStorage(newItems);
      return recalculateCart(newItems);
    }

    case "EMPTY_CART":
      writeStorage([]);
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: formatCurrency(0),
      };

    default:
      return state;
  }
};

export default function CartReducerProvider({ children }) {
  const [products, setProducts] = useState(null);
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  useEffect(() => {
    const productData = [];
    const fetchData = async () => {
      const fetchedProductData = fetchProducts();
      fetchedProductData.then(function (productArray) {
        productArray.forEach((product) => {
          product.quantity = 0;
          productData.push(product);
        });
        setProducts(productData);
      });
    };
    fetchData();
  }, []);
  const productsWithQuantity =
    products?.map((p) => {
      const cartItem = cart.items.find((i) => i.id === p.id);
      return { ...p, quantity: cartItem?.quantity ?? 0 };
    }) ?? [];
  return (
    <CartContext.Provider
      value={{
        cart,
        dispatch,
        formatCurrency,
        products: productsWithQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
