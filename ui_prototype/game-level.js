'use strict';

var $kt = $kt || {};

(() => {

    class KantoreGameLevel {

        constructor() {

        }

        start(dict, questionType) {
            this._currentQueston = null;
            this._dict = dict;
            this._questionType = questionType;
            this._gaveUp = false;
        }

        askFirstQuestion() {
            // TODO If persisted quesiton exists and is applicable
            // for this level, ask that first, otherwise ask
            // a normal question
            this.askQuestion();
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

        get gaveUp() {
            return this._gaveUp;
        }

        get questionChars() {
            return this._questionType === $kt.enums.QUESTION_TYPE.KANJI
                ? this._currentQueston.kanji
                : this._currentQueston.kana;
        } 

        getQuestionHint() {
            if (this._questionType === $kt.enums.QUESTION_TYPE.KANA) {
                return wanakana.toRomaji(this._currentQueston.kana);
            } else if (this._gaveUp) {
                return`${this._currentQueston.kana} (${wanakana.toRomaji(this._currentQueston.kana, { customRomajiMapping: { 'ぁ': 'xa', 'ぃ': 'xi',  'ぅ': 'xu', 'ぇ': 'xe', 'ぉ': 'xo', 'ァ': 'xa', 'ィ': 'xi', 'ゥ': 'xu', 'ェ': 'xe', 'ォ': 'xo' } })})`;
            } else {
                return this._currentQueston.kana;
            }
        }

        formatWrongAnswer(answer) {
            return wanakana.isKatakana(this._currentQueston.kana)
                ? wanakana.toKatakana(answer)
                : wanakana.toHiragana(answer);
        }

        filterDictByRemainingChars(remainingChars) {
            const filterFunc = this._questionType === $kt.enums.QUESTION_TYPE.KANA
                ? KantoreGameLevel._filterKana
                : KantoreGameLevel._filterKanji;
                
            this._dict = this._dict.filter(entry => filterFunc(entry, remainingChars));
        }

        static _filterKana(entry, remainingChars) {
            return !remainingChars.isDisjointFrom(
                    new Set(entry.kana)
                );
        }

        static _filterKanji(entry, remainingChars) {
            return entry.kanji
                && !remainingChars.isDisjointFrom(
                        new Set(entry.kanji)
                    );
        }

        _askNewQuestion() {
            this._gaveUp = false;
            const question = this._findNewQuestion(this._dict.data, this._currentQueston);
            $kt.gameUi.showQuestion(question, this._questionType);
            this._currentQueston = question;
        }

        _findNewQuestion(dictData, previousQuestion) {
            let newQuestion;

            do {
                newQuestion = dictData[Math.floor(Math.random() * dictData.length)];
            } while(dictData.length > 1 && previousQuestion && (previousQuestion === newQuestion || (this._questionType === $kt.enums.QUESTION_TYPE.KANA && newQuestion.kana === previousQuestion.kana)));
            
            return newQuestion;
        }

    }

    $kt.GameLevel = KantoreGameLevel;

})();