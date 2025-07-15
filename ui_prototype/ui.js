var $kt = $kt || {};

(() => {

    // KantoreUiHelper has access to private fields
    // of this class (friend class)
    class KantoreUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
            this._animateDetails();
            this._setupHints();
            this._initBackgroundPaticles();
        }

        focusAnswerInput() {
            if (this._isLevelUpVisible()) {
                return;
            }

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
            this._wrongAnswer.textContent = '';
            this._answerInput.value = '';
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

            const fadeInTime = 0.5;
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

        showLoading() {
            $kt.uiHelper.showOverlayElement(this._loadingDiv);
        }

        hideLoading() {
            $kt.uiHelper.hideOverlayElement(this._loadingDiv);
        }

        hideStartupLoading() {
            this._loadingDiv.classList.remove('startup-loading');
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

        slideQuestionHint() {
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_2);
            this._questionHintElement.classList.add('slide');
        }

        get answer() {
            return this._answerInput.value;
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

            this._titleScene = document.getElementById('title-screen-container');
            this._titleStartButton = document.getElementById('start-game-button');
            this._titleSettingsButton = document.getElementById('title-settings-button');
            this._titleCreditsButton = document.getElementById('credits-button');
            this._titleCreditsBackButton = document.getElementById('credits-back-button');
            this._preTitleText = document.getElementById('pre-title-press-start-text');
            this._mainMenu = document.getElementById('main-menu');
            this._creditsContainer = document.getElementById('credits-container');
            this._credits = document.getElementById('credits');

            this._gameScene = document.getElementById('game-container');

            this._answerInput = document.getElementById('answer-input');
            this._wrongAnswer = document.getElementById('wrong-answer');

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

            this._hintDetails = document.getElementById('hint');
            this._meanigsDetails = document.getElementById('meaning');
        }

        _addEventListeners() {
            // Prevents menu item from losing focus when clicked away from a menu
            document.body.onpointerdown = event => {
                if (
                    document.activeElement.classList.contains('menu-item')
                    // Fixes clicking on range input
                    && !event.target.classList.contains('menu-item')
                    && event.target !== this._credits
                ) {
                    return false;
                }
            }

            document.addEventListener('keypress', this._documentEnterEventListener.bind(this));
            document.addEventListener('keydown', this._charEventListener.bind(this));
            document.addEventListener('click', this._documentClickEventListener.bind(this));

            this._titleStartButton.addEventListener('click', this._switchToScene.bind(this, this._gameScene));
            this._titleSettingsButton.addEventListener('click', $kt.uiHelper.showSettings);
            this._titleCreditsButton.addEventListener('click', () => {
                this._mainMenu.classList.add('hidden');
                this._creditsContainer.classList.remove('hidden');
                $kt.uiHelper.focusDefaultMenuItem(this._titleCreditsBackButton);
            });
            this._titleCreditsBackButton.addEventListener('click', () => {
                this._creditsContainer.classList.add('hidden');
                this._mainMenu.classList.remove('hidden');
                $kt.uiHelper.startTitleScene();
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

            [
                ...document.getElementsByClassName('menu-item'),
                ...document.getElementsByClassName('menu-item-label')
            ].forEach(element => {
                element.addEventListener('mouseenter', () => $kt.uiHelper.focusSelectedMenuItem(element));
                
                if (element.type === 'checkbox') {
                    element.addEventListener('keypress', event => {
                        if (event.key === 'Enter') {
                            element.checked = !element.checked;
                            element.dispatchEvent(new Event('change'));
                        }
                    });
                }
            });

            const menuItemPressedListenerCreator = element => element.addEventListener('click', () => $kt.audio.playEffect($kt.audio.tracks[element.dataset.se || 'SE_TEST_2']));
            [...document.getElementsByClassName('menu-button')]
                .forEach(element => element.addEventListener('click', menuItemPressedListenerCreator(element)));
            [...document.getElementsByClassName('menu-checkbox')]
                .forEach(element => element.addEventListener('change', menuItemPressedListenerCreator(element)));

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

            if (this.answer === 'Bad') {
                this.shakeWrongAnswer('テスト');
                return;
            }

            if (this.answer === 'Good') {
                this.jumpRightAnswer();
                return;
            }

            if (this.answer === 'Hint') {
                this.slideQuestionHint();
                return;
            }

            this.showLevelExp('Level 2: か行', 123, 5, 12, 12, 48, [
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
            if (event.key !== 'Enter' || this._isMenuItemFocused() || this._isLoadingVisible()) {
                return;
            }

            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
                return;
            }

            if (this._isLevelUpHintVisible()) {
                this._closeLevelUpContainer();
                return;
            }

            if (this._isGameClearOrGameOverVisible()) {
                $kt.uiHelper.backToTitle();
                return;
            }

            if (this._isPreTitleVisible()) {
                this._hidePreTitle();
                return;
            } 
            
            this.focusAnswerInput();
            this._answerInputEnterEventListener(event);
        }

        _charEventListener(event) {
            const key = event.key;

            if (key === 'Tab') {
                this._documentTabEventListener();
                event.preventDefault();
            }

            if (this._isMenuItemFocused()) {
                if (this._isCreditsVisible()) {
                    this._handleCreditsScrolling(key);
                    return;
                }

                if (key === 'ArrowUp') {
                    $kt.uiHelper.focusSelectedMenuItem(this._findPreviousMenuItem(document.activeElement));
                    event.preventDefault();
                } else if (key === 'ArrowDown') {
                    $kt.uiHelper.focusSelectedMenuItem(this._findNextMenuItem(document.activeElement));
                    event.preventDefault();
                }

                return;
            }

            if (this._isLoadingVisible() || this._isLevelUpVisible()) {
                return;
            }

            // Is a character, not a special key
            if (key.length === 1 && key.charCodeAt(0) < 127) {
                this.focusAnswerInput();
            }
        }

        _handleCreditsScrolling(key) {
            if (key === 'ArrowLeft' || key === 'ArrowRight') {
                return;
            }

            const arrowScroll = 72;
            const pageScroll = 258;

            let scroll = 0;
            if (key.startsWith('Arrow')) {
                scroll = arrowScroll;
            } else if (key.startsWith('Page')) {
                scroll = pageScroll;
            }

            if (key.endsWith('Up')) {
                scroll *= -1;
            }

            this._credits.scrollBy({ top: scroll, behavior: 'smooth' });
        }

        _hidePreTitle() {
            this._preTitleText.classList.add('hidden');
            this._mainMenu.classList.remove('hidden');
            $kt.uiHelper.startTitleScene();
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            $kt.audio.playBgm($kt.audio.tracks.BGM_TRACK);
        }

        _switchToScene(scene) {
            const scenes = [...document.getElementsByClassName('scene-container')];
            scenes.forEach(scene => scene.style.display = 'none');
            scene.style.display = 'initial';
            this._sceneSpecialHandling(scene);
            $kt.uiHelper.setSettingsClass(scene.dataset.settingsClass, scenes.map(scene => scene.dataset.settingsClass));
        }

        _sceneSpecialHandling(scene) {
            switch(scene) {
                case this._gameScene:
                    this._moveLevelExpDivBackDown();
                    this._removeLevelUpTransitions();
                    this._displayAnnouncmentText(this._levelUpText);
                    this.focusAnswerInput();
                break;
            }
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

        _documentTabEventListener() {
            if ($kt.uiHelper.isSettingsVisible()) {
                $kt.uiHelper.hideSettings();
            } else {
                $kt.uiHelper.showSettings();
            }
        }

        _findNextMenuItem(startElement) {
            return this._findMenuItem(startElement, element => element.nextElementSibling, element => element.parentNode.firstElementChild);
        }

        _findPreviousMenuItem(startElement) {
            return this._findMenuItem(startElement, element => element.previousElementSibling, element => element.parentNode.lastElementChild);
        }

        _findMenuItem(startElement, getNextElementFunction, getDefaultElementFunction) {
            if (startElement.parentNode.classList.contains('menu-item-label')) {
                startElement = startElement.parentNode;
            }
            let element = startElement;

            do {
                element = getNextElementFunction(element);
            } while (element && !this._isElementMenuItem(element));
            
            if (!element && getDefaultElementFunction) {
                element = getDefaultElementFunction(startElement);
                if (!this._isElementMenuItem(element)) {
                    element = this._findMenuItem(element, getNextElementFunction);
                }
            }

            return element;
        }

        _isElementMenuItem(element) {
            return element && (element.classList.contains('menu-item') || element.classList.contains('menu-item-label')) && element.checkVisibility();
        }
        
        _documentClickEventListener(event) {
            if ($kt.uiHelper.isSettingsVisible()) {
                return;
            }

            const target = event.target;
            
            if ($kt.uiHelper.isSettingsButton(target)) {
                return;
            }

            if (this._isLevelUpHintVisible() && !this._levelUpHint.contains(target)) {
                this._closeLevelUpContainer();
                return;
            }
            
            if (this._isLevelUpTextVisible()) {
                this._forceCloseLevelUpText();
                return;
            }

            if (this._isGameClearOrGameOverVisible()) {
                $kt.uiHelper.backToTitle();
                return;
            }

            if (this._isPreTitleVisible()) {
                this._hidePreTitle();
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
            
            this._fadeLevelUpTextToLevelUpHint(this._showHintOnLevelUp, 'var(--default-transition-time)');
        }
        
        _animateDetails() {
            const detailsElements = document.getElementsByTagName('details');
            [...detailsElements].forEach(details => {
                    const summary = details.firstElementChild;

                    summary.addEventListener('click', event => {
                        if (details.open) {
                            event.preventDefault();
                            details.classList.add('closing');
                        }
                    })

                    details.addEventListener('animationend', event => {
                        if (event.animationName === 'close') {
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

        _isMenuItemFocused() {
            const focusedItem = document.activeElement
            return focusedItem && focusedItem.classList.contains('menu-item');
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

        _isGameClearOrGameOverVisible() {
            return this._gameClearText.checkVisibility() || this._gameOverText.checkVisibility();
        }

        _isCreditsVisible() {
            return this._credits.checkVisibility();
        }

        _isPreTitleVisible() {
            return this._preTitleText.checkVisibility();
        }

        _isFocused(element) {
            return document.activeElement === element;
        }

        /**
         * Uses the _showNewLevelDataFunction field for its end listener
         * @param {string} [duration='var(--default-transition-time)'] Duration in CSS format, default is 'var(--default-transition-time)'
         * @param {string} [delay='0s'] Delay in CSS format, default is '0s'
         */
        _closeLevelUpContainer(duration = 'var(--default-transition-time)', delay = '0s') {
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

    // KantoreUiHelper has access to private fields
    // of this class (friend class)
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
            
            this._closeMeaning = document.getElementById('close-meaning');
            this._closeHint = document.getElementById('close-hint');
            
            this._backToMenu = document.getElementById('back-to-main-menu-button');
            this._returnToGame = document.getElementById('return-to-game-button');
        }

        _addEventListeners() {
            this._settingsButton.addEventListener('click', $kt.uiHelper.showSettings);
            this._settingsDiv.addEventListener('click', e => {
                if (!this._settingsContainer.contains(e.target)) {
                    $kt.uiHelper.hideSettings();
                }
            });
            
            this._bgmVolume.addEventListener('change', e => this._bgmVolumeChanged(Number(e.target.value)));
            this._seVolume.addEventListener('change', e => this._seVolumeChanged(Number(e.target.value)));
            
            this._backToMenu.addEventListener('click', $kt.uiHelper.backToTitle);
            this._returnToGame.addEventListener('click', $kt.uiHelper.hideSettings);
        }

        _restoreSavedSettings() {
            this._bgmVolume.value = $kt.settings.bgmVolume;
            this._seVolume.value = $kt.settings.seVolume;
            this._closeMeaning.checked = $kt.settings.closeMeaning;
            this._closeHint.checked = $kt.settings.closeHint;
        }

        _bgmVolumeChanged(newVolume) {
            $kt.settings.bgmVolume = newVolume;
        }

        _seVolumeChanged(newVolume) {
            $kt.settings.seVolume = newVolume;
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
        }

    }

    // Has access to privete fields of
    // KantoreUi and KantoreSettingsUi
    // to facilitate communication
    // between the two (friend class)
    class KantoreUiHelper {

        /**
         * 
         * @param {HTMLElement} element 
         * @param {HTMLElement} [elementToFocus]
         */
        static showOverlayElement(element, elementToFocus) {
            element.style.visibility = 'visible';
            element.style.setProperty('--current-opacity', 'var(--visible-opacity)');

            if (elementToFocus) {
                element.ontransitionend = event => {
                    if (event.target !== element) {
                        return;
                    }
                    $kt.uiHelper.focusDefaultMenuItem(elementToFocus);
                    element.ontransitionend = null;
                };
            } else {
                $kt.ui._answerInput.blur();
            }
        }

        static hideOverlayElement(element) {
            element.style.removeProperty('visibility');
            element.style.removeProperty('--current-opacity');
        }

        static setCloseMeaningSetting(newValue) {
            $kt.settingsUi._closeMeaning.checked = newValue;
            $kt.settings.closeMeaning = newValue;
        }

        static setCloseHintSetting(newValue) {
            $kt.settingsUi._closeHint.checked = newValue;
            $kt.settings.closeHint = newValue;
        }

        static isSettingsVisible() {
            return $kt.settingsUi._settingsDiv.checkVisibility({ visibilityProperty: true });
        }

        static showSettings() {
            $kt.uiHelper.showOverlayElement($kt.settingsUi._settingsDiv, $kt.settingsUi._returnToGame);
        }

        static hideSettings() {
            $kt.uiHelper.hideOverlayElement($kt.settingsUi._settingsDiv);
            if ($kt.ui._titleScene.checkVisibility()) {
                $kt.uiHelper.startTitleScene();
            } else {
                $kt.ui.focusAnswerInput();
            }
        }

        static focusAnswerInput() {
            $kt.ui.focusAnswerInput();
        }

        static focusSelectedMenuItem(element) {
            $kt.uiHelper._focusMenuItem(element);

            // This prevents multiple sounds from focusing
            // on the same checkbox over and over again
            // directly or through a label
            if (!element.parentNode.classList.contains('menu-item-label')) {
                $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            }

        }

        static focusDefaultMenuItem(element) {
            $kt.uiHelper._focusMenuItem(element);
        }

        static _focusMenuItem(element) {
            element.focus({ focusVisible: true });
        }

        static backToTitle() {
            $kt.ui._switchToScene($kt.ui._titleScene);
            $kt.uiHelper.hideSettings();
            $kt.settingsUi._settingsDiv.ontransitionend = event => {
                if (event.target === $kt.settingsUi._settingsDiv) {
                    $kt.uiHelper.startTitleScene();
                    $kt.settingsUi._settingsDiv.ontransitionend = null;
                }
            };
        }

        static startTitleScene() {
            $kt.uiHelper.focusDefaultMenuItem($kt.ui._titleStartButton);
        }

        /**
         * 
         * @param {string} className Class name to be added
         * @param {[string]} allSettingsClassNames Class names to be removed before adding the new one
         */
        static setSettingsClass(className, allSettingsClassNames) {
            $kt.settingsUi._settingsDiv.classList.remove(...allSettingsClassNames);
            $kt.settingsUi._settingsDiv.classList.add(className);
        }

        static connectCheckboxesToDetails() {
            [
                [$kt.settingsUi._closeMeaning, $kt.ui._meanigsDetails, $kt.settings.closeMeaning, value => $kt.settings.closeMeaning = value],
                [$kt.settingsUi._closeHint, $kt.ui._hintDetails, $kt.settings.closeHint, value => $kt.settings.closeHint = value]
            ].forEach(([checkbox, details, initValue, changeListener]) => $kt.uiHelper._connectCheckboxToDetails(checkbox, details, initValue, changeListener));
        }

        static isSettingsButton(element) {
            return $kt.settingsUi._settingsButton.contains(element);
        }

        static _connectCheckboxToDetails(checkbox, details, initValue, changeListener) {
            checkbox.checked = initValue;
            details.open = !initValue;
            
            checkbox.addEventListener('change', () => changeListener(checkbox.checked));
            checkbox.addEventListener('change', () => details.open = !checkbox.checked);

            const summary = details.firstElementChild;
            // The open status updates after the click,
            // so if its opening open = false,
            // if closing open = true
            summary.addEventListener('click', () => changeListener(details.open));
            summary.addEventListener('click', () => checkbox.checked = details.open);
        }

    }

    $kt.uiHelper = KantoreUiHelper;
    $kt.ui = new KantoreUi();
    $kt.settingsUi = new KantoreSettingsUi();

    $kt.uiHelper.connectCheckboxesToDetails();

    $kt.ui.hideStartupLoading();

})();