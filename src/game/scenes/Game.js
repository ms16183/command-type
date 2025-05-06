import { Scene } from 'phaser';

export class Game extends Scene {

  // コマンドを画面に表示するtextオブジェクトのリスト
  commands = [];
  // 問題の対象であるtextオブジェクト
  currentCommand = null;
  // 問題番号
  commandIndex = 0;
  // 入力するコマンド
  modelCommand = '';
  // ユーザが入力したコマンド
  typedCommand = '';
  // タイマー(開始は初めてのキー入力)
  timedEvent = null;
  // カウンター
  timerCount = 0;
  // 制限時間
  expire = 0;
  // 正しい入力数
  correctLetter = 0;
  // 誤った入力数
  incorrectLetter = 0;
  // JSON→Array
  descList = [];
  inputList = [];
  outputList = [];
  rootList = [];

  constructor() {
    super('Game');
  }

  init() {
    const stage = this.cache.json.get("stage");
    this.descList = stage.commands.map(command => command.description);
    this.inputList = stage.commands.map(command => command.input);
    this.outputList = stage.commands.map(command => command.output);
    this.rootList = stage.commands.map(command => command.root);

    this.expire = stage.expire;
  }

  create() {

    // カメラ位置
    this.cameras.main.setBackgroundColor(0x000000);
    // 背景画像
    this.add.image(this.game.config.width/2, this.game.config.height/2, 'background');
    // 外部ファイルからロードしたコマンドリストをBBCode形式のリストに変換
    this.commands = [];
    for (let i = 0; i < this.inputList.length; i++){
      this.commands.push(
        this.add.rexBBCodeText(
          this.game.config.width * 0.05,
          this.game.config.height * 0.5 + i * 150,
          this.decoratePrompt(this.inputList[i], this.rootList[i]),
          {
            fontFamily: 'Consolas',
            fontSize: 36,
            resolution: 3,
            color: '#737994',
            stroke: '#000000',
            strokeThickness: 16,
            align: 'left',
          }
        ).setOrigin(0.0, 0.5)
      );
    }
    // upタイマーテキスト
    this.timerText = this.add.text(10, 5, 'time: 0', {
        fontFamily: 'Roboto Mono',
        fontSize: 16,
        color: '#c6d0f5',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center',
    }).setOrigin(0.0);

    // 入力対象のコマンドにリストの先頭から取り出す
    this.commandIndex = 0;
    this.currentCommand = this.commands[this.commandIndex];
    this.modelCommand = this.inputList[this.commandIndex];
    this.typedCommand = '';

    // キー入力
    this.input.keyboard.on('keydown', event => {

      // キーが始めて入力されたとき，タイマー開始
      if (this.timedEvent === null) {
        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: this.updateText,
          callbackScope: this,
          loop: true
        });
      }

      // Enterで判定
      if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.ENTER) {
        // 完全一致の場合
        if (this.typedCommand === this.modelCommand) {
          // 出力結果を表示
          this.currentCommand.appendText(this.outputList[this.commandIndex], true);
          // 次の例文へ
          this.commandIndex += 1;
          // 例文が残っている場合
          if (this.commandIndex < this.commands.length) {
            this.currentCommand = this.commands[this.commandIndex];
            this.modelCommand = this.inputList[this.commandIndex];
            this.typedCommand = '';

            // 上昇アニメーション
            for (let i = 0; i < this.commands.length; i++) {
              this.tweens.add({
                targets: this.commands[i],
                y: this.commands[i].y - 150,
                duration: 100,
                ease: 'Power2',
              })
            }
          }
          // 全ての例文の入力が完了した場合
          else if (this.commandIndex >= this.commands.length) {
            this.scene.start('GameOver', { time: this.timerCount, correct: 0, incorrect: 0});
          }
        }
        // 不一致の場合は振動アニメーション
        else {
          this.cameras.main.shake(300, 0.005);
        }
      }
      // Backspaceで削除範囲を超えないように調整
      else if (event.keyCode == Phaser.Input.Keyboard.KeyCodes.BACKSPACE) {
        if (this.typedCommand.length > 0) {
          this.typedCommand = this.typedCommand.substring(0, this.typedCommand.length - 1);
        }
      }
      // その他文字
      else if(this.isAlpha(event.keyCode) || this.isNumeric(event.keyCode) || this.isSymbol(event.keyCode)) {
        if(this.typedCommand.length < this.modelCommand.length){
          this.typedCommand += event.key;
        }
      }

