import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';

const GROUND_KEY = 'ground';
const DUDE_KEY = 'dude';
const STAR_KEY = 'star';

const GAME_WIDTH = 640;
const GAME_HEIGHT = 960;

export default class GameScene extends Phaser.Scene {
  backgroundScene;
  playerLeft = false;
  playerRight = false;
  playerJump = false;
	constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
    this.layer = undefined;
    this.buttons = undefined;
	}

  create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    this.parent = new Phaser.Structs.Size(width, height);
    this.sizer = new Phaser.Structs.Size(GAME_WIDTH, GAME_HEIGHT, Phaser.Structs.Size.FIT, this.parent);

    this.parent.setSize(width, height);
    this.sizer.setSize(width, height);
      
    this.backgroundScene = this.scene.get('background-scene');
    this.updateCamera();
    
    this.scale.on('resize', this.resize, this);
         
    this.physics.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const stars = this.createStars();
    this.scoreLabel = this.createScoreLabel(16, 16, 0);
    this.buttons = this.createButtons();

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(this.player, stars, this.collectStar, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.pointer = this.input.activePointer;
    
    this.buttons.leftButton.setInteractive();
    this.buttons.leftButton.on('pointerdown', () => { this.playerLeft = true });
    this.buttons.leftButton.on('pointerup', () => { this.playerLeft = false });
    this.buttons.rightButton.setInteractive();
    this.buttons.rightButton.on('pointerdown', () => { this.playerRight = true });
    this.buttons.rightButton.on('pointerup', () => { this.playerRight = false });
    this.buttons.jumpButton.setInteractive();
    this.buttons.jumpButton.on('pointerdown', () => { this.playerJump = true })
    this.buttons.jumpButton.on('pointerup', () => { this.playerJump = false });

  }

   update() {
     if(this.cursors.left.isDown || this.playerLeft) {
       this.player.setVelocityX(-160);
       this.player.anims.play('left', true);
     } else if(this.cursors.right.isDown || this.playerRight) {
       this.player.setVelocityX(160);
       this.player.anims.play('right', true);
     } else {
       this.player.setVelocityX(0);
       this.player.anims.play('turn');
     }

     if(this.cursors.up.isDown && this.player.body.touching.down) {
       this.player.setVelocityX(-330);
     }

     if((this.cursors.space.isDown || this.playerJump) && this.player.body.bottom) {
      this.player.setVelocityY(-250);
     }
   }

   createPlatforms() {
     const platforms = this.physics.add.staticGroup();

     platforms.create(320, 944, GROUND_KEY).setDisplaySize(640, 32).refreshBody();

     platforms.create(750, 220, GROUND_KEY);
     platforms.create(50, 250, GROUND_KEY);
     platforms.create(600, 400, GROUND_KEY);
     platforms.create(320, 520, GROUND_KEY).setScale(0.3, 1).refreshBody();
     platforms.create(50, 650, GROUND_KEY);
     platforms.create(600, 780, GROUND_KEY);
     return platforms;
   }

   createPlayer() {
     const player = this.physics.add.sprite(100, 450, DUDE_KEY);
     player.setBounce(0.2);
     player.setCollideWorldBounds(true);

     this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
     });

     this.anims.create({
			key: 'turn',
			frames: [{ key: DUDE_KEY, frame: 4 }],
			frameRate: 20
    })
    
    this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1
    })
    
    return player;
   }

   createStars() {
     const stars = this.physics.add.group({
       key: STAR_KEY,
       repeat: 11,
       setXY: { x:12, y: 0, stepX: 70 }
     })

     stars.children.iterate((child) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })
    return stars;
   }

   collectStar(player, star) {
     star.disableBody(true, true);
     this.scoreLabel.add(10);
   }

   createScoreLabel(x, y, score) {
     const style = { fontSize: '32px', fill: '#000' };
     const label = new ScoreLabel(this, x, y, score, style);
     this.add.existing(label);
     return label;
   }

   createButtons() {
    const leftButton = this.add.sprite(GAME_WIDTH - 600, GAME_HEIGHT - 100, 'buttonhorizontal')
    const rightButton = this.add.sprite(GAME_WIDTH - 480, GAME_HEIGHT - 100, 'buttonhorizontal');
    const jumpButton = this.add.sprite(GAME_WIDTH - 100, GAME_HEIGHT - 100, 'buttonjump')
    const buttons = { leftButton, rightButton, jumpButton};
    return buttons;
   }

   resize (gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    this.parent.setSize(width, height);
    this.sizer.setSize(width, height);

    this.updateCamera();
   }

   updateCamera () {
    const camera = this.cameras.main;

    const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5);
    const y = 0;
    const scaleX = this.sizer.width / GAME_WIDTH;
    const scaleY = this.sizer.height / GAME_HEIGHT;

    camera.setViewport(x, y, this.sizer.width, this.sizer.height);
    camera.setZoom(Math.max(scaleX, scaleY));
    camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2);

    this.backgroundScene.updateCamera();
   }

   getZoom () {
    return this.cameras.main.zoom;
   }
}
