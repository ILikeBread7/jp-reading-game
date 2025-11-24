import { dialogue } from './dialogue-ui.js';
import { dicts } from './dicts.js';
import { KantoreLevels } from './levels.js';
import { KantoreTemplates } from './templates.js';
import { KantoreUiHelper } from './ui-helper.js';

const HUB_MENU_ID = 'story-mode-menu';

class KantoreStoryModeUi {

    constructor() {

    }

    initialize() {
        this._lastVisibleMenu = null;
        this._createMenus();
        this._getMenuElements();
        this._addEventListeners();
    }

    showStoryModeMenu() {
        const visibleMenu = this._allMenus.find(menu => menu.checkVisibility());
        if (visibleMenu) {
            this._lastVisibleMenu = visibleMenu;
        }

        if (this._lastVisibleMenu) {
            KantoreUiHelper.showMenu(this._lastVisibleMenu);
        }
    }

    hideStoryModeMenu() {
        const visibleMenu = this._allMenus.find(menu => menu.checkVisibility());
        this._lastVisibleMenu = visibleMenu;

        if (visibleMenu) {
            KantoreUiHelper.hideMenu(visibleMenu);
        }
    }

    isVisible() {
        return this._allMenus.some(menu => menu.checkVisibility());
    }

    _createMenus() {
        const hubMenu = [
            { name: 'Hiragana', entries: [
                {
                    name: `おじいさん - Old man (${KantoreLevels.getLevelName(1)})`,
                    beforeText: [
                        /*html*/ `
                            Test <span class="popover" data-content="Test">test</span> after<br>
                            Test <span class="popover" data-content="Test">test</span> after<br>
                            Test <span class="popover" data-content="Test">test</span> after<br>
                            Test <span class="popover" data-content="Test">test</span> after<br>
                            `,
                        'Before test 1', 'Before test 2'
                    ],
                    afterText: [
                        'After test 1', 'After test 2'
                    ],
                    dict: dicts.getLevelDict(1),
                    totalQuestions: 5
                },
                {
                    name: `もり - Forest (${KantoreLevels.getLevelName(4)})`,
                    beforeText: [
                        'Before test forest 1', 'Before test forest 2', 'Before test forest 3'
                    ],
                    afterText: [
                        'After test forest 1', 'After test forest 2', 'After test forest 3'
                    ],
                    dict: dicts.createComplexLevelDict(2, 4),
                    totalQuestions: 10
                },
                { name: `いけ - Pond (${KantoreLevels.getLevelName(7)})` },
                { name: `どうくつ - Cave (${KantoreLevels.getLevelName(10)})` },
                { name: `ないてるこ - Crying child (${KantoreLevels.getLevelName(10)})` },
            ] },
            { name: 'Katakana', entries: [] },
            { name: 'Grade 1', entries: [] },
            { name: 'Grade 2', entries: [] },
            { name: 'Grade 3', entries: [] },
            { name: 'Grade 4', entries: [] },
            { name: 'Grade 5', entries: [] },
            { name: 'Grade 6', entries: [] },
            { name: 'Junior High', entries: [] },
            { name: 'Jinmeiyo (postgame)', entries: [] },
            { name: 'Hyougai (postgame)', entries: [] },
        ];

        const parentMenuId = 'main-menu';
        const menuHtml = KantoreTemplates.storyModeMenu(HUB_MENU_ID, parentMenuId, hubMenu);
        document.body.insertAdjacentHTML('beforeend', menuHtml);

        this._levels = hubMenu.flatMap(menu => menu.entries);
    }

    _getMenuElements() {
        this._hubMenu = document.getElementById(HUB_MENU_ID);
        this._hubMenuEntryButtons = [...this._hubMenu.getElementsByClassName('story-entry-button')];
        this._storyModeEntryButtons = [...document.getElementsByClassName('story-mode-entry-button')];
        this._allMenus = [...document.getElementsByClassName('story-menu')];
    }

    _addEventListeners() {
        KantoreUiHelper.addMenuShownEventListener(this._hubMenu, () => {
            this._hubMenuEntryButtons.forEach((button, index) => {
                if (index % 2 === 1) {
                    button.disabled = true;
                }

                if (index % 3 === 1) {
                    button.classList.add('hidden');
                }
            });
        });

        this._storyModeEntryButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const level = this._levels[index];
                level.dict.preload();
                dialogue.showSequence(
                    level.name,
                    level.beforeText,
                    () => KantoreUiHelper.startGameStory(level)
                );
            });
        });
    }

}

export const storyModeUi = new KantoreStoryModeUi();