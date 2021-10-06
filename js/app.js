'use strict';
let gameState = '';
let secondsPassed;
let lastTimeStamp;

window.addEventListener('keydown', handleKeyPress);

function Game(canvas, context, state) {
  this.canvas = canvas;
  this.context = context;
  this.state = 'intro';
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
  if (event.key.toLowerCase() === '0') {
    gameState = 'snake';
  }
  if (event.key.toLowerCase() === 'q') {
    gameState = 'intro';
  }
  for (let i = 0; i < allowedKeys.length; i++) {
    if (event.key.toLowerCase() === allowedKeys[i]) {
      event.preventDefault();
      activeKey = event.key.toLowerCase();
    }
  }
}

let startCanvas = document.getElementById('start');
let startCtx = startCanvas.getContext('2d');
let intro = new Game(startCanvas, startCtx);


function startLoop(timeStamp) {
  console.log('start is running');
  secondsPassed = (timeStamp - lastTimeStamp) / 1000;
  lastTimeStamp = timeStamp;

  switch (gameState) {
  case 'intro':
    intro.canvas.width = 500;
    intro.height = 400;
    intro.context.fillStyle = 'red';
    intro.context.fillRect(0, 0, startCanvas.width, startCanvas.height);
    break;
  case 'start':
    startCtx.clearRect(0, 0, startCanvas.width, startCanvas.height);
    init();
    break;
  default:
    window.requestAnimationFrame(startLoop);
  }

}

startLoop();

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
