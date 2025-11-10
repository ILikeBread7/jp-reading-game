import { dialogue } from './dialogue-ui.js';
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
        this._totalQuestions = 15;
        this._questionsBeforeBreak = 5;
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
            this._askQuestionOrBreakOrFinish();
        } else {
            this._wrongAnswer(answer);
        }
    }

    _askQuestionOrBreakOrFinish() {
        gameUi.pauseTimeBar();

        if (this._correctAnswersNumber >= this._totalQuestions) {
            gameUi.showGameClear();
            return;
        }

        if (this._correctAnswersNumber > 0 && this._correctAnswersNumber % this._questionsBeforeBreak === 0) {
            dialogue.show(
                'Have a little break!',
                /*html*/ `
                <div class="centered-text">
                    Good job at answering
                    ${this._correctAnswersNumber} out of ${this._totalQuestions} questions!
                    <br>
                    You can take a little breather now and continue
                    whenever you're ready.
                </div>`,
                this._askQuestion.bind(this)
            )
            return;
        }

        this._askQuestion();
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
            this._totalQuestions,
        );
    }

}