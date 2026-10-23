document.documentElement.classList.add("js");

const toggle = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".site-nav");

if (toggle && navigation) {
  const closeMenu = ({ restoreFocus = false } = {}) => {
    toggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const willOpen = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(willOpen));
    navigation.classList.toggle("is-open", willOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu({ restoreFocus: true });
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const current = carousel.querySelector("[data-carousel-current]");
  const controls = carousel.querySelector(".hardware-controls");

  if (slides.length < 2 || !previous || !next || !current || !controls) return;

  let activeIndex = 0;
  controls.hidden = false;

  const showSlide = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      slide.hidden = index !== activeIndex;
    });
    current.textContent = String(activeIndex + 1);
  };

  previous.addEventListener("click", () => showSlide(activeIndex - 1));
  next.addEventListener("click", () => showSlide(activeIndex + 1));
});

// The comparison is user-controlled; reduced motion retains its static poster.
