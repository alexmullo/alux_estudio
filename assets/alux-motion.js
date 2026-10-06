/* Alux Studio — adaptación del lienzo original a Canvas 2D, sin dependencias.
   Aros, trazos y puntos con límite de cuadros y pausa fuera de pantalla. */
(() => {
  'use strict';
  const host = document.getElementById('hero-motion');
  if (!host) return;
  const stage = host.parentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  if (!context) return;
  host.append(canvas);
  let width = 1, height = 1, scale = 1, visible = true, request = null;
  let lastFrame = 0, easedX = 0, easedY = 0;
  const pointer = { x: 0, y: 0 };
  const resize = () => {
    const bounds = host.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    if (reducedMotion.matches) draw(0);
  };
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    const bounds = stage.getBoundingClientRect();
    pointer.x = (event.clientX - bounds.left) / bounds.width - .5;
    pointer.y = (event.clientY - bounds.top) / bounds.height - .5;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; });
  const ellipse = (x, y, rx, ry) => {
    context.beginPath();
    context.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
    context.stroke();
  };
  function draw(time) {
    const t = time * .001;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);
    easedX += (pointer.x - easedX) * .055;
    easedY += (pointer.y - easedY) * .055;
    context.save();
    context.translate(width * .51 + easedX * 21, height * .48 + easedY * 17);
    context.rotate(-.38 + Math.sin(t * .25) * .035);
    for (let i = 0; i < 4; i++) {
      const pulse = Math.sin(t * .55 + i * .9) * 6;
      context.strokeStyle = i % 2 ? 'rgba(246,146,30,.25)' : 'rgba(0,59,74,.15)';
      context.lineWidth = i === 2 ? 1.4 : .8;
      ellipse(0, 0, (width * (.76 + i * .2) + pulse) / 2, (height * (.4 + i * .1) + pulse) / 2);
    }
    context.restore();
    context.strokeStyle = 'rgba(246,146,30,.5)';
    context.lineWidth = 1.6;
    context.beginPath();
    context.moveTo(-20, height * (.74 + Math.sin(t * .6) * .015));
    context.bezierCurveTo(width * .2, height * .45, width * .76, height * .87, width + 20, height * .51);
    context.stroke();
    for (let i = 0; i < 8; i++) {
      const angle = t * .18 + i * Math.PI * 2 / 8;
      context.fillStyle = i % 3 === 0 ? 'rgba(246,146,30,.7)' : 'rgba(0,59,74,.38)';
      context.beginPath();
      context.arc(width * .51 + Math.cos(angle) * width * .45, height * .48 + Math.sin(angle) * height * .32, i % 3 === 0 ? 2.5 : 1.5, 0, Math.PI * 2);
      context.fill();
    }
  }
  function tick(time) {
    request = null;
    if (!visible || document.hidden || reducedMotion.matches) return;
    if (time - lastFrame >= 1000 / (window.innerWidth <= 800 ? 18 : 30)) {
      draw(time);
      lastFrame = time;
    }
    request = window.requestAnimationFrame(tick);
  }
  const syncPlayback = () => {
    if (request !== null) { window.cancelAnimationFrame(request); request = null; }
    if (reducedMotion.matches) { easedX = 0; easedY = 0; draw(0); }
    else if (visible && !document.hidden) request = window.requestAnimationFrame(tick);
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(host);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { rootMargin: '100px' }).observe(stage);
  }
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  window.addEventListener('pagehide', () => { if (request !== null) window.cancelAnimationFrame(request); });
  window.addEventListener('pageshow', syncPlayback);
  resize();
  syncPlayback();
})();
