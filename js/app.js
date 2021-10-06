'use strict';

let menuCanvas = document.getElementById('menu');
let menuCtx = menuCanvas.getContext('2d');
let snakeCanvas = document.getElementById('snake');
let snakeCtx = snakeCanvas.getContext('2d');
let snakeGame = new Game(snakeCanvas, snakeCtx);

window.addEventListener('keydown', handleMenuKeyPress);

function handleMenuKeyPress(event) {
  if (event.key === '1') {
    snakeGame.setData();
    snakeGame.newGame();
  }
}
menuCanvas.width = 600;
menuCanvas.height = 440;
menuCtx.fillStyle = 'red';
menuCtx.fillRect(0, 0, menuCanvas.width, menuCanvas.height);
menuCtx.font = 'bold 70px monospace';
menuCtx.fillStyle = 'white';
menuCtx.fillText('Mini', 240, 100);
menuCtx.fillText('Arcade', 210, 170);
menuCtx.font = '40px monospace';
menuCtx.fillText('Press 1 for Snake', 0, 300);
menuCtx.fillText('Press 2 for Coming Soon', 0, 400);



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

function appLoop(timeStamp) {
  secondsPassed = (timeStamp - lastTimeStamp) / 1000;
  lastTimeStamp = timeStamp;
  update();

  draw();
  window.requestAnimationFrame(appLoop);
}
