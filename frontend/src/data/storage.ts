import type { Item } from "../contexts/CartContextProvider.tsx";

export const storedCart = "cart";

export function loadStorage(): Item[] {
  try {
    const data = localStorage.getItem(storedCart);

    if (!data) return [];

    return JSON.parse(data) as Item[];
  } catch (error) {
    console.error("Local storage error:", error);
    return [];
  }
}

export function writeStorage(items: Item[]): void {
  localStorage.setItem(storedCart, JSON.stringify(items));
}
