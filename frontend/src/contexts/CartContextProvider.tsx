import { createContext, useEffect, useReducer, useState } from "react";
import type { Dispatch, ReactNode } from "react";

import { fetchProducts } from "../data/network.ts";
import { loadStorage, writeStorage } from "../data/storage.ts";

export type Item = {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
};

interface CartState {
  items: Item[];
  itemCount: number;
  total: string;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Item }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "EMPTY_CART" };

interface CartContextType {
  cart: CartState;
  dispatch: Dispatch<CartAction>;
  formatCurrency: (amount: number) => string;
  products: Item[];
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

const initialState: CartState = {
  items: loadStorage(),
  itemCount: loadStorage().reduce(
    (acc: number, item: Item) => acc + item.quantity,
    0,
  ),
  total: formatCurrency(
    loadStorage().reduce(
      (acc: number, item: Item) => acc + item.price * item.quantity,
      0,
    ),
  ),
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const recalculateCart = (items: Item[]) => {
    const itemCount = items.reduce((acc, item: Item) => acc + item.quantity, 0);
    const total = formatCurrency(
      items.reduce((acc, item: Item) => acc + item.price * item.quantity, 0),
    );
    return { ...state, items, itemCount, total };
  };

  switch (action.type) {
    case "ADD_TO_CART": {
      const existingProduct = state.items.find(
        (item: Item) => item.id === action.payload.id,
      );
      let newItems: Item[];
      if (existingProduct) {
        newItems = state.items.map((item: Item) =>
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
        (item: Item) => item.id === action.payload,
      );
      let newItems: Item[];

      if (existingProduct?.quantity === 1) {
        newItems = state.items.filter(
          (item: Item) => item.id !== action.payload,
        );
      } else {
        newItems = state.items.map((item: Item) =>
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

export default function CartReducerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<Item[] | null>(null);
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const productData: Item[] = [];
    const fetchData = async () => {
      const fetchedProductData = fetchProducts();
      fetchedProductData.then(function (productArray: Item[]) {
        productArray.forEach((product: Item) => {
          product.quantity = 0;
          productData.push(product);
        });
        setProducts(productData);
      });
    };
    fetchData();
  }, []);

  const productsWithQuantity =
    products?.map((p: Item) => {
      const cartItem = cart.items.find((i: Item) => i.id === p.id);
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
