import { Scene } from 'phaser';

export class MainMenu extends Scene
{
  constructor ()
  {
      super('MainMenu');
  }

  create ()
  {
    this.add.image(this.game.config.width/2, 384, 'background');
    let logo = this.add.image(this.game.config.width/2, -260, 'logo');
    let text = this.add.text(this.game.config.width/2, -100, '', {
        fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
        stroke: '#000000', strokeThickness: 8,
        align: 'left',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: logo,
      y: 300,
      ease: 'back.out',
      delay: 500,
      duration: 1000,
    });
    this.tweens.add({
      targets: text,
      y: 460,
      ease: 'back.out',
      delay: 500,
      duration: 1000,
    });

    let stage = this.cache.json.get("stage");
    text.setText("Space -『"+stage.title+"』をプレイ\nTab - クレジット");
    this.input.keyboard.on("keydown", (event) => {

      if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE) {
        this.scene.start("Game");
        return;
      }
      if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.TAB) {
        this.scene.start("Credit");
        return;
      }
    });
  }
}
