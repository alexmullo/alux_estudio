let particles = [];

function setup() {
  const heroCanvas = document.getElementById("hero-canvas");
  const w = heroCanvas ? heroCanvas.clientWidth || window.innerWidth : window.innerWidth;
  const h = heroCanvas ? Math.max(heroCanvas.clientHeight, 520) : 520;

  const cnv = createCanvas(w, h);
  cnv.parent("hero-canvas");

  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  const count = w < 768 ? 70 : 130;
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(true));
  }
}

function draw() {
  clear();
  background(210, 15, 98, 0.96);

  particles.forEach((p) => {
    p.update();
    p.display();
  });
}

class Particle {
  constructor(initial = false) {
    this.reset(initial);
  }

  reset(initial = false) {
    this.x = random(width);
    this.y = random(height);
    this.size = random(4, 14);
    this.speed = random(0.2, 1.1);
    this.offset = random(1000);
    this.layer = random([0.4, 0.7, 1]);

    if (!initial) {
      this.y = height + this.size * 2;
    }
  }

  update() {
    const t = frameCount * 0.005;
    const nX = noise(this.x * 0.001, this.y * 0.001, this.offset + t);
    const nY = noise(this.x * 0.001, this.y * 0.001, this.offset - t);

    const angle = map(nX, 0, 1, -PI / 4, PI / 4);
    const float = map(nY, 0, 1, -0.4, 0.4);

    this.x += cos(angle) * this.speed * this.layer;
    this.y -= this.speed + float;

    if (this.y < -this.size * 2 || this.x < -50 || this.x > width + 50) {
      this.reset(false);
    }
  }

  display() {
    const hueBase = 205;
    const hue = hueBase + map(this.layer, 0.4, 1, -6, 8);
    const alpha = map(this.layer, 0.4, 1, 0.15, 0.45);

    push();
    fill(hue, 35, 100, alpha * 0.35);
    ellipse(this.x, this.y, this.size * 2.4, this.size * 2.4);
    pop();

    fill(hue, 45, 100, alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

function windowResized() {
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas) {
    const w = heroCanvas.clientWidth || window.innerWidth;
    const h = heroCanvas.clientHeight || 520;
    resizeCanvas(w, h);
  }
}
