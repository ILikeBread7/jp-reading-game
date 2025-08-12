'use strict';

var $kt = $kt || {};

(() => {

    const EXP_PER_KANA = 10;
    const EXP_PER_KANJI = 20;

    class KantoreGame {

        /**
         * 
         * @param {{
         *  level: number,
         *  totalExp: number,
         *  currentLevelExp: number,
         *  levelChars: { char: string, remainingReps: number, totalReps: number } | undefined
         * }} gameStatus 
         */
        constructor(gameStatus) {
            this._gameStatus = gameStatus;
            this._gameLevel = new $kt.GameLevel();
            $kt.dicts.getLevelDict(this._gameStatus.level).preload();
        }

        start() {
            this._setupLevelFromGameStatus();

            let updateRemainingChars = false;
            this._remainingChars.forEach(char => {
                if (this._levelChars.get(char).remainingReps <= 0) {
                    this._remainingChars.delete(char);
                    updateRemainingChars = true;
                }
            });

            
            if (updateRemainingChars) {
                if (this._remainingChars.size === 0) {
                    this._levelUp();
                    return;
                }

                this._gameLevel.filterDictByRemainingChars(this._remainingChars);
                
                this._maxedCharacters +=
                    this._levelChars.values()
                        .filter(({ remainingReps }) => remainingReps <= 0)
                        .toArray()
                        .length;
            }

            this._showCurrentLevelData();
            this._askFirstQuestion();

            if (this._gameStatus.gaveUp) {
                $kt.gameUi.showQuestionHint(this._gameLevel.questionHint);
                this._gameLevel.giveUp();
            }
        }

        startNewLevel() {
            this._showCurrentLevelData();
            this._askAndSaveQuestion();
        }

        answer(answer) {
            if (!answer) {
                $kt.gameUi.slideQuestionHint(this._gameLevel.questionHint);
                this._gameLevel.giveUp();
                this._saveGameStatus();
                return;
            }

            if (this._gameLevel.answerMatches(answer)) {
                $kt.gameUi.jumpRightAnswer();
                const leveledUp = this._updateScore();
                if (leveledUp) {
                    this._levelUp();
                } else {
                    this._askAndSaveQuestion();
                }
                this._saveGameStatus();
            } else {
                const formattedWrongAnswer = this._gameLevel.formatWrongAnswer(answer);
                $kt.gameUi.shakeWrongAnswer(formattedWrongAnswer);
            }
        }

        stopLoadingDict() {
            if (this._currentLevelDict.isComplex) {
                this._currentLevelDict.stopLoading();
            }
        }

        _askFirstQuestion() {
            const savedQuestion = $kt.persistence.getGameQuestion();
            const questionPromise = this._gameLevel.askFirstQuestion(savedQuestion);
            this._saveQuestion(questionPromise);
        }

        _askAndSaveQuestion() {
            const questionPromise = this._gameLevel.askQuestion();
            this._saveQuestion(questionPromise);
        }

        _saveQuestion(questionPromise) {
            if (!questionPromise) {
                return;
            }

            questionPromise
                .then(question => $kt.persistence.setGameQuestion(question));
        }

        _saveGameStatus() {
            this._gameStatus.currentCharReps = this._levelChars.entries()
                .map(([ char, { remainingReps, targetReps } ]) => {
                    return [ char, targetReps - remainingReps ];
                })
                .toArray();
            this._gameStatus.gaveUp = this._gameLevel.gaveUp;
            $kt.persistence.setGameStatus(this._gameStatus);
        }

        _showCurrentLevelData() {
            $kt.gameUi.showLevelData(
                this._levelName,
                this._gameStatus.totalExp,
                this._gameStatus.currentLevelExp,
                this._toNextLevelExp,
                this._maxedCharacters,
                this._totalCharacters
            );
        }

        /**
         * 
         * @returns {boolean} true if leveled up, false otherwise
         */
        _updateScore() {
            if (this._gameLevel.gaveUp) {
                return false;
            }

            const questionChars = this._gameLevel.questionChars;
            const charsForExp = this._remainingChars.intersection(new Set(questionChars));
            const addedScore = charsForExp.size * this._expPerChar;

            const oldCurrentLevelExp = this._gameStatus.currentLevelExp;
            this._gameStatus.totalExp += addedScore;
            this._gameStatus.currentLevelExp += addedScore;
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
                    addedExp: this._expPerChar
                });

                if (charReps.remainingReps <= 0) {
                    updateRemainingChars = true;
                    this._remainingChars.delete(char);
                    this._maxedCharacters++;
                }
            });

            $kt.gameUi.showLevelExp(
                this._levelName,
                this._gameStatus.totalExp,
                this._gameStatus.currentLevelExp,
                this._toNextLevelExp,
                this._maxedCharacters,
                this._totalCharacters,
                [
                    {
                        oldExpPercentage: this._calculatePercentage(oldCurrentLevelExp, this._toNextLevelExp),
                        newExpPercentage: this._calculatePercentage(this._gameStatus.currentLevelExp, this._toNextLevelExp),
                        addedExp: addedScore
                    },
                    ...addedExpPerChar
                ]
            );

            if (updateRemainingChars) {
                if (this._remainingChars.size === 0) {
                    return true;
                } else {
                    this._gameLevel.filterDictByRemainingChars(this._remainingChars);
                }
            }

            return false;
        }

        _levelUp() {
            this._gameStatus.level++;
            $kt.persistence.removeGameQuestion();
            this._setupNewLevel();
            const hintAdded = $kt.gameUi.addNewHint();
            $kt.gameUi.showLevelUp(hintAdded);
        }

        _setupNewLevel() {
            this._gameStatus.currentLevelExp = 0;
            this._setupLevelChars();
            this._setupLevelCommon();
        }

        _setupLevelFromGameStatus() {
            this._setupLevelChars();
            if (this._gameStatus.currentCharReps) {
                this._gameStatus.currentCharReps
                    .forEach(([ char, reps ]) => {
                        const charReps = this._levelChars.get(char);
                        if (charReps) {
                            charReps.remainingReps -= reps;
                        }
                    });
            }
            this._setupLevelCommon();
        }

        _setupLevelChars() {
            this._levelChars = $kt.levels.getCharsWithRepsPerLevel(this._gameStatus.level);
            this._levelChars.forEach((reps, char, map) => map.set(char, { targetReps: reps, remainingReps: reps }));
        }
        
        _setupLevelCommon() {
            this._levelName = $kt.levels.getLevelName(this._gameStatus.level);
            this._remainingChars = new Set(this._levelChars.keys());
            this._maxedCharacters = $kt.levels.getTotalCharsUntilLevel(this._gameStatus.level);
            this._totalCharacters = $kt.levels.getTotalCharsForDisplay(this._gameStatus.level);

            this._setupExpPerChar();
            this._toNextLevelExp = this._levelChars.values()
                .reduce(
                    (acc, { targetReps }) => acc + targetReps
                    , 0
                ) * this._expPerChar;

            this._currentLevelDict = $kt.dicts.getLevelDict(this._gameStatus.level);
            
            // Properly load current level dict
            const dictPromise = this._currentLevelDict.load();
            
            // Preload the next level's dict if it exists
            const nextLevelDict = $kt.dicts.getLevelDict(this._gameStatus.level + 1);
            if (nextLevelDict) {
                dictPromise.then(() => nextLevelDict.preload());
            }

            this._gameLevel.start(this._currentLevelDict);
        }

        _setupExpPerChar() {
            this._expPerChar = this._isKanjiLevel ? EXP_PER_KANJI : EXP_PER_KANA;
        }

        get _isKanjiLevel() {
            return this._levelChars.size > 0
                && wanakana.isKanji(this._levelChars.keys().next().value);
        }

        _calculateCharExpPercentage(charReps) {
            return 100 - this._calculatePercentage(charReps.remainingReps, charReps.targetReps);
        }

        _calculatePercentage(fraction, total) {
            return fraction * 100 / total;
        }

    }

    $kt.Game = KantoreGame;

})();