export async function loadProducts() {
  try {
    const response = await fetch("./data/data.json");

    if (!response.ok) {
      throw new Error("Ошибка загрузки товаров");
    }

    const products = await response.json();
    return products;
  } catch (error) {
    return [];
  }
}
