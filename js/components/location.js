export function initLocation() {
  const cityButton = document.querySelector(".location__city");
  const cityNameEl = document.querySelector(".location__city-name");
  const citiesList = document.querySelector(".location__sublist");

  if (!cityButton || !cityNameEl || !citiesList) {
    return;
  }

  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity) {
    cityNameEl.textContent = savedCity;
  }

  cityButton.addEventListener("click", () => {
    cityButton.classList.toggle("location__city--active");
  });

  const cityButtons = citiesList.querySelectorAll(".location__sublink");

  cityButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newCity = btn.textContent.trim();
      cityNameEl.textContent = newCity;
      localStorage.setItem("selectedCity", newCity);
      cityButton.classList.remove("location__city--active");
    });
  });
}
