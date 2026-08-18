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
