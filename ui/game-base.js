import { KantoreGameLevel } from './game-level.js';
import { gameUi } from './game-ui.js';

export class KantoreGameBase {

    /**
     * 
     * @param {KantoreGameLevel} gameLevel 
     */
    constructor(gameLevel) {
        this._gameLevel = gameLevel;
    }

    stopLoadingDict() {
        if (this._dict.isComplex) {
            this._dict.stopLoading();
        }
    }

    startNewLevel() {
        // Empty, to be overriden by extending classes
    }

    _giveUp() {
        gameUi.slideQuestionHint(this._gameLevel.questionHint);
        this._gameLevel.giveUp();
    }

    _wrongAnswer(answer) {
        const formattedWrongAnswer = this._gameLevel.formatWrongAnswer(answer);
        gameUi.shakeWrongAnswer(formattedWrongAnswer);
    }

}