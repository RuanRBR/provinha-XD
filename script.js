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
        this.speed = 3;
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
        this.parts.forEach(part => {
            ctx.fillStyle = '#0eff00';
            ctx.fillRect(part.x, part.y, part.largura, part.altura);
        });
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
        comida.foodItems.forEach(food => {
            if (
                head.x < food.x + food.largura &&
                head.x + head.largura > food.x &&
                head.y < food.y + food.altura &&
                head.y + head.altura > food.y
            ) {
                this.#comer(food);
            }
        });
    }

    #comer(food) {
        const index = comida.foodItems.indexOf(food);
        if (index !== -1) {
            comida.foodItems.splice(index, 1);
        }
        food.x = Math.floor(Math.random() * (canvas.width - 20));
        food.y = Math.floor(Math.random() * (canvas.height - 20));
    

        this.speed += .1;
    
        this.parts.push(new SnakePart(food.x, food.y, 20, 20));
    
        const scoreElement = document.getElementById('score');
        const score = parseInt(scoreElement.innerText.split(': ')[1]) + 1;
        scoreElement.innerText = `Score: ${score}`;
    
        const recordElement = document.getElementById('record');
        const record = parseInt(localStorage.getItem('record')) || 0;
    
        if (score > record) {
            localStorage.setItem('record', score);
            recordElement.innerText = `Record: ${score}`;
        }
    
        comida.foodItems.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), largura: 20, altura: 20 });
    }
}
class Comida {
    constructor() {
        this.foodItems = [];
        this.generateFood();
    }

    generateFood() {
        const maxFoodItems = 10;
        while (this.foodItems.length < maxFoodItems) {
            const food = {
                x: Math.floor(Math.random() * (canvas.width - 20)),
                y: Math.floor(Math.random() * (canvas.height - 20)),
                largura: 20,
                altura: 20
            };
            this.foodItems.push(food);
        }
    }

    desenhar() {
        this.foodItems.forEach(food => {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(food.x, food.y, food.largura, food.altura);
        });
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

    const speedMeterElement = document.getElementById('speed-meter');
    speedMeterElement.innerText = `Speed: ${snake.speed.toFixed(2)}`;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const snakeHead = snake.parts[0];


    if (snakeHead.x < 0 || snakeHead.x >= canvasWidth || snakeHead.y < 0 || snakeHead.y >= canvasHeight) {

        alert(`Game Over! Score: ${score}`);

        scoreElement.innerText = 'Score: 0';
        recordElement.innerText = 'Record: 0';
        snake.parts = [new SnakePart(100, 200, 20, 20)];
        comida.foodItems.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), largura: 20, altura: 20 });
        snake.speed = 3;
    }

    if (comida.foodItems.length === 0) {
        comida.foodItems.push({ x: Math.random() * (canvas.width - 20), y: Math.random() * (canvas.height - 20), largura: 20, altura: 20 });
    }

    requestAnimationFrame(loop);
}

loop();