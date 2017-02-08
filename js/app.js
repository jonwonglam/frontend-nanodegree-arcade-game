// Canvas Properties
var canvasWidth = 505,
    canvasHeight = 606;

// Sprite Size Properties
var spriteWidth = 101,
    spriteHeight = 83;

/* Gameinfo object holds any properties relevent to the game.
 * In this case points is used to store the number of points
 * a player has.
 */
var GameInfo = function() {
    this.points = 0;
};

GameInfo.prototype.addPoints = function(points) {
    this.points += points;
};

GameInfo.prototype.resetPoints = function() {
    this.points = 0;
}

GameInfo.prototype.render = function() {
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Points: " + this.points, 10, 30);
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
    this.y = -30 + spriteHeight * col;
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
    if (this.x < canvasWidth) {
        this.x += dt * this.speed;
    } else {
        this.x = -100 - Math.random() * 200;
        this.speed = 50 + Math.random() * 200 + gameInfo.points / 50;
    }

    // Check for collision with player, if so then set isDead flag to true
    // which is checked by checkGameOver().
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
    this.x = spriteWidth * 2;
    this.y = -30 + spriteHeight * 5;
    this.width = 60;
    this.height = 40;
    this.offsetX = 20;
    this.offsetY = 100;
    this.isDead = false;
};

Player.prototype.update = function() {

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
                this.x -= spriteWidth;
            }
            break;

        case 'right':
            if (this.x < canvasWidth - spriteWidth) {
                this.x += spriteWidth;
            }
            break;

        case 'up':
            if (this.y > 0) {
                this.y -= spriteHeight;
            }
            break;

        case 'down':
            if (this.y < canvasHeight - spriteHeight * 3) {
                this.y += spriteHeight;
            }
            break;
    }
};

// Instantiate Enemy and Player objects in global scope.
var allEnemies = [];
var player = new Player();

var gameInfo = new GameInfo();

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

// This is called in reset() to reset the starting position of the player
// and reset the isDead flag.
var setupPlayer = function(player) {
    player.x = spriteWidth * 2;
    player.y = -30 + spriteHeight * 5;
    player.isDead = false;
};

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
