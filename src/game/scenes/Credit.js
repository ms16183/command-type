import { Scene } from "phaser";

export class Credit extends Scene {
  constructor() {
    super("Credit");
  }

  create() {
    let credit = `Credit
John Doe
`;
    let text = this.add
      .text(512, 300, credit, {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.keyboard.on("keydown", () => {
      this.scene.start("MainMenu");
    });

  }
}
