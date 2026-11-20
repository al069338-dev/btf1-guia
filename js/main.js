/* Erbet Gomez Bohorquez */
/**
 * @param {string} tagName
 * @param {string} [className]
 * @param {string} [textContent]
 * @returns {HTMLElement}
 */
function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
}

const FALLBACK_IMAGE_EXTENSIONS = ["png", "PNG", "jpg", "jpeg", "webp"];

/**
 * @param {string} source
 * @returns {string[]}
 */
function buildImageCandidates(source) {
  const lastSlashIndex = source.lastIndexOf("/");
  const folderPath = source.slice(0, lastSlashIndex + 1);
  const fileName = source.slice(lastSlashIndex + 1);
  const lastDotIndex = fileName.lastIndexOf(".");
  const baseName = lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
  const originalExtension = lastDotIndex > 0 ? fileName.slice(lastDotIndex + 1) : "png";

  const nameVariants = [
    baseName,
    baseName.normalize("NFD"),
    baseName.toLowerCase(),
    baseName.toLowerCase().normalize("NFD")
  ];
  const extensions = [originalExtension, ...FALLBACK_IMAGE_EXTENSIONS];

  const candidates = [];
  nameVariants.forEach((name) => {
    extensions.forEach((extension) => {
      candidates.push(folderPath + encodeURIComponent(name) + "." + extension);
    });
    candidates.push(folderPath + encodeURIComponent(name) + ".png.png"); // extensión doble oculta en Windows
  });
  return [...new Set(candidates)];
}

/**
 * @param {HTMLImageElement} image 
 * @param {string} source
 * @param {Function} onFailure
 */
function loadImageWithFallback(image, source, onFailure) {
  const candidates = buildImageCandidates(source);
  let attemptIndex = 0;

  image.addEventListener("error", () => {
    attemptIndex += 1;
    if (attemptIndex < candidates.length) {
      image.src = candidates[attemptIndex];
      return;
    }
    console.warn("No se pudo cargar la imagen. Revisa que exista y que el nombre coincida: " + source);
    onFailure();
  });
  image.src = candidates[0];
}

/**
 * @param {HTMLElement} container
 * @param {string} source
 * @param {string} altText
 * @param {string} imageClassName
 */
function addImage(container, source, altText, imageClassName) {
  const image = createElement("img", imageClassName);
  image.alt = altText;
  container.classList.add("has-image");
  container.append(image);
  loadImageWithFallback(image, source, () => {
    // image.remove();
    // container.classList.remove("has-image");
  });
}

function setupCoverImages() {
  document.querySelectorAll(".cover img").forEach((image) => {
    const source = image.getAttribute("src");
    image.removeAttribute("loading");
    loadImageWithFallback(image, source, () => {
      const wrapper = image.closest("li, figure");
      // if (wrapper) wrapper.hidden = true;
    });
  });
}

function renderBasicTips() {
  const tipsContainer = document.getElementById("basicTips");
  BASIC_TIPS.forEach((tip) => {
    const item = createElement("li", "tips-list__item");
    item.append(createElement("h3", "", tip.title), createElement("p", "", tip.text));
    tipsContainer.append(item);
  });
}

function renderGameModes() {
  const modesContainer = document.getElementById("modesList");
  GAME_MODES.forEach((mode, index) => {
    const details = createElement("details", "mode");
    if (index === 0) details.open = true;
    details.append(createElement("summary", "mode__name", mode.name), createElement("p", "mode__text", mode.text));
    modesContainer.append(details);
  });
}

function renderPlayerClasses() {
  const classGrid = document.getElementById("classGrid");
  PLAYER_CLASSES.forEach((playerClass) => {
    const card = createElement("article", "class-card");
    addImage(card, IMAGE_FOLDERS.classes + playerClass.image, "Icono de la clase " + playerClass.name, "class-card__icon");
    card.append(
      createElement("h3", "", playerClass.name),
      createElement("p", "class-card__role", playerClass.role),
      createElement("p", "", playerClass.text)
    );
    classGrid.append(card);
  });
}

