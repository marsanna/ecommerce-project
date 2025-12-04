const urlToFetch = "https://fakestoreapi.com/products";

export async function fetchProducts() {
  try {
    return fetch(`${urlToFetch}`).then((res) => {
      if (!res.ok) throw new Error("error");
      return res.json();
    });
  } catch (error) {
    console.log(error);
  }
}

export function getFetchProductData(id, productArray) {
  return productArray.find((product) => product.id === id);
}
