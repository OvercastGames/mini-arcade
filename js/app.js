'use strict';

const kenneyThick = new FontFace('kenney-thick', 'url(./img/kenney-thick.ttf)');
const kenney = new FontFace('kenney', 'url(./img/kenney.ttf)');
document.fonts.add(kenneyThick);
document.fonts.add(kenney);
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

function App() {
  this.gameCanvas = document.getElementById('game');
  this.gameCtx = this.gameCanvas.getContext('2d');
  this.gameCanvas.width = 600;
  this.gameCanvas.height = 440;
  this.joystickCanvas = document.getElementById('joystick');
  this.joystickCtx = this.joystickCanvas.getContext('2d');
  this.joystickCanvas.width = 400;
  this.joystickCanvas.height = 213;
  this.previousTimeStamp = null;
  this.state = gameStates.MENU;
  this.menuBackgroundColor = '#30f0af';
  this.menuTextColor = '#187856';
  this.menuFontLarge = 'bold 70px kenney-thick';
  this.menuFontSmall = '70px kenney';
  this.drawMainMenu = function () {
    this.gameCtx.fillStyle = this.menuBackgroundColor;
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    this.gameCtx.textAlign = 'center';
    this.gameCtx.font = this.menuFontLarge;
    this.gameCtx.fillStyle = this.menuTextColor;
    this.gameCtx.fillText('Mini', this.gameCanvas.width / 2, 100);
    this.gameCtx.fillText('Arcade', this.gameCanvas.width / 2, 180);
    this.gameCtx.font = this.menuFontSmall;
    this.gameCtx.fillText('PRESS 1 FOR SNAKE', this.gameCanvas.width / 2, 300);
    this.gameCtx.fillText('PRESS 2 COMING SOON', this.gameCanvas.width / 2, 350);
  };
}

// Set up all the global joystick images
App.prototype.loadJoystick = function () {
  this.joystickImages = {
    upImg: new Image(),
    downImg: new Image(),
    leftImg: new Image(),
    rightImg: new Image(),
    normalImg: new Image(),
  }
  this.joystickImages.upImg.src = './img/joystickup.png';
  this.joystickImages.downImg.src = './img/joystickdown.png';
  this.joystickImages.leftImg.src = './img/joystickleft.png';
  this.joystickImages.rightImg.src = './img/joystickright.png';
  this.joystickImages.normalImg.src = './img/joysticknormal.png';
}

// Game contructor
function Game(title, directions, colors, timeout) {
  this.title = title;
  this.directions = directions;
  this.colors = colors;
  this.timeout = timeout;
  this.score = 0;
  this.initials = '';
  this.setData = function () {};
  this.newGame = function () {};
  this.receiveKeyDown = function () {};
  this.receiveKeyUp = function () {};
  this.updateAll = function () {};
  this.checkAllCollisions = function () {};
  this.drawAll = function () {};
  this.gameLoop = function () {
    this.updateAll();
    this.checkAllCollisions();
    this.drawAll();
  }
};

Game.prototype.drawDirections = function () {
  miniArcade.gameCtx.fillStyle = this.colors.backgroundColor;
  miniArcade.gameCtx.fillRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  miniArcade.gameCtx.textAlign = 'center';
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillStyle = this.colors.textColor;
  miniArcade.gameCtx.fillText(this.title, miniArcade.gameCanvas.width / 2, 100);
  miniArcade.gameCtx.font = miniArcade.menuFontSmall;
  miniArcade.gameCtx.fillText(this.directions, miniArcade.gameCanvas.width / 2, 300);
  miniArcade.gameCtx.fillText('SPACEBAR TO CONTINUE', miniArcade.gameCanvas.width / 2, 350);
}

