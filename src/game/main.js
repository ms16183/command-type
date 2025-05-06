import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Credit } from './scenes/Credit';
import { Preloader } from './scenes/Preloader';
import { Game } from 'phaser';

import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    resolution: window.devicePixelRatio,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    plugins: {
        global: [{
            key: 'rexBBCodeTextPlugin',
            plugin: BBCodeTextPlugin,
            start: true
        },
      ]
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Credit,
        MainGame,
        GameOver
    ],
    version: 0.1,
};

const StartGame = (parent) => {

    return new Game({ ...config, parent });

}


export default StartGame;
