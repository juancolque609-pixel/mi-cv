/* ===== Configuración: cambia aquí la ruta de tu CV en PDF ===== */
const PDF_URL = "assets/CV.pdf";

document.documentElement.classList.add("js");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Año del pie de página */
$("#year").textContent = new Date().getFullYear();

/* Menú móvil */
const menu = $("#menu"), menuBtn = $("#menuBtn");
const setMenu = open => {
  menu.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Barra superior y botón "volver arriba" */
const nav = $("#nav"), toTop = $("#toTop");
const onScroll = () => {
  nav.classList.toggle("scrolled", scrollY > 20);
  toTop.classList.toggle("show", scrollY > 600);
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0 }));

/* Aparición de elementos (y barras de nivel) */
const revealIO = new IntersectionObserver((entries, io) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: .15 });
$$(".reveal").forEach(el => revealIO.observe(el));

/* Enlace activo según la sección visible */
const links = $$(".menu a");
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => spy.observe(s));

/* Tarjetas interactivas: luz que sigue al cursor */
$$(".card").forEach(card => card.addEventListener("pointermove", e => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--x", e.clientX - r.left + "px");
  card.style.setProperty("--y", e.clientY - r.top + "px");
}));

/* Descarga del PDF: usa assets/CV.pdf si existe; si no, abre el diálogo de impresión (Guardar como PDF) */
$("#pdfBtn").addEventListener("click", async e => {
  e.preventDefault();
  try {
    const res = await fetch(PDF_URL, { method: "HEAD" });
    if (!res.ok) throw new Error("sin PDF");
    const a = Object.assign(document.createElement("a"), { href: PDF_URL, download: "CV.pdf" });
    a.click();
  } catch {
    window.print();
  }
});

/* Formulario: abre tu programa de correo con el mensaje listo */
$("#mailForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const to = $("#mailLink").getAttribute("href").replace("mailto:", "");
  const subject = encodeURIComponent("Contacto desde tu portafolio - " + f.get("nombre"));
  const body = encodeURIComponent(f.get("mensaje") + "\n\n" + f.get("nombre"));
  location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
