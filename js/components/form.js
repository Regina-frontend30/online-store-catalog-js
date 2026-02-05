export function initForm() {
  const formEl = document.querySelector(".questions__form");
  if (!formEl || !JustValidate) return;

  const validation = createValidation();
  attachSuccessHandler(formEl, validation);
}

function createValidation() {
  const validation = new JustValidate(".questions__form", {
    errorLabelStyle: {
      color: "#d52b1e",
      fontSize: "12px",
    },
  });

  validation
    .addField("#name", getNameRules())
    .addField("#email", getEmailRules())
    .addField("#agree", getAgreeRules());

  return validation;
}

function getNameRules() {
  return [
    { rule: "required", errorMessage: "Введите имя" },
    { rule: "minLength", value: 3, errorMessage: "Минимум 3 символа" },
    { rule: "maxLength", value: 20, errorMessage: "Максимум 20 символов" },
  ];
}

function getEmailRules() {
  return [
    { rule: "required", errorMessage: "Введите почту" },
    { rule: "email", errorMessage: "Введите корректный email" },
  ];
}

function getAgreeRules() {
  return [{ rule: "required", errorMessage: "Согласие обязательно" }];
}

function attachSuccessHandler(formEl, validation) {
  validation.onSuccess((event) => handleSubmit(event, formEl, validation));
}

async function handleSubmit(event, formEl, validation) {
  event.preventDefault();

  const payload = getFormPayload();
  try {
    const response = await fetch("https://httpbin.org/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Request failed");

    showModal("success");
    formEl.reset();
    validation.refresh();
  } catch {
    showModal("error");
  }
}

function getFormPayload() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const agreeInput = document.getElementById("agree");

  return {
    name: nameInput ? nameInput.value.trim() : "",
    email: emailInput ? emailInput.value.trim() : "",
    agree: agreeInput ? agreeInput.checked : false,
  };
}

function showModal(type) {
  const { overlay, titleEl, textEl } = createModalStructure(type);
  setModalContent(type, titleEl, textEl);
  attachModalClose(overlay);
}

function createModalStructure(type) {
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.classList.add(type === "success" ? "modal--success" : "modal--error");

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "modal__close";
  closeBtn.innerHTML = "&times;";

  const icon = document.createElement("div");
  icon.className = "modal__icon";
  icon.classList.add(
    type === "success" ? "modal__icon--success" : "modal__icon--error"
  );

  const titleEl = document.createElement("h2");
  titleEl.className = "modal__title";
  const textEl = document.createElement("p");
  textEl.className = "modal__text";

  modal.append(closeBtn, icon, titleEl, textEl);
  overlay.append(modal);
  document.body.append(overlay);

  return { overlay, titleEl, textEl };
}

function setModalContent(type, titleEl, textEl) {
  if (type === "success") {
    titleEl.textContent = "Благодарим за обращение!";
    textEl.textContent =
      "Мы получили вашу заявку и свяжемся с вами в ближайшее время.";
  } else {
    titleEl.textContent = "Не удалось отправить обращение";
    textEl.textContent =
      "Что-то пошло не так, попробуйте отправить форму ещё раз. Если ошибка повторится — свяжитесь со службой поддержки.";
  }
}

function attachModalClose(overlay) {
  const closeBtn = overlay.querySelector(".modal__close");

  const close = () => overlay.remove();

  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") close();
    },
    { once: true }
  );
}