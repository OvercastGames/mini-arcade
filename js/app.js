'use strict';

// Main game is drawn on the '#snake' canvas
// The joystick is on the '#joystick' canvas
let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');
let joystickCanvas = document.getElementById('joystick');
let joystickCtx = joystickCanvas.getContext('2d');

// Create a Game
let snakeGame = new Game(canvas, ctx, '#fff64d');

let previousTimeStamp;
let state = 'menu';


// Declaring fonts
let kenneyThick = new FontFace('kenney-thick', 'url(./img/kenney-thick.ttf)');
let kenney = new FontFace('kenney', 'url(./img/kenney.ttf)');
document.fonts.add(kenneyThick);
document.fonts.add(kenney);

// Set up all the global joystick images
joystickCanvas.width = 400;
joystickCanvas.height = 213;
let upImg = new Image();
upImg.src = './img/joystickup.png';
let downImg = new Image();
downImg.src = './img/joystickdown.png';
let leftImg = new Image();
leftImg.src = './img/joystickleft.png';
let rightImg = new Image();
rightImg.src = './img/joystickright.png';
let normalImg = new Image();
normalImg.src = './img/joysticknormal.png';
joystickCtx.drawImage(normalImg, 400, 100);


window.addEventListener('keydown', handleKeyPress);

// Game constructor
function Game(canvas, context, textColor) {
  this.canvas = canvas;
  this.context = context;
  this.textColor = textColor;
}

// Game Object constructor for all on sreen game objects
// e.g. SnakeSegment and SnakeFood inherit from this.
function GameObject(context, x, y, vx, vy) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.collision = false;
}

// Logic to control global keypresses for switching states
function handleKeyPress(event) {
  let key = event.key.toLowerCase();
  drawJoystick(key);
  // stops browser scroll
  if (key === 'arrowup' ||
    key === 'arrowdown' ||
    key === 'arrowleft' ||
    key === 'arrowright' ||
    key === ' ') {
    event.preventDefault();
  }
  switch (state) {
    case 'menu':
      if (key === '1') state = 'directions';
      break;
    case 'directions':
      if (key === ' ') {
        snakeGame.setData();
        snakeGame.newGame();
        state = 'snake';
      } else if (key === 'escape') {
        state = 'menu';
      }
      break;
    case 'paused':
      if (key === 'escape') {
        state = 'menu';
      } else if (key === 'p' || key === ' ') {
        state = 'snake';
      }
      break;
    case 'snake':
      if (key === 'p' || key === 'escape') {
        state = 'paused';
      } else {
        // limits the keys that can be the snakeGame.activeKey
        for (let i = 0; i < snakeGame.allowedKeys.length; i++) {
          if (key === snakeGame.allowedKeys[i]) {
            snakeGame.activeKey = key;
          }
        }
      }
      break;
    // a little extra logic here for initials
    case 'highScore':
      if (snakeGame.initials.length < 3 && isValidLetter(key)) {
        snakeGame.initials += key.toUpperCase();
      } else {
        if (key === 'enter') {
          setNewHighScore(snakeGame.initials, snakeGame.score);
          state = 'showHighScore';
        }
      }
      break;
    case 'showHighScore':
      if (key === ' ') state = 'menu';
      if (key === 'enter') state = 'menu';
      if (key === 'escape') state = 'menu';
      break;
    case 'noHighScore':
      if (key === ' ') state = 'directions';
      if (key === 'escape') state = 'menu';
      break;
    default:
      break;
  }
}

// Swaps the image for the joystick depending on the key
// this function is called inside the global handleKeyPress
// and takes a tolowercase(ed) event.key as a parameter
function drawJoystick(key) {
  joystickCtx.clearRect(0, 0, joystickCanvas.width, joystickCanvas.height);
  switch (key) {
    case 'arrowup':
      joystickCtx.drawImage(upImg, 0, 0);
      break;
    case 'arrowdown':
      joystickCtx.drawImage(downImg, 0, 0);
      break;
    case 'arrowleft':
      joystickCtx.drawImage(leftImg, 0, 0);
      break;
    case 'arrowright':
      joystickCtx.drawImage(rightImg, 0, 0);
      break;
    case 'w':
      joystickCtx.drawImage(upImg, 0, 0);
      break;
    case 's':
      joystickCtx.drawImage(downImg, 0, 0);
      break;
    case 'a':
      joystickCtx.drawImage(leftImg, 0, 0);
      break;
    case 'd':
      joystickCtx.drawImage(rightImg, 0, 0);
      break;
    default:
      joystickCtx.drawImage(normalImg, 0, 0);
      break;
  }
}

// Limits the highscore to only alpha
function isValidLetter(letter) {
  let valid = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  if (valid.includes(letter.toUpperCase())) {
    return true;
  }
  return false;
}

