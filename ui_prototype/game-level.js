'use strict';

var $kt = $kt || {};

(() => {

    class KantoreGameLevel {

        constructor() {

        }

        start(dict) {
            this._currentQueston = null;
            this._dict = dict;
            this._gaveUp = false;
        }

        askFirstQuestion(firstQuestion) {
            if (firstQuestion) {
                this._askExistingQuestion(firstQuestion);
            } else {
                return this.askQuestion();
            }
        }

        async askQuestion() {
            if (this._dict.isLoaded) {
                const question = this._askNewQuestion();
                return Promise.resolve()
                    .then(() => question);
            } else {
                $kt.ui.showLoading();
                return this._dict.load()
                    .then(() => {
                        const question = this._askNewQuestion();
                        $kt.ui.hideLoading();
                        return question;
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
            return this._currentQueston.kanji || this._currentQueston.kana;
        } 

        getQuestionHint() {
            if (!this._currentQueston.kanji) {
                return wanakana.toRomaji(this._currentQueston.kana);
            } else if (this._gaveUp) {
                return`${this._currentQueston.kana} (${wanakana.toRomaji(this._currentQueston.kana, { customRomajiMapping: { 'ぁ': 'xa', 'ぃ': 'xi',  'ぅ': 'xu', 'ぇ': 'xe', 'ぉ': 'xo', 'ァ': 'xa', 'ィ': 'xi', 'ゥ': 'xu', 'ェ': 'xe', 'ォ': 'xo' } })})`;
            } else {
                return this._currentQueston.kana;
            }
        }

        formatWrongAnswer(answer) {
            return wanakana.isHiragana(this._currentQueston.kana)
                ? wanakana.toHiragana(answer)
                : wanakana.toKatakana(answer);
        }

        filterDictByRemainingChars(remainingChars) {
            this._dict = this._dict.filter(
                entry => !remainingChars.isDisjointFrom(new Set(entry.kanji || entry.kana))
            );
        }
  
        _askNewQuestion() {
            this._gaveUp = false;
            const question = this._findNewQuestion(this._dict.data, this._currentQueston);
            this._askExistingQuestion(question);
            return question;
        }

        _askExistingQuestion(question) {
            $kt.gameUi.showQuestion(question);
            this._currentQueston = question;
        }

        _findNewQuestion(dictData, previousQuestion) {
            let newQuestion;
            let retries = 10;

            do {
                newQuestion = dictData[Math.floor(Math.random() * dictData.length)];
            } while(
                dictData.length > 1
                && retries-- > 0
                && this._isSameQuestion(newQuestion, previousQuestion)
            );
            
            return newQuestion;
        }

        _isSameQuestion(question1, question2) {
            if (question1 === question2) {
                return true;
            }

            // If one is undefined but the other isn't
            if (!!question1 !== !!question2) {
                return false;
            }


            return question1.kanji === question2.kanji
                && question1.kana === question2.kana;
        }

    }

    $kt.GameLevel = KantoreGameLevel;

})();