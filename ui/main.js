import { KantoreGameLevel } from './game-level.js';
import { KantoreGameMain } from './game-main.js';
import { KantoreGamePractice } from './game-practice.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

const EVENTS = $kt.gameUi.eventNames;
const events = $kt.gameUi.events;

const flags = Object.assign({
        showHintOnGameStart: true,
        maxLevelFinished: false
    }, $kt.persistence.getFlags() || {});

$kt.persistence.addFlagsChangedEventListener(event => {
    Object.assign(flags, event.detail);
});

const gameStatus = Object.assign({
        level: 1,
        totalExp: 0,
        currentLevelExp: 0
    }, $kt.persistence.getGameStatus() || {});

$kt.persistence.addGameStatusChangedEventListener(event => {
    Object.assign(gameStatus, event.detail);
});

// If there were new levels added in an update
// since the player last played and finished the game
if (flags.maxLevelFinished && gameStatus.level <= $kt.levels.maxLevel) {
    $kt.persistence.removeGameQuestion();
    flags.maxLevelFinished = false;
    $kt.persistence.setFlags(flags);
}

const gameLevel = new KantoreGameLevel();
const gameMain = new KantoreGameMain(gameLevel, gameStatus);
const gamePractice = new KantoreGamePractice(gameLevel);

let game = gameMain;
$kt.hints.loadKanjidex();
$kt.audio.preloadAudio();
$kt.gameUi.setupLevelHints(gameStatus.level);

events.addEventListener(EVENTS.START, event => {
    const TYPES = $kt.enums.GAME_TYPE;
    const detail = event.detail;
    const gameType = detail.gameType;

    switch(gameType) {
        case TYPES.MAIN:
            game = gameMain;
            gameMain.start();

            if (flags.showHintOnGameStart) {
                // Needs the timeout to work
                setTimeout(() => {
                    $kt.gameUi.showHint();
                    flags.showHintOnGameStart = false;
                    $kt.persistence.setFlags(flags);
                }, 0);
            }
        break;
        case TYPES.PRACTICE: {
            game = gamePractice;
            const { categoryName, dict } = detail;
            gamePractice.start(categoryName, dict);
        } break;
    }

});

events.addEventListener(EVENTS.ANSWER, event => {
    const answer = event.detail.answer;
    game.answer(answer);
});

events.addEventListener(EVENTS.LEVEL_UP_BEFORE, event => {
    const newLevel = event.detail.newLevel;
    if (newLevel > $kt.levels.maxLevel) {
        flags.maxLevelFinished = true;
    }
    flags.showHintOnGameStart = true;
    $kt.persistence.setFlags(flags);
});

events.addEventListener(EVENTS.LEVEL_UP_AFTER, () => {
    game.startNewLevel();
    flags.showHintOnGameStart = false;
    $kt.persistence.setFlags(flags);
});

events.addEventListener(EVENTS.BACK_TO_TITLE, () => {
    game.stopLoadingDict();
});

$kt.ui.hideStartupLoading();