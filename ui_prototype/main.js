'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.gameUi.eventNames;
    const events = $kt.gameUi.events;

    // To be loaded from persistence later
    const currentLevel = 1;

    let currentLevelDict = $kt.dicts.getLevelDict(currentLevel);
    currentLevelDict.load()
        .then(() => $kt.dicts.getLevelDict(currentLevel + 1).load());

    const game = new $kt.Game();

    events.addEventListener(EVENTS.START, () => {
        game.start(currentLevelDict, $kt.enums.QUESTION_TYPE.KANA);
        game.askQuestion();
    
        $kt.gameUi.showLevelData('Level 1: あ行', 75, 10, 15, 0, 48);
        setTimeout(() => {
            $kt.gameUi.showLevelExp('Level 2: か行', 123, 5, 12, 10, 48, [
                { oldExpPercentage: 20, newExpPercentage: 100, addedExp: 3 },
                { char: 'か', oldExpPercentage: 10, newExpPercentage: 100, addedExp: 1 },
                { char: 'き', oldExpPercentage: 20, newExpPercentage: 40, addedExp: 2 }
            ]);
        }, 1000);
    });

    events.addEventListener(EVENTS.ANSWER, event => {
        const answer = event.detail.answer;

        if (!answer) {
            $kt.gameUi.slideQuestionHint(game.giveUpAndGetQuestionHint());
            return;
        }

        if (game.answerMatches(answer)) {
            $kt.gameUi.jumpRightAnswer();
            game.askQuestion();
        } else {
            $kt.gameUi.shakeWrongAnswer(answer);
        }
    });

})();