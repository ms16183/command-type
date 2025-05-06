import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  speedPercentage = 0;
  rank = '';

  init(data) {
    const time = data.time;
    const stage = this.cache.json.get("stage");

    this.speedPercentage = (stage.expire - time) / stage.expire;
    console.log(this.speedPercentage);

  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000);

    this.add.image(512, 384, "background");

    this.rank = '';
    if (this.speedPercentage >= 0.95) {
      this.rank = "S+";
    }
    else if (this.speedPercentage >= 0.85) {
      this.rank = "S";
    }
    else if (this.speedPercentage >= 0.75) {
      this.rank = "A";
    }
    else if (this.speedPercentage >= 0.5) {
      this.rank = "B";
    }
    else {
      this.rank = "C";
    }

    this.add.text(512, 384, `Rank: ${this.rank}`, {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown", (event) => {
      if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE) {
        this.scene.start("MainMenu");
        return;
      }
    });
  }
}
