/* =============================================
   sketch.js — p5.js modo global + JS DOM
   Estilo familiar: setup() y draw() directos
   ============================================= */


// ================================================
// VARIABLES GLOBALES
// Declaradas aquí para que setup() y draw()
// puedan usarlas
// ================================================

let particulas = [];   // lista de partículas del fondo

let colores = [
  [240, 192,  64],   // amarillo
  [128, 224, 192],   // verde agua
  [192, 128, 240],   // violeta
  [240, 100, 100],   // coral
];
let colorActual = 0;  // índice del color activo

let canvasDemo;       // segundo canvas para la sección de dibujo
let modoDemo = false; // true cuando el mouse está sobre el canvas demo


// ================================================
// SETUP — se ejecuta UNA sola vez al inicio
// ================================================
function setup() {

  // Crear canvas del tamaño del header (fondo animado)
  let contenedor = document.getElementById('canvas-container');
  let lienzo = createCanvas(contenedor.offsetWidth, contenedor.offsetHeight);
  lienzo.parent('canvas-container');

  // Crear 80 partículas en posiciones aleatorias
  for (let i = 0; i < 80; i++) {
    particulas.push(crearParticula());
  }

  // Segundo canvas para la sección interactiva de dibujo
  canvasDemo = createGraphics(800, 350);
  document.getElementById('canvas-demo-container').appendChild(canvasDemo.elt);
  canvasDemo.background(15, 15, 19);
  mostrarInstrucciones();
}


// ================================================
// DRAW — se repite ~60 veces por segundo
// ================================================
function draw() {

  // Fondo con transparencia = efecto de estela
  background(15, 15, 19, 25);

  // Animar cada partícula
  for (let pt of particulas) {

    // Calcular distancia al mouse
    let dx = mouseX - pt.x;
    let dy = mouseY - pt.y;
    let distancia = sqrt(dx * dx + dy * dy);

    // Si el mouse está cerca, la partícula huye
    if (distancia < 200) {
      pt.vx -= dx * 0.002;
      pt.vy -= dy * 0.002;
    }

    // Mover
    pt.x += pt.vx;
    pt.y += pt.vy;

    // Fricción: va perdiendo velocidad poco a poco
    pt.vx *= 0.98;
    pt.vy *= 0.98;

    // Velocidad mínima para que nunca se detenga
    if (abs(pt.vx) < 0.2) pt.vx += random(-0.3, 0.3);
    if (abs(pt.vy) < 0.2) pt.vy += random(-0.3, 0.3);

    // Rebotar en los bordes
    if (pt.x < 0 || pt.x > width)  pt.vx *= -1;
    if (pt.y < 0 || pt.y > height) pt.vy *= -1;

    // Dibujar la partícula con el color activo
    let [r, g, b] = colores[colorActual];
    noStroke();
    fill(r, g, b, pt.alpha);
    ellipse(pt.x, pt.y, pt.tamano);
  }

  // Dibujar en el canvas demo si el mouse está presionado encima
  if (mouseIsPressed && modoDemo) {
    let [r, g, b] = colores[colorActual];
    canvasDemo.stroke(r, g, b, 200);
    canvasDemo.strokeWeight(4);
    canvasDemo.line(mouseX, mouseY, pmouseX, pmouseY);
  }
}


// ================================================
// EVENTOS — p5.js los llama automáticamente
// ================================================

function mouseMoved() {
  // Detectar si el mouse está sobre el canvas demo
  let rect = canvasDemo.elt.getBoundingClientRect();
  modoDemo = (
    mouseX >= rect.left && mouseX <= rect.right &&
    mouseY >= rect.top  && mouseY <= rect.bottom
  );
}

function windowResized() {
  // Ajustar el canvas principal si cambia el tamaño de ventana
  let contenedor = document.getElementById('canvas-container');
  resizeCanvas(contenedor.offsetWidth, contenedor.offsetHeight);
}


// ================================================
// FUNCIONES PROPIAS
// ================================================

function crearParticula() {
  return {
    x:      random(width),
    y:      random(height),
    vx:     random(-1, 1),
    vy:     random(-1, 1),
    tamano: random(2, 6),
    alpha:  random(80, 180),
  };
}

function mostrarInstrucciones() {
  canvasDemo.fill(80, 80, 100);
  canvasDemo.noStroke();
  canvasDemo.textAlign(CENTER, CENTER);
  canvasDemo.textSize(14);
  canvasDemo.text('Haz clic y arrastra para dibujar ✏️', 400, 175);
}


// ================================================
// JAVASCRIPT DOM — conectar botones con p5.js
// ================================================

document.addEventListener('DOMContentLoaded', function () {

  // Año automático en el footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Botón: cambiar color de las partículas y del pincel
  document.getElementById('btn-color').addEventListener('click', function () {
    colorActual = (colorActual + 1) % colores.length;

    // Dar feedback visual en el botón
    let coloresCSS = ['#f0c040', '#80e0c0', '#c080f0', '#f06464'];
    this.style.background = coloresCSS[colorActual];
    this.style.color = '#000';
  });

  // Botón: limpiar el canvas de dibujo
  document.getElementById('btn-limpiar').addEventListener('click', function () {
    canvasDemo.background(15, 15, 19);
    mostrarInstrucciones();
  });

  // Animación de entrada para las tarjetas al hacer scroll
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.tarjeta').forEach(function (tarjeta) {
    tarjeta.style.opacity = '0';
    tarjeta.style.transform = 'translateY(30px)';
    tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(tarjeta);
  });

});
