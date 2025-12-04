export const storedCart = "cart";

export function loadStorage() {
  return JSON.parse(localStorage.getItem(storedCart)) ?? [];
}

export function writeStorage(items) {
  localStorage.setItem(storedCart, JSON.stringify(items));
}
