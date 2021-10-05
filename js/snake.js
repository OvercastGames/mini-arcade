let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');

let snakeGame = new Game(canvas, ctx);

window.addEventListener('keydown', handleKeyPress);

let squareSize = canvas.width / 15;


const timeout = 1000 / 6;

let activeKey = '';

let allowedKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

snakeGame.canvas.width = 600;
snakeGame.canvas.height = 450;

function SnakeSegment(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  SnakeSegment.all.push(this);
}

SnakeSegment.add = function() {
  new SnakeSegment(ctx, 0, 0, 0, 0, squareSize, squareSize, 'green');
}

SnakeSegment.all = [];

SnakeSegment.prototype.draw = function () {
  // How a new snake segment is shown on the screen
  this.context.fillStyle = this.color;
  this.context.fillRect(this.x, this.y, this.height, this.width);

};

SnakeSegment.prototype.update = function () {
  // Will let us take each snake segment and change its x and y coordinates change its properties
  if(activeKey === 'a' || activeKey === 'arrowleft') {
    this.vy = 0;
    this.vx = -1;
  }
  if(activeKey === 'd' || activeKey === 'arrowright') {
    this.vy = 0;
    this.vx = 1;
  }
  if(activeKey === 'w' || activeKey === 'arrowup') {
    this.vy = -1;
    this.vx = 0;
  }
  if(activeKey === 's' || activeKey === 'arrowdown') {
    this.vy = 1;
    this.vx = 0;
  }
  // this.x = 50 this.y = 50
  // if right key pressed we can see we can see vy = 0 and vx = 1
  this.x += this.vx * this.width;
  this.y += this.vy * this.height;
};

function SnakeFood(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  SnakeFood.all.push(this);
}

SnakeFood.prototype.draw = function () {
  this.context.fillStyle = this.color;
  this.context.fillRect(this.x, this.y, this.height, this.width);
};

SnakeFood.prototype.update = function () {

};

SnakeFood.prototype.findSafeLocation = function () {

};

SnakeFood.all = [];

function handleKeyPress(event) {

  for(let i = 0; i < allowedKeys.length; i++) {
    if(event.key.toLowerCase() === allowedKeys[i]) {
      activeKey = event.key.toLowerCase();
    }
  }
  console.log(activeKey);
}

function updateAll() {
  for(let i = SnakeSegment.all.length - 1; i > 0; i--) {
    // If snakesegment.all[10] then === snakesegment.all[9]
    SnakeSegment.all[i].x = SnakeSegment.all[i - 1].x;
    SnakeSegment.all[i].y = SnakeSegment.all[i - 1].y;
  }
  for(let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].findSafeLocation();
    if(SnakeFood.all[i].collision) {
      SnakeFood[i].all.findSafeLocation();
    }
  }
  SnakeSegment.all[0].update();
}

function drawAll() {
  // function that draws all the things
  for(let i = 0; i < SnakeSegment.all.length; i++) {
    SnakeSegment.all[i].draw();
  }
  for(let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].draw();
  }
}

function gameLoop() {
  // Function that does all the updating (snake update food update)
  updateAll();
  // Function to clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Looping backwards through snakesegments and not including the head = [0]
  drawAll();
  setTimeout(gameLoop, timeout);
  // Check for collisions (walls food self)
}


new SnakeSegment(ctx, 50, 50, 0, 0, squareSize, squareSize, 'green');
new SnakeSegment(ctx, 50, 50, 0, 0, squareSize, squareSize, 'green');
new SnakeSegment(ctx, 50, 50, 0, 0, squareSize, squareSize, 'green');
new SnakeSegment(ctx, 50, 50, 0, 0, squareSize, squareSize, 'green');

new SnakeFood(ctx, 100, 100, 0, 0, 10, 10, 'red');

gameLoop();

