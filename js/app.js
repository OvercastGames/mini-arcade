'use strict';

let canvas = document.getElementById('snake');
let ctx = canvas.getContext('2d');
let snakeGame = new Game(canvas, ctx);
let previousTimeStamp;
let state = 'menu';

window.addEventListener('keydown', handleKeyPress);

function Game(canvas, context) {
  this.canvas = canvas;
  this.context = context;
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
    } else if (key === ' ') {
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
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('Mini', 200, 100);
  ctx.fillText('Arcade', 160, 170);
  ctx.font = '40px monospace';
  ctx.fillText('Press 1 For Snake', 65, 300);
  ctx.fillText('Press 2 Coming Soon', 65, 350);
}

function drawSnakeDirections() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('Snake', 200, 100);
  ctx.font = '40px monospace';
  ctx.fillText('Move with WASD or arrows.', 0, 300);
  ctx.fillText('Spacebar to continue.', 0, 350);
}

function drawPauseMenu() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('Paused', 240, 100);
  ctx.font = '40px monospace';
  ctx.fillText('Press spacebar to continue.', 0, 200);
  ctx.fillText('Press esc to quit.', 0, 300);
}
function drawYesHighScore() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('High Score!', 75, 100);
  ctx.font = '40px monospace';
  ctx.fillText('Enter Initials', 115, 200);
  ctx.font = 'bold 120px monospace';
  ctx.fillText(snakeGame.initials, 170, 370);
}
function drawHightScoreList() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('HIGH SCORE', 70, 100);
  ctx.font = '40px monospace';
  for (let i = 0; i < HighScore.all.length; i++) {
    ctx.fillText(HighScore.all[i].initial.toUpperCase(), 70, 200 + i * 45);
    ctx.fillText(HighScore.all[i].score, 390, 200 + i * 45);
  }

}
function drawNoHighScore() {
  canvas.width = 600;
  canvas.height = 440;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 70px monospace';
  ctx.fillStyle = 'green';
  ctx.fillText('Game Over', 95, 100);
  ctx.font = '40px monospace';
  ctx.fillText('Spacebar to continue.', 30, 200);
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
  console.log(state);
  if (previousTimeStamp === undefined) {
    previousTimeStamp = timestamp;
  }

  if (state === 'menu') {
    drawMainMenu();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else if (state === 'snake') {
    previousTimeStamp = timestamp;
    setTimeout(function () {
      gameLoop();
      requestAnimationFrame(appLoop);
    }, 1000 / 5);
  } else if (state === 'directions') {
    drawSnakeDirections();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else if (state === 'paused') {
    drawPauseMenu();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else if (state === 'gameOver') {
    if (isNewHighScore(snakeGame.score)) {
      // do modal popup and adjust highscore list in localstorage
      state = 'highScore';
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(appLoop);
    } else {
      state = 'noHighScore';
      previousTimeStamp = timestamp;
      window.requestAnimationFrame(appLoop);
    }
    // if not we go display game over
    // and then go to main menu

    // check localstorage for highscore stuff
    // check
  } else if (state === 'highScore') {
    drawYesHighScore();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else if (state === 'noHighScore') {
    drawNoHighScore();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else if (state === 'showHighScore') {
    drawHightScoreList();
    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);
  } else {

    previousTimeStamp = timestamp;
    window.requestAnimationFrame(appLoop);

  }
}

window.requestAnimationFrame(appLoop);
