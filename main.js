var mainState = {
    preload: function () {
        game.load.image('mario', 'assets/mario.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.audio('jump', 'assets/jump.wav'); 
    },

    create: function () {
        // Change the background color of the game to blue
        game.stage.backgroundColor = '#b0b7c1';

        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.jumpSound = game.add.audio('jump'); 

        // Display the bird at the position x=100 and y=245
        this.mario = game.add.sprite(100, 245, 'mario');

        // Create an empty group
        this.walls = game.add.group();

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.mario);

        // Add gravity to the bird to make it fall
        this.mario.body.gravity.y = 1050;

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(
                Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = game.add.text(180, 20, "0",
                {font: "40px Arial", fill: "FF0000"});

        this.timer = game.time.events.loop(1250, this.addRowOfWalls, this);

        this.mario.anchor.setTo(-0.2, 0.5);
    },

    addOneWall: function (x, y) {
        // Create a wall at the position x and y
        var wall = game.add.sprite(x, y, 'wall');

        // Add the pipe to our previously created group
        this.walls.add(wall);

        // Enable physics on the pipe 
        game.physics.arcade.enable(wall);

        // Add velocity to the pipe to make it move left
        wall.body.velocity.x = -200;

        // Automatically kill the pipe when it's no longer visible 
        wall.checkWorldBounds = true;
        wall.outOfBoundsKill = true;
    },

    addRowOfWalls: function () {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 5) + 1;

        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1)
                this.addOneWall(400, i * 60 + 10);

        this.score += 1;
        this.labelScore.text = this.score;
    },

    hitPipe: function () {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.mario.alive == false)
            return;

        // Set the alive property of the bird to false
        this.mario.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.walls.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },

    update: function () {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.mario.y < 0 || this.mario.y > 490)
            this.restartGame();

        game.physics.arcade.overlap(
                this.mario, this.walls, this.hitPipe, null, this);

        if (this.mario.angle < 20)
            this.mario.angle += 1;
    },

    jump: function () {

        if (this.mario.alive == false)
            return;
        
        // Add a vertical velocity to the bird
        this.mario.body.velocity.y = -350;

        // Create an animation on the bird
        var animation = game.add.tween(this.mario);

        // Change the angle of the mario to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);

        // And start the animation
        animation.start();
        
        this.jumpSound.play(); 
    },

    // Restart the game
    restartGame: function () {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');