document.addEventListener("DOMContentLoaded", () => {
  
  // Scroll suave del menú
  const navLinks = document.querySelectorAll('header .main-nav a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      // Cerrar menú móvil si está abierto
      const nav = document.querySelector(".main-nav");
      const burger = document.querySelector(".burger");
      if (nav && burger) {
        nav.classList.remove("nav-open");
        burger.classList.remove("burger-open");
      }
    });
  });

  // Resaltar link según sección visible
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const currentLink = document.querySelector(`.main-nav a[href="#${id}"]`);

      if (entry.isIntersecting && currentLink) {
        document
          .querySelectorAll(".main-nav a")
          .forEach(a => a.classList.remove("active"));
        currentLink.classList.add("active");
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));

  // Animaciones "reveal"
const revealElements = document.querySelectorAll(
  ".card, .hero-text, .hero-media, .steps li, .contact-grid > *, .portfolio-item"
);


  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => {
    el.classList.add("reveal-hidden");
    revealObserver.observe(el);
  });

  // Menú móvil
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("nav-open");
      burger.classList.toggle("burger-open");
    });
  }
   // ===== PARALLAX SUAVE DEL FONDO DEL HÉROE =====
  const hero = document.querySelector(".hero");
  const heroCanvasWrapper = document.getElementById("hero-canvas");

  if (hero && heroCanvasWrapper) {
    const onScrollParallax = () => {
      const rect = hero.getBoundingClientRect();
      const windowH = window.innerHeight || document.documentElement.clientHeight;

      // Solo cuando el héroe es visible
      if (rect.bottom > 0 && rect.top < windowH) {
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const translate = (progress - 0.5) * 40; // -20px a 20px aprox.
        heroCanvasWrapper.style.transform = `translateY(${translate}px)`;
      }
    };

    window.addEventListener("scroll", onScrollParallax, { passive: true });
    onScrollParallax();
  }

});
