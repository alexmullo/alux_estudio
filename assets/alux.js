/* Alux Studio — interacciones de la base original, con navegación y filtros. */
(() => {
  'use strict';
  document.documentElement.classList.add('enhanced');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const projects = [
    { name: 'Gran Banda K-Leña', type: 'Agendas semanales · Diseño · Motion graphics', category: 'artists', mark: 'K' },
    { name: 'Orquesta Adolescencia', type: 'Agendas semanales · Eventos · Animación', category: 'artists', mark: 'A' },
    { name: 'Christopher Caparros', type: 'Contenido para redes · Diseño · Motion graphics', category: 'artists', mark: 'C' },
    { name: 'Próxima marca 01', type: 'Un espacio para una nueva historia', category: 'brands', mark: '01' },
    { name: 'Próxima marca 02', type: 'Un espacio para una nueva historia', category: 'brands', mark: '02' },
    { name: 'Próxima marca 03', type: 'Un espacio para una nueva historia', category: 'brands', mark: '03' }
  ];
  // Aquí se incorporarán los archivos reales de cada cliente. Las composiciones
  // actuales son reservas gráficas identificadas; no son trabajos publicados.
  const tileLabels = ['Agenda & diseño', 'Motion graphics', 'Identidad visual', 'Contenido para redes'];
  const list = document.getElementById('projects');
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const graphic = kind => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const star = kind === 'star';
    svg.setAttribute('class', star ? 'spark' : 'arrow-icon');
    svg.setAttribute('viewBox', star ? '0 0 100 100' : '0 0 24 24');
    path.setAttribute('d', star ? 'M50 8v84M8 50h84M20 20l60 60M20 80l60-60' : 'M5 19 19 5M5 5h14v14');
    svg.append(path);
    return svg;
  };
  projects.forEach((project, index) => {
    const article = element('details', 'project');
    article.dataset.category = project.category;
    article.dataset.reveal = '';
    article.open = index === 0;
    const summary = element('summary');
    const number = element('span', 'project-number', String(index + 1).padStart(2, '0'));
    const heading = element('div', 'project-heading');
    heading.append(element('h3', '', project.name), element('p', '', project.type));
    const status = element('span', 'project-status', project.category === 'brands' ? 'Espacio reservado' : 'Selección en preparación');
    const toggle = element('span', 'project-toggle', '+');
    toggle.setAttribute('aria-hidden', 'true');
    summary.append(number, heading, status, toggle);
    const body = element('div', 'project-body');
    const grid = element('div', 'project-grid');
    grid.setAttribute('aria-label', 'Cuatro espacios de material pendiente para ' + project.name);
    tileLabels.forEach((label, tileIndex) => {
      const tile = element('div', 'work-tile');
      const art = element('div', 'tile-art');
      art.setAttribute('aria-hidden', 'true');
      if (tileIndex === 1 || tileIndex === 2) art.append(graphic(tileIndex === 1 ? 'star' : 'arrow'));
      else art.append(element('span', '', tileIndex === 0 ? project.mark : '◎'));
      const bottom = element('div', 'tile-bottom');
      bottom.append(element('strong', '', label), element('small', '', 'Material próximamente'));
      tile.append(art, element('span', 'tile-top', String(tileIndex + 1).padStart(2, '0') + ' / 04'), bottom);
      grid.append(tile);
    });
    body.append(grid, element('p', 'project-note', 'Espacios de reserva: los videos, piezas y logos de este proyecto se incorporarán aquí.'));
    article.append(summary, body);
    list.append(article);
  });
  const projectNodes = [...list.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    projectNodes.forEach(project => {
      project.hidden = selected !== 'all' && project.dataset.category !== selected;
    });
    const visible = projectNodes.filter(project => !project.hidden);
    if (!visible.some(project => project.open)) visible[0].open = true;
    visible.forEach(project => project.classList.add('is-visible'));
    document.getElementById('filter-status').textContent = visible.length + ' espacios mostrados. ' + (selected === 'brands' ? 'Marcas pendientes de incorporar.' : 'Piezas y videos en preparación.');
    requestScrollUpdate();
  }));

  document.getElementById('year').textContent = new Date().getFullYear();
  const frame = document.getElementById('portrait-frame');
  const switcher = document.getElementById('agency-switch');
  async function loadPortraits() {
    try {
      const response = await fetch('assets/portraits.json');
      if (!response.ok) return;
      const sources = await response.json();
      if (!sources.personal || !sources.agency) return;
      const photos = await Promise.all(['personal', 'agency'].map(async kind => {
        const photo = new Image();
        photo.className = kind;
        photo.alt = kind === 'personal' ? 'Alex Xavier Mullo Yugla' : 'Retrato de Alex tomado por Inhaus Corp';
        photo.src = sources[kind];
        await photo.decode();
        return photo;
      }));
      frame.querySelector('.portrait-placeholder')?.remove();
      frame.prepend(...photos);
      switcher.disabled = false;
      switcher.title = 'Toca para cambiar la foto';
      document.getElementById('portrait-hint').textContent = 'Toca Inhaus Corp para descubrir la otra foto.';
    } catch {
      // Una foto pendiente o ilegible conserva la reserva y el botón desactivado.
    }
  }
  loadPortraits();
  switcher.addEventListener('click', () => {
    if (!frame.querySelector('img.personal') || !frame.querySelector('img.agency')) return;
    const active = frame.classList.toggle('agency-active');
    switcher.setAttribute('aria-pressed', String(active));
    document.getElementById('portrait-caption').textContent = active ? 'Alex · retrato de Inhaus Corp' : 'Alex · retrato personal';
  });

  const nav = document.getElementById('main-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    nav.classList.remove('is-open');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header-inner')) closeMenu();
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  const revealNodes = [...document.querySelectorAll('[data-reveal]')];
  let revealObserver;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 45px 0px', threshold: .04 });
  }
  const syncMotion = () => {
    document.documentElement.classList.toggle('motion-enabled', !motion.matches);
    if (motion.matches || !revealObserver) {
      revealNodes.forEach(node => node.classList.add('is-visible'));
    } else {
      revealNodes.filter(node => !node.classList.contains('is-visible')).forEach(node => revealObserver.observe(node));
    }
    requestScrollUpdate();
  };

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.reading-progress');
  const pieces = [...document.querySelectorAll('[data-parallax]')];
  const sectionLinks = [...nav.querySelectorAll('a')];
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href')));
  let scrollQueued = false;
  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 24);
    progress.style.transform = 'scaleX(' + (height > 0 ? Math.min(1, y / height) : 0) + ')';
    const enabled = !motion.matches && window.innerWidth > 800 && y < 1000;
    const travel = enabled ? Math.min(y * .08, 45) : 0;
    pieces.forEach((piece, index) => piece.style.setProperty('--shift', travel * (index === 0 ? -.55 : .55) + 'px'));
    let active = null;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= window.innerHeight * .4) active = index;
    });
    sectionLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function requestScrollUpdate() {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate, { passive: true });
  projectNodes.forEach(project => project.addEventListener('toggle', requestScrollUpdate));
  motion.addEventListener('change', syncMotion);
  syncMotion();

  document.querySelectorAll('[data-tilt]').forEach(card => {
    const reset = () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--light-x');
      card.style.removeProperty('--light-y');
    };
    card.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--tilt-x', (y - .5) * -7 + 'deg');
      card.style.setProperty('--tilt-y', (x - .5) * 7 + 'deg');
      card.style.setProperty('--light-x', x * 100 + '%');
      card.style.setProperty('--light-y', y * 100 + '%');
    }, { passive: true });
    card.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);
  });
})();
