'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.gameUi.eventNames;
    const events = $kt.gameUi.events;

    const flags = $kt.persistence.getFlags() || {
        levelOneHintShown: false
    };
    const gameStatus = $kt.persistence.getGameStatus() || {
        level: 1,
        totalExp: 0,
        currentLevelExp: 0
    };
    const gameLevel = new $kt.GameLevel();
    const gameMain = new $kt.GameMain(gameLevel, gameStatus);
    const gamePractice = new $kt.GamePractice(gameLevel);

    let game = gameMain;
    $kt.audio.preloadAudio();

    events.addEventListener(EVENTS.START, event => {
        const TYPES = $kt.enums.GAME_TYPE;
        const detail = event.detail;
        const gameType = detail.gameType;

        switch(gameType) {
            case TYPES.MAIN:
                game = gameMain;

                $kt.gameUi.setupLevelHints(gameStatus.level);
                gameMain.start();

                if (!flags.levelOneHintShown) {
                    // Needs the timeout to work
                    setTimeout(() => {
                        $kt.gameUi.showHint();
                        flags.levelOneHintShown = true;
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

    events.addEventListener(EVENTS.LEVEL_UP, () => {
        game.startNewLevel();
    });

    events.addEventListener(EVENTS.BACK_TO_TITLE, () => {
        game.stopLoadingDict();
    });

    $kt.ui.hideStartupLoading();

})();