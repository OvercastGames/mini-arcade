'use strict';

function HighScore(initial, score) {
  this.initial = initial;
  this.score = score;
  HighScore.all.push(this);
}

HighScore.all = [];

new HighScore('KCS', 900);
new HighScore('KRK', 800);
new HighScore('JSN', 700);
new HighScore('BAM', 600);
new HighScore('MRO', 500);

function saveToLocalStorage(data) {
  localStorage.setItem('scoreBoard', JSON.stringify(data));
}

function getFromLocalStorage() {
  if (localStorage.length > 0) {
    HighScore.all = JSON.parse(localStorage.getItem('scoreBoard'));
  } else {
    saveToLocalStorage(HighScore.all);
  }
}

getFromLocalStorage();

