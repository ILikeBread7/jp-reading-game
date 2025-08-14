'use strict';

var $kt = $kt || {};

(() => {

    class KantoreGameBase {

        /**
         * 
         * @param {KantoreGameLevel} gameLevel 
         */
        constructor(gameLevel) {
            this._gameLevel = gameLevel;
        }

        stopLoadingDict() {
            if (this._currentLevelDict.isComplex) {
                this._currentLevelDict.stopLoading();
            }
        }

        startNewLevel() {
            // Empty, to be overriden by extending classes
        }

        _giveUp() {
            $kt.gameUi.slideQuestionHint(this._gameLevel.questionHint);
            this._gameLevel.giveUp();
        }

        _wrongAnswer(answer) {
            const formattedWrongAnswer = this._gameLevel.formatWrongAnswer(answer);
            $kt.gameUi.shakeWrongAnswer(formattedWrongAnswer);
        }

    }

    $kt.GameBase = KantoreGameBase;

})();