/**
 * @param {string} className
 */
function showWeapons(className) {
  const panel = document.getElementById("weaponPanel");
  panel.replaceChildren();
  WEAPONS_BY_CLASS[className].forEach((weapon) => {
    const row = createElement("div", "weapon");
    const description = createElement("div", "weapon__info");
    description.append(createElement("h3", "weapon__name", weapon.name), createElement("p", "weapon__note", weapon.note));
    addImage(row, IMAGE_FOLDERS.weapons + weapon.image, "Imagen del arma " + weapon.name, "weapon__image");
    row.append(description);
    panel.append(row);
  });
}

function renderWeaponTabs() {
  const tabList = document.getElementById("weaponTabs");
  const classNames = Object.keys(WEAPONS_BY_CLASS);

  classNames.forEach((className, index) => {
    const tab = createElement("button", "tabs__button", className);
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
    tab.addEventListener("click", () => {
      tabList.querySelectorAll(".tabs__button").forEach((other) => other.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      showWeapons(className);
    });
    tabList.append(tab);
  });
  showWeapons(classNames[0]);
}

function renderVehicles() {
  const vehicleList = document.getElementById("vehicleList");
  VEHICLES.forEach((vehicle) => {
    const card = createElement("article", "vehicle vehicle--" + vehicle.type.toLowerCase());
    const body = createElement("div", "vehicle__body");
    body.append(
      createElement("p", "vehicle__type", vehicle.type),
      createElement("h3", "", vehicle.name),
      createElement("p", "", vehicle.text)
    );
    addImage(card, IMAGE_FOLDERS.vehicles + vehicle.image, "Imagen de " + vehicle.name, "vehicle__image");
    card.append(body);
    vehicleList.append(card);
  });
}

function renderSecrets() {
  const secretList = document.getElementById("secretList");
  EASTER_EGGS.forEach((secret) => {
    const item = createElement("li", "secret");
    const body = createElement("div", "secret__body");
    body.append(createElement("h3", "", secret.title), createElement("p", "", secret.text));
    if (secret.image) {
      addImage(item, IMAGE_FOLDERS.secrets + secret.image, "Ilustración de: " + secret.title, "secret__image");
    }
    item.append(body);
    secretList.append(item);
  });
}

function setupMobileMenu() {
  const toggleButton = document.getElementById("menuToggle");
  const navigation = document.getElementById("mainNav");

  toggleButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("main-nav--open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navigation.classList.remove("main-nav--open");
      toggleButton.setAttribute("aria-expanded", "false");
    }
  });
}

function setupActiveSectionHighlight() {
  const links = document.querySelectorAll(".main-nav a");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

function setupGallery() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox__image");
  const lightboxCaption = document.getElementById("lightbox__caption");
  
  let currentImages = [];
  let currentIndex = 0;

  function updateLightbox() {
    if (currentImages.length === 0) return;
    const activeImg = currentImages[currentIndex];
    lightboxImg.src = activeImg.src;
    lightboxImg.alt = activeImg.alt;
    lightboxCaption.textContent = activeImg.alt;
  }

  document.querySelector("main").addEventListener("click", (event) => {
    if (event.target.tagName === "IMG") {
      currentImages = Array.from(document.querySelectorAll("main img"));
      currentIndex = currentImages.indexOf(event.target);
      updateLightbox();
      lightbox.hidden = false;
    }
  });

  document.querySelector(".lightbox__next").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
  });

  document.querySelector(".lightbox__prev").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  });

  const closeLightbox = () => { lightbox.hidden = true; };
  
  document.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.hidden) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") document.querySelector(".lightbox__next").click();
      if (event.key === "ArrowLeft") document.querySelector(".lightbox__prev").click();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCoverImages();
  renderBasicTips();
  renderGameModes();
  renderPlayerClasses();
  renderWeaponTabs();
  renderVehicles();
  renderSecrets();
  setupMobileMenu();
  setupActiveSectionHighlight();
  setupGallery();
});
