const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};
document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
    desenhar() {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class SnakePart extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
    }
}

class Snake {
    constructor() {
        this.parts = [new SnakePart(100, 200, 20, 20)];
        this.direction = 'right';
        this.speed = 7;
    }

    update() {
        const head = this.parts[0];
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case 'up':
                newY -= this.speed;
                break;
            case 'down':
                newY += this.speed;
                break;
            case 'left':
                newX -= this.speed;
                break;
            case 'right':
                newX += this.speed;
                break;
        }

        this.parts.unshift(new SnakePart(newX, newY, 20, 20));
        this.parts.pop();
    }

    draw() {
        this.parts.forEach(part => part.desenhar());
    }

    handleInput(event) {
        const { code } = event;
        switch (code) {
            case 'KeyW':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'KeyS':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'KeyA':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'KeyD':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    checkCollision(comida) {
        const head = this.parts[0];
        if (
            head.x < comida.x + comida.largura &&
            head.x + head.largura > comida.x &&
            head.y < comida.y + comida.altura &&
            head.y + head.altura > comida.y
        ) {
            this.#comer(comida);
        }
    }

    #comer(comida) {
        comida.x = Math.floor(Math.random() * (canvas.width - 20));
        comida.y = Math.floor(Math.random() * (canvas.height - 20));

        const scoreElement = document.getElementById('score');
        const score = parseInt(scoreElement.innerText.split(': ')[1]) + 1;
        scoreElement.innerText = `Score: ${score}`;

        const recordElement = document.getElementById('record');
        const record = parseInt(localStorage.getItem('record')) || 0;

        if (score > record) {
            localStorage.setItem('record', score);
            recordElement.innerText = `Record: ${score}`;
        }
    }
}
class Comida extends Entidade {
    constructor() {
        super(Math.random() * (canvas.width - 20), Math.random() * (canvas.height - 20), 20, 20);
    }
}

const snake = new Snake();
const comida = new Comida();

document.addEventListener('keydown', event => snake.handleInput(event));

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    comida.desenhar();
    snake.checkCollision(comida);

    const scoreElement = document.getElementById('score');
    const score = parseInt(scoreElement.innerText.split(': ')[1]);
    scoreElement.innerText = `Score: ${score}`;

    const recordElement = document.getElementById('record');
    const record = parseInt(localStorage.getItem('record')) || 0;
    recordElement.innerText = `Record: ${record}`;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const snakeHead = snake.parts[0];

    if (snakeHead.x < 0 || snakeHead.x >= canvasWidth || snakeHead.y < 0 || snakeHead.y >= canvasHeight) {

        alert(`Game Over! Score: ${score}`);

        scoreElement.innerText = 'Score: 0';
        recordElement.innerText = 'Record: 0';
        snake.parts = [new SnakePart(100, 200, 20, 20)];
        comida.x = Math.floor(Math.random() * (canvasWidth - 20));
        comida.y = Math.floor(Math.random() * (canvasHeight - 20));
    }

    requestAnimationFrame(loop);
}

loop();