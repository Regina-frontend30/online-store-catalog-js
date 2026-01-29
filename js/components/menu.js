export function initMenu() {
  const openBtn = document.querySelector(".header__catalog-btn");
  const menu = document.querySelector(".header__catalog");
  const closeBtn = document.querySelector(".main-menu__close");

  if (!openBtn || !menu || !closeBtn) return;

  function openMenu() {
    menu.classList.add("main-menu--active");
  }

  function closeMenu() {
    menu.classList.remove("main-menu--active");
  }

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("click", (event) => {
    if (
      menu.classList.contains("main-menu--active") &&
      !menu.contains(event.target) &&
      !openBtn.contains(event.target)
    ) {
      closeMenu();
    }
  });
}