Game.prototype.drawPauseMenu = function () {
  miniArcade.gameCtx.fillStyle = this.colors.altBackgroundColor;
  miniArcade.gameCtx.fillRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  miniArcade.gameCtx.textAlign = 'center';
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillStyle = this.colors.textColor;
  miniArcade.gameCtx.fillText('PAUSED', miniArcade.gameCanvas.width / 2, 100);
  miniArcade.gameCtx.font = miniArcade.menuFontSmall;
  miniArcade.gameCtx.fillText('SPACEBAR TO CONTINUE', miniArcade.gameCanvas.width / 2, 300);
  miniArcade.gameCtx.fillText('ESC TO QUIT', miniArcade.gameCanvas.width / 2, 350);
}
Game.prototype.drawYesHighScore = function () {
  miniArcade.gameCtx.fillStyle = this.colors.altBackgroundColor;
  miniArcade.gameCtx.fillRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  miniArcade.gameCtx.textAlign = 'center';
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillStyle = this.colors.altTextColor;
  miniArcade.gameCtx.fillText('HIGH', miniArcade.gameCanvas.width / 2, 100);
  miniArcade.gameCtx.fillText('SCORE', miniArcade.gameCanvas.width / 2, 180);
  miniArcade.gameCtx.font = miniArcade.menuFontSmall;
  miniArcade.gameCtx.fillText('ENTER INITIALS', miniArcade.gameCanvas.width / 2, 250);
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillText(this.initials, miniArcade.gameCanvas.width / 2, 390);
}
Game.prototype.drawNoHighScore = function () {
  miniArcade.gameCtx.fillStyle = this.colors.altBackgroundColor;
  miniArcade.gameCtx.fillRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  miniArcade.gameCtx.textAlign = 'center';
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillStyle = this.colors.altTextColor;
  miniArcade.gameCtx.fillText('Game', miniArcade.gameCanvas.width / 2, 100);
  miniArcade.gameCtx.fillText('Over', miniArcade.gameCanvas.width / 2, 180);
  miniArcade.gameCtx.font = miniArcade.menuFontSmall;
  miniArcade.gameCtx.fillText('SPACEBAR TO CONTINUE', miniArcade.gameCanvas.width / 2, 350);
}
Game.prototype.drawHightScoreList = function () {
  miniArcade.gameCtx.fillStyle = this.colors.altBackgroundColor;
  miniArcade.gameCtx.fillRect(0, 0, miniArcade.gameCanvas.width, miniArcade.gameCanvas.height);
  miniArcade.gameCtx.textAlign = 'center';
  miniArcade.gameCtx.font = miniArcade.menuFontLarge;
  miniArcade.gameCtx.fillStyle = this.colors.altTextColor;
  miniArcade.gameCtx.fillText('HIGH', miniArcade.gameCanvas.width / 2, 100);
  miniArcade.gameCtx.fillText('SCORE', miniArcade.gameCanvas.width / 2, 180);
  miniArcade.gameCtx.font = miniArcade.menuFontSmall;
  for (let i = 0; i < HighScore.all.length; i++) {
    miniArcade.gameCtx.fillText(HighScore.all[i].initial.toUpperCase(), miniArcade.gameCanvas.width / 4, 240 + i * 45);
    miniArcade.gameCtx.fillText(HighScore.all[i].score, miniArcade.gameCanvas.width * 0.75, 240 + i * 45);
  }
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

function handleKeyUp() {
  miniArcade.joystickCtx.clearRect(0, 0, miniArcade.joystickCanvas.width, miniArcade.joystickCanvas.height);
  miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.normalImg, 0, 0);
}

// Logic to control global keypresses for switching states
function handleKeyDown(event) {
  let key = event.key;
  drawJoystick(key);
  // stops browser scroll
  if (key === keyPresses.ARROW_UP ||
    key === keyPresses.ARROW_DOWN ||
    key === keyPresses.ARROW_LEFT ||
    key === keyPresses.ARROW_RIGHT ||
    key === keyPresses.SPACE_BAR) {
    event.preventDefault();
  }
  switch (miniArcade.state) {
    case gameStates.MENU:
      if (key === '1') {
        miniArcade.state = gameStates.DIRECTIONS;
        miniArcade.activeGame = snakeGame;
      } else if (key === '2') {
        miniArcade.state = gameStates.DIRECTIONS;
        miniArcade.activeGame = breakoutGame;
      }
      break;
    case gameStates.DIRECTIONS:
      if (key === keyPresses.SPACE_BAR) {
        miniArcade.activeGame.setData();
        miniArcade.activeGame.newGame();
        miniArcade.state = gameStates.GAME;
      } else if (key === keyPresses.ESCAPE) {
        miniArcade.state = keyPresses.MENU;
      }
      break;
    case gameStates.PAUSED:
      if (key === keyPresses.ESCAPE) {
        miniArcade.state = gameStates.MENU;
      } else if (key === keyPresses.P || key === keyPresses.SPACE_BAR) {
        miniArcade.state = gameStates.GAME;
      }
      break;
    case gameStates.GAME:
      if (key === keyPresses.P || key === keyPresses.ESCAPE) {
        miniArcade.state = gameStates.PAUSED;
      } else {
        miniArcade.activeGame.receiveKeyDown(key);
      }
      break;
    // a little extra logic here for initials
    case gameStates.HIGH_SCORE:
      if (miniArcade.activeGame.initials.length < 3 && isValidLetter(key)) {
        miniArcade.activeGame.initials += key.toUpperCase();
      } else {
        if (key === keyPresses.ENTER || key === keyPresses.ESCAPE || key === keyPresses.SPACE_BAR) {
          setNewHighScore(miniArcade.activeGame.initials, miniArcade.activeGame.score);
          miniArcade.state = gameStates.SHOW_HIGH_SCORE;
        }
      }
      break;
    case gameStates.SHOW_HIGH_SCORE:
      if (key === keyPresses.ENTER || key === keyPresses.ESCAPE || key === keyPresses.SPACE_BAR) {
        miniArcade.state = gameStates.MENU;
      }
      break;
    case gameStates.NO_HIGH_SCORE:
      if (key === keyPresses.SPACE_BAR) miniArcade.state = gameStates.DIRECTIONS;
      if (key === keyPresses.ESCAPE) miniArcade.state = gameStates.MENU;
      break;
    default:
      break;
  }
}

