import { dialogue } from './dialogue-ui.js';
import { dicts } from './dicts.js';
import { gameUi } from './game-ui.js';
import { audio } from './audio.js';
import { GAME_TYPE } from './enums.js';
import { KantorePersistence } from './persistence.js';
import { KantoreUiHelper } from './ui-helper.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

// KantoreUiHelper has access to private fields
// of this class (friend class)
class KantoreTitleUi {

    constructor() {
        this._menuGameType = GAME_TYPE.MAIN;
        this._getAllElements();
        this._addEventListeners();
        this._createCategoryMenus();
        this._getAllMenuAndArcadeCategoryElements();
        this._addCategoriesBackButtonEventListeners();
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

        KantoreUiHelper.showMenu(menuToShow);
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
            KantoreUiHelper.focusTemporarily(this._credits);
        }
    }

    _getAllElements() {
        this._titleScene = document.getElementById('title-screen-container');
        this._titleStartGameMainButton = document.getElementById('start-game-main-button');
        this._titleSettingsButton = document.getElementById('title-settings-button');
        this._preTitleText = document.getElementById('pre-title-press-start-text');
        this._mainMenu = document.getElementById('main-menu');
        this._credits = document.getElementById('credits');

        this._levelSelect = document.getElementById('level-select');
        this._createKeepProgressLevelSelectOption();
        this._levelSelectLevels = [...this._levelSelect.getElementsByClassName('level-select-button')];

        this._arcadeMenu = document.getElementById('arcade-menu');
        this._arcadeDifficultyButtons = [...this._arcadeMenu.getElementsByClassName('arcade-difficulty-button')];
        this._arcadeCategoriesButton = document.getElementById('arcade-categories-button');
        this._practiceCategoriesButton = document.getElementById('start-game-practice-button');
    }

    _addEventListeners() {
        this._titleStartGameMainButton.addEventListener('click', this._startGameButtonEventListener.bind(this));
        this._titleSettingsButton.addEventListener('click', KantoreUiHelper.showSettings);
        
        this._levelSelectLevels.forEach(button => {
            button.addEventListener('click', () => {
                const level = Number(button.dataset.level);

                const gameStatus = KantorePersistence.getGameStatus() || {};
                if (level !== 0 && gameStatus.level !== level) {
                    dicts.getLevelDict(level).preload();
                    gameStatus.level = level;
                    gameStatus.currentLevelExp = 0;
                    gameStatus.gaveUp = false;
                    KantorePersistence.setGameStatus(gameStatus);
                    KantorePersistence.removeGameQuestion();
                    gameUi.setupLevelHints(level);
                }

                const flags = KantorePersistence.getFlags() || {};
                flags.levelSelected = true;
                KantorePersistence.setFlags(flags);

                KantoreUiHelper.hideMenu(this._levelSelect);
                dialogue.show(
                    'Controls',
                    $kt.templates.controls(),
                    KantoreUiHelper.startGameMain
                );
            });
        });

        this._arcadeDifficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const categoryName = button.textContent;
                const dict = dicts.getCategoryDict(button.dataset.dict);
                this._startArcadeMode(categoryName, dict);
            });
        });

        this._arcadeCategoriesButton.addEventListener('click', () => {
            this._menuGameType = GAME_TYPE.ARCADE;
        });

        this._practiceCategoriesButton.addEventListener('click', () => {
            this._menuGameType = GAME_TYPE.PRACTICE;
        });
    };

    _startGameButtonEventListener() {
        const flags = KantorePersistence.getFlags() || {};

        if (flags.levelSelected) {
            KantoreUiHelper.startGameMain();
            return;
        }

        KantoreUiHelper.hideMenu(this._mainMenu);
        KantoreUiHelper.showMenu(this._levelSelect);
    }
    
    _createKeepProgressLevelSelectOption() {
        const persistedGameStatus = KantorePersistence.getGameStatus();
        if (!persistedGameStatus) {
            return;
        }

        const level = persistedGameStatus.level || 1;
        this._levelSelect.insertAdjacentHTML(
            'afterbegin',
            /*html*/ `<button class="menu-item menu-button level-select-button" id="level-select-keep-progress" data-level="0">Keep current progress - Level ${level}</button>`
        );
    }

    _isPreTitleVisible() {
        return this._preTitleText.checkVisibility();
    }

    _isCreditsVisible() {
        return this._credits.checkVisibility();
    }

    _hidePreTitle() {
        this._preTitleText.classList.add('hidden');
        KantoreUiHelper.showMenu(this._mainMenu);
        audio.playEffect(audio.seTracks.CONFIRM);
        audio.startBgms();
    }

    _createCategoryMenus() {
        const container = this._titleScene;
        const categories = dicts.categories;

        container.insertAdjacentHTML(
            'beforeend',
            $kt.templates.categoriesMenu(categories)
        );

        [...this._titleScene.getElementsByClassName('category-entry-button')]
            .forEach(button => button.addEventListener('click', () => {
                const categoryName = button.textContent;
                const dict = button.dataset.levelDict
                    ? dicts.getLevelDict(Number(button.dataset.levelDict))
                    : dicts.getCategoryDict(button.dataset.tagDict);

                if (this._menuGameType === GAME_TYPE.ARCADE) {
                    this._startArcadeMode(categoryName, dict);
                } else {
                    KantoreUiHelper.startGamePractice(categoryName, dict);
                }
            }));

        this._disableCategoryMenuElements();
    }

    _getAllMenuAndArcadeCategoryElements() {
        this._menuElements = [...this._titleScene.getElementsByClassName('menu')];
        this._categoriesBackButton = document.getElementById('category-main-categories-back-button');
        this._categoriesMenu = document.getElementById('category-main-categories-container');
    }

    _addCategoriesBackButtonEventListeners() {
        this._categoriesBackButton.addEventListener('click', () => {
            KantoreUiHelper.hideMenu(this._categoriesMenu);

            if (this._menuGameType === GAME_TYPE.ARCADE) {
                KantoreUiHelper.showMenu(this._arcadeMenu);
                return;
            }

            KantoreUiHelper.showMenu(this._mainMenu);
        });
    }

    _disableCategoryMenuElements() {
        const beatenLevelsButton = document.getElementById('category-main-categories-main-game-mode-levels-entry-beaten-levels-only-button');
        const levelsMenuButton = document.getElementById('category-main-categories-main-game-mode-levels-entry-main-game-mode-levels-button');
        
        const showMenuListener = () => {
            const gameStatus = KantorePersistence.getGameStatus();
            const disabled = !gameStatus || gameStatus.level <= 1;
            beatenLevelsButton.disabled = disabled;

            if (!disabled) {
                levelsMenuButton.removeEventListener('click', showMenuListener);
            }
        };

        levelsMenuButton.addEventListener('click', showMenuListener);
    }

    _startArcadeMode(categoryName, dict) {
        dict.preload();
        dialogue.show(
            'Arcade mode',
            $kt.templates.arcadeModeExplanation(),
            () => KantoreUiHelper.startGameArcade(categoryName, dict)
        );
    }
}

export const titleUi = new KantoreTitleUi();