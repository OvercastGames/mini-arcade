function gameLoop() {
  updateAll();
  checkCollisions();
  snakeGame.context.clearRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
  drawAll();
}

snakeGame.setData = function () {
  snakeGame.allSegments = [];
  snakeGame.squareSize = 40;
  snakeGame.snakeSegmentSize = 36;
  snakeGame.numRows = 11;
  snakeGame.numColumns = 15;
  snakeGame.canvas.width = 600;
  snakeGame.canvas.height = 450;
  snakeGame.timeout = 1000 / 6;
  snakeGame.activeKey = '';
  snakeGame.allowedKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  snakeGame.allFood = [];
  snakeGame.score = 0;
  snakeGame.initials = '';
  snakeGame.segmentColor = 'linear-gradient(#74f330, #000000)';
  snakeGame.foodColor = 'red';
  snakeGame.scoreDisplayBuffer = 0;
  snakeGame.muted = false;
};

snakeGame.newGame = function () {
  snakeGame.allSegments = [];
  new SnakeSegment(ctx, snakeGame.squareSize * 4, snakeGame.squareSize * 6, 1, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(ctx, snakeGame.squareSize * 3, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(ctx, snakeGame.squareSize * 2, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeFood(ctx, 100, 100, 0, 0, 25, 25, 'red');
  snakeGame.state = 'snake';
};

snakeGame.continueGame = function () {
  setTimeout(gameLoop, snakeGame.timeout);
};

function SnakeSegment(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  snakeGame.allSegments.push(this);
}

SnakeSegment.prototype.add = function () {
  if (this.vx === 0 && this.vy > 0) {
    new SnakeSegment(this.context, this.x, this.y - snakeGame.squareSize, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  }
  if (this.vx === 0 && this.vy < 0) {
    new SnakeSegment(this.context, this.x, this.y + snakeGame.squareSize, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  }
  if (this.vy === 0 && this.vx > 0) {
    new SnakeSegment(this.context, this.x - snakeGame.squareSize, this.y, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  }
  if (this.vy === 0 && this.vx < 0) {
    new SnakeSegment(this.context, this.x + snakeGame.squareSize, this.y, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  }
};

SnakeSegment.prototype.draw = function () {
  // How a snake segment is shown on the screen
  let grd = snakeGame.context.createLinearGradient(0, 0, 600, 0);
  grd.addColorStop(.0, '#f33074');
  grd.addColorStop(.33, '#fff64d');
  grd.addColorStop(.66, '#30f0af');
  grd.addColorStop(1, '#6cdef6');
  let padding = (snakeGame.squareSize - this.width) / 2;
  if (this.collision) {
    this.context.fillStyle = 'yellow';
  } else {
    this.context.fillStyle = grd;
  }
  this.context.fillRect(this.x + padding, this.y + padding, this.height, this.width);

};

SnakeSegment.prototype.update = function () {
  // Will let us take each snake segment and change its x and y coordinates change its properties
  if (snakeGame.activeKey === 'a' || snakeGame.activeKey === 'arrowleft') {
    if (this.vx !== 1) {

      this.vx = -1;
      this.vy = 0;
    }
  }
  if (snakeGame.activeKey === 'd' || snakeGame.activeKey === 'arrowright') {
    if (this.vx !== -1) {
      this.vy = 0;
      this.vx = 1;
    }
  }
  if (snakeGame.activeKey === 'w' || snakeGame.activeKey === 'arrowup') {
    if (this.vy !== 1) {
      this.vy = -1;
      this.vx = 0;
    }
  }
  if (snakeGame.activeKey === 's' || snakeGame.activeKey === 'arrowdown') {
    if (this.vy !== -1) {
      this.vy = 1;
      this.vx = 0;
    }
  }
  // this.x = 50 this.y = 50
  // if right key pressed we can see we can see vy = 0 and vx = 1
  this.x += this.vx * snakeGame.squareSize;
  this.y += this.vy * snakeGame.squareSize;
};

function SnakeFood(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  snakeGame.allFood.push(this);
  this.findSafeLocation();
}

SnakeFood.prototype.draw = function () {
  let padding = (snakeGame.squareSize - this.width) / 2;
  this.context.lineWidth = 5;
  this.context.strokeStyle = 'white';
  this.context.fillStyle = '#f33074';
  this.context.fillRect(this.x + padding, this.y + padding, this.height, this.width);
  this.context.strokeRect(this.x + padding, this.y + padding, this.height, this.width);

};

function drawScoreToScreen() {

  snakeGame.context.fillStyle = '#00000077';
  snakeGame.context.font = 'bold 50px kenney-thick';
  snakeGame.context.fillText(snakeGame.score, 20, 65);
}

SnakeFood.prototype.update = function () {
  if (this.collision) {
    this.findSafeLocation();
  }
};



SnakeFood.prototype.findSafeLocation = function () {
  let randomX;
  let randomY;
  do {
    randomX = Math.floor(Math.random() * snakeGame.numColumns) * snakeGame.squareSize;
    randomY = Math.floor(Math.random() * snakeGame.numRows) * snakeGame.squareSize;
  } while (isOccupied(randomX * snakeGame.squareSize, randomY * snakeGame.squareSize));
  this.x = randomX;
  this.y = randomY;

};


function isOccupied(x, y) {
  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    let current = snakeGame.allSegments[i];
    if (rectIntersect(current.x, current.y, current.width, current.height, x, y, snakeGame.squareSize, snakeGame.squareSize)) {
      return true;
    }
  }
  return false;
}

function drawGameBoard() {
  for (let rows = 0; rows < snakeGame.numRows; rows++) {
    for (let columns = 0; columns < snakeGame.numColumns; columns++) {
      if ((isOdd(rows) && isEven(columns)) || ((isEven(rows) && isOdd(columns)))) {
        ctx.fillStyle = '#fddde8';
        //ctx.fillStyle = '#4168AB';
      } else {
        ctx.fillStyle = '#fbbad1';
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

  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    snakeGame.allSegments[i].collision = false;
  }

  for (let i = 0; i < snakeGame.allFood.length; i++) {
    snakeGame.allFood[i].collision = false;
  }

  let head = snakeGame.allSegments[0];
  let foodHead = snakeGame.allFood[0];

  if (rectIntersect(head.x, head.y, head.width, head.height, foodHead.x, foodHead.y, foodHead.width, foodHead.height)) {
    head.collision = true;
    foodHead.collision = true;
  }
  // outside game board
  if (head.x < 0 || head.x + snakeGame.squareSize > snakeGame.canvas.width || head.y < 0 || head.y + snakeGame.squareSize > snakeGame.canvas.height) {
    state = 'gameOver';
    let sound = new Audio('../audio/death.wav');
    sound.volume = 0.5;
    sound.play();
  }
  // Add new segment
  if (foodHead.collision) {
    snakeGame.score += 100;
    snakeGame.allSegments[snakeGame.allSegments.length - 1].add();
  }

  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    a = snakeGame.allSegments[i];
    for (let j = i + 1; j < snakeGame.allSegments.length; j++) {
      b = snakeGame.allSegments[j];
      if (rectIntersect(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height)) {
        a.collision = true;
        b.collision = true;
        state = 'gameOver';
        let sound = new Audio('../audio/death.wav');
        sound.volume = 0.5;
        sound.play();
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
  for (let i = snakeGame.allSegments.length - 1; i > 0; i--) {
    // If snakesegment.all[10] then === snakesegment.all[9]
    snakeGame.allSegments[i].x = snakeGame.allSegments[i - 1].x;
    snakeGame.allSegments[i].y = snakeGame.allSegments[i - 1].y;
    snakeGame.allSegments[i].vy = snakeGame.allSegments[i - 1].vy;
    snakeGame.allSegments[i].vx = snakeGame.allSegments[i - 1].vx;
  }
  for (let i = 0; i < snakeGame.allFood.length; i++) {
    snakeGame.allFood[i].update();
  }
  snakeGame.allSegments[0].update();

}

function drawAll() {
  drawGameBoard();
  // function that draws all the things
  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    snakeGame.allSegments[i].draw();
  }
  for (let i = 0; i < snakeGame.allFood.length; i++) {
    snakeGame.allFood[i].draw();
  }

  if (snakeGame.allFood[0].collision) {
    if (!snakeGame.muted) {
      let sound = new Audio('../audio/pickup-food.wav');
      sound.volume = 0.5;
      sound.play();
    }
    snakeGame.scoreDisplayBuffer = 1;
    drawScoreToScreen();
  } else if (snakeGame.scoreDisplayBuffer > 0 && snakeGame.scoreDisplayBuffer < 4) {
    drawScoreToScreen();
    snakeGame.scoreDisplayBuffer++;
  } else {
    snakeGame.scoreDisplayBuffer = 0;
  }
}

