let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');

let snakeGame = new Game(canvas, ctx);

snakeGame.canvas.width = 600;
snakeGame.canvas.height = 450;

function SnakeBody(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  this.segments = 5;
}

SnakeBody.prototype.draw = function () {
  for (let i = 0; i < this.segments; i++) {

  }
};

let mySnake = new SnakeBody(ctx, 50, 50, 0, 0, 20, 20, 'green');