// Swaps the image for the joystick depending on the key
// this function is called inside the global handleKeyPress
// and takes a tolowercase(ed) event.key as a parameter
function drawJoystick(key) {
  miniArcade.joystickCtx.clearRect(0, 0, miniArcade.joystickCanvas.width, miniArcade.joystickCanvas.height);
  switch (key) {
    case keyPresses.ARROW_UP:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.upImg, 0, 0);
      break;
    case keyPresses.ARROW_DOWN:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.downImg, 0, 0);
      break;
    case keyPresses.ARROW_LEFT:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.leftImg, 0, 0);
      break;
    case keyPresses.ARROW_RIGHT:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.rightImg, 0, 0);
      break;
    case keyPresses.W:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.upImg, 0, 0);
      break;
    case keyPresses.S:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.downImg, 0, 0);
      break;
    case keyPresses.A:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.leftImg, 0, 0);
      break;
    case keyPresses.D:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.rightImg, 0, 0);
      break;
    default:
      miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.normalImg, 0, 0);
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

// Collision detection logic taken from tutorial AT https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
function rectIntersect(ax, ay, aWidth, aHeight, bx, by, bWidth, bHeight) {
  if (bx > aWidth + ax || ax > bWidth + bx || by > aHeight + ay || ay > bHeight + by) {
    return false;
  }
  return true;
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
  if (!miniArcade.previousTimeStamp) {
    miniArcade.previousTimeStamp = timestamp;
  }
  // Draws the initial joystick normal view hopefully at least once before we get keyboard input
  if (miniArcade.previousTimeStamp > 0 && miniArcade.previousTimeStamp < 500) {
    miniArcade.joystickCtx.drawImage(miniArcade.joystickImages.normalImg, 0, 0);
  }

  miniArcade.previousTimeStamp = timestamp;

  switch (miniArcade.state) {
    case gameStates.MENU:
      miniArcade.drawMainMenu();
      window.requestAnimationFrame(appLoop);
      break;
    case gameStates.DIRECTIONS:
      miniArcade.activeGame.drawDirections();
      window.requestAnimationFrame(appLoop);
      break;
    case gameStates.GAME:
      setTimeout(function () {
        miniArcade.activeGame.gameLoop();
        requestAnimationFrame(appLoop);
      }, miniArcade.activeGame.timeout);
      break;
    case gameStates.PAUSED:
      miniArcade.activeGame.drawPauseMenu();
      window.requestAnimationFrame(appLoop);
      break;
    case gameStates.GAME_OVER:
      if (isNewHighScore(miniArcade.activeGame.score)) {
        miniArcade.state = gameStates.HIGH_SCORE;
        let sound = new Audio('./audio/new-highscore.ogg');
        sound.volume = 0.30;
        // Adds a delay to the highScore so it doesn't play over the death sound.
        setTimeout(function () {
          sound.play();
        }, 1000);
        window.requestAnimationFrame(appLoop);
      } else {
        miniArcade.state = gameStates.NO_HIGH_SCORE;
        window.requestAnimationFrame(appLoop);
      }
      break;
    case gameStates.HIGH_SCORE:
      miniArcade.activeGame.drawYesHighScore();
      window.requestAnimationFrame(appLoop);
      break;
    case gameStates.NO_HIGH_SCORE:
      miniArcade.activeGame.drawNoHighScore();
      window.requestAnimationFrame(appLoop);
      break;
    case gameStates.SHOW_HIGH_SCORE:
      miniArcade.activeGame.drawHightScoreList();
      window.requestAnimationFrame(appLoop);
      break;
    default:
      window.requestAnimationFrame(appLoop);
  }
}

// Create App and load joystick
const miniArcade = new App();
miniArcade.loadJoystick();

// Starts appLoop as soon as the joystick image is loaded.
// This is the entry point into the game loop
miniArcade.joystickImages.normalImg.onload = window.requestAnimationFrame(appLoop);

// Instantiate Games
const snakeGame = new Game(
  'snake',
  'WASD OR ARROWS TO MOVE',
  {
    textColor: '#99932e',
    backgroundColor: '#fff64d',
    altBackgroundColor: '#22210f',
    altTextColor: '#fff64d',
  },
  1000 / 4,
);

const breakoutGame = new Game(
  'breakout',
  'AD OR ARROWS TO MOVE',
  {
    textColor: '#99932e',
    backgroundColor: '#fff64d',
    altBackgroundColor: '#22210f',
    altTextColor: '#fff64d',
  },
  0,
);
