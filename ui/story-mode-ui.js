import { dialogue } from './dialogue-ui.js';
import { dicts } from './dicts.js';
import { KantoreLevels } from './levels.js';
import { KantorePersistence } from './persistence.js';
import { KantoreTemplates } from './templates.js';
import { KantoreUiHelper } from './ui-helper.js';
import { KantoreUtils } from './utils.js';

const HUB_MENU_ID = 'story-mode-menu';
const SUBMENU_ENTRY_BUTTON_CLASS = 'story-mode-entry-button';
const TO_BE_CONTINUED_STRING = 'To be continued...';

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
        // dialogue.showSequence(level.name, [level.beforeText, level.text, level.afterText].filter(Boolean).flat().map(KantoreUtils.formatDialogueText));
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

            if (focusNextEntry) {
                const currentEntryId = this._lastVisibleMenu.dataset.lastUsedItem;
                const currentEntry = document.getElementById(currentEntryId);
                currentEntry.nextElementSibling.focus();
            }
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
        if (stage <= this._progress.lastClearedStage) {
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
            {
                name: 'そうげん - Field',
                entries: [
                    {
                        name: `ふしぎなおとこ - Mysterious man`,
                        text: [
                            `
                                Ugh… Hey, don’t just appear all of a sudden!”
                                You hear an annoyed voice from behind. You turn around and see a man glaring at you.
                                
                                “You’re supposed to report when you use the-”
                                Suddenly, he stops, his face turns pale, and his eyes become wide open.
                            `,
                            `
                                “How did you get here?! Crap!” he screams before turning around and taking off towards nearby woods.
                                
                                You are so stunned by the interaction that by the time you think about following him, he’s already out of sight.
                            `,
                            `
                                You didn’t recognize him, but he surely seemed to know you.
                                
                                You try to remember who he might be, but then you realize something even stranger.
                                
                                You have no memories prior to this moment.
                            `,
                            `
                                Among the confusion, you decide to look around.
                                
                                It looks like you are in a field.
                                
                                There's a small hut in the distance with smoke coming out of its chimney and a fence around its backyard.
                                Looking closer you notice an old man peeking through a window from inside the hut.
                                
                                He notices you, sprints towards the door, flings it open, and rushes in your direction.
                            `
                        ]
                    },
                    {
                        'name': `おじいさん - Old man 1`,
                        text: [
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
                                
                                
                                “One last thing, you have 60 seconds to figure out how to read each word.
                                
                                If you can’t do it you can avoid a word up to 3 times during a single battle!” (By submitting an empty answer.)
                                
                                “If you don’t answer or avoid within the time limit, you lose.”
                                
                                As he finishes talking the words jump at you, and the battle starts.
                            `
                        ]
                    },
                    {
                        name: `Fence - へい (${KantoreLevels.getLevelName(1)})`,
                        dict: dicts.getLevelDict(1),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                The words attack you, but you decide to hold your ground.
                            `
                        ],
                        afterText: [
                            `
                                The words run away towards the edges of the fenced area.
                                It seems like they've lost all will to fight.
                            `
                        ]
                    },
                    {
                        name: `おじいさん - Old man 2`,
                        text: [
                            `
                                After a not so fierce battle the old man taps your shoulder and says
                                
                                “Great job! With battle skills like that you have nothing to worry about going forward!
                                
                                But just in case you end up struggling against some future opponent, remember that you can always train and practice!” (In either “Learning mode” or “Practice mode”. The levels you see in the parenthesis on the menu options are the recommended “Learning mode” levels to have beaten before challenging that part of the story.)
                            `,
                            `
                                “Now that you’re fully prepared you might want to begin your adventure!
                                
                                A good start would be to go to the closest village!
                                You’re in luck because it’s not far from here, just past that forest.” he says while pointing.
                                
                                “There’s also a pond on the way there where you can take a short break.”
                            `,
                            `
                                “That’s all, now, on your way! Good luck!” he pats your back a few times while merrily laughing and returns to his hut.
                                
                                You’re no less confused than before, but you need to get going.
                                The sun is starting to go down and you need a safe place to stay before the night sets in.
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
                                You keep looking around, hoping to find the mysterious man, but you don’t see anyone.
                                
                                Suddenly, you notice subtle rustling in the nearby bushes.
                                
                                You decide to check it out, thinking maybe it’s him.
                            `,
                            `
                                You walk up to the bushes, and a word jumps out from them.
                                You’re disappointed and decide to walk away.
                                
                                Until you get jumped by words emerging from all around.
                            `
                        ]
                    },
                    {
                        name: `もり - Forest 2 (${KantoreLevels.getLevelName(4)})`,
                        dict: dicts.createComplexLevelDict(2, 4),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You are taken by surprise, but still decide to fight back against the words.
                            `
                        ],
                        afterText: [
                            `
                                You come up victorious from your first real battle, and, as the words scramble away, you continue with your journey through the forest.
                            `
                        ]
                    },
                    {
                        name: `いけ - Pond 1`,
                        text: [
                            `
                                After walking for a little bit longer you come across the pond the old man told you about.
                                
                                The water is calm, on the opposite side of the pond there’s a small deer eating berries from a nearby bush, and a plethora of other animals feeding themselves and quenching their thirst.
                            `,
                            `
                                You decide to rest here for a moment, but first, learning from the previous experience, you check behind every tree, bush or rock in the vicinity to make sure there are no rouge words around waiting to attack you.
                                
                                Having confirmed there’s none you sit down on a nearby rock and relax.
                            `,
                            `
                                After a few moments you hear a voice from behind you.
                                
                                “What are you doing?”
                                
                                You turn around and see a young lady, wearing a sporty outfit, looking at you with a puzzled expression, as if you were a village idiot.
                                
                                “That’s dangerous, you know? Sitting alone. Not paying attention to your surroundings.”
                                
                                She pauses for a moment, probably waiting for a response, but, after noticing your consternation, continues talking.
                                
                                “Anyway, we shouldn’t stay here for too long or feral words will come and-” before she finishes speaking a group of words jumps out of the pond.
                                
                                “Watch out!” she shouts as the words leap at you.
                            `
                        ]
                    },
                    {
                        name: `いけ - Pond 2 (${KantoreLevels.getLevelName(10)})`,
                        dict: dicts.createComplexLevelDict(5, 10),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                You get ambushed by the words and fight back together with the lady.
                            `
                        ],
                        afterText: [
                            `
                                Together, you beat all the words that emerge from the pond.
                            `
                        ]
                    },
                    {
                        name: `いけ - Pond 3`,
                        text: [
                            `
                                After the fight you explain the situation to the lady.
                                
                                “Oh, okay. Yeah, I guess if you just came from our world you might not know. No place is safe, no matter how thoroughly you check your surroundings the words can still be hiding somewhere, in the water, on top of trees or even underground!” she explains vigorously.
                                
                                That’s valuable information, but one part especially catches your attention so you decide to ask about it.
                                
                                “Oh, right, I haven’t told you yet. Yes, I also come from the same world. I ended up here not long before you.
                                Damn that old geezer, he also told you to rest near the pond?
                                I almost died because of him. Don’t listen to his advice, I don’t know what he’s trying to do but it doesn’t seem to be helping us.” she says with a pouting face.
                            `,
                            `
                                “Apparently you’re not supposed to travel long distances alone.
                                If you need to take a break along the way, you should bring a companion so you can alternate keeping watch while the other person is resting.
                                That’s why I wasn’t able to leave the village up ahead, where I’m staying.” she continues, pointing in the direction of the village.
                                
                                “Anyway, let’s go. The village is not too far from here, and we shouldn’t stay in one place for too long or you know what’s coming.” she beckons you with a smile and you follow her to the village.
                            `
                        ]
                    },
                    {
                        name: `みちのとちゅう - On the way`,
                        text: [
                            `
                                “Oh, right. I forgot to introduce myself! I’m Harumi, nice to meet you!” your new companion says, introducing herself.
                                
                                “Or, at least that’s what everyone calls me in the village; I don’t remember my real name, or anything at all, just like you.” she adds while apologetically smiling.
                            `,
                            `
                                After a short conversation Harumi turns to you, starts waving her hands energetically, and says with excitement.
                                
                                “Oh, I forgot to tell you about one more cool thing! Here, see this.”
                                
                                She grins and puts her finger up before continuing.
                            `,
                            `
                                “Sky is blue.
                                <span class="popover" data-content="sky">そら</span> is <span class="popover" data-content="blue">あおい</span>.”
                                
                                “You see, in this world when people talk sometimes the words they say turn into Japanese!” she <span class="popover" data-content="says">いう</span> proudly, as if she was the one who discovered it.
                                
                                “Also, you can still see the meanings of those words if you try hard enough!” (Hover over them, click on them, or press shift. Press shift repeatedly to cycle through them.)
                            `,
                            `
                                “I learned this from grandma! I mean, an old lady who owns the inn I’m staying at in the village!
                                Cool, isn’t it?” she looks at you with sparkling eyes, supposedly seeking approval.
                                
                                “Hey, look! A squirrel!” before you can answer <span class="popover" data-content="she">かのじょ</span> excitedly runs up to a nearby tree while pointing at the rodent in the branches.
                                
                                Despite some distractions, the two of you continue on your way, and not before long arrive at the village’s gate.
                            `
                        ]
                    }
                ]
            },
            {
                name: 'むら - Village',
                entries: [
                    {
                        name: `もん - Gate 1`,
                        text: [
                            `
                                The village is surrounded by a wooden palisade the height of about two meters (about seven feet).
                                
                                More crucially, there’s also a closed gate leading inside the <span class="popover" data-content="village">むら</span>, around which a sizable group of words has gathered.
                            `,
                            `
                                “Sometimes words flock around the gate but this number is a little much. Usually there’s only a few.” Harumi says.
                                
                                “Anyway, they won’t open the <span class="popover" data-content="gate">もん</span> if there are words around; let’s beat’em up!
                                You attack from the left side, I take the right!” she continues, and eagerly rushes into combat before you have time to answer.
                                
                                You follow her lead and join the fight.
                            `
                        ]
                    },
                    {
                        name: `もん - Gate 2 (${KantoreLevels.getLevelName(12)})`,
                        dict: dicts.createComplexLevelDict(11, 12),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                The words seem focused on Harumi as you circle around them and strike them from behind.
                            `
                        ],
                        afterText: [
                            `
                                You and Harumi defeat the majority of the words gathered by the village’s palisade, while the remaining ones run away.
                            `
                        ]
                    },
                    {
                        name: `もん - Gate 3`,
                        text: [
                            `
                                “Seems like it’s all cleaned up!” Harumi exclaims proudly before facing towards the gate.
                                
                                “Hey! There are no more words around the <span class="popover" data-content="gate">もん</span>! You can open it now!” she shouts, but there’s no response.
                                
                                “Weird, there should be some guards near the <span class="popover" data-content="gate">もん</span> to <span class="popover" data-content="open (something)">あける</span> it when there’s no danger anymore.” <span class="popover" data-content="she">かのじょ</span> says with a perplexed face when the <span class="popover" data-content="gate">もん</span> still doesn’t <span class="popover" data-content="open (itself)">あく</span> after a moment.
                                
                                “I’ll take a look. Stay here.” <span class="popover" data-content="she">かのじょ</span> continues before swiftly climbing the wall and peeking into the other side.
                            `,
                            `
                                “Oh, no!” she shouts and immediately hops over the fortification, into the village.
                                
                                After a short moment the <span class="popover" data-content="gate">もん</span> <span class="popover" data-content="opens (itself)">あく</span> and you see a terrible scene.
                                
                                The whole <span class="popover" data-content="village">むら</span> is filled with words and people fighting them.
                                
                                Some defenders have proper equipment, like swords and shields, these are probably the guards, but some are only armed with improvised weapons, like pitchforks.
                                
                                Everyone else is either desperately running towards the closest building, or already barricaded inside.
                            `,
                            `
                                “Come on, we need to help!” you hear Harumi’s voice before you notice her plunge into battle.
                                
                                You rush inside to support the villagers.
                            `
                        ]
                    },
                    {
                        name: `むら - Village 1 (${KantoreLevels.getLevelName(14)})`,
                        dict: dicts.createComplexLevelDict(12, 14),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You join the battle and strike at the closest enemy.
                            `
                        ],
                        afterText: [
                            `
                                The battle is over. All words have been either defeated, or repelled away from the village.
                            `
                        ]
                    },
                    {
                        name: `むら - Village 2`,
                        text: [
                            `
                                After things have calmed down Harumi comes towards one of the guards and asks.
                                “What happened here? Where did all those words come from?”
                                
                                “We don’t know, they just suddenly appeared inside the village.” the guard answers.
                                
                                “Someone had to bring them in, there’s no way they could enter on their own!” another nearby guard shouts after hearing the conversation.
                            `,
                            `
                                You ask if they could’ve come from underground, as warned by Harumi before, but one of the guards responds.
                                
                                “No chance. The palisade is buried deep underground, deeper than any word can dig. This was a deliberate attack!”
                                
                                “But who would do something like this?” Harumi asks with a frown.
                            `,
                            `
                                “Waaah!”
                                Suddenly, you hear a child start crying.
                            `
                        ]
                    },
                    {
                        name: `ないてるこ - Crying child 1`,
                        text: [
                            `
                                Looking in the direction the cry is coming from, and you see a little girl bawling her eyes out.
                                You approach her and ask what's wrong.
                                
                                “Someone stole my… Waaah!!!” while still <span class="popover" data-content="crying">ないてる</span>, she points at a man running away just past the village gate.
                            `,
                            `
                                You start chasing the man, eventually almost catching up to him but he immediately attacks you.
                            `
                        ]
                    },
                    {
                        name: `どろぼう - Thief 1 (${KantoreLevels.getLevelName(20)})`,
                        dict: dicts.createComplexLevelDict(15, 20),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                The man sends out a big group of words in your direction to avoid getting caught.
                            `
                        ],
                        afterText: [
                            `
                                You manage to beat all the words, but lose track of the man.
                            `
                        ]
                    },
                    {
                        name: `どろぼう - Thief 2`,
                        text: [
                            `
                                When you were too busy fighting words to notice, Harumi sprinted past you, caught up with the man, and apprehended him.
                                
                                Apparently the words he sent out at you were his last ones.
                            `,
                            `
                                “It’s you again?!” he asks nervously after seeing you.
                                You realize that this is the man you were looking for.
                                
                                “Do you know him?” Harumi asks you, visibly confused.
                                
                                You explain your first encounter with the <span class="popover" data-content="man">おとこ</span> to her.
                                
                                “Playing stupid, huh? Whatever, not like I care.” the <span class="popover" data-content="man">おとこ</span> rebukes, not believing in your memory loss.
                            `,
                            `
                                He refuses to speak anymore, so you give up on trying to find out more from him.
                                
                                You search him for stolen goods and retrieve an old map.
                                Then you bring him back to the village.
                            `,
                            `
                                “Better watch your back from now on! We, the Aku no Soshiki, will never forget this!” he yells when you hand him over to the guards.
                                
                                You don’t know who the “Aku no Soshiki” is, but it doesn't seem important right now.
                                You return to the little girl.
                            `
                        ]
                    },
                    {
                        name: `ないてるこ - Crying child 2`,
                        text: [
                            `
                                “That’s my treasure map!” she says as her face lights up.
                                “This is the last thing my grandpa left me.” <span class="popover" data-content="she">かのじょ</span> continues.
                                
                                You return the <span class="popover" data-content="map">ちず</span> <span class="popover" data-content="to her (へ - grammar particle read as “e”)">かのじょ へ</span> and <span class="popover" data-content="she">かのじょ</span> looks at it for a moment, looks back at you, and continues.
                                
                                “Do you think you can find this <span class="popover" data-content="treasure">たから</span>? If you promise to split it with me, you can borrow my <span class="popover" data-content="map">ちず</span>!”
                            `,
                            `
                                You think about it for a moment when Harumi interjects.
                                “We should take it!
                                
                                That man we caught, he said he was from some organization? The ‘Aku no Soshiki’ or whatnot?
                                
                                If they still want this <span class="popover" data-content="map">ちず</span> they will probably come looking for us to get it back.”
                            `,
                            `
                                “That guy seemed to know you from our world, so maybe other members also do? If we meet them we could learn about our pasts, and maybe even how to go back to our world!” she continues excitedly.
                                
                                “We lost our memories from before coming here, but maybe not everyone does?” <span class="popover" data-content="she">かのじょ</span> finishes <span class="popover" data-content="her">かのじょ の</span> thought.
                            `,
                            `
                                You agree, and decide to accept the deal, much to the little girl’s content.
                                
                                You receive the <span class="popover" data-content="map">ちず</span>, and decide to prepare for your upcoming journey following the <span class="popover" data-content="map’s">ちず の</span> guidance with the goal of tracking down the “Aku no Soshiki”.
                            `
                        ]
                    },
                    {
                        name: `むらをたつ - Leaving the village`,
                        text: [
                            `
                                In order to gather more information, you ask the little girl if she knows what kind of treasure the map is leading to, but neither she, nor her parents seem to know.
                                
                                <span class="popover" data-content="Her">かのじょ の</span> mother only tells you that the grandpa, who left the map, would often be away from home for months at a time for work, but no one really knows what he was doing then, or what kind of work <span class="popover" data-content="he">かれ</span> was performing. They don’t know where <span class="popover" data-content="he">かれ</span> got the <span class="popover" data-content="map">ちず</span> from, either.
                            `,
                            `
                                You also try talking to the captured Aku no Soshiki member, but he stubbornly remains silent.
                                
                                Because of that, you decide to ask the villagers what they know about the group, and <span class="popover" data-content="you">あなた</span> find out it’s a criminal organization who uses captured words to commit their crimes.
                                
                                Unfortunately, apparently not much is known about their motives or whereabouts.
                            `,
                            `
                                Having collected all the information you could, you and Harumi gather necessary supplies for the journey, and leave the village the next morning.
                                
                                “Okay, let’s see, according to the map the first place we need to aim for is…” Harumi says while checking the <span class="popover" data-content="map">ちず</span>.
                                
                                “The Chiropteran... C-Cave?” she stumbles over her words for a moment, looking quite distraught.
                            `
                        ]
                    },
                ]
            },
            { name: TO_BE_CONTINUED_STRING, entries: [] },
            // { name: `どうくつ - Cave (${KantoreLevels.getLevelName(10)})` },
            // { name: 'Grade 1', entries: [] },
            // { name: 'Grade 2', entries: [] },
            // { name: 'Grade 3', entries: [] },
            // { name: 'Grade 4', entries: [] },
            // { name: 'Grade 5', entries: [] },
            // { name: 'Grade 6', entries: [] },
            // { name: 'Junior High', entries: [] },
            // { name: 'Jinmeiyo (postgame)', entries: [] },
            // { name: 'Hyougai (postgame)', entries: [] },
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

        // All except hub menu and the "To be continued" menu
        this._allMenus.slice(1, this._allMenus.length - 1).forEach((menu, index) => {
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

        const toBeContinuedMenu = this._allMenus[this._allMenus.length - 1];
        KantoreUiHelper.addMenuShownEventListener(toBeContinuedMenu, () => {
            dialogue.show(
                TO_BE_CONTINUED_STRING,
                KantoreTemplates.storyToBeContinuedText(),
                () => {
                    KantoreUiHelper.hideMenu(toBeContinuedMenu);
                    KantoreUiHelper.showMenu(this._hubMenu);
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