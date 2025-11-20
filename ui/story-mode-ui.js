import { dialogue } from './dialogue-ui.js';
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
                {
                    name: `おじいさん - Old man (${KantoreLevels.getLevelName(1)})`,
                    beforeText: [
                        'Before test 1', 'Before test 2'
                    ],
                    afterText: [
                        'After test 1', 'After test 2'
                    ]
                },
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

        this._levels = hubMenu.flatMap(menu => menu.entries);
    }

    _getMenuElements() {
        this._hubMenu = document.getElementById(HUB_MENU_ID);
        this._hubMenuEntryButtons = [...this._hubMenu.getElementsByClassName('story-entry-button')];
        this._storyModeEntryButtons = [...document.getElementsByClassName('story-mode-entry-button')];
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

                dialogue.showSequence(
                    level.name,
                    level.beforeText,
                    () => {
                        console.log(`Start story mode level ${level.name}`)
                        queueMicrotask(() => dialogue.showSequence(
                            level.name,
                            level.afterText,
                            () => console.log(`End story mode level ${level.name}`)
                        ))
                    }
                )
            });
        });
    }

}

export const storyModeUi = new KantoreStoryModeUi();