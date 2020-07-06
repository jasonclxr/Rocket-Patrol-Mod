class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    createClock() {
        if (this.clock != undefined) {
            this.clock.destroy();
            this.clock.remove([false]);
        }
        this.clock = this.time.delayedCall(game.settings.playTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'UP to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', { frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9 });
    }

    create() {
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //add rocket (p1)

        this.p1Rocket = new Rocket(this, game.config.width / 4 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        // add spacehships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30, 3).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20, 2).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width + 0, 260, 'spaceship', 0, 10, 1).setOrigin(0, 0);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });

        this.p1Score = 0;
        this.p2Score = 0;
        this.p1scoreLeft = this.add.text(69, 54, "P1: " + this.p1Score, scoreConfig);
        this.p2scoreLeft = this.add.text(210, 54, "P2: " + this.p2Score, scoreConfig);
        scoreConfig.align = 'left';
        scoreConfig.fixedWidth = 100;
        this.timeLeft = this.add.text(470, 54, this.p1Score, scoreConfig);

        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        
        this.createClock();

        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }

    update() {
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.scene.restart(this.p1Score);
        }
        let time = Math.floor((game.settings.playTimer - this.clock.getElapsed()) / 1000);
        this.timeLeft.text = "T: " + time;

        if (time == 30) {
            if (game.settings.spaceshipSpeed == 4) {
                game.settings.spaceshipSpeed = 5;
            } else if (game.settings.spaceshipSpeed == 2){
                game.settings.spaceshipSpeed = 3;
            }
        }

        this.starfield.tilePositionX -= 4;

        this.p1Rocket.update();

        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);  
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);  
        }

        if (!this.gameOver) {
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        this.sound.play('sfx_explosion');

        

        if (!this.p1Rocket.playerMode) {
            this.p1Score += ship.points;
            this.p1scoreLeft.text = "P1: " + this.p1Score;
        } else {
            this.p2Score += ship.points;
            this.p2scoreLeft.text = "P2: " + this.p2Score;
        }
        game.settings.playTimer += ship.timeBoost- this.clock.getElapsed();
        this.createClock();
    }

}