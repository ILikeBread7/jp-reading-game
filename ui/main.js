import { KantoreGameArcade } from './game-arcade.js';
import { KantoreGameLevel } from './game-level.js';
import { KantoreGameMain } from './game-main.js';
import { KantoreGamePractice } from './game-practice.js';
import { ui } from './ui.js';
import { gameUi } from './game-ui.js';
import { settingsUi } from './settings-ui.js';
import { audio } from './audio.js';
import { GAME_TYPE } from './enums.js';
import { KantorePersistence } from './persistence.js';
import { KantoreHints } from './hints.js';
import { KantoreLevels } from './levels.js';
import { titleUi } from './title-ui.js';

audio.initialize();
settingsUi.initialize();
titleUi.initialize();
gameUi.initialize();
ui.initialize();

const EVENTS = gameUi.eventNames;
const events = gameUi.events;

const flags = Object.assign({
        showHintOnGameStart: true,
        maxLevelFinished: false
    }, KantorePersistence.getFlags() || {});

KantorePersistence.addFlagsChangedEventListener(event => {
    Object.assign(flags, event.detail);
});

const gameStatus = Object.assign({
        level: 1,
        totalExp: 0,
        currentLevelExp: 0
    }, KantorePersistence.getGameStatus() || {});

KantorePersistence.addGameStatusChangedEventListener(event => {
    Object.assign(gameStatus, event.detail);
});

// If there were new levels added in an update
// since the player last played and finished the game
if (flags.maxLevelFinished && gameStatus.level <= KantoreLevels.maxLevel) {
    KantorePersistence.removeGameQuestion();
    flags.maxLevelFinished = false;
    KantorePersistence.setFlags(flags);
}

const gameLevel = new KantoreGameLevel();
const gameMain = new KantoreGameMain(gameLevel, gameStatus);
const gamePractice = new KantoreGamePractice(gameLevel);
const gameArcade = new KantoreGameArcade(gameLevel);

let game = gameMain;
KantoreHints.loadKanjidex();
audio.preloadAudio();
gameUi.setupLevelHints(gameStatus.level);

events.addEventListener(EVENTS.START, event => {
    const detail = event.detail;
    const gameType = detail.gameType;

    switch(gameType) {
        case GAME_TYPE.MAIN:
            game = gameMain;
            gameMain.start();

            if (flags.showHintOnGameStart) {
                // Needs the timeout to work
                setTimeout(() => {
                    gameUi.showHint();
                    flags.showHintOnGameStart = false;
                    KantorePersistence.setFlags(flags);
                }, 0);
            }
        break;
        case GAME_TYPE.PRACTICE: {
            game = gamePractice;
            const { categoryName, dict } = detail;
            gamePractice.start(categoryName, dict);
        } break;
        case GAME_TYPE.ARCADE: {
            game = gameArcade;
            const { categoryName, dict } = detail;
            gameArcade.start(categoryName, dict);
        } break;
    }

});

events.addEventListener(EVENTS.ANSWER, event => {
    const answer = event.detail.answer;
    game.answer(answer);
});

events.addEventListener(EVENTS.LEVEL_UP_BEFORE, event => {
    const newLevel = event.detail.newLevel;
    if (newLevel > KantoreLevels.maxLevel) {
        flags.maxLevelFinished = true;
    }
    flags.showHintOnGameStart = true;
    KantorePersistence.setFlags(flags);
});

events.addEventListener(EVENTS.LEVEL_UP_AFTER, () => {
    game.startNewLevel();
    flags.showHintOnGameStart = false;
    KantorePersistence.setFlags(flags);
});

events.addEventListener(EVENTS.BACK_TO_TITLE, () => {
    game.stopLoadingDict();
});

ui.hideStartupLoading();