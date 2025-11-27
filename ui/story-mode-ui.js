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

        const level = this._levels[1];
        dialogue.showSequence(
            level.name,
            level.afterText.map(KantoreUtils.formatDialogueText)
        );
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

                            You look around and see a small hut in the distance with smoke coming out of its chimney and a fence around its backyard.
                            Looking closer you notice an old man peeking through a window from inside the hut.

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
                            The old man notices your bewilderment and points to a group of words surrounded by the fence in the hut’s backyard.

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
                        `
                            After a not so fierce battle the old man taps your shoulder and says

                            “Great job! With battle skills like that you have nothing to worry about going forward!

                            But just in case you end up struggling against some future opponent, remember that you can train in either Learning mode or Practice mode.”
                        `,
                        `
                            “The level you see in the parenthesis on the menu option and in the title of this dialogue message is the recommended Learning mode level to have beaten before challenging this part of the story.”
                        `,
                        `
                            “Now that you’re fully prepared you might want to begin your adventure!

                            A good start would be to go to the closest village!
                            You’re in luck because it’s not far from here, just past that forest.” he says while pointing.
                        `,
                        `
                            “There’s a pond on the way there where you can take a short break.

                            There’s also a big mountain right before the village.
                            Don’t try to climb it or go around; there’s a cave going straight through it, like a tunnel. Go through there.”
                        `,
                        `
                            “That’s all, now, on your way! Good luck!” he pats your back a few times while merrily laughing and returns to his hut.

                            You don’t really have anything better to do so you reluctantly decide to follow his instructions and head towards the forest.
                        `,
                    ],
                    dict: dicts.getLevelDict(1),
                    totalQuestions: 5
                },
                {
                    name: `もり - Forest (${KantoreLevels.getLevelName(4)})`,
                    beforeText: [
                        `
                            You walk on a trail through the forest.
                            
                            There are trees and bushes all over, the birds are chirping, animals are frolicking, and sunshine is coming through the leaves overhead.
                            
                            The scenery feels peaceful and idyllic.
                        `,
                        `
                            Suddenly you notice subtle rustling in the nearby bushes.
                            
                            You don’t pay it much attention at first, thinking it’s probably some small harmless animals messing around.
                        `,
                        `
                            Until you get jumped by words emerging from all around.
                        `
                    ],
                    afterText: [
                       `
                            You come up victorious from your first real battle and continue with your journey through the forest.
                       `
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