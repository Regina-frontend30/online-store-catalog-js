import { addToBasket } from "./basket.js";

const PAGE_SIZE = 6;
let allProducts = [];
let currentProducts = [];
let catalogListEl = null;
let paginationEl = null;
let currentPage = 1;

export function initCatalog(products) {
  allProducts = Array.isArray(products) ? products : [];
  currentProducts = [...allProducts];
  catalogListEl = document.querySelector(".catalog__list");
  paginationEl = document.querySelector(".catalog__pagination");
  const form = document.querySelector(".catalog-form");
  const sortSelect = document.querySelector(".catalog__sort-select");

  if (!catalogListEl) return;

  updateTypeCounts(allProducts);
  renderProductsPage();

  if (form) form.addEventListener("change", () => applyFiltersAndSort());
  if (sortSelect)
    sortSelect.addEventListener("change", () => applyFiltersAndSort());
}

function renderProductsPage() {
  const total = currentProducts.length;
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  renderProducts(currentProducts.slice(start, end));
  updatePagination(total);
}

function renderProducts(products) {
  catalogListEl.innerHTML = products.length
    ? ""
    : '<li class="catalog__empty">Нет доступных товаров</li>';

  products.forEach((p) => catalogListEl.append(createProductCard(p)));
  initTooltips();
}

function createProductCard(product) {
  const li = document.createElement("li");
  li.className = "catalog__item";
  li.innerHTML = getProductCardMarkup(product);

  const available =
    product.availability &&
    (product.availability.moscow > 0 ||
      product.availability.orenburg > 0 ||
      product.availability.saintPetersburg > 0);

  const addBtn = li.querySelector(".add-to-cart-btn");
  if (!addBtn) return li;

  if (available) {
    addBtn.addEventListener("click", () => addToBasket(product.id));
  } else {
    addBtn.disabled = true;
    addBtn.classList.add("btn--disabled");
    const textEl = addBtn.querySelector(".btn__text");
    if (textEl) textEl.textContent = "Нет в наличии";
  }

  return li;
}

function getProductCardMarkup({ id, name, image, price, availability }) {
  const newPrice = price?.new ?? 0;
  const oldPrice = price?.old ?? 0;
  const { moscow = 0, orenburg = 0, saintPetersburg = 0 } = availability || {};

  return `
    <div class="product-card">
      <div class="product-card__visual">
        <img class="product-card__img" src="${image}" alt="${name}" width="290" height="436">
        <div class="product-card__more">
          <button class="product-card__link btn btn--icon add-to-cart-btn" type="button" data-id="${id}">
            <span class="btn__text">В корзину</span>
            <svg width="24" height="24">
              <use xlink:href="images/sprite.svg#icon-basket"></use>
            </svg>
          </button>
          <a href="#" class="product-card__link btn btn--secondary">
            <span class="btn__text">Подробнее</span>
          </a>
        </div>
      </div>
      <div class="product-card__info">
        <h2 class="product-card__title">${name}</h2>
        <span class="product-card__old">
          <span class="product-card__old-number">${oldPrice.toLocaleString(
            "ru-RU",
          )}</span>
          <span class="product-card__old-add">₽</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-number">${newPrice.toLocaleString(
            "ru-RU",
          )}</span>
          <span class="product-card__price-add">₽</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" type="button">
            <svg class="tooltip__icon" width="5" height="10">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Наличие товара по городам:</span>
            <ul class="tooltip__list">
              <li>Москва: <span>${moscow}</span></li>
              <li>Оренбург: <span>${orenburg}</span></li>
              <li>Санкт-Петербург: <span>${saintPetersburg}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function applyFiltersAndSort() {
  const types = [
    ...document.querySelectorAll('input[name="type"]:checked'),
  ].map((el) => el.value);

  const status = document.querySelector('input[name="status"]:checked')?.value;
  const sortValue = document.querySelector(".catalog__sort-select")?.value;

  let filtered = filterProducts(allProducts, types, status);
  currentProducts = sortProducts(filtered, sortValue);
  currentPage = 1;
  renderProductsPage();
  updateTypeCounts(allProducts);
}

function filterProducts(products, types, status) {
  let result = [...products];

  if (types.length) {
    result = result.filter((p) => types.some((t) => p.type.includes(t)));
  }

  if (status === "instock") {
    result = result.filter(
      (p) =>
        p.availability.moscow > 0 ||
        p.availability.orenburg > 0 ||
        p.availability.saintPetersburg > 0,
    );
  }

  return result;
}

function sortProducts(products, sortValue) {
  const sorted = [...products];

  switch (sortValue) {
    case "price-min":
      sorted.sort((a, b) => a.price.new - b.price.new);
      break;
    case "price-max":
      sorted.sort((a, b) => b.price.new - a.price.new);
      break;
    case "rating-max":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }

  return sorted;
}

function updatePagination(totalCount) {
  if (!paginationEl) return;

  paginationEl.innerHTML = "";
  if (totalCount <= PAGE_SIZE) return;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  for (let i = 1; i <= totalPages; i += 1) {
    const li = document.createElement("li");
    li.className = "catalog__pagination-item";

    const btn = document.createElement("button");
    btn.className = "catalog__pagination-link";
    if (i === currentPage) {
      btn.classList.add("catalog__pagination-link--active");
    }
    btn.textContent = String(i);

    btn.addEventListener("click", () => {
      if (currentPage === i) return;
      currentPage = i;
      renderProductsPage();
    });

    li.append(btn);
    paginationEl.append(li);
  }
}

function updateTypeCounts(products) {
  const typeCounts = {};

  products.forEach((p) => {
    if (!p.type) return;
    p.type.forEach((t) => {
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
  });

  const inputs = document.querySelectorAll('.catalog-form input[name="type"]');

  inputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label) return;

    const countEl = label.querySelector(".custom-checkbox__count");
    if (!countEl) return;

    const count = typeCounts[input.value] || 0;
    countEl.textContent = count;
  });
}

function initTooltips() {
  if (!tippy || !catalogListEl) return;

  catalogListEl
    .querySelectorAll(".product-card__tooltip")
    .forEach((tooltipEl) => {
      const btn = tooltipEl.querySelector(".tooltip__btn");
      const contentEl = tooltipEl.querySelector(".tooltip__content");
      if (!btn || !contentEl) return;

      tippy(btn, {
        content: contentEl.innerHTML,
        allowHTML: true,
        maxWidth: 260,
        placement: "top",
        animation: "shift-away",
        theme: "light",
      });
    });
}