// Drawing functions for static text on background color screens
function drawMainMenu() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#30f0af';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = '#187856';
  ctx.fillText('Mini', 175, 100);
  ctx.fillText('Arcade', 100, 180);
  ctx.font = '70px kenney';
  ctx.fillText('PRESS 1 FOR SNAKE', 110, 300);
  ctx.fillText('PRESS 2 COMING SOON', 80, 350);
}

function drawSnakeDirections() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = '#99932e';
  ctx.fillText('Snake', 125, 100);
  ctx.font = '70px kenney';
  ctx.fillText('MOVE WITH WASD OR ARROWS', 10, 300);
  ctx.fillText('SPACEBAR TO CONTINUE', 60, 350);
}

function drawPauseMenu() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#22210f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillText('PAUSED', 90, 100);
  ctx.font = '70px kenney';
  ctx.fillText('SPACEBAR TO CONTINUE', 60, 300);
  ctx.fillText('ESC TO QUIT', 165, 350);
}
function drawYesHighScore() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#22210f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillText('HIGH', 160, 100);
  ctx.fillText('SCORE', 115, 180);
  ctx.font = '70px kenney';
  ctx.fillText('ENTER INITIALS', 145, 250);
  ctx.font = 'bold 105px kenney-thick';
  ctx.fillText(snakeGame.initials, 145, 390);
}
function drawHightScoreList() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#22210f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillText('HIGH', 160, 100);
  ctx.fillText('SCORE', 115, 180);
  ctx.font = '70px kenney';
  for (let i = 0; i < HighScore.all.length; i++) {
    ctx.fillText(HighScore.all[i].initial.toUpperCase(), 110, 240 + i * 45);
    ctx.fillText(HighScore.all[i].score, 365, 240 + i * 45);
  }
}
function drawNoHighScore() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#22210f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillText('Game', 165, 100);
  ctx.fillText('Over', 165, 180);
  ctx.font = '70px kenney';
  ctx.fillText('SPACEBAR TO CONTINUE', 60, 350);
}

// Lil helper functions for getting even/odd
function isOdd(num) {
  if (num % 2 !== 0) {
    return true;
  }
  return false;
}
function isEven(num) {
  if (num % 2 === 0) {
    return true;
  }
  return false;
}

// Returns true if points is higher than any of the entries in HighScore.all
function isNewHighScore(points) {
  for (let i = 0; i < HighScore.all.length; i++) {
    if (points > HighScore.all[i].score) {
      return true;
    }
  }
  return false;
}

// Saves a highscore to localstorage
function setNewHighScore(newInitial, newScore) {
  for (let i = 0; i < HighScore.all.length; i++) {
    if (newScore > HighScore.all[i].score) {
      HighScore.all[i].initial = newInitial;
      HighScore.all[i].score = newScore;
      saveToLocalStorage(HighScore.all);
      return 0;
    }
  }
}

// This is the main loop of the with a switch on states
// controlled by keyboard events in handleKeyPress()
function appLoop(timestamp) {
  if (!previousTimeStamp) {
    previousTimeStamp = timestamp;
  }
  // Draws the initial joystick normal view hopefully at least once before we get keyboard input
  if (previousTimeStamp > 0 && previousTimeStamp < 500) {
    joystickCtx.drawImage(normalImg, 0, 0);
  }

  previousTimeStamp = timestamp;

  switch (state) {
    case 'menu':
      drawMainMenu();
      window.requestAnimationFrame(appLoop);
      break;
    case 'snake':
      setTimeout(function () {
        gameLoop();
        requestAnimationFrame(appLoop);
      }, 1000 / 5);
      break;
    case 'directions':
      drawSnakeDirections();
      window.requestAnimationFrame(appLoop);
      break;
    case 'paused':
      drawPauseMenu();
      window.requestAnimationFrame(appLoop);
      break;
    case 'gameOver':
      if (isNewHighScore(snakeGame.score)) {
        state = 'highScore';
        let sound = new Audio('./audio/new-highscore.ogg');
        sound.volume = 0.30;
        // Adds a delay to the highScore so it doesn't play over the death sound.
        setTimeout(function () {
          sound.play();
        }, 1000);
        window.requestAnimationFrame(appLoop);
      } else {
        state = 'noHighScore';
        window.requestAnimationFrame(appLoop);
      }
      break;
    case 'highScore':
      drawYesHighScore();
      window.requestAnimationFrame(appLoop);
      break;
    case 'noHighScore':
      drawNoHighScore();
      window.requestAnimationFrame(appLoop);
      break;
    case 'showHighScore':
      drawHightScoreList();
      window.requestAnimationFrame(appLoop);
      break;
    default:
      window.requestAnimationFrame(appLoop);
  }
}

// Starts appLoop as soon as the joystick image is loaded.
// This is the entry point into the game loop
normalImg.onload = window.requestAnimationFrame(appLoop);

