import { KantoreLevels } from './levels.js';
import { KantoreTemplates } from './templates.js';
import { KantoreUiHelper } from './ui-helper.js';

const HUB_MENU_ID = 'story-mode-menu';

class KantoreStoryModeUi {

    constructor() {

    }

    initialize() {
        this._createMenus();
        this._getMenuElements();
        this._addEventListeners();
    }

    _createMenus() {
        const hubMenu = [
            { name: 'Hiragana', entries: [
                { name: `おじいさん - Old man (${KantoreLevels.getLevelName(1)})` },
                { name: `もり - Forest (${KantoreLevels.getLevelName(4)})` },
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
    }

    _getMenuElements() {
        this._hubMenu = document.getElementById(HUB_MENU_ID);
        this._hubMenuEntryButtons = [...this._hubMenu.getElementsByClassName('story-entry-button')];
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
    }

}

export const storyModeUi = new KantoreStoryModeUi();