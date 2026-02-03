function handleAccordionClick(event) {
  const btn = event.currentTarget;
  const elements = document.querySelectorAll(".accordion__element");
  const isActive = btn.classList.contains("accordion__btn--active");

  elements.forEach((el) => {
    const otherBtn = el.querySelector(".accordion__btn");
    if (!otherBtn) return;
    otherBtn.classList.remove("accordion__btn--active");
  });

  if (!isActive) btn.classList.add("accordion__btn--active");
}

export function initAccordion() {
  const elements = document.querySelectorAll(".accordion__element");
  if (!elements.length) return;

  elements.forEach((element) => {
    const btn = element.querySelector(".accordion__btn");
    if (!btn) return;

    btn.removeEventListener("click", handleAccordionClick);
    btn.addEventListener("click", handleAccordionClick);
  });
}
