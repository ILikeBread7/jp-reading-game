var $kt = $kt || {};

(() => {

    class KantoreUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
        }

        focusAnswerInput() {
            this._answerInput.focus();
        }

        showLevelUp() {
            this._fadeIn(this._levelUpContainer, '1s', '0s');
            this._answerInput.blur();
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage: number, addedExp: number } ] } expData 
         */
        showLevelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData) {
            this._levelExpDiv.innerHTML = $kt.templates.levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData);
            const levelExpTmpBarsDiv = document.getElementById('level-exp-tmp-bars');
            this._fadeIn(levelExpTmpBarsDiv, '1s', '0s', this._fadeOut.bind(this, levelExpTmpBarsDiv, '1s', '2s'));
            
            // Force reflow
            // Without it the transition might not work if
            // there is another transition already in-progress
            void levelExpTmpBarsDiv.offsetWidth;
            
            this._growExpBars(expData);
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
                    this._fadeIn(expMax, '0.5s', '0.5s', () => {
                        this._transition(expMax, 'top', '-10px', '0.2s', '0s', () => {
                            this._transition(expMax, 'top', '0px', '0.2s', '0s');
                        });
                    });
                });
        }

        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            this._levelUpContainer = document.getElementById('level-up-container');
            this._levelExpDiv = document.getElementById('level-exp');
        }

        _addEventListeners() {
            document.addEventListener('keypress', this._enterEventListener.bind(this));
            document.addEventListener('keydown', this._charEventListener.bind(this));
            this._levelUpHintCloseButton.addEventListener('click', this._closeLevelUpContainer.bind(this));
        }

        _enterEventListener(event) {
            if (event.key === 'Enter' && this._isLevelUpVisible()) {
                this._closeLevelUpContainer();
            }
        }

        _charEventListener(event) {
            const key = event.key;

            if (
                !this._isLevelUpVisible()
                && !this._isFocused(this._answerInput)
                && key.length === 1
                && key.charCodeAt(0) < 127
            ) {
                this.focusAnswerInput();
            }
        }

        _isLevelUpVisible() {
            return this._levelUpContainer.checkVisibility();
        }

        _isFocused(element) {
            return document.activeElement === element;
        }

        _closeLevelUpContainer() {
            this._fadeOut(this._levelUpContainer, '0.2s', '0s');
            this.focusAnswerInput();
        }

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
    }

    $kt.ui = new KantoreUi();

})();