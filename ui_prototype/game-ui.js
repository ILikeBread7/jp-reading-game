'use strict';

var $kt = $kt || {};

(() => {

    const EVENTS = $kt.settings.eventNames;

    // KantoreUiHelper has access to private fields
    // of this class (friend class)
    class KantoreGameUi {

        constructor() {
            this._createEvents();
            this._getAllElements();
            this._addEventListeners();
            this._setupHints();
            this._connectSettings();
        }

        get events() {
            return this._events;
        }

        get eventNames() {
            return this._eventNames;
        }

        enterListener(event) {
            if (this._enterOrClickListener()) {
                return true;
            }

            this.focusAnswerInput();
            this._answerInputEnterEventListener(event);
        }

        clickListener(target) {
            return this._enterOrClickListener(target);
        }

        keyListener(key) {
            if (this._isLevelUpVisible()) {
                return true;
            }

            if (
                // Is a character, not a special key
                (key.length === 1 && key.charCodeAt(0) < 127)
                || key === 'Backspace'
                || key === 'Delete'
                || key === 'ArrowLeft'
                || key === 'ArrowRight'
            ) {
                this.focusAnswerInput();
                return true;
            }

            // Allow scrolling the page with Page and Arrow Up/Down keys
            if (key.startsWith('Page') || key === 'ArrowUp' || key === 'ArrowDown') {
                this._answerInput.blur();
                return true;
            }

            return false;
        }

        /**
         * 
         * @param {HTMLElement?} target optional, event target
         * @returns 
         */
        _enterOrClickListener(target) {
            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
                return true;
            }

            if (this._isLevelUpHintVisible() && (!target || !this._levelUpHint.contains(target))) {
                this._closeLevelUpContainer();
                return true;
            }

            if (this._isGameClearOrGameOverVisible()) {
                $kt.uiHelper.backToTitle();
                return true;
            }

            return false;
        }

        focusAnswerInput() {
            this._answerInput.focus({ preventScroll: true });
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth'});
        }

        /**
         * 
         * @param { {
         *  entSeq: number,
         *  kanji: string?,
         *  kana: string,
         *  hint: string?,
         *  tags: [string]?,
         *  sense: [{
         *      pos: [string],
         *      misc: [string]?,
         *      gloss: [string|{ value: string, type: string }],
         *      lsource: [ { lang: string, value: string?, wasei: boolean? } ],
         *      sInf: string?
         *  }]
         * } } question
         */
        showQuestion(question) {
            this._questionKanjiElement.textContent = question.kanji || question.kana;
            this._questionHintElement.textContent = question.hint || '';
            this._meaningContentElement.innerHTML = $kt.templates.questionMeaning(question.sense);
            this._wrongAnswer.textContent = '';
            this._answerInput.value = '';
            this.focusAnswerInput();
        }

        /**
         * @param {boolean} showHint true if hint should be shown, false otherwise
         */
        showLevelUp(showHint) {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_2);
            
            this._showHintOnLevelUp = showHint;
            this._levelUpHintContent.innerHTML = this._currentHintTemplate;

            const fadeInTime = 0.5;
            const charTransitionDelayTime = 0.075;
            const charTransitionTime = 0.325;
            const totalTextTransitionTime = charTransitionDelayTime * (this._levelUpTextChars.length - 1) + charTransitionTime * 2;

            const fadeInTimeCss = `${fadeInTime}s`;
            this._fadeIn(this._levelUpContainer, fadeInTimeCss, '0s');
            this._textJumpByChar(this._levelUpTextChars, '-0.5em', `${charTransitionTime}s`, charTransitionDelayTime);

            this._fadeLevelUpTextToLevelUpHint(showHint, '0.35s', `${totalTextTransitionTime}s`);
            this._answerInput.blur();
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param {number} maxedCharacters 
         * @param {number} totalCharacters 
         */
        showLevelData(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters) {
            this._levelExpDiv.innerHTML = $kt.templates.levelData(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters);
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param {number} maxedCharacters 
         * @param {number} totalCharacters 
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage?: number, addedExp?: number } ] } expData 
         */
        showLevelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData) {
            this._updateLevelExpDiv(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData);
            this._moveLevelExpDivAbove();

            // Force reflow to correctly apply
            // the growing exp bars transitions
            void this._levelExpDiv.offsetWidth;
            
            this._growExpBars(expData);
        }

        /**
         * 
         * @param {string} levelName 
         * @param {number} totalCorrectAnswers 
         */
        showPracticeData(levelName, totalCorrectAnswers) {
            this._levelExpDiv.innerHTML = $kt.templates.practiceData(levelName, totalCorrectAnswers);
        }

        /**
         * 
         * @param {string} levelName 
         * @param {number} currentAnswers 
         * @param {number} totalQuestions 
         * @param {number?} oldExpPercentage
         * @returns 
         */
        showArcadeData(levelName, currentAnswers, totalQuestions, oldExpPercentage) {
            this._levelExpDiv.innerHTML = $kt.templates.arcadeData(levelName, currentAnswers, totalQuestions, oldExpPercentage);
        }

        /**
         * 
         * @param {string} levelName 
         * @param {number} currentAnswers 
         * @param {number} totalQuestions 
         * @returns 
         */
        showArcadeExp(levelName, currentAnswers, totalQuestions) {
            const oldExpPercentage = Math.max(0, (currentAnswers - 1) * 100 / totalQuestions);
            const newExpPercentage = currentAnswers * 100 / totalQuestions;

            this.showArcadeData(levelName, currentAnswers, totalQuestions, oldExpPercentage);
            this._moveLevelExpDivAbove();

            // Move the exp div back down after the same time as the fade-in-out animation takes
            setTimeout(this._moveLevelExpDivBackDown.bind(this), 4000);

            // Force reflow to correctly apply
            // the growing exp bars transitions
            void this._levelExpDiv.offsetWidth;
            
            this._growExpBars([{ oldExpPercentage, newExpPercentage }]);
        }

        _forceCloseLevelUpText() {
            // If fade out transition is already in progress
            if (getComputedStyle(this._levelUpText).opacity < 1) {
                return;
            }

            this._removeTransition(this._levelUpText)
            
            // Force reflow to apply previous remove transition
            void this._levelUpText.offsetWidth;
            
            this._fadeLevelUpTextToLevelUpHint(this._showHintOnLevelUp, 'var(--default-transition-time)');
        }

        _moveLevelExpDivAbove() {
            this._levelExpDiv.style['z-index'] = 'var(--overlays-z-index)';
        }

        _moveLevelExpDivBackDown() {
            this._levelExpDiv.style.removeProperty('z-index');
        }

        shakeWrongAnswer(answer) {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            this._wrongAnswer.textContent = answer;
            this._wrongAnswer.classList.add('shake');
        }

        jumpRightAnswer() {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_2);
            this._questionAnswerContainer.classList.add('jump');
            this._wrongAnswer.textContent = '';
            this._answerInput.value = '';
        }

        slideQuestionHint(newHint) {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_2);
            this._questionHintElement.classList.add('slide');
            this._questionHintElement.textContent = newHint;
        }

        dispatchBackToTitleEvent() {
            this._dispatchEvent(this._eventNames.BACK_TO_TITLE);
        }

        get answer() {
            return this._answerInput.value;
        }

        get _currentHintTemplate() {
            return this._hints[this._currentHintIndex].template;
        }

        /**
         * @param {boolean} showHint true if hint should be shown, false otherwise
         * @param {string} duration Duration in CSS format
         * @param {string} [delay='0s'] Delay in CSS format, default is '0s'
         */
        _fadeLevelUpTextToLevelUpHint(showHint, duration, delay = '0s') {
            const fadeTextListener = showHint
                ? this._fadeIn.bind(this, this._levelUpHint, duration, '0s')
                : this._closeLevelUpContainer.bind(this, duration);
            
            this._fadeOut(this._levelUpText, duration, delay, fadeTextListener);
        }

        /**
         * 
         * @param {[HTMLElement]} charElements 
         * @param {string} height Height in CSS format (e.g. "-10px")
         * @param {string} duration Duration in CSS format
         * @param {number} delayByChar Delay for te next char's animation in number of seconds as a number (e.g. 1)
         * @param {number} [delayToStart=0] Delay in number of seconds before starting the whole animation, default 0
         */
        _textJumpByChar(charElements, height, duration, delayByChar, delayToStart = 0) {
            charElements.forEach((char, index) => this._jump(char, height, duration, `${index * delayByChar + delayToStart}s`))
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param {number} maxedCharacters 
         * @param {number} totalCharacters 
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage?: number, addedExp?: number } ] } expData 
         */
        _updateLevelExpDiv(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData) {
            this._levelExpDiv.innerHTML = $kt.templates.levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData);
            const levelExpTmpBars = document.getElementById('level-exp-tmp-bars');
            levelExpTmpBars.onanimationend = event => {
                if (event.target === levelExpTmpBars) {
                    levelExpTmpBars.style.display = 'none';
                    if (!this._isLevelUpVisible()) {
                        this._moveLevelExpDivBackDown();
                    }
                }
            }
        }

        /**
         * 
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage: number, addedExp: number } ] } expData 
         */
        _growExpBars(expData) {
            [...this._levelExpDiv.getElementsByClassName('level-exp-content')]
                .forEach((expBar, index) => {
                    const exp = expData[index];
                    this._growWidth(expBar, `${exp.newExpPercentage}%`, '1s', '0s');
                });
            [...this._levelExpDiv.getElementsByClassName('exp-max')]
                .forEach(expMax => {
                    const expMaxChars = [...expMax.getElementsByClassName('exp-max-char')];
                    this._fadeIn(expMax, '0.25s', '0.1s');
                    this._textJumpByChar(expMaxChars, '-10px', '0.2s', 0.1);
                });
        }

        _createEvents() {
            this._events = new EventTarget();
            this._eventNames = Object.freeze({
                START: 'start',
                ANSWER: 'answer',
                LEVEL_UP: 'levelUp',
                BACK_TO_TITLE: 'backToTitle'
            });
        }

        _getAllElements() {
            this._gameScene = document.getElementById('game-container');
            
            this._answerInput = document.getElementById('answer-input');
            this._wrongAnswer = document.getElementById('wrong-answer');
            this._answerSubmitButton = document.getElementById('answer-submit-button');

            this._questionAnswerContainer = document.getElementById('question-answer-container');
            this._questionKanjiElement = document.getElementById('question-kanji');
            this._questionHintElement = document.getElementById('question-hint');

            this._meaningContentElement = document.getElementById('meaning-content');

            this._levelUpContainer = document.getElementById('level-up-container');
            this._levelUpText = document.getElementById('level-up-text');
            this._levelUpTextChars = [...document.getElementsByClassName('level-up-text-char')];
            this._gameClearText = document.getElementById('game-clear-text');
            this._gameClearTextChars = [...document.getElementsByClassName('game-clear-text-char')];
            this._gameOverText = document.getElementById('game-over-text');

            this._levelUpHint = document.getElementById('level-up-hint');
            this._levelUpHintContent = document.getElementById('level-up-hint-content');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            
            this._levelExpDiv = document.getElementById('level-exp');
            
            this._hintContent = document.getElementById('hint-content');
            this._hintFirstButton = document.getElementById('hint-first-button');
            this._hintPreviousButton = document.getElementById('hint-previous-button');
            this._hintNextButton = document.getElementById('hint-next-button');
            this._hintLastButton = document.getElementById('hint-last-button');
            this._hintSelect = document.getElementById('hint-select');

            this._hintDetails = document.getElementById('hint');
            this._meaningDetails = document.getElementById('meaning');
        }

        _addEventListeners() {
            this._answerSubmitButton.addEventListener('click', event => {
                event.stopPropagation();
                this._submitAnswer();
                this.focusAnswerInput();
            });

            this._questionAnswerContainer.addEventListener('animationend', event => {
                if (event.target === this._questionAnswerContainer) {
                    this._questionAnswerContainer.classList.remove('jump');
                }
            });

            this._questionHintElement.addEventListener('animationend', event => {
                if (event.target === this._questionHintElement) {
                    this._questionHintElement.classList.remove('slide');
                }
            });

            this._levelUpHintCloseButton.addEventListener('click', () => this._closeLevelUpContainer());
            this._answerInput.addEventListener('keypress', this._answerInputEnterEventListener.bind(this));
            this._wrongAnswer.addEventListener('animationend', event => {
                if (event.target === this._wrongAnswer) {
                    this._wrongAnswer.classList.remove('shake');
                }
            });

            this._hintSelect.addEventListener('change', e => this.selectHint(Number(e.target.value)));

            this._hintFirstButton.addEventListener('click', () => 
                this.selectHint(0)
            );

            this._hintPreviousButton.addEventListener('click', () => 
                this.selectHint(this._currentHintIndex - 1)
            );

            this._hintNextButton.addEventListener('click', () => 
                this.selectHint(this._currentHintIndex + 1)
            );

            this._hintLastButton.addEventListener('click', () => 
                this.selectHint(this._hints.length - 1)
            );
        }

        _connectSettings() {
            const openCloseDetails = (details, value) => {
                if (!value && details.checkVisibility()) {
                    details.classList.add('closing');
                } else {
                    details.classList.remove('closing');
                    details.open = value;
                }
            }
            $kt.uiHelper.connectSettingToListener(EVENTS.SHOW_MEANING, openCloseDetails.bind(this, this._meaningDetails));
            $kt.uiHelper.connectSettingToListener(EVENTS.SHOW_HINT, openCloseDetails.bind(this, this._hintDetails));
            $kt.uiHelper.connectSettingToListener(EVENTS.CURRENT_HINT_INDEX, (newHintIndex = 0) => {
                this._selectHintNoUpdateSettings(newHintIndex);
                this._hintSelect.value = this._currentHintIndex;
            });
            $kt.uiHelper.connectSettingToListener(EVENTS.SHOW_SUBMIT_BUTTON, $kt.uiHelper.adjustMobileOnlyElementsVisibility);
        }

        _answerInputEnterEventListener(event) {
            if (event.key !== 'Enter') {
                return;
            }

            event.stopPropagation();
            this._submitAnswer();
        }

        _submitAnswer() {
            this._dispatchEvent(this._eventNames.ANSWER, { answer: this.answer });
        }

        startGame() {
            $kt.uiHelper.switchToScene(this._gameScene);
            this._moveLevelExpDivBackDown();
            this._removeLevelUpTransitions();
            this._displayAnnouncmentText(this._levelUpText);
            $kt.uiHelper.initializeHintSelects(this._latestUnlockedHintIndex + 1);
            $kt.settings.currentHintIndex = this._currentHintIndex;
            this.focusAnswerInput();
            this._dispatchEvent(this._eventNames.START);
        }

        _displayAnnouncmentText(textElement) {
            [...document.getElementsByClassName('announcment-text')]
                .forEach(text => text.style.display = 'none');
            textElement.style.removeProperty('display');
        }
        
        _removeLevelUpTransitions() {
            [ ...this._levelUpTextChars, ...this._gameClearTextChars ]
                .forEach(this._removeTransition.bind(this));
            this._removeTransition(this._levelUpText);
            this._removeTransition(this._gameClearText);
            this._removeTransition(this._levelUpHint);
            this._removeTransition(this._levelUpContainer);
        }

        _setupHints() {
            if (!$kt.hints) {
                console.error('The "hints.js" file must be included before the "ui.js" file.')
                return;
            }

            this._hints = $kt.hints;
            this._currentHintIndex = this._latestUnlockedHintIndex = 0; // Change to reading from save file (local storage)
            this._showHintOnLevelUp = false;
            this._updateHintContent();
        }

        selectHint(newHintIndex) {
            this._selectHintNoUpdateSettings(newHintIndex);
            $kt.settings.currentHintIndex = this._currentHintIndex;
        }

        _selectHintNoUpdateSettings(newHintIndex) {
            if (newHintIndex === this._currentHintIndex) {
                return;
            }
            
            const clampedHintIndex = Math.min(Math.max(newHintIndex, 0), this._latestUnlockedHintIndex);
            if (clampedHintIndex === this._currentHintIndex) {
                return;
            }
            
            this._currentHintIndex = clampedHintIndex;
            this._updateHintContent();
        }

        _updateHintContent() {
            this._updateHintButtons();
            this._hintContent.innerHTML = this._currentHintTemplate;
        }

        _updateHintButtons() {
            this._hintFirstButton.disabled = this._hintPreviousButton.disabled = this._currentHintIndex === 0;
            this._hintLastButton.disabled = this._hintNextButton.disabled = this._currentHintIndex === this._latestUnlockedHintIndex;
        }

        /**
         * 
         * @returns {boolean} true if new hint added, false if all hints had been added already
         */
        addNewHint() {
            const newHintIndex = Math.min(this._latestUnlockedHintIndex + 1, this._hints.length - 1);
            if (newHintIndex > this._latestUnlockedHintIndex) {
                this._latestUnlockedHintIndex = newHintIndex;
                $kt.uiHelper.addNewHintToSelects(newHintIndex);
                this.selectHint(newHintIndex);
                return true;
            }

            return false;
        }

        _isLevelUpVisible() {
            return this._levelUpContainer.checkVisibility();
        }

        _isLevelUpHintVisible() {
            return this._levelUpHint.checkVisibility();
        }

        _isLevelUpTextVisible() {
            return this._levelUpText.checkVisibility();
        }

        _isGameClearOrGameOverVisible() {
            return this._gameClearText.checkVisibility() || this._gameOverText.checkVisibility();
        }

        /**
         * @param {string} [duration='var(--default-transition-time)'] Duration in CSS format, default is 'var(--default-transition-time)'
         * @param {string} [delay='0s'] Delay in CSS format, default is '0s'
         */
        _closeLevelUpContainer(duration = 'var(--default-transition-time)', delay = '0s') {
            this._fadeOut(this._levelUpContainer, duration, delay, () => {
                this._removeTransition(this._levelUpText);
                this._removeTransition(this._levelUpHint);
                this._levelUpTextChars.forEach(this._removeTransition.bind(this));
                this._moveLevelExpDivBackDown();
            });
            this._dispatchEvent(this._eventNames.LEVEL_UP);
        }

        _dispatchEvent(eventName, detail) {
            this._events.dispatchEvent(new CustomEvent(eventName, { detail }));
        }

        /**
         * Requires the "jumpable" css class on the element
         * @param {HTMLElement} element 
         * @param {string} height css string
         * @param {string} duration css string
         * @param {string} delay css string
         * @param {[function]} endListeners 
         */
        _jump(element, height, duration, delay, endListeners) {
            this._transition(element, 'top', height, duration, delay, () => {
                this._transition(element, 'top', '0px', duration, '0s', endListeners);
            });
        }

        /**
         * If the element is supposed to be hidden at the beginning
         * requires the "fade-hidden" css class on the element
         * @param {HTMLElement} element 
         * @param {string} duration css string
         * @param {string} delay css string
         * @param {[function]} endListeners 
         * @returns 
         */
        _fadeIn(element, duration, delay, endListeners) {
            if (element.checkVisibility()) {
                this._fade(element, 1, '0s', '0s');
                if (endListeners) {
                    // Force reflow before running transition listeners
                    void element.offsetWidth;
                    endListeners();
                }
                return;
            }
            
            element.style.display = 'unset';

            // Force reflow
            // Without it the element doesn't fade in
            // right after its display is changed
            void element.offsetWidth;

            this._fade(element, 1, duration, delay, endListeners);
        }

        _fadeOut(element, duration, delay, endListeners) {
            const fadeOutListener = () => element.style.display = 'none';
            const listeners = endListeners ? [ fadeOutListener, endListeners ] : fadeOutListener;
            this._fade(element, 0, duration, delay, listeners);
        }

        _fade(element, opacity, duration, delay, endListeners) {
            this._transition(element, 'opacity', opacity, duration, delay, endListeners);
        }

        _growWidth(element, width, duration, delay, endListeners) {
            this._transition(element, 'width', width, duration, delay, endListeners);
        }

        _transition(element, property, value, duration, delay, endListeners) {
            element.style['transition-property'] =  property;
            element.style['transition-duration'] =  duration;
            element.style['transition-delay'] =  delay;
            element.style[property] = value;

            this._addOnTransitionEnd(element, endListeners);
        }

        _addOnTransitionEnd(element, endCallbacks) {
            if (!endCallbacks) {
                element.ontransitionend = null;
                return;
            }

            const funcToCall = Array.isArray(endCallbacks)
                ? () => endCallbacks.forEach(f => f())
                : endCallbacks;

            const callback = event => {
                if (event.target !== element) {
                    return;
                }

                element.ontransitionend = null;
                funcToCall();
            }

            element.ontransitionend = callback;
        }

        _removeTransition(element) {
            element.style.removeProperty('transition-property');
            element.style.removeProperty('transition-duration');
            element.style.removeProperty('transition-delay');
            element.style.removeProperty('display');
            element.style.removeProperty('opacity');
            element.style.removeProperty('top');
            element.ontransitionend = null;
        }

    }

    $kt.gameUi = new KantoreGameUi();

})();