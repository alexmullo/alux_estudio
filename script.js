document.addEventListener("DOMContentLoaded", () => {
  // SCROLL SUAVE DEL MENÚ
  const navLinks = document.querySelectorAll("header .main-nav a[href^='#']");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      const nav = document.querySelector(".main-nav");
      const burger = document.querySelector(".burger");
      if (nav && burger) { nav.classList.remove("nav-open"); burger.classList.remove("burger-open"); }
    });
  });

  // MENÚ ACTIVO POR SECCIÓN
  const sections = document.querySelectorAll("section[id]");
  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const currentLink = document.querySelector(`.main-nav a[href="#${id}"]`);
        if (entry.isIntersecting && currentLink) {
          document.querySelectorAll(".main-nav a").forEach((a) => a.classList.remove("active"));
          currentLink.classList.add("active");
        }
      });
    }, { threshold: 0.4 });
    sections.forEach((s) => observer.observe(s));
  }

  // REVEAL ON SCROLL
  const revealElements = document.querySelectorAll(".hero-text, .hero-side, .card, .portfolio-item, .service-card, .testimonial-card, .process-card, .brand-badge, .contact-main-box, .contact-card");
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("reveal-visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    revealElements.forEach((el) => { el.classList.add("reveal-hidden"); revealObserver.observe(el); });
  }

  // MENÚ BURGER
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  if (burger && nav) burger.addEventListener("click", () => { nav.classList.toggle("nav-open"); burger.classList.toggle("burger-open"); });

  // PARALLAX HERO CANVAS
  const hero = document.querySelector(".hero");
  const heroCanvasWrapper = document.getElementById("hero-canvas");
  if (hero && heroCanvasWrapper) {
    const onScrollParallax = () => {
      const rect = hero.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight;
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translate = (progress - 0.5) * 60;
        heroCanvasWrapper.style.transform = `translateY(${translate}px)`;
      }
    };
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    onScrollParallax();
  }

  // BLOB DE CURSOR (solo desktop)
  const blob = document.querySelector(".cursor-blob");
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (blob && !isTouchDevice) {
    let bx = innerWidth / 2, by = innerHeight / 2, tx = bx, ty = by;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop(){
      const ease = 0.16;
      bx += (tx - bx) * ease; by += (ty - by) * ease;
      blob.style.left = `${bx}px`; blob.style.top = `${by}px`;
      requestAnimationFrame(loop);
    })();
  } else if (blob && isTouchDevice) { blob.style.display = "none"; }

  // FLIP DE SERVICIOS
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      serviceCards.forEach((c) => { if (c !== card) c.classList.remove("is-flipped"); });
      card.classList.toggle("is-flipped");
    });
  });

  // TILT / GIRO CON SCROLL
  const tiltElements = document.querySelectorAll(".scroll-tilt");
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (tiltElements.length && !prefersReducedMotion) {
    const maxRotate = 8;
    const updateTilt = () => {
      const vh = innerHeight || document.documentElement.clientHeight;
      tiltElements.forEach((el) => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const norm = (center - vh / 2) / (vh / 2); // -1 a 1
        const rotateX = norm * maxRotate;
        const translateY = norm * 8;
        if (innerWidth < 768) { el.style.transform = ""; return; }
        el.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`;
      });
      requestAnimationFrame(updateTilt);
    };
    requestAnimationFrame(updateTilt);
  }
});
