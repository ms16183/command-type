import StartGame from './game/main';

/*
document.addEventListener('DOMContentLoaded', () => {

    StartGame('game-container');

});
*/

// JSONファイルをアップロードしてから開始するため，DOMContentLoadedでLitenerを仕掛けずロード
StartGame('game-container');
