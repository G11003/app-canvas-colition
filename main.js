const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#000";

class Circle {
    constructor(x, y, radius, color, text) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.defaultColor = color; // Color inicial
        this.color = color;
        this.text = text;
        this.velocityX = Math.random() * 4 - 2; // velocidad aleatoria en el eje X
        this.velocityY = Math.random() * 4 - 2; // velocidad aleatoria en el eje Y
    }

    draw(Context) {
        Context.beginPath();
        Context.fillText(this.text, this.posX, this.posY);
        Context.strokeStyle = this.color; // Establece el color del contorno
        Context.textAlign = 'center'; // Centra el texto en el eje X
        Context.textBaseline = 'middle'; // Centraliza el texto en el eje Y
        Context.fillStyle = 'white';
        Context.font = '20px Arial';
        Context.lineWidth = 2;
        Context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        Context.stroke();
        Context.closePath();
    }

    update() {
        // actualiza la posición del círculo
        this.posX += this.velocityX;
        this.posY += this.velocityY;
        
        // comprueba colisiones con los bordes del canvas
        if (this.posX + this.radius >= canvas.width || this.posX - this.radius <= 0) {
            this.velocityX *= -1;
        }
        if (this.posY + this.radius >= canvas.height || this.posY - this.radius <= 0) {
            this.velocityY *= -1;
        }
        
        // asegura que el círculo permanezca dentro del canvas
        this.posX = Math.min(Math.max(this.posX, this.radius), canvas.width - this.radius);
        this.posY = Math.min(Math.max(this.posY, this.radius), canvas.height - this.radius);
    }
}


let arrayCircle = [];

for (let i = 0; i < 10; i++) {
    let randomX = Math.random() * window_width; // posicion aleatoria para X
    let randomY = Math.random() * window_height; // posicion aleatoria para Y
    let randomRadius = Math.floor(Math.random() * 100 + 30); // Radio de los círculos va de 1 a 99
    let color = i % 2 === 0 ? '#ff1493':'#c2ff05'; // Alterna entre colores
    let miCirculo = new Circle(randomX, randomY, randomRadius, color, i + 1);
    arrayCircle.push(miCirculo);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas en cada frame
    for (let i = 0; i < arrayCircle.length; i++) {
        arrayCircle[i].update(); // Actualiza la posición de los círculos
        arrayCircle[i].draw(ctx); // Dibuja los círculos actualizados
    }

    // Verifica colisiones y realiza el rebote si es necesario
    for (let i = 0; i < arrayCircle.length; i++) {
        for (let j = i + 1; j < arrayCircle.length; j++) {
            if (checkCollision(arrayCircle[i], arrayCircle[j])) {
                handleCollision(arrayCircle[i], arrayCircle[j]);
            }
        }
    }

    requestAnimationFrame(animate); // Solicita el próximo frame de animación
}
// Función para manejar la colisión entre dos círculos


// Función para manejar la colisión entre dos círculos
function handleCollision(circle1, circle2) {

    const dx = circle1.posX - circle2.posX;
    const dy = circle1.posY - circle2.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = circle1.radius + circle2.radius - distance;

    // Mueve los círculos para evitar la superposición
    const angle = Math.atan2(dy, dx);
    const moveX = overlap * Math.cos(angle);
    const moveY = overlap * Math.sin(angle);
    circle1.posX += moveX / 2;
    circle1.posY += moveY / 2;
    circle2.posX -= moveX / 2;
    circle2.posY -= moveY / 2;

    // Invierte las velocidades para simular el rebote
    const tempVelocityX = circle1.velocityX;
    const tempVelocityY = circle1.velocityY;
    circle1.velocityX = circle2.velocityX;
    circle1.velocityY = circle2.velocityY;
    circle2.velocityX = tempVelocityX;
    circle2.velocityY = tempVelocityY;

   // Cambia los colores de los círculos al colisionar
   const newColor = circle1.color === '#ff1493' ? '#ff1493':'#c2ff05';

   // Cambia los colores de los círculos al colisionar
   circle1.color = newColor;
   circle2.color = newColor;

}

// Función para verificar colisiones entre dos círculos
function checkCollision(circle1, circle2) {
    const dx = circle1.posX - circle2.posX;
    const dy = circle1.posY - circle2.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si la distancia entre los centros es menor o igual a la suma de los radios, están colisionando
    return distance <= circle1.radius + circle2.radius;
}

animate(); // Comienza la animación