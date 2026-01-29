import type { Item } from "../contexts/CartContextProvider.tsx";

const urlToFetch = "https://fakestoreapi.com/products";

export async function fetchProducts(): Promise<Item[]> {
  try {
    const response = await fetch(`${urlToFetch}`);
    if (!response.ok) throw new Error("Network response was not ok");

    return (await response.json()) as Item[];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export function getFetchProductData(id: number, productArray: Item[]) {
  return productArray.find((product: Item) => product.id === id);
}
