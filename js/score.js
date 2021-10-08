'use strict';

let initalsListEl = document.getElementById('initial-ol');
let scoreListEl = document.getElementById('score-ol');

for (let i = 0; i < HighScore.all.length; i++) {
  let initalEl = document.querySelector(`#initial-ol li:nth-child(${i + 1})`);
  let scoreEl = document.querySelector(`#score-ol li:nth-child(${i + 1})`);
  initalEl.textContent = HighScore.all[i].initial;
  scoreEl.textContent = HighScore.all[i].score;
}

