

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
  let grd = miniArcade.gameCtx.createLinearGradient(0, 0, 600, 0);
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
    // Speeds up the action every 500 points
    if (snakeGame.score % 500 === 0) {
      snakeGame.timeout *= 0.9;
    }
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
  } while (snakeGame.isOccupied(randomX * snakeGame.squareSize, randomY * snakeGame.squareSize));
  this.x = randomX;
  this.y = randomY;

};

// The snakeGame game loop that gets called from appLoop when the state is 'snake'
snakeGame.gameLoop = function () {
  this.updateAll();
  this.checkAllCollisions();
  this.drawAll();
}

// Loads in all the default snakeGame data
snakeGame.setData = function () {
  this.allSegments = [];
  this.squareSize = 40;
  this.snakeSegmentSize = 36;
  this.numRows = 11;
  this.numColumns = 15;
  this.activeKey = '';
  this.validKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
  this.allFood = [];
  this.segmentColor = 'linear-gradient(#74f330, #000000)';
  this.foodColor = 'red';
  this.scoreDisplayBuffer = 0;
};

// Sets the starting position of the initial snake segments and food.
snakeGame.newGame = function () {
  snakeGame.allSegments = [];
  snakeGame.score = 0;
  snakeGame.timeout = 1000 / 4;
  new SnakeSegment(miniArcade.gameCtx, snakeGame.squareSize * 4, snakeGame.squareSize * 6, 1, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(miniArcade.gameCtx, snakeGame.squareSize * 3, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeSegment(miniArcade.gameCtx, snakeGame.squareSize * 2, snakeGame.squareSize * 6, 0, 0, snakeGame.snakeSegmentSize, snakeGame.snakeSegmentSize, 'green');
  new SnakeFood(miniArcade.gameCtx, 100, 100, 0, 0, 25, 25, 'red');
  snakeGame.state = 'snake';
};

snakeGame.receiveKeyDown = function (keyDown) {
  for (let i = 0; i < this.validKeys.length; i++) {
    if (keyDown === this.validKeys[i]) {
      this.activeKey = keyDown;
    }
  }
}
// Draws the score to screen this is called in updateAll
// with a buffer so it is only shown for a short time.
snakeGame.drawScoreToScreen = function () {
  miniArcade.gameCtx.fillStyle = '#00000077';
  miniArcade.gameCtx.font = 'bold 50px kenney-thick';
  miniArcade.gameCtx.fillText(this.score, miniArcade.gameCanvas.width / 2, 65);
}

snakeGame.isOccupied = function (x, y) {
  for (let i = 0; i < this.allSegments.length; i++) {
    let current = this.allSegments[i];
    if (rectIntersect(current.x, current.y, current.width, current.height, x, y, this.squareSize, this.squareSize)) {
      return true;
    }
  }
  return false;
}

snakeGame.drawGameBoard = function () {
  for (let rows = 0; rows < this.numRows; rows++) {
    for (let columns = 0; columns < this.numColumns; columns++) {
      if ((isOdd(rows) && isEven(columns)) || ((isEven(rows) && isOdd(columns)))) {
        miniArcade.gameCtx.fillStyle = '#fddde8';
        //miniArcade.gameCtx.fillStyle = '#4168AB';
      } else {
        miniArcade.gameCtx.fillStyle = '#fbbad1';
        //miniArcade.gameCtx.fillStyle = '#3D4B75';
      }
      miniArcade.gameCtx.beginPath();
      miniArcade.gameCtx.fillRect(columns * 40, rows * 40, 40, 40);
    }
  }
}

snakeGame.checkFoodCollision = function () {
  let head = this.allSegments[0];
  let foodHead = this.allFood[0];
  if (rectIntersect(head.x, head.y, head.width, head.height, foodHead.x, foodHead.y, foodHead.width, foodHead.height)) {
    head.collision = true;
    foodHead.collision = true;
  }
}

snakeGame.checkSegmentCollision = function () {
  // Collision with edge of game board
  let head = this.allSegments[0];
  if (head.x < 0 || head.x + this.squareSize > miniArcade.gameCanvas.width || head.y < 0 || head.y + this.squareSize > miniArcade.gameCanvas.height) {
    miniArcade.state = gameStates.GAME_OVER;
    let sound = new Audio('./audio/death.wav');
    sound.volume = 0.5;
    sound.play();
  }
  // Collision with self
  let segmentA;
  let segmentB;
  for (let i = 0; i < this.allSegments.length; i++) {
    segmentA = this.allSegments[i];
    for (let j = i + 1; j < this.allSegments.length; j++) {
      segmentB = this.allSegments[j];
      if (rectIntersect(segmentA.x, segmentA.y, segmentA.width, segmentA.height, segmentB.x, segmentB.y, segmentB.width, segmentB.height)) {
        segmentA.collision = true;
        segmentB.collision = true;
        miniArcade.state = gameStates.GAME_OVER;
        let sound = new Audio('./audio/death.wav');
        sound.volume = 0.5;
        sound.play();
      }
    }
  }
}

snakeGame.checkAllCollisions = function () {
  // Reset all the snake segements and food to collision false
  this.allFood[0].collision = false;
  for (let i = 0; i < this.allSegments.length; i++) {
    this.allSegments[i].collision = false;
  }
  this.checkFoodCollision();
  this.checkSegmentCollision();
}

// Adds a buffer to drawScoreToScreen() so it only stays up for 3 frames
snakeGame.drawScoreWithBuffer = function () {
  if (this.allFood[0].collision) {
    this.scoreDisplayBuffer = 1;
  }
  if (this.scoreDisplayBuffer > 0 && this.scoreDisplayBuffer < 10) {
    this.drawScoreToScreen();
    this.scoreDisplayBuffer++;
  } else {
    this.scoreDisplayBuffer = 0;
  }
}

// Updates snake segments and food with new positions and velocities.
snakeGame.updateAll = function () {
  // Works backwards through allSegments assigning x/y/vx/vy from from the 
  // segment ahead of the current segment.
  // E.g. if we're on snakesegment.all[10] then it grabs new values from snakesegment.all[9]
  for (let i = this.allSegments.length - 1; i > 0; i--) {
    this.allSegments[i].x = this.allSegments[i - 1].x;
    this.allSegments[i].y = this.allSegments[i - 1].y;
    this.allSegments[i].vy = this.allSegments[i - 1].vy;
    this.allSegments[i].vx = this.allSegments[i - 1].vx;
  }
  // Currently the game only implements a single piece of food at a time.
  // This updates that first index.
  this.allFood[0].update();
  // Only update the head, the rest of the segments follow with above logic.
  this.allSegments[0].update();
}

// This function holds all the calls to drawing the background, the snake segments,
// the score and food.
snakeGame.drawAll = function () {
  miniArcade.gameCtx.clearRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  this.drawGameBoard();
  for (let i = 0; i < this.allSegments.length; i++) {
    this.allSegments[i].draw();
  }
  // Currently the game only implements a single piece of food at a time.
  // This updates that first index.
  this.allFood[0].draw();
  this.drawScoreWithBuffer();
}

