document.documentElement.classList.add("js");

const menu = document.querySelector(".menu-toggle");
const directory = document.querySelector("#directory");
const closeDirectory = (restoreFocus = false) => {
  menu?.setAttribute("aria-expanded", "false");
  directory?.classList.remove("is-open");
  if (restoreFocus) menu?.focus();
};
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  menu.setAttribute("aria-expanded", String(open));
  directory?.classList.toggle("is-open", open);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu?.getAttribute("aria-expanded") === "true") closeDirectory(true);
});
directory?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeDirectory();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeDirectory();
});

const form = document.querySelector("[data-command-form]");
const input = form?.querySelector("input[name=command]");
const message = document.querySelector("#command-message");
const help = document.querySelector("#command-help");
const commands = {
  whoami: "overview",
  education: "education",
  projects: "projects",
  experience: "experience",
  tascien: "tascien",
  contact: "contact",
};
if (form && input && message && help) {
  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = input.value.trim().toLowerCase();
    input.removeAttribute("aria-invalid");
    if (command === "help") {
      help.hidden = false;
      message.textContent = "Available commands: whoami, education, projects, experience, tascien, contact.";
      return;
    }
    // The command field resolves only this fixed navigation map.
    if (!Object.hasOwn(commands, command)) {
      input.setAttribute("aria-invalid", "true");
      message.textContent = "Unknown command. Type help to see the available sections.";
      return;
    }
    const target = document.getElementById(commands[command]);
    if (!target) return;
    message.textContent = "Opening " + command + ".";
    input.value = "";
    history.replaceState(null, "", "#" + commands[command]);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start" });
  });
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    message.textContent = "";
  });
}

const directoryLinks = [...document.querySelectorAll("#directory nav a")];
const sections = directoryLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;
    directoryLinks.forEach((link) => {
      if (link.hash === "#" + current.target.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-5% 0px -65% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
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
  const show = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => { slide.hidden = position !== activeIndex; });
    current.textContent = String(activeIndex + 1);
  };
  previous.addEventListener("click", () => show(activeIndex - 1));
  next.addEventListener("click", () => show(activeIndex + 1));
});
