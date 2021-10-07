'use strict';

let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');
let snakeGame = new Game(canvas, ctx, '#fff64d');
let previousTimeStamp;
let state = 'menu';
let menuTextColor = '#187856';
let kenneyThick = new FontFace('kenney-thick', 'url(../img/kenney-thick.ttf)');
document.fonts.add(kenneyThick);
let kenney = new FontFace('kenney', 'url(../img/kenney.ttf)');
document.fonts.add(kenney);

window.addEventListener('keydown', handleKeyPress);

function Game(canvas, context, textColor) {
  this.canvas = canvas;
  this.context = context;
  this.textColor = textColor;
}

function GameObject(context, x, y, vx, vy) {
  this.context = context;
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.collision = false;
}

function handleKeyPress(event) {
  let key = event.key.toLowerCase();
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
    if (key === 'p') {
      state = 'paused';
    } else {
      for (let i = 0; i < snakeGame.allowedKeys.length; i++) {
        if (key === snakeGame.allowedKeys[i]) {
          snakeGame.activeKey = key;
        }
      }
    }
    break;
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
    break;
  case 'noHighScore':
    if (key === ' ') state = 'directions';
    if (key === 'escape') state = 'menu';
    break;
  default:
    break;
  }
}

function isValidLetter(letter) {
  let valid = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  if (valid.includes(letter.toUpperCase())) {
    return true;
  }
  return false;
}

function drawMainMenu() {

  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#30f0af';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = menuTextColor;
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
  ctx.fillText('MOVE WITH WASD OR ARROWS.', 15, 300);
  ctx.fillText('SPACEBAR TO CONTINUE.', 60, 350);
}

function drawPauseMenu() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = '#22210f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px kenney-thick';
  ctx.fillStyle = snakeGame.textColor;
  ctx.fillText('PAUSED', 240, 100);
  ctx.font = '40px kenney';
  ctx.fillText('PRESS SPACEBAR TO CONTINUE.', 0, 200);
  ctx.fillText('PRESS ESC TO QUIT.', 0, 300);
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
  ctx.fillText('SPACEBAR TO CONTINUE.', 60, 350);
}


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

function isNewHighScore(points) {
  for (let i = 0; i < HighScore.all.length; i++) {
    if (points > HighScore.all[i].score) {
      return true;
    }
  }
  return false;
}

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

function appLoop(timestamp) {
  if (previousTimeStamp === undefined) {
    previousTimeStamp = timestamp;
  }

  switch (state) {
  case 'menu':
    drawMainMenu();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  case 'snake':
    previousTimeStamp = timestamp;
    setTimeout(function () {
      gameLoop();
      requestAnimationFrame(appLoop);
    }, 1000 / 5);
    break;
  case 'directions':
    drawSnakeDirections();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  case 'paused':
    drawPauseMenu();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  case 'gameOver':
    if (isNewHighScore(snakeGame.score)) {
      // do modal popup and adjust highscore list in localstorage
      state = 'highScore';
      let sound = new Audio('../audio/new-highscore.ogg');
      setTimeout(function () {
        sound.play();
      }, 1000);
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(appLoop);
    } else {

      state = 'noHighScore';
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(appLoop);
    }
    break;
  case 'highScore':
    drawYesHighScore();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  case 'noHighScore':
    drawNoHighScore();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  case 'showHighScore':
    drawHightScoreList();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
    break;
  default:
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);

  }
}

window.requestAnimationFrame(appLoop);
