'use strict';

var $kt = $kt || {};

(() => {

    class KantoreGame {

        constructor() {

        }

        start(dict, mode) {
            this._currentQueston = null;
            this._dict = dict;
            this._mode = mode;
            this._gaveUp = false;
        }

        askQuestion() {
            if (this._dict.isLoaded()) {
                this._askNewQuestion();
            } else {
                $kt.ui.showLoading();
                this._dict.load()
                    .then(() => {
                        this._askNewQuestion();
                        $kt.ui.hideLoading();
                    })
            }
        }

        answerMatches(answer) {
            return wanakana.toKatakana(this._currentQueston.kana) === wanakana.toKatakana(answer);
        }

        giveUp() {
            this._gaveUp = true;
        }

        getQuestionHint() {
            if (this._mode === $kt.enums.QUESTION_TYPE.KANA) {
                return wanakana.toRomaji(this._currentQueston.kana);
            } else if (this._gaveUp) {
                return`${this._currentQueston.kana} (${wanakana.toRomaji(this._currentQueston.kana, { customRomajiMapping: { 'ぁ': 'xa', 'ぃ': 'xi',  'ぅ': 'xu', 'ぇ': 'xe', 'ぉ': 'xo', 'ァ': 'xa', 'ィ': 'xi', 'ゥ': 'xu', 'ェ': 'xe', 'ォ': 'xo' } })})`;
            } else {
                return this._currentQueston.kana;
            }
        }

        _askNewQuestion() {
            this._gaveUp = false;
            const question = this._findNewQuestion(this._dict.data, this._currentQueston);
            $kt.gameUi.showQuestion(question, this._mode);
            this._currentQueston = question;
        }

        _findNewQuestion(dictData, previousQuestion) {
            let newQuestion;

            do {
                newQuestion = dictData[Math.floor(Math.random() * dictData.length)];
            } while(dictData.length > 1 && previousQuestion && (previousQuestion === newQuestion || (this._mode === $kt.enums.QUESTION_TYPE.KANA && newQuestion.kana === previousQuestion.kana)));
            
            return newQuestion;
        }

    }

    $kt.Game = KantoreGame;

})();