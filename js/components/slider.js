import { addToBasket } from "./basket.js";

export function initSlider(products) {
  const sliderEl = document.querySelector(".day-products__slider");
  const listEl = sliderEl?.querySelector(".day-products__list");
  const dayProducts = getDayProducts(products);

  if (!sliderEl || !listEl || !dayProducts.length) return;

  const templateItem = listEl.querySelector(".day-products__item");
  if (!templateItem) return;

  renderSliderItems(listEl, templateItem, dayProducts);
  initSliderTooltips(listEl);
  initSwiper();
}

function getDayProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.filter((p) => p.goodsOfDay);
}

function renderSliderItems(listEl, templateItem, products) {
  const cardTemplate = templateItem.cloneNode(true);
  listEl.innerHTML = "";

  products.forEach((product) => {
    const slide = createSlide(cardTemplate, product);
    listEl.append(slide);
  });
}

function createSlide(template, product) {
  const li = template.cloneNode(true);
  li.classList.add("swiper-slide");

  fillSlideContent(li, product);
  bindAddToBasket(li, product);

  return li;
}

function fillSlideContent(li, product) {
  const imgEl = li.querySelector(".product-card__img");
  const titleEl = li.querySelector(".product-card__title");
  const oldPriceEl = li.querySelector(".product-card__old-number");
  const newPriceEl = li.querySelector(".product-card__price-number");

  if (titleEl)
    titleEl.textContent = product.name || product.title || "Без названия";

  if (imgEl) {
    imgEl.src = product.image || product.img || "images/item-1.png";
    imgEl.alt = product.name || product.title || "Товар";
  }

  const price = product.price || {};
  const oldPrice = price.old ?? product.oldPrice ?? "";
  const newPrice = price.new ?? product.newPrice ?? "";

  if (oldPriceEl) oldPriceEl.textContent = formatPrice(oldPrice);
  if (newPriceEl) newPriceEl.textContent = formatPrice(newPrice);
}

function bindAddToBasket(li, product) {
  const addBtn = li.querySelector(".product-card__link.btn--icon");
  if (!addBtn) return;

  addBtn.dataset.id = String(product.id);
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addToBasket(product.id);
  });
}

function initSwiper() {
  new Swiper(".day-products__slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      nextEl: ".day-products__navigation-btn--next",
      prevEl: ".day-products__navigation-btn--prev",
    },
    watchOverflow: true,
  });
}

function initSliderTooltips(listEl) {
  if (!tippy || !listEl) return;

  const tooltipBlocks = listEl.querySelectorAll(".product-card__tooltip");
  tooltipBlocks.forEach((tooltipEl) => {
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

function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return value ?? "";
  return num.toLocaleString("ru-RU");
}