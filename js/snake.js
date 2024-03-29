// The snakeGame game loop that gets called from appLoop when the state is 'snake'
function gameLoop() {
  updateAll();
  checkAllCollisions();
  snakeGame.context.clearRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
  drawAll();
}

// Loads in all the default snakeGame data
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

// Sets the starting position of the initial snake segments and food.
snakeGame.newGame = function () {
  snakeGame.allSegments = [];
  new SnakeSegment(ctx, snakeGame.squareSize * 4, snakeGame.squareSize * 6, 1, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(ctx, snakeGame.squareSize * 3, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(ctx, snakeGame.squareSize * 2, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeFood(ctx, 100, 100, 0, 0, 25, 25, 'red');
  snakeGame.state = 'snake';
};

// SnakeSegment constructor function
function SnakeSegment(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  snakeGame.allSegments.push(this);
}

// Adds a new SnakeSegment to the end of the tail
// The x and y change depending on the tail's vx and vy
// so that the new segment is placed in the correct position.
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

// Draws each SnakeSegment to screen using a gradient the size of the canvas.
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


// This prototype function is only used on the "head" of the snake.
// The activeKey controls the new vx/vy. There is also logic to 
// disallow moving in the opposite direction of the current direction.
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
  // The segment movement is controlled by the squareSize.
  // E.g. if x if 120 and the new vx is -1 then the new x will be 80.
  // x = 120 + (-1 * 40)
  this.x += this.vx * snakeGame.squareSize;
  this.y += this.vy * snakeGame.squareSize;
};

// SnakeFood constructor
// Each new food is assigned an appropriate location
// and placed in the allFood array.
function SnakeFood(context, x, y, vx, vy, height, width, color) {
  GameObject.call(this, context, x, y, vx, vy);
  this.height = height;
  this.width = width;
  this.color = color;
  this.findSafeLocation();
  snakeGame.allFood.push(this);
}

// Draws the food to screen
SnakeFood.prototype.draw = function () {
  let padding = (snakeGame.squareSize - this.width) / 2;
  this.context.lineWidth = 5;
  this.context.strokeStyle = 'white';
  this.context.fillStyle = '#f33074';
  this.context.fillRect(this.x + padding, this.y + padding, this.height, this.width);
  this.context.strokeRect(this.x + padding, this.y + padding, this.height, this.width);

};

// SnakeFood prototype function
SnakeFood.prototype.update = function () {
  if (this.collision) {
    snakeGame.score += 100;
    // Grow the tail
    snakeGame.allSegments[snakeGame.allSegments.length - 1].add();
    this.findSafeLocation();
    let sound = new Audio('./audio/pickup-food.wav');
    sound.volume = 0.5;
    sound.play();
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

// Draws the score to screen this is called in updateAll
// with a buffer so it is only shown for a short time.
function drawScoreToScreen() {
  snakeGame.context.fillStyle = '#00000077';
  snakeGame.context.font = 'bold 50px kenney-thick';
  snakeGame.context.fillText(snakeGame.score, 20, 65);
}

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

// Collision detection logic taken from tutorial AT https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
function rectIntersect(ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {
  if (bx > aWidth + ax || ax > bWidth + bx || by > aHeight + ay || ay > bHeight + by) {
    return false;
  }
  return true;
}

function checkFoodCollision() {
  let head = snakeGame.allSegments[0];
  let foodHead = snakeGame.allFood[0];
  if (rectIntersect(head.x, head.y, head.width, head.height, foodHead.x, foodHead.y, foodHead.width, foodHead.height)) {
    head.collision = true;
    foodHead.collision = true;
  }
}

function checkSegmentCollision() {

  // Collision with edge of game board
  let head = snakeGame.allSegments[0];
  if (head.x < 0 || head.x + snakeGame.squareSize > snakeGame.canvas.width || head.y < 0 || head.y + snakeGame.squareSize > snakeGame.canvas.height) {
    state = 'gameOver';
    let sound = new Audio('./audio/death.wav');
    sound.volume = 0.5;
    sound.play();
  }

  // Collision with self
  let segmentA;
  let segmentB;
  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    segmentA = snakeGame.allSegments[i];
    for (let j = i + 1; j < snakeGame.allSegments.length; j++) {
      segmentB = snakeGame.allSegments[j];
      if (rectIntersect(segmentA.x, segmentA.y, segmentA.width, segmentA.height, segmentB.x, segmentB.y, segmentB.width, segmentB.height)) {
        segmentA.collision = true;
        segmentB.collision = true;
        state = 'gameOver';
        let sound = new Audio('./audio/death.wav');
        sound.volume = 0.5;
        sound.play();
      }
    }
  }
}


function checkAllCollisions() {
  // Reset all the snake segements and food to collision false
  snakeGame.allFood[0].collision = false;
  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    snakeGame.allSegments[i].collision = false;
  }
  checkFoodCollision();
  checkSegmentCollision();
}


// Adds a buffer to drawScoreToScreen() so it only stays up for 3 frames
function updateScoreWithBuffer() {
  snakeGame.scoreDisplayBuffer = 1;
  drawScoreToScreen();
  if (snakeGame.scoreDisplayBuffer > 0 && snakeGame.scoreDisplayBuffer < 4) {
    drawScoreToScreen();
    snakeGame.scoreDisplayBuffer++;
  } else {
    snakeGame.scoreDisplayBuffer = 0;
  }
}

// Updates snake segments and food with new positions and velocities.
function updateAll() {
  // Works backwards through allSegments assigning x/y/vx/vy from from the 
  // segment ahead of the current segment.
  // E.g. if we're on snakesegment.all[10] then it grabs new values from snakesegment.all[9]
  for (let i = snakeGame.allSegments.length - 1; i > 0; i--) {
    snakeGame.allSegments[i].x = snakeGame.allSegments[i - 1].x;
    snakeGame.allSegments[i].y = snakeGame.allSegments[i - 1].y;
    snakeGame.allSegments[i].vy = snakeGame.allSegments[i - 1].vy;
    snakeGame.allSegments[i].vx = snakeGame.allSegments[i - 1].vx;
  }
  // Currently the game only implements a single piece of food at a time.
  // This updates that first index.
  snakeGame.allFood[0].update();
  // Only update the head, the rest of the segments follow with above logic.
  snakeGame.allSegments[0].update();
}

// This function holds all the calls to drawing the background, the snake segments,
// the score and food.
function drawAll() {
  drawGameBoard();
  for (let i = 0; i < snakeGame.allSegments.length; i++) {
    snakeGame.allSegments[i].draw();
  }
  // Currently the game only implements a single piece of food at a time.
  // This updates that first index.
  snakeGame.allFood[0].draw();
  if (snakeGame.allFood.collision) {
    updateScoreWithBuffer();
  }
}

