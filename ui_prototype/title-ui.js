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
            this._credits = document.getElementById('credits');
        }

        _addEventListeners() {
            this._titleStartGameMainButton.addEventListener('click', $kt.uiHelper.startGameMain);
            this._titleSettingsButton.addEventListener('click', $kt.uiHelper.showSettings);
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
            $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            $kt.audio.playBgm($kt.audio.tracks.BGM_TRACK);
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
        }

        _getAllMenuElements() {
            this._menuElements = [...this._titleScene.getElementsByClassName('menu')];
        }
    }

    $kt.titleUi = new KantoreTitleUi();

})();