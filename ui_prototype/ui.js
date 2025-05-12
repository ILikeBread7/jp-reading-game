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
            this._levelUpContainer.style.display = 'block';
            this._answerInput.blur();
        }

        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            this._levelUpContainer = document.getElementById('level-up-container');
        }

        _addEventListeners() {
            document.addEventListener('keydown', this._keyPressEventListener.bind(this));
            this._levelUpHintCloseButton.addEventListener('click', this._closeLevelUpContainer.bind(this));
        }

        _keyPressEventListener(event) {
            const key = event.key;
            
            switch (key) {
                case 'Enter':
                    this._enterEventListener();
                break;
                default:
                    this._charEventListener(key);
            }
        }

        _enterEventListener() {
            if (this._isLevelUpVisible()) {
                this._closeLevelUpContainer();
            }
        }

        _charEventListener(key) {
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
            this._levelUpContainer.style.display = 'none';
            this.focusAnswerInput();
        }
    }

    $kt.ui = new KantoreUi();

})();