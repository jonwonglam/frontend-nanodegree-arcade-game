/* Gameinfo object holds any properties relevent to the game.
 */
var GameInfo = function() {
    this.CANVAS_WIDTH = 505;
    this.CANVAS_HEIGHT = 606;
    this.SPRITE_WIDTH = 101;
    this.SPRITE_HEIGHT = 83;
    this.points = 0;
    this.highscore = 0;
    this.secsLeft = 20;
    this.timeNow = Date.now();
    this.lastTime = Date.now();
};

GameInfo.prototype.addPoints = function(points) {
    this.points += points;
};

GameInfo.prototype.addTime = function(secs) {
    this.secsLeft += secs;
};

GameInfo.prototype.reset = function() {
    if (this.points > this.highscore) {
      this.highscore = this.points;
    }
    this.points = 0;
    this.secsLeft = 20;
};

/* This function will update the game time property as well as render
 * the time left. Gets called in the update() function.
 */
GameInfo.prototype.update = function() {
    this.timeNow = Date.now();
    if (this.timeNow - this.lastTime >= 1000) {
      this.secsLeft--;
      this.lastTime = Date.now();
      ctx.fillStyle = "white";
      ctx.fillRect(400, 0, 130, 50);
      ctx.font = "22px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Time: " + this.secsLeft, 400, 30);
    }
};

/* This function renders the points, the default starting time,
 * and the highscore. Gets called in the reset() function.
 */
GameInfo.prototype.render = function() {
    ctx.font = "22px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Points: " + this.points, 10, 30);
    ctx.fillText("Time: " + this.secsLeft, 400, 30);
    ctx.font = "18px Arial";
    ctx.fillText("High Score: " + this.highscore, 190, 27);
};

/* This function is called in the update() function to check whether
 * the player has won, died, or ran out of time.
 */
GameInfo.prototype.checkGameover = function(player) {
    if (player.isDead || this.secsLeft < 0) {
        this.reset();
        reset();
    } else if (player.y < 1) {
        this.addPoints(1000);
        this.addTime(2);
        reset();
    }
};

/* Enemies our player must avoid
 * speed: speed at which the sprite moves each update().
 * x,y: starting position of the sprite.
 * width/height: correspond to the bounding box, used to detect
 * collisions in update().
 * offset: bounding box offset.
 */
var Enemy = function(col) {
    this.sprite = 'images/enemy-bug.png';
    this.speed = 80 + Math.random() * 200;
    this.x = -100 - Math.random() * 300;
    this.y = -30 + gameInfo.SPRITE_HEIGHT * col;
    this.width = 80;
    this.height = 60;
    this.offsetY = 90;
};

/* Call this function to update an enemy's position and check for collisions.
 * If the position is outside the canvas, generate a new starting position and speed.
 * @ Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function(dt) {
    /* Update enemy position.
     * If the object is still crossing the screen, then increase it's x pos.
     * If it's made it across the screen, reset it's position with a faster speed.
     */
    if (this.x < gameInfo.CANVAS_WIDTH) {
        this.x += dt * this.speed;
    } else {
        this.x = -100 - Math.random() * 200;
        this.speed = 50 + Math.random() * 200 + gameInfo.points / 50;
    }
};

/* Check for collision with player, if so then set isDead flag to true
 * which is checked by checkGameOver().
 */
Enemy.prototype.checkCollisions = function() {
    if (this.y + this.offsetY < player.y + player.offsetY &&
        this.y + this.height + this.offsetY > player.y + player.offsetY &&
        this.x < player.x + player.offsetX + player.width &&
        this.x + this.width > player.x + player.offsetX) {
        player.isDead = true;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    /* Uncomment this line to see the enemy's bounding box */
    // ctx.strokeRect(this.x, this.y + this.offsetY, this.width, this.height);
};

/**
 * This is the player object. The x,y properties are used in determining position
 * on the canvas. Width, height, offsetX, and offsetY are used when calculating
 * the bounding box of the player object. The game checks whether a collision
 * has happened by the isDead flag. This is set in the enemy's update() function
 * if a collision has happened.
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = gameInfo.SPRITE_WIDTH * 2;
    this.y = -30 + gameInfo.SPRITE_HEIGHT * 5;
    this.width = 60;
    this.height = 40;
    this.offsetX = 20;
    this.offsetY = 100;
    this.isDead = false;
};

// This is called in reset() to reset the starting position of the player
// and reset the isDead flag.
Player.prototype.setup = function() {
    this.x = gameInfo.SPRITE_WIDTH * 2;
    this.y = -30 + gameInfo.SPRITE_HEIGHT * 5;
    this.isDead = false;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    /* Uncomment this line to see the player's bounding box */
    // ctx.strokeRect(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height);
};

/* handleInput is called in the eventlistener and will process keypresses
 * to move the player.
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x > 0) {
                this.x -= gameInfo.SPRITE_WIDTH;
            }
            break;

        case 'right':
            if (this.x < gameInfo.CANVAS_WIDTH - gameInfo.SPRITE_WIDTH) {
                this.x += gameInfo.SPRITE_WIDTH;
            }
            break;

        case 'up':
            if (this.y > 0) {
                this.y -= gameInfo.SPRITE_HEIGHT;
            }
            break;

        case 'down':
            if (this.y < gameInfo.CANVAS_HEIGHT - gameInfo.SPRITE_HEIGHT * 3) {
                this.y += gameInfo.SPRITE_HEIGHT;
            }
            break;
    }
};

// Instantiate Enemy and Player objects in global scope.
var gameInfo = new GameInfo();
var allEnemies = [];
var player = new Player();


/**
 * Gets called at the beginning of the game to create enemy objects
 * inside the allEnemies array. This array is used to call update()
 * on each of the enemy objects in the game engine.
 */
var generateEnemies = function() {
    allEnemies.push(new Enemy(3));
    allEnemies.push(new Enemy(1));
    allEnemies.push(new Enemy(2));
    allEnemies.push(new Enemy(1));
    allEnemies.push(new Enemy(3));
    allEnemies.push(new Enemy(2));
    allEnemies.push(new Enemy(4));
}();

// This listens for key presses and sends the keys to player.handleInput
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
