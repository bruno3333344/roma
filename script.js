const ruleta = document.getElementById('ruleta');
const girarBtn = document.getElementById('girar');
const resultado = document.getElementById('resultado');
const canvas = ruleta.getContext('2d');

// Configuración de la ruleta
const sectores = 30; // Número de sectores en la ruleta (puedes modificar este valor)
const angulosPorSector = (2 * Math.PI) / sectores;
const colores = ['#FF4500', '#FF6347', '#FF7F50', '#FFD700', '#FF8C00', '#FFA500', '#FFB6C1', '#FF1493', '#FF00FF', '#D2691E']; // Colores de los sectores

// Ajuste para el tamaño del canvas
const radio = 200; // Radio de la ruleta
const centroX = 250;
const centroY = 250;

// Configuramos el tamaño del canvas en función de la ruleta
ruleta.width = 500;  // Ancho del canvas
ruleta.height = 500; // Alto del canvas

// Efecto de partículas
let particulas = [];
let numeroAgrandado = false;

// Dibuja la ruleta
function dibujarRuleta() {
  canvas.clearRect(0, 0, ruleta.width, ruleta.height);
  canvas.beginPath();
  canvas.arc(centroX, centroY, radio, 0, 2 * Math.PI);
  canvas.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Fondo semi-transparente
  canvas.fill();

  for (let i = 0; i < sectores; i++) {
    const anguloInicio = angulosPorSector * i;
    const anguloFin = angulosPorSector * (i + 1);
    canvas.beginPath();
    canvas.arc(centroX, centroY, radio, anguloInicio, anguloFin);
    canvas.lineTo(centroX, centroY);
    
    // Cambiar el color de los sectores
    canvas.fillStyle = colores[i % colores.length]; // Colores normales
    canvas.fill();
  }

  // Dibujar números
  for (let i = 0; i < sectores; i++) {
    const angulo = angulosPorSector * (i + 0.5);
    const x = centroX + Math.cos(angulo) * (radio - 30);
    const y = centroY + Math.sin(angulo) * (radio - 30);
    canvas.font = '20px Arial';
    canvas.fillStyle = '#fff';
    canvas.textAlign = 'center';
    canvas.textBaseline = 'middle';
    canvas.fillText(i + 1, x, y); // Dibuja el número
  }
}

// Efecto de partículas
function crearParticulas(x, y) {
  for (let i = 0; i < 50; i++) {
    particulas.push({
      x: x,
      y: y,
      radio: Math.random() * 5 + 2,
      color: '#ffcc00',
      velocidadX: Math.random() * 4 - 2,
      velocidadY: Math.random() * 4 - 2,
      vida: 100
    });
  }
}

// Dibuja las partículas
function dibujarParticulas() {
  for (let i = 0; i < particulas.length; i++) {
    let p = particulas[i];
    canvas.beginPath();
    canvas.arc(p.x, p.y, p.radio, 0, 2 * Math.PI);
    canvas.fillStyle = p.color;
    canvas.fill();
    p.x += p.velocidadX;
    p.y += p.velocidadY;
    p.vida -= 2;
    
    if (p.vida <= 0) {
      particulas.splice(i, 1);
      i--;
    }
  }
}

// Función para girar la ruleta
function girarRuleta() {
  let anguloFinal = Math.random() * 2 * Math.PI; // Angulo final aleatorio
  let duracion = 3000; // Duración de la animación en milisegundos
  let inicio = null;

  function animar(timestamp) {
    if (!inicio) inicio = timestamp;
    let progreso = timestamp - inicio;
    let angulo = Math.min(progreso / duracion * 2 * Math.PI, anguloFinal);
    canvas.clearRect(0, 0, ruleta.width, ruleta.height); // Limpiar canvas
    canvas.save();
    canvas.translate(centroX, centroY); // Centrar el canvas
    canvas.rotate(angulo); // Rotar el canvas
    canvas.translate(-centroX, -centroY); // Volver a la posición original
    dibujarRuleta(); // Redibujar la ruleta
    dibujarParticulas(); // Dibujar partículas

    if (progreso < duracion) {
      requestAnimationFrame(animar); // Continuar la animación
    } else {
      mostrarResultado(angulo); // Mostrar el resultado una vez que la animación termine
    }
  }

  requestAnimationFrame(animar);
}

// Función para mostrar el resultado (número ganador)
function mostrarResultado(angulo) {
  const sector = Math.floor((angulo + Math.PI / 2) / angulosPorSector) % sectores; // Calcular el número de sector
  const numeroGanador = sector + 1;

  // Resaltar el número ganador en el centro de la ruleta
  resultado.innerText = `Número ganador: ${numeroGanador}`;

  // Crear partículas en el centro para el efecto de celebración
  crearParticulas(centroX, centroY);

  // Aseguramos que el número gane tamaño de forma gradual
  let tamanoInicial = 30;
  let tamanoFinal = 100;
  let duracionAgrandado = 1000; // Duración para agrandar el número
  let tiempo = 0;

  // Animar el tamaño del número
  let intervaloAgrandado = setInterval(function() {
    if (tiempo < duracionAgrandado) {
      tiempo += 20;
      let tamanoActual = tamanoInicial + (tamanoFinal - tamanoInicial) * (tiempo / duracionAgrandado);
      canvas.clearRect(0, 0, ruleta.width, ruleta.height); // Limpiar canvas
      canvas.save();
      canvas.translate(centroX, centroY); // Centrar el canvas
      canvas.rotate(angulo); // Rotar el canvas
      canvas.translate(-centroX, -centroY); // Volver a la posición original
      dibujarRuleta(); // Redibujar la ruleta
      dibujarParticulas(); // Dibujar partículas
      canvas.font = `${tamanoActual}px Arial`;
      canvas.fillStyle = '#ffffff'; // Ahora el color del número es blanco
      canvas.textAlign = 'center';
      canvas.textBaseline = 'middle';
      canvas.fillText(numeroGanador, centroX, centroY); // Mostrar el número ganador en el centro
    } else {
      clearInterval(intervaloAgrandado); // Detener la animación una vez que el número haya alcanzado el tamaño final
    }
  }, 20);
}

// Inicializar la ruleta al cargar la página
dibujarRuleta();

// Añadir el evento al botón de girar
girarBtn.addEventListener('click', girarRuleta);
