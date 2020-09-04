import Phaser from 'phaser'

import GameScene from './scenes/GameScene'
import BackgroundScene from './scenes/BackgroundScene'

const config = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.RESIZE,
		parent: 'game-scene',
        width: 640,
        height: 960,
        min: {
            width: 320,
            height: 480
        },
        max: {
            width: 1400,
            height: 1200
        }
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
	scene: [BackgroundScene, GameScene]
}

export default new Phaser.Game(config)
