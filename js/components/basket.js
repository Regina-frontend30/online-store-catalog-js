let cart = [];
let productsRef = [];

let basketEl;
let basketToggleBtn;
let countEl;
let basketListEl;
let emptyEl;

export function initBasket(products) {
  productsRef = Array.isArray(products) ? products : [];

  basketEl = document.querySelector(".header__basket");
  basketToggleBtn = document.querySelector(
    ".header__user-item .header__user-btn"
  );
  countEl = document.querySelector(".header__user-count");
  basketListEl = basketEl?.querySelector(".basket__list");
  emptyEl = basketEl?.querySelector(".basket__empty-block");

  if (!basketEl || !basketToggleBtn || !countEl || !basketListEl || !emptyEl)
    return;

  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch {
      cart = [];
    }
  }

  updateCartUI();

  basketToggleBtn.addEventListener("click", () => {
    basketEl.classList.toggle("basket--active");
  });
}

export function addToBasket(id) {
  const idStr = String(id);
  const product = productsRef.find((p) => String(p.id) === idStr);
  if (!product) return;

  cart.push(product);
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  const idStr = String(id);
  const index = cart.findIndex((item) => String(item.id) === idStr);
  if (index === -1) return;

  cart.splice(index, 1);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
  if (!countEl || !basketListEl || !emptyEl) return;

  countEl.textContent = String(cart.length);
  basketListEl.innerHTML = "";

  const checkoutBtn = basketEl.querySelector(".basket__link");

  if (!cart.length) {
    emptyEl.style.display = "block";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  if (checkoutBtn) checkoutBtn.style.display = "flex";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "basket__item";
    li.innerHTML = `
      <div class="basket__img">
        <img src="${item.image}" alt="${item.name}" width="60" height="60">
      </div>
      <span class="basket__name">${item.name}</span>
      <span class="basket__price">${item.price.new} ₽</span>
      <button class="basket__item-close" data-id="${item.id}" type="button">
        <svg width="24" height="24">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    `;
    const removeBtn = li.querySelector(".basket__item-close");
    removeBtn.addEventListener("click", () => {
      removeFromCart(item.id);
    });
    basketListEl.append(li);
  });
}