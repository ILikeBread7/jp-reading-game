var $kt = $kt || {};

(() => {

    class KantoreUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
            this._transitionListeners = new Map();
        }

        focusAnswerInput() {
            this._answerInput.focus();
        }

        showLevelUp() {
            this._fadeIn(this._levelUpContainer, '1s', '0s');
            this._answerInput.blur();
        }

        showLevelExp() {
            this._fadeIn(this._levelExpTmpBarsDiv, '1.5s', '0s', () => {
                this._growExpBars();
                this._fadeOut(this._levelExpTmpBarsDiv, '1.5s', '2s');
            });
        }

        _growExpBars() {
            [...this._levelExpDiv.getElementsByClassName('level-exp-content')]
                .forEach(expBar => {
                    const startingWidth = expBar.clientWidth;
                    const targetWidth = startingWidth + 20;
                    this._growWidth(expBar, `${targetWidth}px`, '1s', '0s');
                });
        }

        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            this._levelUpContainer = document.getElementById('level-up-container');
            this._levelExpDiv = document.getElementById('level-exp');
            this._levelExpTmpBarsDiv = document.getElementById('level-exp-tmp-bars');
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
            const fadeInFunction = (element, duration, delay, endListeners) => {
                element.style.display = 'block';
                setTimeout(this._fade.bind(this), 0, element, 1, duration, delay, endListeners);
            }
            
            if (element.checkVisibility()) {
                const oldListener = this._transitionListeners.get(element);
                if (oldListener) {
                    element.removeEventListener('transitionend', oldListener);
                    this._transitionListeners.delete(element);
                }
                fadeInFunction(element, '0s', '0s');
                setTimeout(endListeners, 0);
                return;
            }
            
            fadeInFunction(element, duration, delay, endListeners);
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

            if (endListeners) {
                this._addTransitionListener(element, endListeners);
            }
        }

        _addTransitionListener(element, endListeners) {
            const eventName = 'transitionend';

            const funcToCall = Array.isArray(endListeners)
                ? () => endListeners.forEach(f => f())
                : endListeners;

            const listener = event => {
                if (event.target !== element) {
                    return;
                }

                element.removeEventListener(eventName, listener);
                funcToCall();
            }

            const oldListener = this._transitionListeners.get(element);
            if (oldListener) {
                element.removeEventListener(eventName, oldListener);
            }
            element.addEventListener(eventName, listener);
            this._transitionListeners.set(element, listener);
        }
    }

    $kt.ui = new KantoreUi();

})();