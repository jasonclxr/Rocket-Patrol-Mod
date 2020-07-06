// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, timeValue) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.points = pointValue;
        this.timeBoost = timeValue*1000;
    }

    update() {
        this.x -= game.settings.spaceshipSpeed;
        if (this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}