var $kt = $kt || {};

(() => {

    class KantoreUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
        }
        
        _getAllElements() {
            this._answerInput = document.getElementById('answer-input');
            this._levelUpHintCloseButton = document.getElementById('level-up-hint-close-button');
            this._levelUpContainer = document.getElementById('level-up-container');
        }

        _addEventListeners() {
            document.addEventListener('keypress', event => {
                if (event.key === 'Enter' && this._levelUpContainer.checkVisibility()) {
                    this.closeLevelUpContainer();
                }
            });
            this._levelUpHintCloseButton.addEventListener('click', this.closeLevelUpContainer.bind(this));
        }

        focusAnswerInput() {
            this._answerInput.focus();
        }

        closeLevelUpContainer() {
            this._levelUpContainer.style.display = 'none';
            this.focusAnswerInput();
        }
        
    }

    $kt.ui = new KantoreUi();

})();