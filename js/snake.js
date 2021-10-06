let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');

let snakeGame = new Game(canvas, ctx);

window.addEventListener('keydown', handleKeyPress);

let squareSize = 40;
let snakeSegmentSize = 34;
let numColumns = 15;
let numRows = 11;

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

SnakeSegment.prototype.add = function () {
  new SnakeSegment(this.context, this.x, this.y, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
};

SnakeSegment.all = [];

SnakeSegment.prototype.draw = function () {
  // How a snake segment is shown on the screen
  let padding = (squareSize - this.width) / 2;
  if (this.collision) {
    this.context.fillStyle = 'yellow';
  } else {
    this.context.fillStyle = 'green';
  }
  this.context.fillRect(this.x, this.y, this.height, this.width);

};

SnakeSegment.prototype.update = function () {
  // Will let us take each snake segment and change its x and y coordinates change its properties
  if (activeKey === 'a' || activeKey === 'arrowleft') {
    this.vy = 0;
    this.vx = -1;
  }
  if (activeKey === 'd' || activeKey === 'arrowright') {
    this.vy = 0;
    this.vx = 1;
  }
  if (activeKey === 'w' || activeKey === 'arrowup') {
    this.vy = -1;
    this.vx = 0;
  }
  if (activeKey === 's' || activeKey === 'arrowdown') {
    this.vy = 1;
    this.vx = 0;
  }
  // this.x = 50 this.y = 50
  // if right key pressed we can see we can see vy = 0 and vx = 1
  this.x += this.vx * squareSize;
  this.y += this.vy * squareSize;
};

function SnakeFood(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  SnakeFood.all.push(this);
}

SnakeFood.prototype.draw = function () {
  let padding = (squareSize - this.width) / 2;
  if (this.collision) {
    this.context.fillStyle = 'orange';
  } else {
    this.context.fillStyle = 'red';
  }
  this.context.fillRect(this.x, this.y, this.height, this.width);
};

SnakeFood.prototype.update = function () {
  if (this.collision) {
    this.findSafeLocation();
  }
};

SnakeFood.prototype.findSafeLocation = function () {
  let randomX;
  let randomY;
  do {
    randomX = Math.floor(Math.random() * numColumns) * squareSize;
    randomY = Math.floor(Math.random() * numRows) * squareSize;
  } while ((randomX > 0 && randomX < canvas.width || randomY > 0 && randomY < canvas.height));
  this.x = randomX;
  this.y = randomY;

};

SnakeFood.all = [];

function drawGameBoard() {
  for (let rows = 0; rows < numRows; rows++) {
    for (let columns = 0; columns < numColumns; columns++) {
      if ((isOdd(rows) && isEven(columns)) || ((isEven(rows) && isOdd(columns)))) {
        ctx.fillStyle = 'purple';
      } else {
        ctx.fillStyle = 'orange';
      }
      ctx.beginPath();
      ctx.fillRect(columns * 40, rows * 40, 40, 40);
    }
  }
}

function checkCollisions() {
  // Food collisions
  let a;
  let b;

  for (let i = 0; i < SnakeSegment.all.length; i++) {
    SnakeSegment.all[i].collision = false;
  }

  for (let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].collision = false;
  }

  let head = SnakeSegment.all[0];
  let foodHead = SnakeFood.all[0];

  if (rectIntersect(head.x, head.y, head.width, head.height, foodHead.x, foodHead.y, foodHead.width, foodHead.height)) {
    head.collision = true;
    foodHead.collision = true;
  }

  if (foodHead.collision) {
    SnakeSegment.all[SnakeSegment.all.length - 1].add();
  }

  for (let i = 0; i < SnakeSegment.all.length; i++) {
    a = SnakeSegment.all[i];
    for (let j = i + 1; j < SnakeSegment.all.length; j++) {
      b = SnakeSegment.all[j];
    } if (rectIntersect(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height)) {
      a.collision = true;
      b.collision = true;
    }
  }
}

// Collision detection logic taken from tutorial AT https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
function rectIntersect(ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {
  if (bx > aWidth + ax || ax > bWidth + bx || by > aHeight + ay || ay > bHeight + by) {
    return false;
  }
  return true;
}

function handleKeyPress(event) {

  for (let i = 0; i < allowedKeys.length; i++) {
    if (event.key.toLowerCase() === allowedKeys[i]) {
      activeKey = event.key.toLowerCase();
    }
  }
}

function updateAll() {
  for (let i = SnakeSegment.all.length - 1; i > 0; i--) {
    // If snakesegment.all[10] then === snakesegment.all[9]
    SnakeSegment.all[i].x = SnakeSegment.all[i - 1].x;
    SnakeSegment.all[i].y = SnakeSegment.all[i - 1].y;
  }
  for (let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].update();
    console.log(SnakeFood.all[i].collision);
  }
  SnakeSegment.all[0].update();
  //SnakeSegment.all[SnakeSegment.all.length - 1].update();
}

function drawAll() {
  drawGameBoard();
  // function that draws all the things
  for (let i = 0; i < SnakeSegment.all.length; i++) {
    SnakeSegment.all[i].draw();
  }
  for (let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].draw();
  }
}

function gameLoop() {
  // Function that does all the updating (snake update food update)
  updateAll();
  checkCollisions();
  // Function to clear screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Looping backwards through snakesegments and not including the head = [0]
  drawAll();
  setTimeout(gameLoop, timeout);
  // Check for collisions (walls food self)
}


new SnakeSegment(ctx, squareSize, squareSize, 0, 1, snakeSegmentSize, snakeSegmentSize, 'green');
new SnakeSegment(ctx, squareSize, squareSize, 0, 1, snakeSegmentSize, snakeSegmentSize, 'green');
new SnakeSegment(ctx, squareSize, squareSize, 0, 1, snakeSegmentSize, snakeSegmentSize, 'green');



new SnakeFood(ctx, 100, 100, 0, 0, 10, 10, 'red');

gameLoop();