      // 正しい入力数と異なる文字数を集計
      this.correctLetter = 0;
      this.incorrectLetter = 0;
      // textオブジェクトのテキストを初期化
      this.currentCommand.setText(this.decoratePrompt('', this.rootList[this.commandIndex]));
      // ユーザの入力した各文字と例文の各文字列を比較して
      for (let i = 0; i < this.modelCommand.length; i++){
        // 未入力の文字の場合
        if (i >= this.typedCommand.length) {
          this.currentCommand.appendText(`[color=#c6d0f5]${this.modelCommand[i]}[/color]`, false);
        }
        // 正しい文字の場合
        else if (this.typedCommand[i] === this.modelCommand[i]) {
          this.currentCommand.appendText(`[color=#81c8be]${this.typedCommand[i]}[/color]`, false);
        }
        // 異なる文字の場合
        else {
          // 誤入力のスペースを色で表示できないので，'␣'として表示
          this.currentCommand.appendText(`[color=#e78284]${this.decorateSpace(this.typedCommand[i])}[/color]`, false);
        }
      }
      //console.log(this.typedCommand);
    });
  }

  update() {
  }

  // タイマーカウント
  updateText() {
    this.timerCount += 1;
    this.timerText.setText(`time: ${this.timerCount}`);

    if (this.expire - this.timerCount < 0) {
      this.scene.start('GameOver', { time: this.timerCount, correct: 0, incorrect: 0});
    }
  }

  decoratePrompt(command, isRoot = false) {
    prompt = isRoot ? '#' : '$';
    return prompt + ' ' + command;
  }

  decorateSpace(command) {
    return command.replace(/ /g, '␣');
  }

  isNumeric(keyCode) {
    // 0
    if (keyCode == Phaser.Input.Keyboard.KeyCodes.ZERO) {
      return true;
    }
    // 1~9
    if (keyCode >= Phaser.Input.Keyboard.KeyCodes.ONE && keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) {
      return true;
    }
    return false;
  }

  isAlpha(keyCode) {
    // A~Z
    if (keyCode >= Phaser.Input.Keyboard.KeyCodes.A && keyCode <= Phaser.Input.Keyboard.KeyCodes.Z) {
      return true;
    }
    return false;
  }

  isSymbol(keyCode) {
    if (keyCode == Phaser.Input.Keyboard.KeyCodes.SPACE || keyCode == Phaser.Input.Keyboard.KeyCodes.SEMICOLON ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.PLUS || keyCode == Phaser.Input.Keyboard.KeyCodes.COMMA ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.MINUS || keyCode == Phaser.Input.Keyboard.KeyCodes.PERIOD ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.FORWARD_SLASH || keyCode == Phaser.Input.Keyboard.KeyCodes.BACK_SLASH ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.QUOTES || keyCode == Phaser.Input.Keyboard.KeyCodes.BACKTICK ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET || keyCode == Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.SEMICOLON_FIREFOX || keyCode == Phaser.Input.Keyboard.KeyCodes.COLON ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.COLON_FIREFOX || keyCode == Phaser.Input.Keyboard.KeyCodes.BRACKET_RIGHT_FIREFOX ||
      keyCode == Phaser.Input.Keyboard.KeyCodes.BRACKET_LEFT_FIREFOX || keyCode == Phaser.Input.Keyboard.KeyCodes.ZERO) {
      return true;
    }
    return false;
  }
}
