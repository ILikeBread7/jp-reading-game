'use strict';

var $kt = $kt || {};

(() => {

    // KantoreUiHelper has access to private fields
    // of this class (friend class)
    class KantoreTitleUi {

        constructor() {
            this._getAllElements();
            this._addEventListeners();
            this._createCategoryMenus();
            this._getAllMenuElements();
        }

        enterListener() {
            return this._handlePreTitle();
        }

        keyListener(key) {
            if (this._isCreditsVisible()) {
                this._handleCreditsScrolling(key);
                return true;
            }
            return false;
        }

        clickListener() {
            return this._handlePreTitle();
        }

        startTitleScene() {
            if (this._isPreTitleVisible()) {
                return;
            }

            const menuToShow = this._menuElements
                .find(menu => menu.checkVisibility())
                || this._mainMenu;

            $kt.uiHelper.showMenu(menuToShow);
        }

        /**
         * 
         * @returns {boolean} true if pre title was active, false if not
         */
        _handlePreTitle() {
            if (this._isPreTitleVisible()) {
                this._hidePreTitle();
                return true;
            }
            return false;
        }

        _handleCreditsScrolling(key) {
            if (
                key.startsWith('Page')
                || key === 'ArrowUp'
                || key === 'ArrowDown'
            ) {
                $kt.uiHelper.focusTemporarily(this._credits);
            }
        }

        _getAllElements() {
            this._titleScene = document.getElementById('title-screen-container');
            this._titleStartGameMainButton = document.getElementById('start-game-main-button');
            this._titleSettingsButton = document.getElementById('title-settings-button');
            this._preTitleText = document.getElementById('pre-title-press-start-text');
            this._mainMenu = document.getElementById('main-menu');
            this._levelSelect = document.getElementById('level-select');
            this._levelSelectLevels = [...this._levelSelect.getElementsByClassName('level-select-button')];
            this._credits = document.getElementById('credits');
        }

        _addEventListeners() {
            this._titleStartGameMainButton.addEventListener('click', this._startGameButtonEventListener.bind(this));
            this._titleSettingsButton.addEventListener('click', $kt.uiHelper.showSettings);
            
            this._levelSelectLevels.forEach(button => {
                const level = Number(button.dataset.level);
                button.addEventListener('click', () => {
                    const gameStatus = $kt.persistence.getGameStatus() || {};
                    gameStatus.level = level;
                    $kt.persistence.setGameStatus(gameStatus);
                    $kt.persistence.removeGameQuestion();
                    $kt.gameUi.setupLevelHints(level);

                    const flags = $kt.persistence.getFlags() || {};
                    flags.levelSelected = true;
                    $kt.persistence.setFlags(flags);

                    $kt.uiHelper.startGameMain();
                });
            });
        }

        _startGameButtonEventListener() {
            const flags = $kt.persistence.getFlags() || {};

            if (flags.levelSelected) {
                $kt.uiHelper.startGameMain();
                return;
            }

            $kt.uiHelper.hideMenu(this._mainMenu);
            $kt.uiHelper.showMenu(this._levelSelect);
        }
        
        _isPreTitleVisible() {
            return this._preTitleText.checkVisibility();
        }

        _isCreditsVisible() {
            return this._credits.checkVisibility();
        }

        _hidePreTitle() {
            this._preTitleText.classList.add('hidden');
            $kt.uiHelper.showMenu(this._mainMenu);
            $kt.audio.playEffect($kt.audio.seTracks.CONFIRM);
            $kt.audio.startBgms();
        }

        _createCategoryMenus() {
            const container = this._titleScene;
            const categories = $kt.dicts.categories;

            container.insertAdjacentHTML(
                'beforeend',
                $kt.templates.categoriesMenu(categories)
            );

            [...this._titleScene.getElementsByClassName('category-entry-button')]
                .forEach(button => button.addEventListener('click', () => {
                    const categoryName = button.textContent;
                    const dict = button.dataset.levelDict
                        ? $kt.dicts.getLevelDict(Number(button.dataset.levelDict))
                        : $kt.dicts.getCategoryDict(button.dataset.tagDict);

                    $kt.uiHelper.startGamePractice(categoryName, dict);
                }));

            this._disableCategoryMenuElements();
        }

        _getAllMenuElements() {
            this._menuElements = [...this._titleScene.getElementsByClassName('menu')];
        }

        _disableCategoryMenuElements() {
            const beatenLevelsButton = document.getElementById('category-main-categories-main-game-mode-levels-entry-beaten-levels-only-button');
            const levelsMenuButton = document.getElementById('category-main-categories-main-game-mode-levels-entry-main-game-mode-levels-button');
            
            const showMenuListener = () => {
                const gameStatus = $kt.persistence.getGameStatus();
                const disabled = !gameStatus || gameStatus.level <= 1;
                beatenLevelsButton.disabled = disabled;

                if (!disabled) {
                    levelsMenuButton.removeEventListener('click', showMenuListener);
                }
            };

            levelsMenuButton.addEventListener('click', showMenuListener);
        }
    }

    $kt.titleUi = new KantoreTitleUi();

})();