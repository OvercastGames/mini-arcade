

let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');
let snakeGame = new Game(canvas, ctx);


let squareSize = 40;
let snakeSegmentSize = 36;
let numColumns = 15;
let numRows = 11;

const timeout = 1000 / 6;

let activeKey = '';

let allowedKeys = ['w', 'a', 's', 'd', 'q', 'n', 'm', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];

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
  if (this.vx === 0 && this.vy > 0) {
    new SnakeSegment(this.context, this.x, this.y - squareSize, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  }
  if (this.vx === 0 && this.vy < 0) {
    new SnakeSegment(this.context, this.x, this.y + squareSize, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  }
  if (this.vy === 0 && this.vx > 0) {
    new SnakeSegment(this.context, this.x - squareSize, this.y, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  }
  if (this.vy === 0 && this.vx < 0) {
    new SnakeSegment(this.context, this.x + squareSize, this.y, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  }
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
    if (this.vx !== 1) {

      this.vx = -1;
      this.vy = 0;
    }
  }
  if (activeKey === 'd' || activeKey === 'arrowright') {
    if (this.vx !== -1) {
      this.vy = 0;
      this.vx = 1;
    }
  }
  if (activeKey === 'w' || activeKey === 'arrowup') {
    if (this.vy !== 1) {
      this.vy = -1;
      this.vx = 0;
    }
  }
  if (activeKey === 's' || activeKey === 'arrowdown') {
    if (this.vy !== -1) {
      this.vy = 1;
      this.vx = 0;
    }
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
  this.findSafeLocation();
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
  } while (isOccupied(randomX * squareSize, randomY * squareSize));
  this.x = randomX;
  this.y = randomY;

};

SnakeFood.all = [];

function isOccupied(x, y) {
  for (let i = 0; i < SnakeSegment.all.length; i++) {
    let current = SnakeSegment.all[i];
    if (rectIntersect(current.x, current.y, current.width, current.height, x, y, squareSize, squareSize)) {
      return true;
    }
  }
  return false;
}

function drawGameBoard() {
  for (let rows = 0; rows < numRows; rows++) {
    for (let columns = 0; columns < numColumns; columns++) {
      if ((isOdd(rows) && isEven(columns)) || ((isEven(rows) && isOdd(columns)))) {
        ctx.fillStyle = '#c0eb5d';
        //ctx.fillStyle = '#4168AB';
      } else {
        ctx.fillStyle = '#ccef7d';
        //ctx.fillStyle = '#3D4B75';
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
  if (head.x < 0 || head.x + squareSize > snakeGame.canvas.width || head.y < 0 || head.y + squareSize > snakeGame.canvas.height) {
  }
  // Add new segment
  if (foodHead.collision) {
    SnakeSegment.all[SnakeSegment.all.length - 1].add();
  }

  for (let i = 0; i < SnakeSegment.all.length; i++) {
    a = SnakeSegment.all[i];
    for (let j = i + 1; j < SnakeSegment.all.length; j++) {
      b = SnakeSegment.all[j];
      if (rectIntersect(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height)) {
        a.collision = true;
        b.collision = true;
      }
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



function updateAll() {
  for (let i = SnakeSegment.all.length - 1; i > 0; i--) {
    // If snakesegment.all[10] then === snakesegment.all[9]
    SnakeSegment.all[i].x = SnakeSegment.all[i - 1].x;
    SnakeSegment.all[i].y = SnakeSegment.all[i - 1].y;
    SnakeSegment.all[i].vy = SnakeSegment.all[i - 1].vy;
    SnakeSegment.all[i].vx = SnakeSegment.all[i - 1].vx;
  }
  for (let i = 0; i < SnakeFood.all.length; i++) {
    SnakeFood.all[i].update();
  }
  SnakeSegment.all[0].update();
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
function wallCheck() {
  //wall check
}
function gameLoop() {
  console.log('snake is running');
  // Function that does all the updating (snake update food update)
  updateAll();
  checkCollisions();

  // Function to clear screen
  ctx.clearRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
  // Looping backwards through snakesegments and not including the head = [0]
  drawAll();
  if (activeKey !== 'q') {
    setTimeout(gameLoop, timeout);
  } else if (activeKey === 'n') {
    init();
  }
  // Check for collisions (walls food self)
}

let init = function () {
  state = 'notStart';
  SnakeSegment.all = [];
  new SnakeSegment(ctx, squareSize * 6, squareSize * 6, 1, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  new SnakeSegment(ctx, squareSize * 5, squareSize * 6, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  new SnakeSegment(ctx, squareSize * 4, squareSize * 6, 0, 0, snakeSegmentSize, snakeSegmentSize, 'green');
  new SnakeFood(ctx, 100, 100, 0, 0, 25, 25, 'red');
  gameLoop();
};






