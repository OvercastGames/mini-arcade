'use strict';

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
