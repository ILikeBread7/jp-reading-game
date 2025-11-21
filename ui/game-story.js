import { KantoreGameArcade } from './game-arcade.js';

export class KantoreGameStory extends KantoreGameArcade {

    /**
     * 
     * @param {KantoreGameLevel} gameLevel 
     */
    constructor(gameLevel) {
        super(gameLevel);
    }

    /**
     * 
     * @param {string} levelName 
     * @param {BaseDict | ComplexDict} dict
     * @param {number} totalQuestions 
     * @param {() => void} successListener
     * @param {() => void} failureListener
     */
    start(levelName, dict, totalQuestions, successListener, failureListener) {
        this._setupProperties(dict);
        this._totalQuestions = totalQuestions;
        this._categoryLabel = `Story: ${levelName}`;
        this._successListener = successListener;
        this._failureListener = failureListener;
        this._startQuestions();
    }

    runSuccessListener() {
        if (this._successListener) {
            this._successListener();
        }
    }

    runFailureListener() {
        if (this._failureListener) {
            this._failureListener();
        }
    }

}