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

// Roots are painted once in path order; scroll never moves or obscures the document.
const banyan = document.querySelector("[data-banyan]");
if (banyan) {
  const canvas = banyan.querySelector("canvas");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let context, roots = [], painted = 0, progress = 0, frame = 0, loading;
  const staticTree = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.hidden = true;
    banyan.removeAttribute("data-growing");
  };
  const readingProgress = () => {
    if (getComputedStyle(banyan).position === "fixed") {
      const distance = document.documentElement.scrollHeight - innerHeight;
      return distance > 0 ? scrollY / distance : 1;
    }
    const box = banyan.getBoundingClientRect();
    return (innerHeight - box.top) / box.height;
  };
  const glyphs = "banyan/roots/branches/leaves/";
  let colors, family;
  const paint = (point, index) => {
    context.fillStyle = colors[point[2]];
    context.font = `400 ${point[2] < 3 ? 6.8 : 10}px ${family}`;
    context.fillText(glyphs[index % glyphs.length], point[0], point[1], 5.3);
  };
  const update = () => {
    frame = 0;
    if (!context || motion.matches || navigator.connection?.saveData || document.hidden) return;
    progress = Math.max(progress, Math.min(1, Math.max(0, readingProgress())));
    while (painted < roots.length && roots[painted].point[3] <= progress) {
      const root = roots[painted++];
      paint(root.point, root.index);
    }
    canvas.hidden = false;
    banyan.setAttribute("data-growing", "");
  };
  const schedule = () => { if (!frame && context && !motion.matches) frame = requestAnimationFrame(update); };
  const enhance = async () => {
    if (motion.matches || navigator.connection?.saveData) { staticTree(); return; }
    if (context) { schedule(); return; }
    if (loading) return;
    loading = true;
    try {
      const response = await fetch("assets/banyan-glyph.json");
      if (!response.ok) throw new Error("Tree asset unavailable");
      const data = await response.json();
      if (data.width !== 480 || data.height !== 1421 || !Array.isArray(data.points) || !data.points.every(point => point.length === 4 && point.every(Number.isFinite) && point[0] >= 0 && point[0] < data.width && point[1] >= 0 && point[1] < data.height && Number.isInteger(point[2]) && point[2] >= 0 && point[2] <= 7 && point[3] >= -1 && point[3] <= 1)) throw new Error("Invalid tree asset");
      await document.fonts.load('10px "Martian Mono"');
      if (!document.fonts.check('10px "Martian Mono"')) throw new Error("Tree font unavailable");
      const drawing = canvas.getContext("2d");
      if (!drawing) return;
      context = drawing;
      colors = Array.from({ length: 8 }, (_, index) => getComputedStyle(document.documentElement).getPropertyValue("--glyph-" + index).trim());
      family = getComputedStyle(document.body).fontFamily;
      context.textAlign = "center";
      context.textBaseline = "middle";
      data.points.forEach((point, index) => {
        if (point[3] < 0) paint(point, index);
        else roots.push({ point, index });
      });
      roots.sort((a, b) => a.point[3] - b.point[3]);
      update();
    } catch { context = null; staticTree(); }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  canvas.addEventListener("contextlost", () => { context = null; staticTree(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) staticTree(); else schedule(); });
  motion.addEventListener("change", () => { if (motion.matches) staticTree(); else enhance(); });
  enhance();
}
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
