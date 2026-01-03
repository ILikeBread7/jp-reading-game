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
        const grade1Range = new StageRange(KantoreLevels.getKanjiLevelsGrade1Range, 4);
        const grade2Range = new StageRange(KantoreLevels.getKanjiLevelsGrade2Range, 4);
        const grade3Range = new StageRange(KantoreLevels.getKanjiLevelsGrade3Range, 5);

        const hubMenu = [
            {
                name: 'そうげん - Field',
                entries: [
                    {
                        name: 'ふしぎなおとこ - Mysterious man',
                        text: [
                            `
                                Ugh... Hey, don’t just appear all of a sudden!”
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
                        name: 'Fence - へい (Level 1)',
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
                        name: 'おじいさん - Old man 2',
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
                        name: 'もり - Forest 1',
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
                        name: 'もり - Forest 2 (Level 4)',
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
                        name: 'いけ - Pond 1',
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
                        name: 'いけ - Pond 2 (Level 10)',
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
                        name: 'いけ - Pond 3',
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
                        name: 'みちのとちゅう - On the way',
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
                        name: 'もん - Gate 1',
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
                        name: 'もん - Gate 2 (Level 11)',
                        dict: dicts.getLevelDict(11),
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
                        name: 'もん - Gate 3',
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
                        name: 'むら - Village 1 (Level 14)',
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
                        name: 'むら - Village 2',
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
                        name: 'ないてるこ - Crying child 1',
                        text: [
                            `
                                Looking in the direction the cry is coming from, you see a little girl bawling her eyes out.
                                You approach her and ask what's wrong.
                                
                                “Someone stole my... Waaah!!!” while still <span class="popover" data-content="crying">ないてる</span>, she points at a man running away just past the village gate.
                            `,
                            `
                                You start chasing the man, eventually almost catching up to him but he immediately attacks you.
                            `
                        ]
                    },
                    {
                        name: 'どろぼう - Thief 1 (Level 20)',
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
                        name: 'どろぼう - Thief 2',
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
                        name: 'ないてるこ - Crying child 2',
                        text: [
                            `
                                “That’s my treasure map!” she says as her face lights up.
                                “This is the last thing my grandpa left me.” <span class="popover" data-content="she">かのじょ</span> continues.
                                
                                You return the <span class="popover" data-content="map">ちず</span> <span class="popover" data-content="to her (へ read as “e”)">かのじょ へ</span> and <span class="popover" data-content="she">かのじょ</span> looks at it for a moment, looks back at you, and continues.
                                
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
                        name: 'むらをたつ - Leaving the village',
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
                                Having collected all the information you could, <span class="popover" data-content="you">あなた</span> and Harumi gather necessary supplies for the journey, and leave the village the next morning.
                                
                                “Okay, let’s see, according to the map the first place we need to aim for is...” Harumi says while checking the <span class="popover" data-content="map">ちず</span>.
                                
                                “The Chiropteran... C-Cave?” she stumbles over her words for a moment, looking quite distraught.
                            `
                        ]
                    },
                ]
            },
            {
                name: 'たびがはじまる - Journey begins',
                entries: [
                    {
                        name: 'どうくつ - Cave 1',
                        text: [
                            `
                                The <span class="popover" data-content="cave">どうくつ</span> is dark, lit only by the light of your torch. There are water droplets dripping from the ceiling, resonating every time they reach the floor.
                                
                                Suddenly, a swarm of bats flies overhead.
                                “Aaaa!” Harumi shrieks, cowers in fear, and covers <span class="popover" data-content="her">かのじょ の</span> head.
                                
                                You got startled. Not by the <span class="popover" data-content="bats">コウモリ</span>, but by Harumi’s scream.
                                Once you realize what happened, you turn around and ask her what’s wrong.
                            `,
                            `
                                “N-Nothing.... I... <span class="popover" data-content="I">わたし</span> just don’t like <span class="popover" data-content="bats">コウモリ</span>...” <span class="popover" data-content="she">かのじょ</span> responds with a shaking voice and tears in <span class="popover" data-content="her">かのじょ の</span> eyes.
                                “L-Let’s go, I don’t want to stay here for too long...” <span class="popover" data-content="she">かのじょ</span> adds as <span class="popover" data-content="she">かのじょ</span> stands up and starts pushing you forward.
                                
                                It doesn’t seem like <span class="popover" data-content="she">かのじょ</span> wants to talk about it any further, so you decide to just keep going and get out of this <span class="popover" data-content="cave">どうくつ</span> as soon as possible.
                            `
                        ]
                    },
                    {
                        name: 'どうくつ - Cave 2',
                        text: [
                            `
                                “Finally, we’re almost out!” Harumi exclaims as you notice the exit, and finally see some natural light for a change.
                                
                                Thankfully, she seems completely relieved of the fear that accompanied her all the way through the cave.
                                
                                “At least we didn’t get attacked by any words this time!” <span class="popover" data-content="she">かのじょ</span> continues, with a big smile on <span class="popover" data-content="her">かのじょ の</span> face.
                                
                                Then, you hear a little squishy sound.
                            `,
                            `
                                “Huh? I think I stepped on something..." says Harumi, and the attention of both of you gets directed towards what’s under <span class="popover" data-content="her">かのじょ の</span> feet.
                                
                                “Wah?!” <span class="popover" data-content="she">かのじょ</span> recoils after seeing what <span class="popover" data-content="she">かのじょ</span> has just <span class="popover" data-content="stepped">ふんだ</span> on.
                                
                                It was a word.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'どうくつ - Cave 3',
                            range: grade1Range,
                            index: 0
                        }),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                The word seems to have called for reinforcements, as other words suddenly appear and attack you.
                            `
                        ],
                        afterText: [
                            `
                                You and Harumi beat most of them, as the rest run away in all directions.
                            `
                        ]
                    },
                    {
                        name: 'どうくつ - Cave 4',
                        text: [
                            `
                                “Whew, good riddance.” Harumi says with her hands on her hips, seemingly relieved after the battle.
                                
                                “Let’s see, by now we should be... Oh, there! You can see it!” she starts speaking while checking the map, and then pointing ahead right after.
                            `,
                            `
                                “Akamachi city, our next destination! If we keep going <span class="popover" data-content="we">わたしたち</span> should make it by sunset.” she says with a bright smile.
                                
                                “Come on, let’s keep going. I want to get away from this cave as soon as possible.” <span class="popover" data-content="she">かのじょ</span> continues, nudging you forwards, and the two of you resume your journey with a new destination.
                            `
                        ]
                    },
                    {
                        name: 'あかまち - Akamachi 1',
                        text: [
                            `
                                
                                You arrive in Akamachi city. This time, thankfully, with no issues at the gate.
                                
                                The <span class="popover" data-content="city">まち</span> is surrounded by a brick wall, all buildings in the vicinity are also built with <span class="popover" data-content="brick">れんが</span>, all of them <span class="popover" data-content="red">あかい</span>. Most of the roofs around are also <span class="popover" data-content="red">あかい</span>. According to the map, the city’s name apparently means “<span class="popover" data-content="Red">あかい</span> <span class="popover" data-content="City">まち</span>”. The origin of the name seems quite obvious looking at your surroundings.
                                
                                “We’re finally here. Okay, let’s find an inn before the sun comes down.” Harumi says while stretching.
                            `,
                            `
                                “Hm?” a moment later, she starts looking around in all directions.
                                
                                You wonder what’s wrong, but then it hits <span class="popover" data-content="you">あなた</span> too.
                                
                                <span class="popover" data-content="you (plural)">あなたたち</span> are being watched.
                            `,
                            `
                                <span class="popover" data-content="You">あなた</span> lock eyes with Harumi, both of you with stern expressions.
                                
                                “Let’s go.” she says.
                                
                                <span class="popover" data-content="You">あなた</span> nod in agreement, and together <span class="popover" data-content="you (plural)">あなたたち</span> start looking for an inn, when suddenly.
                            `,
                            `
                                “Aaaaa!” <span class="popover" data-content="you">あなた</span> hear a piercing scream coming from the nearby square.
                                
                                Harumi immediately rushes towards there, with <span class="popover" data-content="you">あなた</span> following closely behind, and when there, <span class="popover" data-content="you">あなた</span> find a woman, terrified, lying on the ground, seemingly the source of the <span class="popover" data-content="scream">ひめい</span>, surrounded by words, with everyone around in panic.
                            `
                        ]
                    },
                    {
                        name: '女 - Woman 1',
                        text: [
                            `
                                “Help!” she shouts as soon as <span class="popover" data-content="she">かのじょ</span> notices you.
                                
                                “You two, please, <span class="popover" data-content="help">たすけて</span>!” <span class="popover" data-content="she">かのじょ</span> continues to shout while looking straight at <span class="popover" data-content="you (plural)">あなたたち</span>, and reaching <span class="popover" data-content="her">かのじょ の</span> hand in <span class="popover" data-content="your (plural)">あなたたち の</span> direction.
                                
                                “Don’t worry, everything will be fine!” Harumi responds as <span class="popover" data-content="she">かのじょ</span> plunges into combat, with you following shortly after.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ひろば - City square',
                            range: grade1Range,
                            index: 1
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You and Harumi attack the words surrounding the distressed woman.
                            `
                        ],
                        afterText: [
                            `
                                Most of the words run away soon after the first few are defeated.
                            `
                        ]
                    },
                    {
                        name: '女 - Woman 2',
                        text: [
                            `
                                “Oh, thank you! What would I have done if it wasn’t for <span class="popover" data-content="you (plural)">あなたたち</span>?” the woman says while approaching Harumi with open arms.
                                
                                “No problem, it’s- h-huh?” as Harumi responds, the <span class="popover" data-content="(おんな) woman">女</span> suddenly hugs <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span>.
                            `,
                            `
                                “Thank you so much once again, now, farewell, my heroes.” the <span class="popover" data-content="(おんな) woman">女</span> says after letting go of Harumi, who’s just standing there with a blank expression.
                                
                                As the <span class="popover" data-content="(おんな) woman">女</span> walks away, Harumi, seemingly having noticed something wrong, pats her pockets. Then, <span class="popover" data-content="she">かのじょ</span> points at the <span class="popover" data-content="(おんな) woman">女</span> and shouts.
                                “Hey, <span class="popover" data-content="she">かのじょ</span> stole the map!”
                            `,
                            `
                                The woman starts running away, and you and Harumi chase after her.
                                
                                Unfortunately for her, as she enters a long alley, you two split up, Harumi going around, and together, <span class="popover" data-content="you (plural)">あなたたち</span> cut off <span class="popover" data-content="her">かのじょ の</span> path, you from behind, and Harumi from ahead.
                            `,
                            `
                                “Tch! How pesky of her.” the woman says after she notices <span class="popover" data-content="she">かのじょ</span> has no way to escape.
                                
                                “Take this!” <span class="popover" data-content="she">かのじょ</span> continues while sending out words to fight you.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '女 - Woman 3',
                            range: grade1Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You get attacked by the words the woman sent out.
                            `
                        ],
                        afterText: [
                            `
                                You beat your half of the words, with Harumi also beating hers.
                            `
                        ]
                    },
                    {
                        name: '女 - Woman 4',
                        text: [
                            `
                                You apprehend the woman, and ask why she tried to steal the map.
                                
                                “Because the boss told me to, duh.” <span class="popover" data-content="she">かのじょ</span> answers.
                                
                                It became clear that <span class="popover" data-content="she">かのじょ</span> is, in fact, a member of Aku no Soshiki, but <span class="popover" data-content="she">かのじょ</span> doesn’t seem to know much of anything about you, the map, or the organization. It seems <span class="popover" data-content="she">かのじょ</span> is just a low level grunt.
                            `,
                            `
                                After being unable to extract any more valuable information from her, you hand <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> over to the guards and start looking for an inn.
                                
                                Unfortunately, even after the woman is arrested, you still have a feeling of being watched.
                            `,
                            `
                                You manage to find a place to stay for the night, <span class="popover" data-content="you (plural)">あなたたち</span> eat dinner, and being cautious about <span class="popover" data-content="your (plural)">あなたたち の</span> experience in the city so far, you make sure to properly lock the door to your room.
                                
                                Thankfully, the night passes without an incident, and in the early morning <span class="popover" data-content="you (plural)">あなたたち</span> arrive at the city gate.
                            `,
                            `
                                Unfortunately, as soon as <span class="popover" data-content="you (plural)">あなたたち</span> leave the city, <span class="popover" data-content="you (plural)">あなたたち</span> are approached by three suspicious looking men.
                            `
                        ]
                    },
                    {
                        name: '男たち - Men 1',
                        text: [
                            `
                                “I’ll be straight to the point. Give me the map, and no one will get hurt.” one of the men says.
                                
                                “I didn’t want to do this, but what can I do after she failed.” he continues, seemingly referring to the woman who tried to rob you earlier. As expected, these <span class="popover" data-content="(おとこたち) men">男たち</span> also seem to be connected to Aku no Soshiki.
                                
                                “Why do you want this map so badly anyway?” Harumi asks him.
                                
                                “That’s none of your business, now, give it to me, or <span class="popover" data-content="you (plural)">あなたたち</span> will regret it.” <span class="popover" data-content="he">かれ</span> responds.
                            `,
                            `
                                “Make me.” she <span class="popover" data-content="responds">こたえる</span> before mockingly sticking out <span class="popover" data-content="her">かのじょ の</span> tongue.
                                
                                “I didn’t want to resort to these kinds of measures, but you leave me no choice.” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="responds">こたえる</span> while all three of them send out words to fight <span class="popover" data-content="you (plural)">あなたたち</span>.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '男たち - Men 2',
                            range: grade1Range,
                            index: 3
                        }),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                You and Harumi get attacked by the words sent out by the suspicious men.
                            `
                        ],
                        afterText: [
                            `
                                After a tough battle you manage to beat all of the words sent out.
                            `
                        ]
                    },
                    {
                        name: '男たち - Men 3',
                        text: [
                            `
                                “W-What? Y-You, <span class="popover" data-content="you (plural)">あなたたち</span> won?” the man says in disbelief.
                                All three of them seem completely shocked at <span class="popover" data-content="your (plural)">あなたたち の</span> performance.
                                
                                “Damn, skedaddle!” he <span class="popover" data-content="says">いう</span> before they all start running away.
                                
                                “Not so fast!” Harumi shouts before giving chase.
                            `,
                            `
                                The two underlings manage to escape, but Harumi successfully captures the <span class="popover" data-content="(おとこ) man">男</span> you were talking to the entire time.
                                
                                “Oh come on...” he laments <span class="popover" data-content="his">かれ の</span> capture.
                                
                                “Now tell me, do you know either of us?” she asks him, motioning at you.
                            `,
                            `
                                “So, you really did lose <span class="popover" data-content="your">あなた の</span> memory, huh?” <span class="popover" data-content="he">かれ</span> answers, smirking.
                                
                                “I’m the one asking questions here!” she doesn’t back down, and slightly twists the <span class="popover" data-content="(おとこの) man’s">男の</span> arm.
                                
                                “Ugh... Okay, okay. I don’t know you, girl, but the other one is an agent, like, law enforcement, or something, who was tracking us down back in the other world. That’s all I know, <span class="popover" data-content="I">わたし</span> don’t know your names or why you’re here or anything.” <span class="popover" data-content="he">かれ</span> reveals, visibly in pain.
                            `,
                            `
                                “Why does <span class="popover" data-content="your">あなた の</span> boss want the map?” <span class="popover" data-content="she">かのじょ</span> continues the questioning.
                                
                                “<span class="popover" data-content="I">わたし</span> don’t know, <span class="popover" data-content="he">かれ</span> just <span class="popover" data-content="says">いう</span> it’s top priority.” <span class="popover" data-content="he">かれ</span> answers without revealing much.
                            `,
                            `
                                <span class="popover" data-content="He">かれ</span> doesn’t seem to know much more, and vehemently refuses to tell <span class="popover" data-content="you (plural)">あなたたち</span> the location of their hideout, so Harumi finishes <span class="popover" data-content="her">かのじょ の</span> questioning, and hands <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span> over to the guards.
                                
                                “Turns out <span class="popover" data-content="you">あなた</span> are in law enforcement, agent! Maybe <span class="popover" data-content="you">あなた</span> are on a secret mission?” Harumi <span class="popover" data-content="says">いう</span>, laughing and nudging you with <span class="popover" data-content="her">かのじょ の</span> elbow. You’re not any less surprised than her.
                                
                                “I wonder if there’s a connection between both of <span class="popover" data-content="us">わたしたち</span> coming here... Hey, maybe <span class="popover" data-content="I">わたし</span> am an agent too?! Wouldn’t that be cool?” <span class="popover" data-content="she">かのじょ</span> adds, cheerfully.
                            `,
                            `
                                “Anyway, now <span class="popover" data-content="we">わたしたち</span> can finally move on to the next destination. Let’s see...” Harumi checks the map again after all is said and done.
                                
                                “Our <span class="popover" data-content="next">つぎ の</span> <span class="popover" data-content="destination">もくてきち</span> is the... nearby swamp?”
                            `
                        ]
                    },
                ]
            },
            { 
                name: 'ぬま - Swamp',
                entries: [
                    {
                        name: 'ぬま - Swamp 1',
                        text: [
                            `
                                After leaving Akamachi city you arrive at <span class="popover" data-content="your (plural)">あなたたち の</span> next destination, a nearby <span class="popover" data-content="swamp">ぬま</span>.
                                
                                According to the map, this place is extremely dangerous, not only is it filled to the brim with words, but also there’s toxic <span class="popover" data-content="swamp">ぬま</span> gas filling the air making staying here for too long highly hazardous, or even deadly. On top of that, the sulfuric smell is nearly unbearable.
                                
                                If <span class="popover" data-content="your (plural)">あなたたち の</span> are going to go through this place, <span class="popover" data-content="your (plural)">あなたたち の</span> need to do it quickly.
                            `,
                            `
                                “Hey, look! A snake!” Harumi exclaims happily, smiling from ear to ear, seemingly with no care in the world, running towards and pointing at a <span class="popover" data-content="snake">へび</span> that’s slithering on the ground.
                                
                                <span class="popover" data-content="You">あなた</span> would never expect anyone to have as much fun at a <span class="popover" data-content="swamp">ぬま</span> as Harumi seems to have right now. <span class="popover" data-content="She">かのじょ</span> is excitedly running around, finding <span class="popover" data-content="snakes">へび</span>, frogs, dragonflies, and all sorts of other creatures.
                                
                                As <span class="popover" data-content="you">あなた</span> are about to tell her to be careful about where <span class="popover" data-content="she">かのじょ</span> is walking, the place not being particularly safe to run around mindlessly, what <span class="popover" data-content="you">あなた</span> expected to happen, <span class="popover" data-content="happens">おこる</span>.
                            `,
                            `
                                “Uaa!” Harumi cries out as <span class="popover" data-content="she">かのじょ</span> falls into a bog, with water all the way up to <span class="popover" data-content="her">かのじょ の</span> waist.
                                
                                “I-<span class="popover" data-content="I">わたし</span> think <span class="popover" data-content="I">わたし</span> am stuck...” <span class="popover" data-content="she">かのじょ</span> says apologetically, being unable to free herself despite all attempts to twist <span class="popover" data-content="her">かのじょ の</span> body and reach one of the nearby plants to try to pull herself out.
                            `,
                            `
                                “Oh no!” suddenly, <span class="popover" data-content="she">かのじょ</span> yells out, noticing a terrible situation.
                                
                                Both of you became surrounded by words, and <span class="popover" data-content="she">かのじょ</span> cannot move.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぬま - Swamp 2',
                            range: grade2Range,
                            index: 0
                        }),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                The words strike and you fight back, with Harumi being unable to help this time, still being stuck in the bog.
                            `
                        ],
                        afterText: [
                            `
                                You fight valiantly, protecting not only yourself, but also immobilized Harumi, and manage to repel the assault.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 3',
                        text: [
                            `
                                After the battle you help pull Harumi out of the bog and tell her to be more careful.
                                
                                “Sorry... and thanks.” she responds with remorse.
                                
                                Then, a moment later, her face lights up looking somewhere behind you.
                            `,
                            `
                                “Look! Is that a ghost?!” she exclaims pointing that way.
                                
                                You look there, and see a floating light in the distance, probably just a will-o'-wisp.
                                
                                “Let’s go! I want to see the <span class="popover" data-content="ghost">ゆうれい</span>!” she says full of excitement, as she takes off in the direction of the light. All remorse from the recent situation seemingly completely gone.
                                
                                At least the direction the <span class="popover" data-content="light">あかり</span> comes from, and your planned route, match up, so going to check it out isn’t going to incur any delays.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 4',
                        text: [
                            `
                                Despite a few minor incursions along the way, you manage to reach the supposed location of the “ghost”.
                                
                                “This smell... is killing me...” Harumi laments, covering her nose, and you can’t help but do the same.
                            `,
                            `
                                The source of the smell, and most likely the “ghost” is a giant bog emitting immeasurable amounts of gas. The surrounding area is completely filled with its foul odor.
                                
                                You point out that the “<span class="popover" data-content="ghost">ゆうれい</span>” was most likely just a will-o’-wisp caused by the gas spontaneously igniting, causing Harumi’s visible disappointment.
                                
                                “Well, I wish I could’ve seen a <span class="popover" data-content="ghost">ゆうれい</span>, but will-o’-wisps are pretty cool too, I guess.” she seems to get over it pretty quickly.
                                
                                Suddenly, she trips and almost falls to the ground.
                            `,
                            `
                                You ask if she’s okay, and at the same time, you start feeling what probably caused her indisposition.
                                
                                “I feel... a little dizzy...” she mutters, putting her hand or <span class="popover" data-content="her">かのじょ の</span> head.
                                
                                You feel it too, it’s probably all the <span class="popover" data-content="toxic gas">ゆうどくガス</span> getting to both of you.
                            `,
                            `
                                You decide to hurry, as it doesn’t seem safe to stay in the <span class="popover" data-content="swamp">ぬま</span> for much longer.
                                
                                “Oh no, this isn't the best time for this...” Harumi says, when, unfortunately, a group of words comes at you from all directions.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぬま - Swamp 5',
                            range: grade2Range,
                            index: 1
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                The words attack as both of you are weakened by the toxic gas.
                            `
                        ],
                        afterText: [
                            `
                                Somehow, you manage to repel the attack.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 6',
                        text: [
                            `
                                “That was tough; let’s go- huh?” Harumi stops mid-sentence, noticing something.
                                
                                “Look, over there! Someone’s on the ground!” <span class="popover" data-content="she">かのじょ</span> adds, pointing at a person lying without movement, not far away.
                            `,
                            `
                                You run up to the <span class="popover" data-content="(ひと) person">人</span>, and notice they’re also surrounded bywords.
                                
                                “Oh, come on. Do they always attack <span class="popover" data-content="(ひとびと) people">人々</span> at their weakest?” Harumi utters.
                                
                                But there’s no time for divagation, in order to help the unconscious <span class="popover" data-content="(ひと) person">人</span> you need to fight the <span class="popover" data-content="words">ことば</span> again.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぬま - Swamp 7',
                            range: grade2Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You attack the words surrounding the unconscious person.
                            `
                        ],
                        afterText: [
                            `
                                After beating most of the words, the rest scatters in all directions.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 8',
                        text: [
                            `
                                “The map sure didn’t lie about there being a ton of words in here...” Harumi says tiredly after scraping victory against the <span class="popover" data-content="words">ことば</span>, as both of you run up to the downed person.
                                
                                Coming closer you realize it’s a man, still breathing, but completely unconscious.
                                
                                “What’s this?” Harumi says while holding up a piece of cloth she found on the <span class="popover" data-content="(おとこ) man">男</span>.
                            `,
                            `
                                “It has an emblem on it... it says ‘Aku no Soshiki’!” <span class="popover" data-content="she">かのじょ</span> adds astounded.
                                
                                He was probably lying here in ambush waiting for you, trying to steal the treasure map again. <span class="popover" data-content="You (plural)">あなたたち</span> discuss if it’s even safe to help <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span>, fearing it might be another one of their ploys, remembering the situation in Akamachi city.
                            `,
                            `
                                “I-<span class="popover" data-content="I">わたし</span> guess it could be, but, what if it isn’t? Sure, they’re criminals, but <span class="popover" data-content="I">わたし</span> still don’t want them to die...” Harumi responds.
                                
                                “We need to bring him out of the <span class="popover" data-content="swamp">ぬま</span>, <span class="popover" data-content="he">かれ</span> might not make it otherwise!” <span class="popover" data-content="she">かのじょ</span> adds.
                                
                                After a little deliberation you decide that it is the right thing to do after all, so you agree and the two of you start carrying the <span class="popover" data-content="(おとこ) man">男</span> together, lending him on shoulder each.
                                
                                You also shouldn't stay in the <span class="popover" data-content="swamp">ぬま</span> much longer, already being affected by the gas yourselves, and helping the <span class="popover" data-content="(おとこ) man">男</span> is probably faster than trying to convince Harumi to leave <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span> here.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 9',
                        text: [
                            `
                                “This is tough... Why is he so heavy..." Harumi mutters while carrying the man.
                                
                                You tell her to keep going for just a little more, you can already see the <span class="popover" data-content="swamp">ぬま</span> getting thinner and thinner, indicating you’re close to leaving it.
                                
                                “Okay, okay... Oh, come on, it’s these things again?!” she says after noticing another problem.
                            `,
                            `
                                “They really seem to wait for the most vulnerable moment to attack, huh.” <span class="popover" data-content="she">かのじょ</span> adds.
                                
                                You can’t help but agree, when <span class="popover" data-content="you">あなた</span> see a big group of words creeping up on <span class="popover" data-content="you">あなた</span>.
                                
                                You put the <span class="popover" data-content="(おとこ) man">男</span> down for a moment to engage the <span class="popover" data-content="words">ことば</span>.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぬま - Swamp 10',
                            range: grade2Range,
                            index: 3
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                Both of you brace for the attack, having to not only defend yourselves, but also the unconscious man behind you.
                            `
                        ],
                        afterText: [
                            `
                                You manage to defeat most of the words, the rest running away as usual.
                            `
                        ]
                    },
                    {
                        name: 'ぬま - Swamp 11',
                        text: [
                            `
                                “I hope this is the last time; I really need a break.” Harumi says, seeming completely exhausted from the battle, the toxic gas, and carrying the man.
                                
                                Thankfully, after leaving the <span class="popover" data-content="swamp">ぬま</span> both of you feel significantly better, and manage to keep going without much further trouble, eventually reaching the closest village.
                            `
                        ]
                    },
                ]
            },
            {
                name: 'ぬまちかくの村 - Village near swamp',
                entries: [
                    {
                        name: '村のいしゃ - Village doctor',
                        text: [
                            `
                                The <span class="popover" data-content="(むら) village">村</span> is surrounded by a palisade, similar to the one in the previous <span class="popover" data-content="(むら) village">村</span>. This <span class="popover" data-content="(むら) village">村</span> is a little bit bigger, and has its own doctor living there, so you immediately bring the man you were carrying to him.
                                
                                “This doesn’t look well.” says the <span class="popover" data-content="(むら の) village (village‘s)">村の</span> doctor.
                                “He received an enormous dose of toxic gas; how long has <span class="popover" data-content="he">かれ</span> been in that swamp?” <span class="popover" data-content="he">かれ</span> continues with an inquiry.
                            `,
                            `
                                “We don’t know, we found <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span> lying there, unconscious.” Harumi responds.
                                “Will <span class="popover" data-content="he">かれ</span> be okay?” she asks, frowning.
                                
                                “I can’t say for sure. There is some medicine that could help, but, unfortunately, we’re out of it right now, and in order to make more I need a particular plant that’s... a little hard to get a hold of.” <span class="popover" data-content="he">かれ</span> responds while shrugging.
                            `,
                            `
                                “Where does that <span class="popover" data-content="plant">しょくぶつ</span> grow? Maybe we could go get it for you?” Harumi continues to ask.
                                
                                “It <span class="popover" data-content="(はえる) grows (out of something, e.g. ground)">生える</span> right past an old cemetery that’s not too far from here. The problem is, the <span class="popover" data-content="cemetery">ぼち</span> is overflowing with words, and there’s no way of getting the <span class="popover" data-content="plant">しょくぶつ</span> without going through there. You can’t even go around, because it’s all surrounded by mountains that would take days to cross, and he might not survive for that long.” the doctor responds, not believing anyone would want to take up the task.
                                
                                You and Harumi look at each other, and after a moment of deliberation, nod in agreement.
                                You’re not in a hurry anyway, as finding the treasure doesn’t seem particularly time-sensitive, and maybe you can even find out something new from the Aku no Soshiki member after <span class="popover" data-content="he">かれ</span> wakes up.
                            `,
                            `
                                “We’ll go find the <span class="popover" data-content="plant">しょくぶつ</span>, we’re not scared of a few <span class="popover" data-content="words">ことば</span>!” Harumi says confidently.
                                
                                “Are you sure? There’s really a lot, even more than at the swamp.” the doctor warns.
                                
                                “We’ll be fine, and in the worst-case scenario, we can just run!” she responds with a grin.
                            `,
                            `
                                After the conversation, the doctor reluctantly agrees to tell you the exact location and appearance of the <span class="popover" data-content="plant">しょくぶつ</span>.
                                
                                Harumi wants to depart immediately, but you and the doctor, still being worried for your safety, convince <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> that both of you should take a rest at the <span class="popover" data-content="(むら) village">村</span> first, and go the next morning.
                            `
                        ]
                    },
                    {
                        name: 'ぼちへの道 - On the way to the cemetery',
                        text: [
                            `
                                The next morning you depart from the <span class="popover" data-content="(むら) village">村</span>, heading for the cemetery.
                                
                                Not before long do you realize that the doctor wasn’t kidding when <span class="popover" data-content="he">かれ</span> said the place was overflowing with words. You haven’t even made it to the <span class="popover" data-content="cemetery">ぼち</span> yet, as you encounter a sizable group of <span class="popover" data-content="words">ことば</span>.
                                
                                “It’ll be a long day, I guess.” Harumi says with a strained laugh.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぼち前 - Before cemetery',
                            range: grade3Range,
                            index: 0
                        }),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                The words leap at you after a short face-off.
                            `
                        ],
                        afterText: [
                            `
                                After a quick battle, the words disperse.
                            `
                        ]
                    },
                    {
                        name: 'ぼち - Cemetery 1',
                        text: [
                            `
                                After a few short and uneventful encounters you make it to the <span class="popover" data-content="cemetery">ぼち</span>.
                                
                                There is a rusted fence surrounding it. You can’t see a gate leading inside, but it’s not needed, as the fence has plenty of gaps big enough to go through. There are plenty of tombstones, all covered in moss, and the ground is covered with thick grass. Any footpaths that might have once been here were already taken over by nature a long time ago. It seems like no one visits here anymore.
                            `,
                            `
                                “According to the doctor, we need to go all the way through the <span class="popover" data-content="cemetery">ぼち</span>, and the plant should be growing in a field right past it.” Harumi says, making sure you’re on the same page.
                                
                                You nod and take a few steps forward, but then...
                                “Wah!” you hear Harumi shriek.
                            `,
                            `
                                
                                You turn around, and see Harumi on the ground, after a word apparently tackled her.
                                
                                Not only that, even more <span class="popover" data-content="words">ことば</span> emerge from behind tombstones, from all directions.
                                
                                Harumi quickly gets up and takes a fighting stance, but you’re already surrounded.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぼち - Cemetery 2',
                            range: grade3Range,
                            index: 1
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You take on the words being back to back with Harumi.
                            `
                        ],
                        afterText: [
                            `
                                You fight your way through the words, eventually repelling all of them.
                            `
                        ]
                    },
                    {
                        name: 'ぼち - Cemetery 3',
                        text: [
                            `
                                
                                “Whew... Let’s... let’s keep going.” Harumi utters after a difficult encounter.
                                
                                “We shouldn’t be that far away, the <span class="popover" data-content="cemetery">ぼち</span> isn’t supposed to be too big.” she continues trying to uplift both of your moods.
                            `,
                            `
                                After continuing to walk for a few minutes, another strange incident happens.
                                
                                “Whoa, look over there!” Harumi exclaims, pointing ahead.
                                
                                “It’s a zombie!” she continues with sparkling eyes.
                            `,
                            `
                                You look in the direction <span class="popover" data-content="she">かのじょ</span> pointed towards, and you see a grave from which ground is shooting up, as if someone was trying to dig their way to the surface from below.
                                
                                Both of you keep watching with anticipation, as the digging continues, waiting to see a <span class="popover" data-content="zombie">ゾンビ</span> or whatever it is that’s digging its way <span class="popover" data-content="(うえ へ) up (literally “to up”) (へ read as “e”)">上へ</span>.
                            `,
                            `
                                After a while, a big lump of soil shoots <span class="popover" data-content="(うえ へ) up (literally “to up”) (へ read as “e”)">上へ</span>, and something emerges.
                                
                                “Oh... It wasn’t a <span class="popover" data-content="zombie">ゾンビ</span>.” Harumi reacts with disappointment.
                            `,
                            `
                                It was just another word.
                                
                                And it’s coming your way.
                                
                                <span class="popover" data-content="And">そして</span> there’s more <span class="popover" data-content="(きている) coming">来ている</span> from the same place.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぼち - Cemetery 4',
                            range: grade3Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You brace for the impact of all the words emerging from underground and coming at you.
                            `
                        ],
                        afterText: [
                            `
                                You manage to repel the attack.
                            `
                        ]
                    },
                    {
                        name: 'ぼち - Cemetery 4',
                        text: [
                            `
                                After the attack, you keep walking for a few minutes and finally see the <span class="popover" data-content="(でぐち) exit">出口</span>.
                                
                                “Hey, look, the field is right ahead!” Harumi exclaims, running towards it.
                                
                                You quickly follow her, and arrive at the <span class="popover" data-content="(そうげん) field">草原</span>.
                                
                                The <span class="popover" data-content="(そうげん) field">草原</span> is filled with grass and various flowers of all colors. It isn’t too big, all of it fits within eyeshot, as there is a cliff wall surrounding it from the opposite side of the <span class="popover" data-content="cemetery">ぼち</span>, creating a clear boundary.
                            `,
                            `
                                “Let’s see, according to the doctor’s description, we’re looking for a blue flower.” Harumi says while scanning the area.
                                
                                “Blue flower, <span class="popover" data-content="(あおい) blue">青い</span> <span class="popover" data-content="(はな) flower">花</span>...” she keeps mumbling while searching.
                                
                                You look for it too, and a few minutes later you find a <span class="popover" data-content="(あおい) blue">青い</span> <span class="popover" data-content="(はな) flower">花</span> and show it <span class="popover" data-content="to her (へ read as “e”)">かのじょ へ</span>.
                            `,
                            `
                                “Yeah, I think that’s the one! Good job!” Harumi confirms, giving you a thumbs-up.
                                
                                “Now, let’s go back before-” she suddenly stops, looking behind you.
                                
                                You look there as well, and see what you already expected.
                            `,
                            `
                                “Well, coming here and finding the <span class="popover" data-content="(はな) flower">花</span> is only half the trip, I guess.” Harumi says with a forced smile as a group of words approaches you from the direction of the <span class="popover" data-content="cemetery">ぼち</span>.
                                
                                “Let’s beat’em up and get out of this place!” <span class="popover" data-content="she">かのじょ</span> continues reassuringly.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'ぼち - Cemetery 5',
                            range: grade3Range,
                            index: 3
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                The words attack you, with your back against a cliff, this will be a hard battle.
                            `
                        ],
                        afterText: [
                            `
                                You successfully defend yourselves, and the words return where they came from.
                            `
                        ]
                    },
                    {
                        name: '村 - Village 1',
                        text: [
                            `
                                After a few more encounters on the way, you return to the <span class="popover" data-content="(むら) village">村</span> with the flower.
                                
                                The doctor prepares the medicine using it, and administers it to the patient.
                            `,
                            `
                                All that is left to do now, is to wait, so as the sun starts to set you decide to stay at the <span class="popover" data-content="(むら) village">村</span> for the <span class="popover" data-content="(よる) night">夜</span>, and hope that all goes well, and the unconscious Aku no Soshiki member wakes up by tomorrow.
                            `
                        ]
                    },
                    {
                        name: '村 - Village 2',
                        text: [
                            `
                                “Good news; he seems to be improving!” says the doctor.
                                
                                After waking up in the <span class="popover" data-content="(あさ) morning">朝</span>, you decided to go check up on the man and went to see the doctor.
                                
                                “Is he awake? Can he talk?” Harumi asks, being both relieved, and hopeful that you might learn some new information from the man.
                            `,
                            `
                                “He did wake up, but he’s still very weak. I wouldn’t recommend talking to him right now; I’d suggest you wait until tomorrow if you want to question him.” the doctor responds.
                                
                                Suddenly, a loud, dull noise is heard outside.
                                “Aaaa! Help!” a shriek follows.
                                
                                “What’s happening? Let’s take a look.” Harumi says before storming out the door.
                            `,
                            `
                                Once outside, you see a group of words has made its way into the <span class="popover" data-content="(むら) village">村</span>. Some people are running away inside buildings, some are standing still, thunderstruck by the situation.
                                
                                “How did they get in here? Anyway, let’s clean this up!” Harumi exclaims, not hiding her surprise.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '村 - Village 3',
                            range: grade3Range,
                            index: 4
                        }),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                You and Harumi charge at the words that made their way into the village.
                            `
                        ],
                        afterText: [
                            `
                                The words scatter midway through the battle.
                            `
                        ]
                    },
                    {
                        name: '村 - Village 4',
                        text: [
                            `
                                “They... didn’t seem particularly vicious, did they?” Harumi says with consternation.
                                
                                The words fled when they still had a big numbers advantage. While they do often <span class="popover" data-content="flee">にげる</span> when their numbers get low, they usually put up more of a fight before that happens.
                                
                                “He’s gone?!”
                                Suddenly, you hear the doctor’s voice from back inside.
                            `,
                            `
                                Both of you turn around and run inside, finding an empty bed where the Aku no Soshiki member was resting.
                                
                                “<span class="popover" data-content="He">かれ</span> ran away?” Harumi <span class="popover" data-content="(きく) asks">聞く</span> in confusion.
                                
                                “<span class="popover" data-content="He">かれ</span> was still very weak, <span class="popover" data-content="he">かれ</span> couldn’t have gone far alone.” the doctor <span class="popover" data-content="(こたえる) responds">答える</span> in a similar manner.
                                
                                Then, looking out a window, you notice a peculiar scene, and point everyone’s attention towards it.
                            `,
                            `
                                There’s another man, supposedly another Aku no Soshiki member, carrying the ill individual while <span class="popover" data-content="running away">にげている</span>.
                                
                                “So the attack was a diversion created to retrieve him? I guess now it makes sense why the words gave up so quickly. And we didn’t get to <span class="popover" data-content="(きく) ask">聞く</span> him anything yet!” Harumi says dejectedly.
                                
                                “But, at least he seems fine, so there's that!” she <span class="popover" data-content="continues">つづける</span>, trying to find a silver lining.
                            `,
                            `
                                After the whole situation unraveled, there doesn’t seem to be anything more to do in this <span class="popover" data-content="(むら) village">村</span>, so you and Harumi decide to head for the next destination.
                                
                                “According to the map our next destination is... well, it’s a little far, but there seems to be a small <span class="popover" data-content="(むら) village">村</span> on the way, so let’s aim for it first so we can take a break there!” Harumi happily exclaims while checking the map.
                            `
                        ]
                    },
                ]
            },
            { name: TO_BE_CONTINUED_STRING, entries: [] }
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

class StageRange {
    
    /**
     * 
     * @param {[number]} range 
     * @param {number} battleLevelsNumber 
     */
    constructor(range, battleLevelsNumber) {
        this._range = range;
        this._battleLevelsNumber = battleLevelsNumber;
        this._levelIncrement = Math.floor((range[1] - range[0] + 1) / battleLevelsNumber);
    }

    /**
     * 
     * @param {number} index 
     * @returns {{ start: number, end: number }}
     */
    getForIndex(index) {
        return {
            start : this._range[0] + this._levelIncrement * index,
            end: index < this._battleLevelsNumber - 1
                ? this._range[0] + this._levelIncrement * (index + 1) - 1
                : this._range[1]    // if last use end of range
        };
    }

}

/**
 * 
 * @param {{ name: string, range: StageRange, index: number }}
 * @returns {{ name: string, dict: ComplexDict }}
 */
function storyBattleFragment({name, range, index}) {
    const levelsRange = range.getForIndex(index);
    
    return {
        name: `${name} (Level ${levelsRange.end})`,
        dict: dicts.createComplexLevelDict(levelsRange.start, levelsRange.end)
    };
}

export const storyModeUi = new KantoreStoryModeUi();