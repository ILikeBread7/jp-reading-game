import { dialogue } from './dialogue-ui.js';
import { KantoreGameBase } from './game-base.js';
import { gameUi } from './game-ui.js';
import { audio } from './audio.js';

export class KantoreGameArcade extends KantoreGameBase {

    /**
     * 
     * @param {KantoreGameLevel} gameLevel 
     */
    constructor(gameLevel) {
        super(gameLevel);
        this._addEventListeners();
    }

    _addEventListeners() {
        gameUi.events.addEventListener(
            gameUi.eventNames.TIME_UP,
            gameUi.showGameOver.bind(gameUi)
        );
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
            gameUi.pauseTimeBar();
            super._giveUp();
            this._lives--;
        } else {
            // Effect won't be played if super._giveUp
            // isn't called, so play it manually
            audio.playEffect(audio.seTracks.CANCEL);
        }

        this._showArcadeDataGaveUp();
    }

    _showArcadeDataCorrectAnswer() {
        const answerIsCorrect = true;
        this._showArcadeData(answerIsCorrect);
    }

    _showArcadeDataGaveUp() {
        const answerIsCorrect = false;
        this._showArcadeData(answerIsCorrect);
    }

    _showArcadeData(answerIsCorrect) {
        gameUi.showArcadeExp(
            this._categoryLabel,
            this._lives,
            answerIsCorrect,
            this._correctAnswersNumber,
            this._totalQuestions,
        );
    }

}