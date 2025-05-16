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
            this._fadeIn(this._levelUpContainer, '1s');
            this._answerInput.blur();
        }

        showLevelExp() {
            this._fadeIn(this._levelExpTmpBarsDiv, '1.5s');
            this._addTransitionListener(this._levelExpTmpBarsDiv, () => {
                this._growExpBars();
                this._fadeOut(this._levelExpTmpBarsDiv, '1.5s', '2s');
            });
        }

        _growExpBars() {
            [...document.getElementsByClassName('level-exp-content')]
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

        _fadeIn(element, duration) {
            element.style.display = 'block';
            setTimeout(this._fade.bind(this), 0, element, 1, duration, '0s');
        }

        _fadeOut(element, duration, delay) {
            this._addTransitionListener(element, () => element.style.display = 'none');
            this._fade(element, 0, duration, delay);
        }

        _fade(element, opacity, duration, delay) {
            this._transition(element, 'opacity', opacity, duration, delay);

        }

        _growWidth(element, width, duration, delay) {
            this._transition(element, 'width', width, duration, delay);
        }

        _transition(element, property, value, duration, delay) {
            element.style['transition-property'] =  property;
            element.style['transition-duration'] =  duration;
            element.style['transition-delay'] =  delay;
            element.style[property] = value;
        }

        _addTransitionListener(element, funcToCall) {
            const eventName = 'transitionend';
            const listener = event => {
                if (event.target !== element) {
                    return;
                }

                element.removeEventListener(eventName, listener);
                funcToCall();
            }
            element.addEventListener(eventName, listener);
        }
    }

    $kt.ui = new KantoreUi();

})();