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
}


