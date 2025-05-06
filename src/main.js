import StartGame from "./game/main";

/*
document.addEventListener('DOMContentLoaded', () => {

  StartGame('game-container');

});
*/

// inputから例文を取得
const jsonFileInput = document.getElementById("jsonfile");
jsonFileInput.addEventListener("change", (event) => {
  const jsonFile = event.target.files[0];
  let jsonData = null;
  if (jsonFile) {
    console.log(`uploaded ${jsonFile.name}`);

    // JSONファイルの中身をロード
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log("onload");
      try {
        // ロード
        jsonData = JSON.parse(event.target.result);
        console.log(jsonData);
        // windowでグローバル変数として保存 TODO: 要改善
        window.stageData = jsonData;
        StartGame("game-container");
      } catch (error) {
        console.error(error);
      }
    };
    reader.onerror = (event) => {
      console.error(error);
    };
    // JSONファイルの中身をロードする(onloadが実行)
    reader.readAsText(jsonFile);

    // 例文を取得したら，Phaser3を実行するスクリプトをロード
    /*
    const script = document.createElement("script");
    script.type = "module";
    script.src = "src/main.js";
    script.onload = () => {
      console.log("Phaser3 loaded.");
    };
    script.onerror = () => {
      console.log("Phser3 load failed.");
    };
    document.body.appendChild(script);
    */
    // inputを削除
    jsonFileInput.parentNode.removeChild(jsonFileInput);
  }
});
// JSONファイルをアップロードしてから開始するため，DOMContentLoadedでLitenerを仕掛けずロード
//StartGame("game-container");
