var $kt = $kt || {};

(() => {

    class KantoreUi {

        /**
         * 
         * @param {KantoreSettingsUi} settings 
         */
        constructor(settings) {
            this.settings = settings;
            this._getAllElements();
            this._addEventListeners();
            this._animateDetails();
            this._setupHints();
            this._initBackgroundPaticles();
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
         * @param {QUESTION_TYPE} [questionType=$kt.enums.QUESTION_TYPE.KANJI] 
         */
        showQuestion(question, questionType = $kt.enums.QUESTION_TYPE.KANJI) {
            this._questionKanjiElement.textContent = (questionType === $kt.enums.QUESTION_TYPE.KANJI && question.kanji) || question.kana;
            this._questionHintElement.textContent = (questionType === $kt.enums.QUESTION_TYPE.KANJI && question.hint) || '';
            this._meaningContentElement.innerHTML = $kt.templates.questionMeaning(question.sense);
            this.focusAnswerInput();
        }

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} toNextLevelExp
         * @param {boolean} showHint true if hint should be shown, false otherwise
         */
        showLevelUp(levelName, totalExp, toNextLevelExp, maxedCharacters, totalCharacters, showHint) {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_2);
            
            this._showHintOnLevelUp = showHint;
            this._levelUpHintContent.innerHTML = this._currentHint;

            const fadeInTime = 1;
            const charTransitionDelayTime = 0.075;
            const charTransitionTime = 0.325;
            const totalTextTransitionTime = charTransitionDelayTime * (this._levelUpTextChars.length - 1) + charTransitionTime * 2;

            const fadeInTimeCss = `${fadeInTime}s`;
            this._fadeIn(this._levelUpContainer, fadeInTimeCss, '0s');
            this._textJumpByChar(this._levelUpTextChars, '-0.5em', `${charTransitionTime}s`, charTransitionDelayTime);

            this._showNewLevelDataFunction = this.showLevelData.bind(this, levelName, totalExp, 0, toNextLevelExp, maxedCharacters, totalCharacters);
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

        showLoading() {
            this.showOverlayElement(this._loadingDiv);
        }
        
        showOverlayElement(element) {
            element.style.visibility = 'visible';
            element.style.setProperty('--current-opacity', 'var(--visible-opacity)');
            this._answerInput.blur();
        }

        hideLoading() {
            this.hideOverlayElement(this._loadingDiv);
        }

        hideOverlayElement(element) {
            element.style.removeProperty('visibility');
            element.style.removeProperty('--current-opacity');
        }

        _moveLevelExpDivAbove() {
            this._levelExpDiv.style['z-index'] = 'var(--level-up-z-index)';
        }

        _moveLevelExpDivBackDown() {
            this._levelExpDiv.style.removeProperty('z-index');
        }

        shakeWrongAnswer(answer) {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            this._wrongAnswer.textContent = answer;
            this._wrongAnswer.classList.add('shake');
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

        _getAllElements() {
            this._loadingDiv = document.getElementById('loading');

            this._answerInput = document.getElementById('answer-input');
            this._wrongAnswer = document.getElementById('wrong-answer');

            this._questionKanjiElement = document.getElementById('question-kanji');
            this._questionHintElement = document.getElementById('question-hint');

            this._meaningContentElement = document.getElementById('meaning-content');

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
            document.addEventListener('click', this._documentClickEventListener.bind(this));

            this._levelUpHintCloseButton.addEventListener('click', () => this._closeLevelUpContainer());
            this._answerInput.addEventListener('keypress', this._answerInputEnterEventListener.bind(this));
            this._wrongAnswer.addEventListener('animationend', event => {
                if (event.target === this._wrongAnswer) {
                    this._wrongAnswer.classList.remove('shake');
                }
            });

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

            if (this._answerInput.value === 'Bad') {
                this.shakeWrongAnswer('テスト');
                return;
            }

            $kt.ui.showLevelExp('Level 2: か行', 123, 5, 12, 12, 48, [
                { oldExpPercentage: 20, newExpPercentage: 100, addedExp: 3 },
                { char: 'か', oldExpPercentage: 10, newExpPercentage: 100, addedExp: 1 },
                { char: 'き', oldExpPercentage: 20, newExpPercentage: 40, addedExp: 2 }
            ]);

            if (this._isLevelUpVisible()) {
                console.warn('Level up is visible!');
            } else {
                const showHint = this._addNewHint();
                this.showLevelUp('Level 3: さ行', 500, 25, 13, 48, showHint);
            }
        }

        _documentEnterEventListener(event) {
            if (event.key !== 'Enter' || this._isLoadingVisible()) {
                return;
            }

            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
            } else if (this._isLevelUpHintVisible()) {
                this._closeLevelUpContainer();
            } else {
                this.focusAnswerInput();
                this._answerInputEnterEventListener(event);
            }
        }

        _charEventListener(event) {
            const key = event.key;

            if (
                !this._isLoadingVisible()
                && !this._isLevelUpVisible()
                // Is a character, not a special key
                && key.length === 1 && key.charCodeAt(0) < 127
            ) {
                this.focusAnswerInput();
            }
        }
        
        _documentClickEventListener(event) {
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

        _initBackgroundPaticles() {
            if (particlesJS) {
                particlesJS.load('particles-js', 'particlesjs-config.json');
            } else {
                console.error('particles.js was not loaded!', `particlesJS object is ${particlesJS}`);
            }
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

        _isLoadingVisible() {
            return this._loadingDiv.checkVisibility({ visibilityProperty: true });
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
                this._moveLevelExpDivBackDown();
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


    class KantoreSettingsUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
            this._restoreSavedSettings();
        }

        _getAllElements() {
            this._settingsDiv = document.getElementById('settings');
            this._settingsContainer = document.getElementById('settings-container');
            this._settingsButton = document.getElementById('settings-button');

            this._bgmVolume = document.getElementById('bgm-volume');
            this._seVolume = document.getElementById('se-volume');
            this._backToMenu = document.getElementById('back-to-main-menu-button');
            this._returnToGame = document.getElementById('return-to-game-button');
        }

        _addEventListeners() {
            this._settingsButton.addEventListener('click', this._showSettings.bind(this));
            this._settingsDiv.addEventListener('click', e => {
                if (!this._settingsContainer.contains(e.target)) {
                    this._hideSettings();
                }
            });
            
            this._bgmVolume.addEventListener('change', e => this._bgmVolumeChanged(Number(e.target.value)));
            this._seVolume.addEventListener('change', e => this._seVolumeChanged(Number(e.target.value)));
            this._backToMenu.addEventListener('click', () => console.log('Back to menu!'));
            this._returnToGame.addEventListener('click', this._hideSettings.bind(this));
        }

        _restoreSavedSettings() {
            this._settings = $kt.persistence.getSettings() || { bgmVolume: 1, seVolume: 1 };
            this._bgmVolume.value = this._settings.bgmVolume;
            this._seVolume.value = this._settings.seVolume;
            $kt.audio.bgmVolumeChange(this._settings.bgmVolume);
            $kt.audio.seVolumeChange(this._settings.seVolume);
        }

        _bgmVolumeChanged(newVolume) {
            this._settings.bgmVolume = newVolume;
            $kt.audio.bgmVolumeChange(this._settings.bgmVolume);
            this._saveSettings();
        }

        _seVolumeChanged(newVolume) {
            this._settings.seVolume = newVolume;
            $kt.audio.seVolumeChange(this._settings.seVolume);
            this._saveSettings();
        }

        _saveSettings() {
            $kt.persistence.setSettings(this._settings);
        }

        _showSettings() {
            $kt.ui.showOverlayElement(this._settingsDiv);
        }

        _hideSettings() {
            $kt.ui.hideOverlayElement(this._settingsDiv);
            $kt.ui.focusAnswerInput();
        }

    }

    $kt.ui = new KantoreUi(new KantoreSettingsUi());

})();