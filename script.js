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
    }

    update() {
        const head = this.parts[0];
        let newX = head.x;
        let newY = head.y;

        switch (this.direction) {
            case 'up':
                newY -= 7;
                break;
            case 'down':
                newY += 7;
                break;
            case 'left':
                newX -= 7;
                break;
            case 'right':
                newX += 7;
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
        const newPart = new SnakePart(comida.x, comida.y, 20, 20);
        this.parts.push(newPart);
        comida.x = Math.floor(Math.random() * (canvas.width - 20));
        comida.y = Math.floor(Math.random() * (canvas.height - 20));

        // Update the score
        const scoreElement = document.getElementById('score');
        const score = parseInt(scoreElement.innerText.split(': ')[1]) + 1;
        scoreElement.innerText = `Score: ${score}`;
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
    requestAnimationFrame(loop);
}

loop();