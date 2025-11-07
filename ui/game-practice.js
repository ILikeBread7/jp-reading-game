import { KantoreGameBase } from './game-base.js';
import { gameUi } from './game-ui.js';

export class KantoreGamePractice extends KantoreGameBase {

    /**
     * 
     * @param {KantoreGameLevel} gameLevel 
     */
    constructor(gameLevel) {
        super(gameLevel);
    }

    /**
     * 
     * @param {string} categoryName 
     * @param {BaseDict | ComplexDict} dict 
     */
    start(categoryName, dict) {
        this._dict = dict;
        this._correctAnswersNumber = 0;
        this._categoryLabel = `Practice: ${categoryName}`;
        gameUi.hideTimeBar();
        this._showPracticeData();
        this._gameLevel.start(dict);
        this._gameLevel.askQuestion();
    }

    answer(answer) {
        if (!answer) {
            this._giveUp();
            return;
        }

        if (this._gameLevel.answerMatches(answer)) {
            gameUi.jumpRightAnswer();
            if (!this._gameLevel.gaveUp) {
                this._correctAnswersNumber++;
                this._showPracticeData();
            }
            this._gameLevel.askQuestion();
        } else {
            this._wrongAnswer(answer);
        }
    }

    _showPracticeData() {
        gameUi.showPracticeData(
            this._categoryLabel,
            this._correctAnswersNumber
        );
    }

}