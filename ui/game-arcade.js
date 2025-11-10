import { KantoreGameBase } from './game-base.js';
import { gameUi } from './game-ui.js';

export class KantoreGameArcade extends KantoreGameBase {

    /**
     * 
     * @param {KantoreGameLevel} gameLevel 
     */
    constructor(gameLevel) {
        super(gameLevel);
    }

    /**
     * 
     * @param {string} diffucyltyName 
     * @param {BaseDict | ComplexDict} dict 
     */
    start(diffucyltyName, dict) {
        this._dict = dict;
        this._correctAnswersNumber = 0;
        this._lives = 3;
        this._categoryLabel = `Arcade: ${diffucyltyName}`;
        this._showArcadeDataCorrectAnswer();
        this._gameLevel.start(dict);
        this._askQuestion();
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
                this._showArcadeDataCorrectAnswer();
            }
            this._askQuestion();
        } else {
            this._wrongAnswer(answer);
        }
    }

    _askQuestion() {
        this._gameLevel.askQuestion();
        gameUi.startTimeBar();
    }

    _giveUp() {
        if (this._gameLevel.gaveUp) {
            super._giveUp();
            return;
        }

        if (this._lives > 0) {
            super._giveUp();
            this._lives--;
        }

        this._showArcadeDataGaveUp();
    }

    _showArcadeDataCorrectAnswer() {
        const shakeLives = false;
        this._showArcadeData(shakeLives);
    }

    _showArcadeDataGaveUp() {
        const shakeLives = true;
        this._showArcadeData(shakeLives);
    }

    _showArcadeData(shakeLives) {
        gameUi.showArcadeData(
            this._categoryLabel,
            this._lives,
            shakeLives,
            this._correctAnswersNumber,
            15
        );
    }

}