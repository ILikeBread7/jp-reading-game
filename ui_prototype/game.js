'use strict';

var $kt = $kt || {};

(() => {

    const EXP_PER_KANA = 10;
    const EXP_PER_KANJI = 20;

    class KantoreGame {

        constructor(level) {
            this._currentLevel = level;
            this._gameLevel = new $kt.GameLevel();
        }

        start() {
            this._setupCurrentLevel();

            this._remainingChars.forEach(char => {
                if (this._levelChars.get(char).remainingReps <= 0) {
                    this._remainingChars.delete(char);
                }
            });

            this._totalExp = 0; // Get from persistence
            this._currentLevelExp += 0; // Get from persistence
            this._maxedCharacters +=
                this._levelChars.values()
                    .filter(({ remainingReps }) => remainingReps <= 0)
                    .toArray()
                    .length;

            $kt.dicts.getLevelDict(this._currentLevel + 1)
                .load();
            $kt.gameUi.showLevelData(
                this._levelName,
                this._totalExp,
                this._currentLevelExp,
                this._toNextLevelExp,
                this._maxedCharacters,
                this._totalCharacters
            );
            
            this._gameLevel.start(this._currentLevelDict, this._questionType);
            this._gameLevel.askFirstQuestion();
        }

        answer(answer) {
            if (!answer) {
                $kt.gameUi.slideQuestionHint(this._gameLevel.getQuestionHint());
                this._gameLevel.giveUp();
                return;
            }

            if (this._gameLevel.answerMatches(answer)) {
                $kt.gameUi.jumpRightAnswer();
                this._updateScore();
                this._gameLevel.askQuestion();
            } else {
                const formattedWrongAnswer = this._gameLevel.formatWrongAnswer(answer);
                $kt.gameUi.shakeWrongAnswer(formattedWrongAnswer);
            }
        }

        _updateScore() {
            if (this._gameLevel.gaveUp || this._currentLevel > $kt.levels.maxLevel) {
                return;
            }

            const questionChars = this._gameLevel.questionChars;
            const charsForExp = this._remainingChars.intersection(new Set(questionChars));
            const expPerChar = this._expPerChar;
            const addedScore = charsForExp.size * expPerChar;

            const oldCurrentLevelExp = this._currentLevelExp;
            this._totalExp += addedScore;
            this._currentLevelExp += addedScore;
            const addedExpPerChar = [];
            let updateRemainingChars = false;

            charsForExp.forEach(char => {
                const charReps = this._levelChars.get(char);
                const oldExpPercentage = this._calculateCharExpPercentage(charReps);
                charReps.remainingReps--;
                const newExpPercentage = this._calculateCharExpPercentage(charReps);
                
                addedExpPerChar.push({
                    char: char,
                    oldExpPercentage: oldExpPercentage,
                    newExpPercentage: newExpPercentage,
                    addedExp: expPerChar
                });

                if (charReps.remainingReps <= 0) {
                    updateRemainingChars = true;
                    this._remainingChars.delete(char);
                    this._maxedCharacters++;
                }
            });

            $kt.gameUi.showLevelExp(
                this._levelName,
                this._totalExp,
                this._currentLevelExp,
                this._toNextLevelExp,
                this._maxedCharacters,
                this._totalCharacters,
                [
                    {
                        oldExpPercentage: this._calculatePercentage(oldCurrentLevelExp, this._toNextLevelExp),
                        newExpPercentage: this._calculatePercentage(this._currentLevelExp, this._toNextLevelExp),
                        addedExp: addedScore
                    },
                    ...addedExpPerChar
                ]
            );

            if (updateRemainingChars) {
                if (this._remainingChars.size === 0) {
                    this._levelUp();
                } else {
                    this._gameLevel.filterDictByRemainingChars(this._remainingChars);
                }
            }

        }

        _levelUp() {
            this._currentLevel++;
            this._setupCurrentLevel();
            const hintAdded = $kt.gameUi.addNewHint();
            $kt.gameUi.showLevelUp(hintAdded);
        }

        _setupCurrentLevel() {
            this._levelName = $kt.levels.getLevelName(this._currentLevel);

            this._levelChars = $kt.levels.getCharsWithRepsPerLevel(this._currentLevel);
            this._levelChars.forEach((reps, char, map) => map.set(char, { targetReps: reps, remainingReps: reps }));
            
            this._remainingChars = new Set(this._levelChars.keys());
            
            this._questionType = $kt.levels.getQuestionType(this._currentLevel);

            this._currentLevelExp = 0;
            this._toNextLevelExp = this._levelChars.values()
                .reduce(
                    (acc, { targetReps }) => acc + targetReps
                    , 0
                ) * this._expPerChar;

            this._maxedCharacters = $kt.levels.getTotalCharsUntilLevel(this._currentLevel);
            this._totalCharacters = $kt.levels.getTotalCharsForDisplay(this._currentLevel);

            this._currentLevelDict = $kt.dicts.getLevelDict(this._currentLevel);
            this._currentLevelDict.load();
        }

        _calculateCharExpPercentage(charReps) {
            return 100 - this._calculatePercentage(charReps.remainingReps, charReps.targetReps);
        }

        _calculatePercentage(fraction, total) {
            return fraction * 100 / total;
        }

        get _expPerChar() {
            return this._questionType === $kt.enums.QUESTION_TYPE.KANJI
                ? EXP_PER_KANJI
                : EXP_PER_KANA;
        }

    }

    $kt.Game = KantoreGame;

})();