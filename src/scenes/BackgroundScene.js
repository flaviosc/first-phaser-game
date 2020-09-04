import Phaser from 'phaser';

export default class BackgroundScene extends Phaser.Scene {
    gameScene;
    
    constructor() {
        super('background-scene');
    }

    preload(){
        this.load.image('bigsky', 'assets/bigsky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('buttonhorizontal', 'assets/button-horizontal.png', {frameWidth: 96, frameHeight: 64});
        this.load.spritesheet('buttonjump', 'assets/button-round-a.png', {frameWidth: 96, frameHeight: 95});
    }

    create(){
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        const backgroundSky = this.add.image(0, 0, 'bigsky').setOrigin(0, 0);

        this.gameScene = this.scene.get('game-scene');
        this.scene.launch('game-scene');
    }

    updateCamera ()
    {
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        const camera = this.cameras.main;

        const zoom = this.gameScene.getZoom();
        const offset = 120 * zoom;

        camera.setZoom(zoom);
        camera.centerOn(1400 / 2, (1200 / 2) + 120);
    }
}