var $kt = $kt || {};

(() => {

    class KantoreUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
            this._animateDetails();
            this._setupHints();
        }

        focusAnswerInput() {
            this._answerInput.focus();
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} toNextLevelExp
         * @param {boolean} showHint true if hint should be shown, false otherwise
         */
        showLevelUp(levelName, totalExp, toNextLevelExp, showHint) {
            this._showHintOnLevelUp = showHint;
            this._levelUpHintContent.innerHTML = this._currentHint;

            const fadeInTime = 1;
            const charTransitionDelayTime = 0.125;
            const charTransitionTime = 0.375;
            const totalTextTransitionTime = fadeInTime + charTransitionDelayTime * (this._levelUpTextChars.length - 1) + charTransitionTime * 2;

            this._fadeIn(this._levelUpContainer, `${fadeInTime}s`, '0s',
                this._textJumpByChar.bind(this, this._levelUpTextChars, '-10px', `${charTransitionTime}s`, charTransitionDelayTime)
            );

            this._showNewLevelDataFunction = this.showLevelData.bind(this, levelName, totalExp, 0, toNextLevelExp);
            this._fadeLevelUpTextToLevelUpHint(showHint, '0.5s', `${totalTextTransitionTime}s`);
            this._answerInput.blur();
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         */
        showLevelData(levelName, totalExp, currentLevelExp, toNextLevelExp) {
            const currentExpPercentage = currentLevelExp * 100 / toNextLevelExp;
            const expData = [{
                oldExpPercentage: currentExpPercentage
            }];
            this._updateLevelExpDiv(levelName, totalExp, currentLevelExp, toNextLevelExp, expData);
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage?: number, addedExp?: number } ] } expData 
         */
        showLevelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData) {
            this._updateLevelExpDiv(levelName, totalExp, currentLevelExp, toNextLevelExp, expData);
            const levelExpTmpBarsDiv = document.getElementById('level-exp-tmp-bars');
            this._fadeIn(levelExpTmpBarsDiv, '1s', '0s', this._fadeOut.bind(this, levelExpTmpBarsDiv, '1s', '2s'));
            
            // Force reflow
            // Without it the transition might not work if
            // there is another transition already in-progress
            void levelExpTmpBarsDiv.offsetWidth;
            
            this._growExpBars(expData);
        }

        get _currentHint() {
            return this._hints[this._currentHintIndex];
        }

        /**
         * @param {boolean} showHint true if hint should be shown, false otherwise
         * @param {string} duration Duration in CSS format
         * @param {string} [delay='0s'] Delay in CSS format, default is '0s'
         */
        _fadeLevelUpTextToLevelUpHint(showHint, duration, delay = '0s') {
            const fadeTextListener = showHint
                ? this._fadeIn.bind(this, this._levelUpHint, '1s', '0s')
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
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage?: number, addedExp?: number } ] } expData 
         */
        _updateLevelExpDiv(levelName, totalExp, currentLevelExp, toNextLevelExp, expData) {
            this._levelExpDiv.innerHTML = $kt.templates.levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData);
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

        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            
            this._levelUpContainer = document.getElementById('level-up-container');
            this._levelUpText = document.getElementById('level-up-text');
            this._levelUpTextChars = [...document.getElementsByClassName('level-up-text-char')];
            
            this._levelUpHint = document.getElementById('level-up-hint');
            this._levelUpHintContent = document.getElementById('level-up-hint-content');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            
            this._levelExpDiv = document.getElementById('level-exp');
            
            this._hintContent = document.getElementById('hint-content');
            this._hintFirstButton = document.getElementById('hint-first-button');
            this._hintPreviousButton = document.getElementById('hint-previous-button');
            this._hintNextButton = document.getElementById('hint-next-button');
            this._hintLastButton = document.getElementById('hint-last-button');
        }

        _addEventListeners() {
            document.addEventListener('keypress', this._documentEnterEventListener.bind(this));
            document.addEventListener('keydown', this._charEventListener.bind(this));
            document.addEventListener('click', this._documentClickEventLisetner.bind(this));
            
            this._levelUpHintCloseButton.addEventListener('click', () => this._closeLevelUpContainer());
            this._answerInput.addEventListener('keypress', this._answerInputEnterEventListener.bind(this));

            this._hintFirstButton.addEventListener('click', () => 
                this._selectHint(0)
            );

            this._hintPreviousButton.addEventListener('click', () => 
                this._selectHint(this._currentHintIndex - 1)
            );

            this._hintNextButton.addEventListener('click', () => 
                this._selectHint(this._currentHintIndex + 1)
            );

            this._hintLastButton.addEventListener('click', () => 
                this._selectHint(this._hints.length)
            );
        }

        _answerInputEnterEventListener(event) {
            if (event.key !== 'Enter') {
                return;
            }

            event.stopPropagation();

            $kt.ui.showLevelExp('Level 2: か行', 123, 5, 12, [
                { oldExpPercentage: 20, newExpPercentage: 100, addedExp: 3 },
                { char: 'か', oldExpPercentage: 10, newExpPercentage: 100, addedExp: 1 },
                { char: 'き', oldExpPercentage: 20, newExpPercentage: 40, addedExp: 2 }
            ]);

            if (this._isLevelUpVisible()) {
                console.warn('Level up is visible!');
            } else {
                const showHint = this._addNewHint();
                this.showLevelUp('Level 3: さ行', 500, 25, showHint);
            }
        }

        _documentEnterEventListener(event) {
            if (event.key !== 'Enter') {
                return;
            }

            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
            } else if (this._isLevelUpHintVisible()) {
                this._closeLevelUpContainer();
            } else {
                this._answerInputEnterEventListener(event);
            }
        }

        _charEventListener(event) {
            const key = event.key;
            
            if (
                !this._isLevelUpVisible()
                && !this._answerInputFocused()
                && key.length === 1
                && key.charCodeAt(0) < 127
            ) {
                this.focusAnswerInput();
            }
        }
        
        _documentClickEventLisetner(event) {
            const target = event.target;
            
            if (this._isLevelUpHintVisible() && !this._levelUpHint.contains(target)) {
                this._closeLevelUpContainer();
                return;
            }
            
            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
                return;
            }
        }
        
        _forceCloseLevelUpText() {
            // If fade out transition is already in progress
            if (getComputedStyle(this._levelUpText).opacity < 1) {
                return;
            }

            this._removeTransition(this._levelUpText)
            
            // Force reflow to apply previous remove transition
            void this._levelUpText.offsetWidth;
            
            this._fadeLevelUpTextToLevelUpHint(this._showHintOnLevelUp, '0.2s');
        }
        
        _animateDetails() {
            const detailsElements = document.getElementsByTagName('details');
            [...detailsElements].forEach(details => {
                    const summary = details.firstElementChild;

                    summary.addEventListener('click', e => {
                        if (details.hasAttribute('open')) {
                            e.preventDefault();
                            details.classList.add('closing');
                        }
                    })

                    details.addEventListener('animationend', e => {
                        if (e.animationName === 'close') {
                            details.removeAttribute('open');
                            details.classList.remove('closing');
                        }
                    });
                }
            );
        }

        _setupHints() {
            if (!$kt.hints) {
                console.error('The "hints.js" file must be included before the "ui.js" file.')
                return;
            }

            this._hints = $kt.hints;
            this._currentHintIndex = this._latestUnlockedHintIndex = 0; // Change to reading from save file (local storage)
            this._showHintOnLevelUp = false;
            this._showNewLevelDataFunction = null;
            this._updateHintContent();
        }

        _selectHint(newHintIndex) {
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
            this._hintContent.innerHTML = this._currentHint;
        }

        _updateHintButtons() {
            this._hintFirstButton.disabled = this._hintPreviousButton.disabled = this._currentHintIndex === 0;
            this._hintLastButton.disabled = this._hintNextButton.disabled = this._currentHintIndex === this._latestUnlockedHintIndex;
        }

        /**
         * 
         * @returns {boolean} true if new hint added, false if all hints had been added already
         */
        _addNewHint() {
            const newHintIndex = Math.min(this._latestUnlockedHintIndex + 1, this._hints.length - 1);
            if (newHintIndex > this._latestUnlockedHintIndex) {
                this._latestUnlockedHintIndex = newHintIndex;
                this._selectHint(newHintIndex);
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

        _isFocused(element) {
            return document.activeElement === element;
        }

        _answerInputFocused() {
            return this._isFocused(this._answerInput);
        }

        /**
         * Uses the _showNewLevelDataFunction field for its end listener
         * @param {string} [duration='0.2s'] Duration in CSS format, default us '0.2s'
         * @param {string} [delay='0s'] Delay in CSS format, default is '0s'
         */
        _closeLevelUpContainer(duration = '0.2s', delay = '0s') {
            this._fadeOut(this._levelUpContainer, duration, delay, () => {
                this._removeTransition(this._levelUpText);
                this._removeTransition(this._levelUpHint);
                this._levelUpTextChars.forEach(this._removeTransition.bind(this));
                if (this._showNewLevelDataFunction) {
                    this._showNewLevelDataFunction();
                    this._showNewLevelDataFunction = null;
                }
            });
            this.focusAnswerInput();
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


    $kt.ui = new KantoreUi();

})();