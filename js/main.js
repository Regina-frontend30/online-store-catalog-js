import { initMenu } from "./components/menu.js";
import { initLocation } from "./components/location.js";
import { loadProducts } from "./components/data.js";
import { initCatalog } from "./components/catalog.js";
import { initBasket } from "./components/basket.js";


window.addEventListener("DOMContentLoaded", async () => {
  initMenu();
  initLocation();
  const products = await loadProducts();
  initCatalog(products);
  initBasket(products);
});