import { dialogue } from './dialogue-ui.js';
import { dicts } from './dicts.js';
import { KantoreLevels } from './levels.js';
import { KantorePersistence } from './persistence.js';
import { KantoreTemplates } from './templates.js';
import { KantoreUiHelper } from './ui-helper.js';
import { KantoreUtils } from './utils.js';

const HUB_MENU_ID = 'story-mode-menu';
const SUBMENU_ENTRY_BUTTON_CLASS = 'story-mode-entry-button';

class KantoreStoryModeUi {

    constructor() {

    }

    initialize() {
        this._lastVisibleMenu = null;
        this._progress = Object.assign({
            lastClearedLevel: 0,
            lastClearedStage: 0
        }, KantorePersistence.getStoryProgress() || {});

        this._createMenus();
        this._getMenuElements();
        this._addEventListeners();

        // const level = this._levels[1];
        // dialogue.showSequence(
        //     level.name,
        //     level.afterText.map(KantoreUtils.formatDialogueText)
        // );
    }

    /**
     * 
     * @param {boolean} [focusNextEntry] if true focus will move onto the next menu item
     */
    showStoryModeMenu(focusNextEntry) {
        const visibleMenu = this._allMenus.find(menu => menu.checkVisibility());
        if (visibleMenu) {
            this._lastVisibleMenu = visibleMenu;
        }

        if (this._lastVisibleMenu) {
            KantoreUiHelper.showMenu(this._lastVisibleMenu);
        }

        if (focusNextEntry) {
            const currentEntryId = this._lastVisibleMenu.dataset.lastUsedItem;
            const currentEntry = document.getElementById(currentEntryId);
            currentEntry.nextElementSibling.focus();
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

    /**
     * 
     * @param {*} levelData 
     * @returns {boolean} True if a new level was beaten, false otherwise
     */
    levelBeaten(levelData) {
        const stage = levelData.stage;
        if (stage < this._progress.lastClearedStage) {
            return false;
        }

        const level = levelData.level;
        if (level <= this._progress.lastClearedLevel) {
            return false;
        }

        const levelIndex = levelData.index;
        const nextLevelData = this._levels[levelIndex + 1];
        
        if (!nextLevelData || nextLevelData.stage > levelData.stage) {
            this._progress.lastClearedStage++;
            this._progress.lastClearedLevel = 0;
        } else {
            this._progress.lastClearedLevel++;
        }

        KantorePersistence.setStoryProgress(this._progress);
        return true;
    }

    _createMenus() {
        const hubMenu = [
            { name: 'Field - そうげん', entries: [
                {
                    name: `おじいさん - Old man 1`,
                    skin: 'test',
                    text: [
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
                    ]
                },
                {
                    name: `おじいさん - Old man 2 (${KantoreLevels.getLevelName(1)})`,
                    dict: dicts.getLevelDict(1),
                    skin: 'test',
                    beforeText: [
                        `The words attack you, but you decide to hold your ground.`
                    ],
                    afterText: [
                        `The words run away towards the edges of the fenced area.
                        It seems like they've lost all will to fight.`
                    ],
                    totalQuestions: 5
                },
                {
                    name: `おじいさん - Old man 3`,
                    text: [
                        `
                            After a not so fierce battle the old man taps your shoulder and says

                            “Great job! With battle skills like that you have nothing to worry about going forward!

                            But just in case you end up struggling against some future opponent, remember that you can train in either Learning mode or Practice mode.”
                        `,
                        `
                            “The levels you see in the parenthesis on the menu options are the recommended Learning mode levels to have beaten before challenging that part of the story.”
                        `,
                        `
                            “Now that you’re fully prepared you might want to begin your adventure!

                            A good start would be to go to the closest village!
                            You’re in luck because it’s not far from here, just past that forest.” he says while pointing.

                            “There’s also a pond on the way there where you can take a short break.”
                        `,
                        `
                            “That’s all, now, on your way! Good luck!” he pats your back a few times while merrily laughing and returns to his hut.

                            You don’t really have anything better to do so you reluctantly decide to follow his instructions and head towards the forest.
                        `
                    ]
                },
                {
                    name: `もり - Forest 1`,
                    text: [
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
                    ]
                },
                {
                    name: `もり - Forest 2 (${KantoreLevels.getLevelName(4)})`,
                    beforeText: [
                        `You are taken by surprise, but still decide to fight back against the words.`
                    ],
                    afterText: [
                       `The words scramble away after your first real battle and you continue with your journey through the forest.`
                    ],
                    dict: dicts.createComplexLevelDict(2, 4),
                    totalQuestions: 5
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

        this._levels = hubMenu.flatMap((menu, menuIndex) => {
            const stage = menuIndex + 1;

            menu.entries.forEach((entry, entryIndex) => {
                entry.level = entryIndex + 1;
                entry.stage = stage;
            });

            return menu.entries;
        });
        this._levels.forEach((level, index) => level.index = index);
    }

    _getMenuElements() {
        this._hubMenu = document.getElementById(HUB_MENU_ID);
        this._hubMenuEntryButtons = [...this._hubMenu.getElementsByClassName('story-entry-button')];
        this._storyModeEntryButtons = [...document.getElementsByClassName(SUBMENU_ENTRY_BUTTON_CLASS)];
        this._allMenus = [...document.getElementsByClassName('story-menu')];
    }

    _addEventListeners() {
        const hiddenClass = 'hidden';
        const clearedClass = 'cleared';

        const menuEventListener = (buttons, lastCleared) => {
            buttons.forEach((button, index) => {
                const level = index + 1;

                if (level <= lastCleared + 1) {
                    button.classList.remove(hiddenClass);
                    if (level <= lastCleared) {
                        button.classList.add(clearedClass);
                    }
                } else {
                    button.classList.add(hiddenClass);
                }
            });
        }

        KantoreUiHelper.addMenuShownEventListener(
            this._hubMenu,
            () => menuEventListener(this._hubMenuEntryButtons, this._progress.lastClearedStage)
        );

        // All except hub menu
        this._allMenus.slice(1).forEach((menu, index) => {
            const buttons = [...menu.getElementsByClassName(SUBMENU_ENTRY_BUTTON_CLASS)];
            
            KantoreUiHelper.addMenuShownEventListener(
                menu,
                () => {
                    const level = index + 1;
                    const lastClearedLevel = this._progress.lastClearedStage >= level
                        ? Number.MAX_SAFE_INTEGER   // If the stage is cleared all levels in it are cleared
                        : this._progress.lastClearedLevel;
                    menuEventListener(buttons, lastClearedLevel);
                    KantoreUiHelper.resetBodySkin();
                }
            );
        });

        const createTextEntryEventListener = levelData => {
            return () => {
                this._setBodySkin(levelData.skin);
                dialogue.showSequence(
                    levelData.name,
                    levelData.text.map(KantoreUtils.formatDialogueText),
                    () => {
                        const newLevelBeaten = this.levelBeaten(levelData);
                        KantoreUiHelper.showStoryModeMenu(newLevelBeaten);
                    }
                );
            };
        };
        
        const createBattleEntryEventListener = levelData => {
            return () => {
                this._setBodySkin(levelData.skin);
                levelData.dict.preload();
                dialogue.showSequence(
                    levelData.name,
                    levelData.beforeText.map(KantoreUtils.formatDialogueText),
                    () => KantoreUiHelper.startGameStory(levelData)
                );
            };
        };

        this._storyModeEntryButtons.forEach((button, index) => {
            const level = this._levels[index];

            const listener = level.dict
                ? createBattleEntryEventListener(level)
                : createTextEntryEventListener(level);

            button.addEventListener('click', listener);
        });
    }

    _setBodySkin(skin) {
        if (skin) {
            document.body.dataset.skin = skin;
        } else {
            KantoreUiHelper.resetBodySkin();
        }
    }

}

export const storyModeUi = new KantoreStoryModeUi();