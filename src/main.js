let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
}

let game = new Phaser.Game(config);

let keyQ, keyLEFT, keyRIGHT, keyP;

game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    playTimer: 60000
}

let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 125

}