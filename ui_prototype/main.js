'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.gameUi.eventNames;
    const events = $kt.gameUi.events;

    // Level to be loaded from persistence later
    const game = new $kt.Game(1);

    $kt.audio.preloadAudio();

    events.addEventListener(EVENTS.START, () => {
        game.start();
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