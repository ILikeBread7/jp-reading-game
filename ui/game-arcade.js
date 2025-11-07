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
        this._categoryLabel = `Arcade: ${diffucyltyName}`;
        this._showArcadeData();
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
                this._showArcadeData();
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

    _showArcadeData() {
        gameUi.showArcadeData(
            this._categoryLabel,
            this._correctAnswersNumber,
            15
        );
    }

}