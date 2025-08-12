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
    const game = new $kt.Game(gameStatus);

    $kt.audio.preloadAudio();

    events.addEventListener(EVENTS.START, () => {
        $kt.gameUi.setupLevelHints(gameStatus.level);
        game.start();

        if (!flags.levelOneHintShown) {
            // Needs the timeout to work
            setTimeout(() => {
                $kt.gameUi.showHint();
                flags.levelOneHintShown = true;
                $kt.persistence.setFlags(flags);
            }, 0);
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