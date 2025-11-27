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

  // ===== BOLITA GLASS QUE SIGUE AL MOUSE =====
  const blob = document.querySelector(".cursor-blob");
  if (blob) {
    let blobX = window.innerWidth / 2;
    let blobY = window.innerHeight / 2;
    let targetX = blobX;
    let targetY = blobY;

    // Capturamos destino con el mouse
    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateBlob() {
      // Interpolación suave (easing)
      const ease = 0.15; // más alto = sigue más rápido
      blobX += (targetX - blobX) * ease;
      blobY += (targetY - blobY) * ease;

      blob.style.left = `${blobX}px`;
      blob.style.top = `${blobY}px`;

      requestAnimationFrame(animateBlob);
    }

    animateBlob();
  }
});
