import { dialogue } from './dialogue-ui.js';
import { dicts } from './dicts.js';
import { KantoreLevels } from './levels.js';
import { KantoreTemplates } from './templates.js';
import { KantoreUiHelper } from './ui-helper.js';
import { KantoreUtils } from './utils.js';

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
                        `
                            You wake up in a field.

                            You look around and see a small hut in the distance with smoke coming out of its chimney.
                            Looking closer you notice an old man peeking through a window inside the hut.

                            He notices you, sprints towards the door, flings it open, and rushes in your direction.
                        `,
                        `
                            “Another one of you!” he exclaims with excitement.

                            “I know you’re confused and don’t remember how you got here, but listen, this is important if you want to survive here.” he continues.
                        `,
                        `
                            “This is a world where words run around everywhere. Most of them are harmless but some of them can be vicious and will attack you at sight.

                            Some outlaws even capture and use them to attack people.

                            In order to protect yourself you need to be able to read those words.
                            If you figure out the correct spelling of a word it can’t harm you.”
                        `,
                        `
                            The old man notices your bewilderment and points to a group of words surrounded by a fence in the hut’s backyard.

                            “It will make more sense in practice. Here, try sparring against some of the words I’ve captured. That should help you prepare yourself for future battles.” he says while leading you inside the fence.
                        `,
                        `
                            “One last thing, you have 60 seconds to figure out how to read each word.

                            If you can’t do it you can skip a word up to 3 times during a single battle by submitting an empty answer.

                            If you don’t answer or skip within the time limit, you lose.”

                            As he finishes talking the words jump at you, and the battle starts.
                        `
                    ],
                    afterText: [
                        `After test 1
                        
                        Test 1`, 'After test 2'
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
                    level.beforeText.map(KantoreUtils.formatDialogueText),
                    () => KantoreUiHelper.startGameStory(level)
                );
            });
        });
    }

}

export const storyModeUi = new KantoreStoryModeUi();