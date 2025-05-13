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

        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            this._levelUpContainer = document.getElementById('level-up-container');
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
            setTimeout(this._fade, 0, element, 1, duration, '0s');
        }

        _fadeOut(element, duration, delay) {
            const eventName = 'transitionend';
            const fadeOutEventListener = () => {
                element.style.display = 'none';
                element.removeEventListener(eventName, fadeOutEventListener);
            }
            
            element.addEventListener(eventName, fadeOutEventListener);
            this._fade(element, 0, duration, delay);
        }

        _fade(element, opacity, duration, delay) {
            element.style['transition-property'] =  'opacity';
            element.style['transition-duration'] =  duration;
            element.style['transition-delay'] =  delay;
            element.style.opacity = opacity;
        }
    }

    $kt.ui = new KantoreUi();

})();