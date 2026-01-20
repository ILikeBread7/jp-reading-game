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
        const grade4Range = new StageRange(KantoreLevels.getKanjiLevelsGrade4Range, 5);
        const grade5Range = new StageRange(KantoreLevels.getKanjiLevelsGrade5Range, 4);
        const grade6Range = new StageRange(KantoreLevels.getKanjiLevelsGrade6Range, 4);

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
                        name: 'へい - Fence (Level 1)',
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
                                You arrive at the <span class="popover" data-content="cave’s">どうくつ の</span> entrance, and notice Harumi being visibly anxious.
                                
                                She’s been acting strange the entire way to the <span class="popover" data-content="cave">どうくつ</span>, but she got even worse after actually reaching it. Right now, she’s standing behind your back and trembling with fear.
                                
                                You ask her what’s wrong, but <span class="popover" data-content="she">かのじょ</span> just answers “N-Nothing, come on, let’s go.” and pushes your back.
                                
                                You’re a little concerned about her, but if <span class="popover" data-content="she">かのじょ</span> doesn’t want to tell you what’s going on, there’s not much you can do, so you pull out a torch, and enter the <span class="popover" data-content="cave">どうくつ</span>, with Harumi following closely behind.
                            `,
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
                                “Oh, thank you! What would I have done if it wasn’t for <span class="popover" data-content="you (plural)">あなたたち</span>?” the <span class="popover" data-content="(おんな) woman">女</span> says while approaching Harumi with open arms.
                                
                                “No problem, it’s- h-huh?” as Harumi responds, the <span class="popover" data-content="(おんな) woman">女</span> suddenly hugs <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span>.
                            `,
                            `
                                “Thank you so much once again, now, farewell, my heroes.” the <span class="popover" data-content="(おんな) woman">女</span> says after letting go of Harumi, who’s just standing there with a blank expression.
                                
                                As the <span class="popover" data-content="(おんな) woman">女</span> walks away, Harumi, seemingly having noticed something wrong, pats her pockets. Then, <span class="popover" data-content="she">かのじょ</span> points at the <span class="popover" data-content="(おんな) woman">女</span> and shouts.
                                “Hey, <span class="popover" data-content="she">かのじょ</span> stole the map!”
                            `,
                            `
                                The <span class="popover" data-content="(おんな) woman">女</span> starts running away, and you and Harumi chase after her.
                                
                                Unfortunately for her, as she enters a long alley, you two split up, Harumi going around, and together, <span class="popover" data-content="you (plural)">あなたたち</span> cut off <span class="popover" data-content="her">かのじょ の</span> path, you from behind, and Harumi from ahead.
                            `,
                            `
                                “Tch! How pesky of <span class="popover" data-content="you (plural)">あなたたち</span>.” the <span class="popover" data-content="(おんな) woman">女</span> says after <span class="popover" data-content="she">かのじょ</span> notices <span class="popover" data-content="she">かのじょ</span> has no way to escape.
                                
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
                                You apprehend the <span class="popover" data-content="(おんな) woman">女</span>, and ask why she tried to steal the map.
                                
                                “Because the boss told me to, duh.” <span class="popover" data-content="she">かのじょ</span> answers.
                                
                                It became clear that <span class="popover" data-content="she">かのじょ</span> is, in fact, a member of Aku no Soshiki, but <span class="popover" data-content="she">かのじょ</span> doesn’t seem to know much of anything about you, the map, or the organization. It seems <span class="popover" data-content="she">かのじょ</span> is just a low level grunt.
                            `,
                            `
                                After being unable to extract any more valuable information from her, you hand <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> over to the guards and start looking for an inn.
                                
                                Unfortunately, even after the <span class="popover" data-content="(おんな) woman">女</span> is arrested, you still have a feeling of being watched.
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
                                
                                If <span class="popover" data-content="you (plural)">あなたたち</span> are going to go through this place, <span class="popover" data-content="you (plural)">あなたたち</span> need to do it quickly.
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
                                
                                At least the direction the <span class="popover" data-content="light">あかり</span> is coming from matches with your planned route, so going to check it out isn’t going to incur any additional delays.
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
                                The source of the smell, and most likely the “ghost” is a giant bog, emitting immeasurable amounts of gas. The surrounding area is completely filled with its foul odor.
                                
                                You point out that the “<span class="popover" data-content="ghost">ゆうれい</span>” was most likely just a will-o’-wisp caused by the gas spontaneously igniting, causing Harumi’s visible disappointment.
                                
                                “Well, I wish I could’ve seen a <span class="popover" data-content="ghost">ゆうれい</span>, but will-o’-wisps are pretty cool too, I guess.” she seems to get over it pretty quickly.
                                
                                Suddenly, she stumbles and almost falls to the ground.
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
                                You run up to the <span class="popover" data-content="(ひと) person">人</span>, and notice they’re also surrounded by words.
                                
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
                                
                                He was probably lying here in ambush, waiting for us, trying to steal the treasure map again. <span class="popover" data-content="You (plural)">あなたたち</span> discuss if it’s even safe to help <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span>, fearing it might be another one of their ploys, remembering the situation in Akamachi city.
                            `,
                            `
                                “I-<span class="popover" data-content="I">わたし</span> guess it could be, but, what if it isn’t? Sure, they’re criminals, but <span class="popover" data-content="I">わたし</span> still don’t want them to die...” Harumi responds.
                                
                                “We need to bring him out of the <span class="popover" data-content="swamp">ぬま</span>, <span class="popover" data-content="he">かれ</span> might not make it otherwise!” <span class="popover" data-content="she">かのじょ</span> adds.
                                
                                After a little deliberation you decide that it is the right thing to do after all, so you agree and the two of you start carrying the <span class="popover" data-content="(おとこ) man">男</span> together, lending him one shoulder each.
                                
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
                                
                                You can’t help but agree, when <span class="popover" data-content="you">あなた</span> notice a big group of words creeping up on <span class="popover" data-content="you (plural)">あなたたち</span>.
                                
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
                                The <span class="popover" data-content="(むら) village">村</span> is surrounded by a palisade, similar to the one in the previous <span class="popover" data-content="(むら) village">村</span>. This <span class="popover" data-content="(むら) village">村</span> is a little bit bigger, and has its own <span class="popover" data-content="doctor">いしゃ</span> living there, so you immediately bring the man you were carrying to him.
                                
                                “This doesn’t look well.” says the <span class="popover" data-content="(むら の) village (village‘s)">村の</span> <span class="popover" data-content="doctor">いしゃ</span>.
                                “He received an enormous dose of toxic gas; how long has <span class="popover" data-content="he">かれ</span> been in that swamp?” <span class="popover" data-content="he">かれ</span> continues with an inquiry.
                            `,
                            `
                                “We don’t know, we found <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span> lying there, unconscious.” Harumi responds.
                                “Will <span class="popover" data-content="he">かれ</span> be okay?” she asks, frowning.
                                
                                “I can’t say for sure. There is some medicine that could help, but, unfortunately, we’re out of it right now, and in order to make more I need a particular plant that’s... a little hard to get a hold of.” <span class="popover" data-content="he">かれ</span> responds while shrugging.
                            `,
                            `
                                “Where does that <span class="popover" data-content="plant">しょくぶつ</span> grow? Maybe we could go get it for you?” Harumi continues to ask.
                                
                                “It <span class="popover" data-content="(はえる) grows (out of something, e.g. ground)">生える</span> right past an old cemetery that’s not too far from here. The problem is, the <span class="popover" data-content="cemetery">ぼち</span> is overflowing with words, and there’s no way of getting the <span class="popover" data-content="plant">しょくぶつ</span> without going through there. You can’t even go around, because it’s all surrounded by mountains that would take days to cross, and he might not survive for that long.” the <span class="popover" data-content="doctor">いしゃ</span> responds, not believing anyone would want to take up the task.
                                
                                You and Harumi look at each other, and after a moment of deliberation, nod in agreement.
                                
                                You’re not in a hurry anyway, as finding the treasure doesn’t seem particularly time-sensitive, and maybe you can even find out something new from the Aku no Soshiki member after <span class="popover" data-content="he">かれ</span> wakes up.
                            `,
                            `
                                “We’ll go find the <span class="popover" data-content="plant">しょくぶつ</span>, we’re not scared of a few <span class="popover" data-content="words">ことば</span>!” Harumi says confidently.
                                
                                “Are you sure? There’s really a lot, even more than at the swamp.” the <span class="popover" data-content="doctor">いしゃ</span> warns.
                                
                                “We’ll be fine, and in the worst-case scenario, we can just run!” she responds with a grin.
                            `,
                            `
                                After the conversation, the <span class="popover" data-content="doctor">いしゃ</span> reluctantly agrees to tell you the exact location and appearance of the <span class="popover" data-content="plant">しょくぶつ</span>.
                                
                                Harumi wants to depart immediately, but you and the <span class="popover" data-content="doctor">いしゃ</span>, still being worried for your safety, convince <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> that both of you should take a rest at the <span class="popover" data-content="(むら) village">村</span> first, and go the next morning.
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
            {
                name: '問題発生 - Trouble ensues',
                entries: [
                    {
                        name: '村の門 - Village gate 1',
                        text: [
                            `
                                After a day of walking, you finally see the <span class="popover" data-content="(むら) village">村</span> above the horizon.
                                
                                “Finally! I’m so tired; we've been walking all day. H-Huh? What’s that?" Harumi exclaims, noticing something concerning a moment later.
                                
                                “There are words all around the gate. And the gate is... open?!” she continues, flabbergasted at what <span class="popover" data-content="she">かのじょ</span> sees.
                            `,
                            `
                                “Let’s hurry; they might need our help!” Harumi <span class="popover" data-content="(いう) says">言う</span> as <span class="popover" data-content="she">かのじょ</span> takes off towards there, without even waiting for your response.
                                
                                You follow right after, and quickly arrive at the gate.
                                
                                “Huh? Why aren’t they attacking?” Harumi <span class="popover" data-content="(いう) says">言う</span>, dumbfounded at the situation.
                                
                                The words seem to notice you, but don’t attack. Usually they either run away or lunge at you the moment they realize they’ve been spotted.
                            `,
                            `
                                “Anyway, we can’t just leave them here; let’s clean this up!” Harumi tells you, and charges at the nearest word.
                                
                                Soon after, you do the same.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '村の門 - Village gate 2',
                            range: grade4Range,
                            index: 0
                        }),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                You attack the words surrounding the open village gate.
                            `
                        ],
                        afterText: [
                            `
                                You defeat a few of the words before the rest runs away inside the village.
                            `
                        ]
                    },
                    {
                        name: '村内 - Inside the village 1',
                        text: [
                            `
                                You chase the words, and enter the <span class="popover" data-content="(むら) village">村</span>, where you’re taken aback by what you see.
                                
                                The whole place is filled to the brim with words. Fortunately, they aren’t attacking anyone. Unfortunately, they don’t seem to be the only problem here.
                                
                                There are a lot of people, seemingly Aku no Soshiki members, taking all the villagers hostage.
                                
                                The <span class="popover" data-content="(むら) village">村</span> isn’t too big, there’s only about twenty villagers around, but the number of assailants is more than double of that. Some hostages have knives pointed at their throats.
                            `,
                            `
                                “What is going on here? There’s so many of them...” Harumi says after looking around and seeing the hopeless situation.
                                
                                “This doesn’t look good... But we can’t leave them like this...” <span class="popover" data-content="she">かのじょ</span> continues without much hope.
                                
                                “Let’s do what we can do, and try to take care of the words at least.” <span class="popover" data-content="she">かのじょ</span> concludes before striking at a nearby word, with you following <span class="popover" data-content="her">かのじょ の</span> lead soon after.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '村内 - Inside the village 2',
                            range: grade4Range,
                            index: 1
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You and Harumi attack the words inside the village.
                            `
                        ],
                        afterText: [
                            `
                                There are so many words around that you barely make a difference in their numbers before getting too exhausted to continue.
                            `
                        ]
                    },
                    {
                        name: '村内 - Inside the village 3',
                        text: [
                            `
                                “Well, well, well. We’ve been waiting for you!” says the presumed leader of the operation coming outside from one of the houses after noticing the commotion.
                                
                                “What’s going on in here?” Harumi asks.
                                
                                “Give me the map, and no one gets hurt.” he responds.
                            `,
                            `
                                “Are you serious?” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(きく) asks">聞く</span> in response.
                                
                                “Dead serious.” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="(こたえる) responds">答える</span>, sticking a knife to a nearby child’s throat, “Ugh-”, and causing it to squirm.
                                
                                “You can’t beat us this time, not with this numbers advantage. And even if <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> try, <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> know what happens.” he continues with a sleazy smile.
                                
                                <span class="popover" data-content="You">あなた</span> know <span class="popover" data-content="he">かれ</span> is right. <span class="popover" data-content="(あなたたち) You (plural)">あなた達</span> are already completely exhausted from the combat, and <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> barely even made a dent in the number of <span class="popover" data-content="(ことば) words">言葉</span> around. Not even mentioning all the Aku no Soshiki members who outnumber <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> by an order of magnitude.
                            `,
                            `
                                “Okay, okay. There.” Harumi acquiesces and presents the map to the man.
                                
                                “Let’s see... Yup, looks like the real deal! All right, guys, we’re leaving!” <span class="popover" data-content="he">かれ</span> snatches the <span class="popover" data-content="(ちず) map">地図</span> from <span class="popover" data-content="her">かのじょ の</span> hand, takes a quick glance, and, after confirming the authenticity of it, the assailants all prepare to leave the village together.
                            `,
                            `
                                “Oops, I almost forgot. Take this!” <span class="popover" data-content="he">かれ</span> says before turning back to <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>, and releasing another batch of <span class="popover" data-content="(ことば) words">言葉</span> inside the <span class="popover" data-content="(むら) village">村</span>.
                                
                                “Hey, what’s that all about? <span class="popover" data-content="You">あなた</span> have the <span class="popover" data-content="(ちず) map">地図</span> already, leave us alone!” Harumi rebukes with a frown and puffy cheeks.
                                
                                “I can't let <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> follow us; we need something to slow <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> down! See you never!” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="(こたえる) responds">答える</span> before leaving the <span class="popover" data-content="(むら) village">村</span> with all the other captors, only leaving behind the <span class="popover" data-content="(ことば) words">言葉</span> <span class="popover" data-content="he">かれ</span> had just sent out.
                                
                                Both of <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> are extremely tired, but rest needs to come later, as the <span class="popover" data-content="(ことば) words">言葉</span> attack you.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '村内 - Inside the village 4',
                            range: grade4Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You are attacked by words surrounding you from all directions, trying to slow you down and prevent you from following the Aku no Soshiki members.
                            `
                        ],
                        afterText: [
                            `
                                Despite being hopelessly exhausted you manage to beat all the words.
                            `
                        ]
                    },
                    {
                        name: '村内 - Inside the village 5',
                        text: [
                            `
                                “Is everyone all right?” Harumi asks, looking around at all the villagers who had just suffered the attack.
                                
                                “It’s all your fault!” someone shouts at <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>.
                                
                                “H-Huh? W-We didn’t do anything. <span class="popover" data-content="(わたしたち) we">わたし達</span> just tried to help...” Harumi responds with dismay.
                            `,
                            `
                                “Please, just... leave.” an old man, presumably the village elder, says after approaching <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>.
                                
                                “We were only attacked because of <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>. If you never came here none of this would’ve happened. No one wants <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> here now. Please, just leave.” he repeats his plea.
                                
                                Without saying another word, both of <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> <span class="popover" data-content="(でていく) leave">出ていく</span> the village feeling completely dejected.
                            `
                        ]
                    },
                    {
                        name: '村を追われて - Kicked out of the village',
                        text: [
                            `
                                “We’re left with almost nothing.” Harumi says after checking your supplies, right after you left the village.
                                
                                “I was hoping we could stay, and resupply at the <span class="popover" data-content="(むら) village">村</span>, but I guess we need to go foraging now. We could run out of supplies before we reach the next city otherwise.” she continues.
                            `,
                            `
                                “We need to be quick, too. Now that <span class="popover" data-content="(わたしたち) we">わたし達</span> got kicked out, <span class="popover" data-content="(わたしたち) we">わたし達</span> will have to sleep outside, so we need time to set up <span class="popover" data-content="(やえい) camp">野営</span> before it gets dark. Let’s go to the forest, there’s no time to waste.” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(つづける) continues">続ける</span>.
                                
                                You nod, and both of <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> <span class="popover" data-content="(いく) go">行く</span> to the <span class="popover" data-content="(もり) forest">森</span> to look for anything edible.
                            `
                        ]
                    },
                    {
                        name: '森で食料採集 - Foraging in the forest 1',
                        text: [
                            `
                                “So, what do you think we should do now?” Harumi asks while picking berries.
                                
                                “We lost the map, and, while I do remember our next destination, Minatomachi city, <span class="popover" data-content="I">わたし</span> don’t know where to go from there. And besides, <span class="popover" data-content="I">わたし</span> don’t want to put any more people in danger...” <span class="popover" data-content="she">かのじょ</span> continues dejectedly.
                                
                                “Maybe... we should just... stop?” <span class="popover" data-content="she">かのじょ</span> asks for your opinion.
                            `,
                            `
                                You don’t know what to do either, <span class="popover" data-content="you">あなた</span> don’t want to quit, but it’s going to be hard to <span class="popover" data-content="(つづける) continue">続ける</span> without the <span class="popover" data-content="(ちず) map">地図</span>.
                                
                                “Well, <span class="popover" data-content="(わたしたち) we">わたし達</span> can’t stay here, that’s for sure. For now, I guess, <span class="popover" data-content="(わたしたち) we">わたし達</span> should head towards Minatomachi. <span class="popover" data-content="(わたしたち) We">わたし達</span> can decide what to do after that.” Harumi <span class="popover" data-content="(いう) says">言う</span> in low spirits.
                                
                                Suddenly, you hear a rustle in the bushes.
                            `,
                            `
                                A group of words comes out from them.
                                
                                “Well, here we go again.” Harumi utters before the <span class="popover" data-content="(ことば) words">言葉</span> leap at you both.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '森の言葉 - Forest words',
                            range: grade4Range,
                            index: 3
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                The words attack, and you stand your ground.
                            `
                        ],
                        afterText: [
                            `
                                You manage to beat most of the words, and drive away the rest.
                            `
                        ]
                    },
                    {
                        name: '森で食料採集 - Foraging in the forest 2',
                        text: [
                            `
                                “Whew, at least these weren’t too strong... Let’s keep looking, we still need to find more food.” Harumi says after the fight.
                                
                                You keep <span class="popover" data-content="(しょくりょうさいしゅう) foraging">食料採集</span> in the <span class="popover" data-content="(もり) forest">森</span> for a little more, and, after <span class="popover" data-content="(さいしゅう) gathering">採集</span> enough <span class="popover" data-content="(しょくりょう) food">食料</span>, leave the <span class="popover" data-content="(もり) forest">森</span>, set up camp at a nearby field, eat dinner, and go to sleep.
                            `
                        ]
                    },
                    {
                        name: '夜中 - Middle of the night 1',
                        text: [
                            `
                                “Wake up!”
                                
                                While sleeping, you suddenly hear Harumi’s voice. You were taking turns sleeping and keeping watch throughout the <span class="popover" data-content="(よる) night">夜</span>.
                                
                                “We’re about to get attacked!”
                            `,
                            `
                                You open your eyes and find yourself surrounded by words.
                                Thankfully, Harumi was keeping watch when it was your turn to <span class="popover" data-content="(ねむる) sleep">眠る</span>.
                                
                                <span class="popover" data-content="You">あなた</span> jolt awake, and prepare to battle before the <span class="popover" data-content="(ことば) words">言葉</span> attack.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '夜襲 (やしゅう) - Night attack',
                            range: grade4Range,
                            index: 4
                        }),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                You stand back to back with Harumi as the words attack you from every direction.
                            `
                        ],
                        afterText: [
                            `
                                You repel the attack for long enough that the words lose interest and leave.
                            `
                        ]
                    },
                    {
                        name: '夜中 - Middle of the night 2',
                        text: [
                            `
                                The battle was tough, but you managed to pull through.
                                
                                When suddenly, “Aaaa!” Harumi shrieks.
                                Just as <span class="popover" data-content="you">あなた</span> thought it was over, <span class="popover" data-content="you">あなた</span> prepare for another attack.
                            `,
                            `
                                ... But it never comes?
                                
                                <span class="popover" data-content="You">あなた</span> look at Harumi and see her cowering in fear and covering <span class="popover" data-content="her">かのじょ の</span> head.
                                
                                “Eek, eek!” <span class="popover" data-content="you">あなた</span> hear from above.
                                There’s a bat flying overhead.
                                
                                <span class="popover" data-content="You">あなた</span> shoo the bat away, and tell her it’s gone.
                            `,
                            `
                                “T-Thanks...” she slowly stands up, still shivering a little.
                                
                                You find <span class="popover" data-content="her">かのじょ の</span> fear of <span class="popover" data-content="bats">コウモリ</span> really unusual; <span class="popover" data-content="she">かのじょ</span> seems to be perfectly fine with most other things, like bugs or snakes, and quite fearless in the face of danger, like criminals or words.
                                
                                <span class="popover" data-content="You">あなた</span> decide to ask her about it.
                            `,
                            `
                                “W-Well, it’s... it’s nothing really... It’s just... When I was little <span class="popover" data-content="I">わたし</span> went to a cave, and a <span class="popover" data-content="bat">コウモリ</span> got stuck in my hair. I ran home crying and screaming with the <span class="popover" data-content="bat">コウモリ</span> flailing around on my head the entire time.” Harumi responds with a sad look.
                                
                                “My parents had to cut my <span class="popover" data-content="hair">かみ</span> to remove it because it got stuck so badly they couldn’t untangle it. It was horrible!” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(つづける) continues">続ける</span>, getting even more visibly shaken because of the painful memory.
                                
                                “<span class="popover" data-content="I">わたし</span> know it’s nothing that scary. It probably might even seem funny to others, but <span class="popover" data-content="I">わたし</span> ended up being terrified of <span class="popover" data-content="bats">コウモリ</span> and <span class="popover" data-content="caves">どうくつ</span> ever since...” <span class="popover" data-content="she">かのじょ</span> adds, seemingly embarrassed about <span class="popover" data-content="her">かのじょ の</span> experience.
                            `,
                            `
                                Something feels off, though. Hasn’t <span class="popover" data-content="she">かのじょ</span> also lost her memory? How can <span class="popover" data-content="she">かのじょ</span> remember that? Has <span class="popover" data-content="she">かのじょ</span> regained it? <span class="popover" data-content="You">あなた</span> ask her about that.
                                
                                “Oh, right, how do I <span class="popover" data-content="(おぼえている) remember">覚えている</span> that? Hmm...” <span class="popover" data-content="she">かのじょ</span> says, seemingly even more confused than <span class="popover" data-content="you">あなた</span>, and starts thinking.
                                
                                “No, that’s all <span class="popover" data-content="I">わたし</span> can <span class="popover" data-content="(おぼえている) remember">覚えている</span>. <span class="popover" data-content="I">わたし</span> guess the memory comes back in parts, not all at once.” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(つづける) continues">続ける</span>.
                                
                                “Can you remember anything now?” <span class="popover" data-content="she">かのじょ</span> asks back.
                            `,
                            `
                                You think about it, but no, <span class="popover" data-content="your">あなた の</span> past is still as much of a mystery to <span class="popover" data-content="you">あなた</span> as it was before, so <span class="popover" data-content="you">あなた</span> shake your head.
                                
                                “Well, at least <span class="popover" data-content="(わたしたち) we">わたし達</span> know it comes back eventually. <span class="popover" data-content="I">わたし</span> just wish it would start with more happy <span class="popover" data-content="memories">きおく</span>. Why is the only thing I <span class="popover" data-content="(おぼえている) remember">覚えている</span>, that?!” the more she talks, the more she pouts, as if being upset at the <span class="popover" data-content="memory">きおく</span> recovery process, if that’s even a thing.
                                
                                Anyway, as the danger is no more, and Harumi seems to have calmed down, <span class="popover" data-content="you">あなた</span> decide to go back to sleep.
                            `
                        ]
                    },
                    {
                        name: '港町 - Minatomachi',
                        text: [
                            `
                                After breaking camp in the morning, and half a day more of walking, you arrive at Minatomachi.
                                
                                The <span class="popover" data-content="(まち) city">町</span> is located by the sea. The most prominent feature of the <span class="popover" data-content="(まち) city">町</span> is a <span class="popover" data-content="(みなと) port">港</span>, where plenty of ships come in and out, bringing in exotic goods from all over the world, and exporting fine local items around the globe.
                                
                                Most buildings are built from white stone, same as the wall around the <span class="popover" data-content="(まち) city">町</span>, and have blue roofs. The sunlight is strong, the sound of waves and seagull cries can be heard in the background. A slight breeze blows and carries the fresh saline smell of the <span class="popover" data-content="(うみ) sea">海</span>.
                            `,
                            `
                                “We’re finally here! Let’s find a place to stay for now; I’m so tired after all that happened lately...” Harumi says while shielding her eyes from the strong sunlight.
                                
                                You agree, and together, <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> find an inn where you can stay for the night.
                            `
                        ]
                    },
                    {
                        name: "宿屋の酒場 - Inn's tavern",
                        text: [
                            `
                                You and Harumi are eating dinner at a <span class="popover" data-content="(さかば) tavern">酒場</span> located on the bottom floor of the <span class="popover" data-content="(やどや) inn">宿屋</span> <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> are staying at.
                                
                                “So, what do we do from now on? We lost the map, our only lead for finding Aku no Soshiki and a way to go back home.” Harumi asks while <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> are still eating.
                                
                                <span class="popover" data-content="You">あなた</span> don’t have a good answer to that question either, so both of <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> sit there for a moment in silence.
                                
                                “Excuse me.” when all of a sudden, someone approaches <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>.
                            `,
                            `
                                <span class="popover" data-content="You">あなた</span> turn around, and see two men, wearing hoods, but their faces aren’t covered. <span class="popover" data-content="You">あなた</span> quickly recognize one of them.
                                
                                “It’s <span class="popover" data-content="you">あなた</span> again!” Harumi exclaims after jolting up from her seat.
                                
                                He’s the Aku no Soshiki member <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> helped at the swamp a few days ago.
                            `,
                            `
                                “Please, keep it quiet. We’re here incognito, and <span class="popover" data-content="(わたしたち) we">わたし達</span> don’t want to attract unnecessary attention.” he says while motioning to the side. You look around and see everyone else in the <span class="popover" data-content="(さかば) tavern">酒場</span> looking in <span class="popover" data-content="(あなたたちの) your (plural)">あなた達の</span> direction.
                                
                                “S-Sorry...” Harumi apologizes and sits back down, visibly embarrassed about her behavior.
                                
                                “<span class="popover" data-content="(わたしたち) We">わたし達</span> came to thank you for helping me out back then, and to give you this.” <span class="popover" data-content="he">かれ</span> sits down at the opposite side of the table from <span class="popover" data-content="you">あなた</span>, and gives <span class="popover" data-content="you">あなた</span> a piece of paper.
                                
                                “It’s the-! It’s the map...” Harumi almost shouts as <span class="popover" data-content="she">かのじょ</span> sees what <span class="popover" data-content="you">あなた</span> were given, stopping herself and switching to a quieter tone midsentence.
                            `,
                            `
                                “A copy of it. I snuck into the boss' room and made a copy.” the man responds.
                                
                                “Thanks, but is it really okay for <span class="popover" data-content="you">あなた</span> to do this? Won’t <span class="popover" data-content="you">あなた</span> get in trouble for this?” Harumi asks with concern in her voice.
                                
                                “Well, maybe. But <span class="popover" data-content="(わたしたち) we">わたし達</span> really wanted to thank <span class="popover" data-content="you">あなた</span>, and this is the best thing <span class="popover" data-content="(わたしたち) we">わたし達</span> could come up with. <span class="popover" data-content="(わたしたち) We">わたし達</span> can also answer any questions you might have, to the best of our ability at least. <span class="popover" data-content="(わたしたち) We">わたし達</span> are not privy to all the secrets of the organization after all.” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="(こたえる) responds">答える</span>.
                                
                                “That’s really nice, but <span class="popover" data-content="(わたしたち) we">わたし達</span> don’t even know if <span class="popover" data-content="(わたしたち) we">わたし達</span> still want to keep following that treasure. After what just happened in that village...” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(いう) says">言う</span> in low spirits.
                                
                                “That’s up to <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>, <span class="popover" data-content="(わたしたち) we">わたし達</span> just wanted to give <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> back what’s <span class="popover" data-content="(あなたたちの) yours (plural)">あなた達の</span>.” he <span class="popover" data-content="(こたえる) responds">答える</span> again.
                            `,
                            `
                                “What’s the <span class="popover" data-content="treasure">たから</span> anyway? Why does <span class="popover" data-content="(あなたたちの) your (plural)">あなた達の</span> <span class="popover" data-content="boss">ボス</span> want it so badly?” Harumi <span class="popover" data-content="(きく) asks">聞く</span>.
                                
                                “<span class="popover" data-content="(わたしたち) We">わたし達</span> don’t know for sure what it is, and the <span class="popover" data-content="boss">ボス</span> most likely <span class="popover" data-content="(しらない) doesn’t know">知らない</span> for sure either, but from what we gathered, the <span class="popover" data-content="(ちず) map">地図</span> was left by a retired army scientist, who worked on developing new weapons for the military.” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="(こたえる) responds">答える</span>.
                                
                                “The <span class="popover" data-content="boss">ボス</span> believes <span class="popover" data-content="he">かれ</span> left behind a <span class="popover" data-content="weapon">ぶき</span> that’s so powerful, even the military deemed it too dangerous and abandoned its development. <span class="popover" data-content="He">かれ</span> also <span class="popover" data-content="(しんじている) believes">信じている</span> the <span class="popover" data-content="weapon">ぶき</span> can help him subjugate entire countries.” <span class="popover" data-content="he">かれ</span> continues.
                                
                                “W-What?! <span class="popover" data-content="(わたしたち) We">わたし達</span> need to stop <span class="popover" data-content="him (as object of a verb) (を read as “o”)">かれ を</span>! Who knows what <span class="popover" data-content="he">かれ</span> could do with that thing?!” Harumi <span class="popover" data-content="(いう) says">言う</span> before turning <span class="popover" data-content="her">かのじょ の</span> face towards <span class="popover" data-content="you">あなた</span>.
                            `,
                            `
                                After that, <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> <span class="popover" data-content="(きく) ask">聞く</span> them a few more questions and find out that:
                                
                                &nbsp;- The organization’s hideout is located on an island that’s not too far from here, called Ajitojima.
                                &nbsp;- In the <span class="popover" data-content="hideout">アジト</span> there is a portal that can be used to go back to your world.
                                &nbsp;- You most likely came to this <span class="popover" data-content="(せかい) world">世界</span> through a damaged <span class="popover" data-content="portal">てんいもん</span> that was seized by law enforcement back in <span class="popover" data-content="(あなたたちの) your (plural)">あなた達の</span> <span class="popover" data-content="(せかい) world">世界</span>, and the reason <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> lost your memory is probably due to the <span class="popover" data-content="portal’s">てんいもん の</span> malfunction.
                                
                                <span class="popover" data-content="(あなたたち) You (plural)">あなた達</span> also <span class="popover" data-content="(きく) ask">聞く</span> other <span class="popover" data-content="questions">しつもん</span>, including about <span class="popover" data-content="(あなたたちの) your (plural)">あなた達の</span> identities, but <span class="popover" data-content="they (masculine)">かれ ら</span> don’t seem to <span class="popover" data-content="(しる) know">知る</span> much more than <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> already do.
                            `,
                            `
                                “Thanks a lot! That’s basically everything <span class="popover" data-content="(わたしたち) we">わたし達</span> needed to <span class="popover" data-content="(しる) know">知る</span>!” Harumi <span class="popover" data-content="(いう) says">言う</span> with gratitude and a smile.
                                
                                “<span class="popover" data-content="(あなたたち) You (plural)">あなた達</span> are more than welcome. Now, <span class="popover" data-content="(わたしたち) we">わたし達</span> should go before <span class="popover" data-content="(わたしたち) we">わたし達</span> get found out. Goodbye.” <span class="popover" data-content="he">かれ</span> <span class="popover" data-content="(いう) says">言う</span> before standing up, and both of <span class="popover" data-content="them (masculine)">かれ ら</span> leave the <span class="popover" data-content="(さかば) tavern">酒場</span>.
                                
                                “Great! <span class="popover" data-content="I">わたし</span> mean, not great, but at least now <span class="popover" data-content="(わたしたち) we">わたし達</span> know what to do!” Harumi turns to <span class="popover" data-content="you">あなた</span> and <span class="popover" data-content="(いう) says">言う</span> right after <span class="popover" data-content="they (masculine)">かれ ら</span> <span class="popover" data-content="(でる) leave">出る</span>.
                            `,
                            `
                                “Let’s see... According to the <span class="popover" data-content="(ちず) map">地図</span> the <span class="popover" data-content="treasure">たから</span> is located on Takaranoyama mountain, which is not too far from here!” <span class="popover" data-content="she">かのじょ</span> continues while looking at the <span class="popover" data-content="(ちず) map">地図</span>.
                                
                                “<span class="popover" data-content="(わたしたち) We">わたし達</span> don’t have much time; <span class="popover" data-content="(わたしたち) we">わたし達</span> need to get there before Aku no Soshiki. Let’s go to sleep early today, so <span class="popover" data-content="(わたしたち) we">わたし達</span> can <span class="popover" data-content="(いく) go">行く</span> as soon as sunrise!” <span class="popover" data-content="she">かのじょ</span> adds with newfound energy, which is an improvement over the mood <span class="popover" data-content="she">かのじょ</span> was in before, but might be counterproductive to the goal of falling asleep <span class="popover" data-content="(はやく) early">早く</span> this evening.
                            `
                        ]
                    },
                ]
            },
            {
                name: '宝の山 - Takaranoyama',
                entries: [
                    {
                        name: '山林 - Mountain forest 1',
                        text: [
                            `
                                In the early morning, you arrive at Takaranoyama.
                                
                                The <span class="popover" data-content="(やま) mountain">山</span> is covered by thick <span class="popover" data-content="(はやし) woods">林</span>, and has a whole cave system inside of it, with entrances to the <span class="popover" data-content="caves">どうくつ</span> scattered all around.
                                
                                According to the map, the quickest way to the treasure leads through a combination of navigating through the <span class="popover" data-content="(はやし) woods">林</span>, and taking a few shortcuts through some of the <span class="popover" data-content="caves">どうくつ</span>.
                                
                                The <span class="popover" data-content="treasure">たから</span> is supposedly located in one of the <span class="popover" data-content="caves">どうくつ</span>, deep inside the <span class="popover" data-content="(やま) mountain">山</span>.
                            `,
                            `
                                As you venture through the <span class="popover" data-content="(さんりん) mountain forest">山林</span>, you arrive at the entrance to the first <span class="popover" data-content="cave">どうくつ</span>.
                                
                                You are surrounded by lush vegetation, and the <span class="popover" data-content="(いりぐち) entrance">入口</span> to the <span class="popover" data-content="cave">どうくつ</span> in front of you is covered in moss. The inside of the <span class="popover" data-content="cave">どうくつ</span> itself looks completely dark.
                                
                                Harumi seems intimidated by it, cowering in fear.
                            `,
                            `
                                Before entering the <span class="popover" data-content="cave">どうくつ</span> you decide to pull out a torch, but when you’re occupied with it, you hear Harumi shriek “Waah! O-Oh...”, followed by a sigh of relief.
                                
                                “Nevermind, it wasn’t a bat, just a word.” she says with an awkward smile.
                                
                                You see a <span class="popover" data-content="(ことば) word">言葉</span> creep up on you from behind, and a lot more hiding in the bushes nearby.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '山林 - Mountain forest 2',
                            range: grade5Range,
                            index: 0
                        }),
                        totalQuestions: 5,
                        beforeText: [
                            `
                                When the words notice you noticing them, they lunge at you.
                            `
                        ],
                        afterText: [
                            `
                                You beat most of the words and the rest run away.
                            `
                        ]
                    },
                    {
                        name: '洞窟(どうくつ)へ入る - Entering the cave',
                        text: [
                            `
                                “That wasn’t so bad! Ah... oh...” Harumi happily says after the battle, suddenly remembering there’s still a <span class="popover" data-content="cave">どうくつ</span> in front of you halfway through her remark.
                                
                                There isn’t much time to waste, as Aku no Soshiki is most likely already looking for the treasure inside, so after quickly cheering Harumi up, the two of you enter the <span class="popover" data-content="cave">どうくつ</span>, with Harumi staying closely behind <span class="popover" data-content="you">あなた</span>.
                            `
                        ]
                    },
                    {
                        name: '洞窟 (どうくつ) - Cave 1',
                        text: [
                            `
                                As you make your way through the <span class="popover" data-content="cave">どうくつ</span>, suddenly, something falls from the ceiling.
                                
                                “Aaaa! H-Huh?!” Harumi shrieks at first, but her fear is quickly replaced with confusion.
                            `,
                            `
                                The thing that fell from the ceiling was a word.
                                
                                You hold up your torch and look up, and there’s a huge number of <span class="popover" data-content="(ことば) words">言葉</span> stuck to the ceiling.
                                
                                “I didn’t know they could do that; that’s cool!” Harumi exclaims after seeing the scene.
                                
                                But there’s no time for being impressed, as they all fall down to the ground, and attack you.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '洞窟 (どうくつ) - Cave 2',
                            range: grade5Range,
                            index: 1
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You fight the words, as more and more keep falling from the ceiling and attacking you.
                            `
                        ],
                        afterText: [
                            `
                                You manage to beat all the words that fell, as the ones still on the ceiling don’t seem inclined to join the fight anymore.
                            `
                        ]
                    },
                    {
                        name: '洞窟(どうくつ)を出る - Exiting the cave',
                        text: [
                            `
                                You exit the first <span class="popover" data-content="cave">どうくつ</span>, there’s still a few more to go, but for now, you’re back in the forest.
                                
                                “Okay, at least one is over!” Harumi says with a little bit of relief.
                                
                                “Hey, what are you doing here?!” suddenly, you hear someone’s voice from a little up ahead.
                            `,
                            `
                                “I thought we might bump into them along the way." Harumi reacts, as she notices the two men, presumably Aku no Soshiki members, standing in front of you.
                                
                                “Take that!” one of them says while sending out words to attack <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '下っ端 (したっぱ) - Goons 1',
                            range: grade5Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                You get attacked by the sent out words.
                            `
                        ],
                        afterText: [
                            `
                                You beat all of the words sent out.
                            `
                        ]
                    },
                    {
                        name: '下っ端 (したっぱ) - Goons 2',
                        text: [
                            `
                                “Damn, run! We have to let the boss know they’re here!” one of the men says to the other, before they run further ahead.
                            `,
                            `
                                “‘The boss’? Their <span class="popover" data-content="boss">ボス</span> is here too?” Harumi says, visibly surprised.
                                
                                “Maybe this is our chance to capture him!” she continues, full of fighting spirit, excitedly throwing fists into the air.
                                
                                “Let’s go! There’s no time to wa-... Oh...” <span class="popover" data-content="she">かのじょ</span> adds, full of enthusiasm in the beginning, quickly fading after <span class="popover" data-content="she">かのじょ</span> sees what’s in front of you two.
                            `,
                            `
                                “Another <span class="popover" data-content="cave">どうくつ</span>...” Harumi says dejectedly.
                            `
                        ]
                    },
                    {
                        name: "組織(そしき)のボス - Organization's Boss",
                        text: [
                            `
                                After a few more caves and bat encounters, you find another patch of the forest.
                                
                                “Well, that was tough, but at least there don’t seem to be too many more <span class="popover" data-content="caves">どうくつ</span> ahead!” Harumi says with a little bit of relief.
                                
                                “Ah, I’ve been waiting for you two!” suddenly, you hear a voice.
                            `,
                            `
                                You look ahead, and see an imposing looking man with two underlings by his side.
                                
                                “I’m Akuto, the leader of Aku no Soshiki. It’s my pleasure to finally meet <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span> both.” he continues.
                                
                                “We won’t let you get that weapon!” Harumi responds, holding up her fist with determination.
                            `,
                            `
                                “Now, now; just hear me out. Don’t you think that people in power only care for their own interests, not those of the <span class="popover" data-content="(ひとびと) people">人々</span> they’re supposed to be serving?” Akuto starts his villain monologue.
                                
                                “We, the Aku no Soshiki, want to change that. Don’t you agree with our sentiment? You could join us!” <span class="popover" data-content="he">かれ</span> continues.
                            `,
                            `
                                “The weapon would greatly help- H-Hey, what are you doing? Stop it! Ouch!” <span class="popover" data-content="he">かれ</span> covers <span class="popover" data-content="his">かれ の</span> face after being suddenly interrupted by Harumi, who picks up nearby rocks and starts throwing them at him.
                                
                                “Get lost!” Harumi says while pulling down her eyelid and sticking out her tongue in contempt.
                                
                                “Ugh, damn you pesky little... Take that!” <span class="popover" data-content="he">かれ</span> and <span class="popover" data-content="his">かれ の</span> underlings send out words at you and run further into the direction of the treasure.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'アクト - Akuto 1',
                            range: grade5Range,
                            index: 3
                        }),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                The words Akuto and his goons sent out attack you.
                            `
                        ],
                        afterText: [
                            `
                                You manage to beat all of the words.
                            `
                        ]
                    },
                    {
                        name: 'また洞窟(どうくつ) - Another cave',
                        text: [
                            `
                                “Whew, okay, I think it’s all cleaned up. Let’s go, we have to get to the treasure before them!” Harumi says after the battle.
                                
                                “Ugh...” suddenly, she gasps, seeing what’s in front of her.
                                
                                “Another <span class="popover" data-content="cave">どうくつ</span>...” <span class="popover" data-content="she">かのじょ</span> adds.
                            `,
                            `
                                You decide to walk in front of her to lead the way through the <span class="popover" data-content="cave">どうくつ</span>, as always, but then you feel a sharp pain in your ankle and fall to the ground.
                                
                                “Hey, what’s wrong? Oh, there was one left.” Harumi reacts to your fall, and, looking behind, you notice a single word, now running away, that must’ve hit you the moment before.
                                
                                “Are you ok?” <span class="popover" data-content="she">かのじょ</span> asks with concern.
                            `,
                            `
                                You say you’re fine and try to stand up, but when you do, your face distorts with pain. You don’t think you can walk too well with this injury.
                                
                                <span class="popover" data-content="You">あなた</span> tell Harumi she will need to go chase Akuto alone, as <span class="popover" data-content="you">あなた</span> would only be slowing <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> down. That means she will need to enter the next <span class="popover" data-content="cave">どうくつ</span> alone.
                                
                                “W-What?! Me, <span class="popover" data-content="alone">ひとり</span>?! In a <span class="popover" data-content="cave">どうくつ</span>?!” she reacts, expectedly flustered given her fears.
                            `,
                            `
                                <span class="popover" data-content="You">あなた</span> try to convince <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span>, explaining that there really is no time, and, after a few moments, <span class="popover" data-content="she">かのじょ</span> eventually obliges.
                                
                                “I understand the situation, but still, <span class="popover" data-content="I">わたし</span> wouldn’t want to leave <span class="popover" data-content="you">あなた</span> here all by yourself...” <span class="popover" data-content="she">かのじょ</span> says, concerned about <span class="popover" data-content="you">あなた</span>, while preparing to enter the <span class="popover" data-content="cave">どうくつ</span> <span class="popover" data-content="(ひとりで) alone (do something alone)">一人で</span>.
                            `,
                            `
                                “Umm... Wait a second... Here, take this!” <span class="popover" data-content="she">かのじょ</span> hesitates for a moment while looking for something, before handing you a stick <span class="popover" data-content="she">かのじょ</span> just found lying under a nearby tree.
                                
                                “Maybe this will help <span class="popover" data-content="you">あなた</span> walk, even if slowly? <span class="popover" data-content="You">あなた</span> won’t be as defenseless either!” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(くわえる) adds">加える</span>.
                                
                                <span class="popover" data-content="You">あなた</span> thank her and accept the stick.
                                
                                “Okay, I’m going after- Oh...” Harumi says, seemingly having forgotten for a moment that she’s about to have to face her fears soon.
                            `,
                            `
                                “Maybe it won’t be too bad... Maybe there will be no-”
                                “Eek!”
                                “Wah!” <span class="popover" data-content="she">かのじょ</span> tries to reassure herself before getting cut off by the cry of a bat flying out of the <span class="popover" data-content="cave">どうくつ</span>, causing her to shriek and cower.
                                
                                “Oh...” <span class="popover" data-content="she">かのじょ</span> weeps before reluctantly making her way into the <span class="popover" data-content="cave">どうくつ</span>.
                            `
                        ]
                    },
                    {
                        name: 'ハルミが洞窟(どうくつ)に - Harumi in a cave',
                        skin: 'harumi',
                        text: [
                            `
                                “Why is this happening to me?” Harumi says, slowly making her way through the <span class="popover" data-content="cave">どうくつ</span>, her mind filled with dread, tears in her eyes, covering her head, desperately trying not to look at the bats flying overhead.
                                
                                “Eek!” a <span class="popover" data-content="bat">コウモリ</span> cries.
                                
                                “Wah!” she shrieks, <span class="popover" data-content="her">かのじょ の</span> heart is pounding, and <span class="popover" data-content="she">かのじょ</span> is on the verge of tears.
                            `,
                            `
                                If things continue to go like this, not only is <span class="popover" data-content="she">かのじょ</span> going to have a tough time making it out of this <span class="popover" data-content="cave">どうくつ</span>, the slow pace will also make her struggle to catch up with Akuto.
                                
                                “When you’re feeling down, exercise! That’s what grandma always says! I’ll just run and keep running until <span class="popover" data-content="I">わたし</span> am out of this place! And <span class="popover" data-content="I">わたし</span> am going to catch up with them in no time! <span class="popover" data-content="(いっせきにちょう) killing two birds with one stone (literally “one stone, two birds”)">一石二鳥</span>!” Harumi cheers herself up, gaining new determination.
                                
                                <span class="popover" data-content="She">かのじょ</span> starts running, still scared, still covering <span class="popover" data-content="her">かのじょ の</span> head, but determined to see everything through to the end.
                            `,
                            `
                                “Wah!” suddenly, something falls on <span class="popover" data-content="her">かのじょ の</span> arm, the one she used to cover <span class="popover" data-content="her">かのじょ の</span> <span class="popover" data-content="(あたま) head">頭</span>.
                                
                                At first, <span class="popover" data-content="she">かのじょ</span> is afraid it might be a <span class="popover" data-content="bat">コウモリ</span> and throws it to the ground.
                                
                                “Oh, it’s just you.” <span class="popover" data-content="she">かのじょ</span> says with relief, seeing it’s just a word.
                            `,
                            `
                                More of the <span class="popover" data-content="(ことば) words">言葉</span> start falling from the ceiling, blocking <span class="popover" data-content="her">かのじょ の</span> way.
                                
                                “I don’t have time for this; bring it on!” <span class="popover" data-content="she">かのじょ</span> <span class="popover" data-content="(いう) says">言う</span> before charging at them.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '洞窟 (どうくつ) - Cave 3',
                            range: grade6Range,
                            index: 0
                        }),
                        skin: 'harumi',
                        totalQuestions: 5,
                        beforeText: [
                            `
                                Harumi attacks the words blocking her way.
                            `
                        ],
                        afterText: [
                            `
                                Harumi defeats enough of the words to make a way ahead.
                            `
                        ]
                    },
                    {
                        name: '息抜き (いきぬき) - Short break',
                        skin: 'harumi',
                        text: [
                            `
                                “Finally! The exit!” Harumi exclaims after a long run through the <span class="popover" data-content="cave">どうくつ</span>.
                                
                                Between the running and the words falling from the ceiling, she even mostly forgot about the bats, and just rushed forward until the exit.
                                
                                “Huh, huh... Okay, let’s see, now I need to go over... there! Ah... not again...” still wheezing from the run, Harumi checks the map and finds where to go next, that being another <span class="popover" data-content="cave">どうくつ</span>.
                            `,
                            `
                                “I just... need to catch my breath.” <span class="popover" data-content="she">かのじょ</span> stops for a moment, not only to rest, but also to gather the courage to enter another <span class="popover" data-content="cave">どうくつ</span> after just having exited one.
                                
                                “Okay, let’s go!” not before long, <span class="popover" data-content="she">かのじょ</span> takes off into the next <span class="popover" data-content="cave">どうくつ</span>, still anxious, but at least having figured out a way of dealing with <span class="popover" data-content="her">かのじょ の</span> fear, and having some confidence from the previous experience.
                            `
                        ]
                    },
                    {
                        name: '洞窟(どうくつ)内の崖(がけ) - Cave cliff',
                        skin: 'harumi',
                        text: [
                            `
                                “Huh... huh... H-Huh? Hey! You up there! Stop!” Harumi runs through the <span class="popover" data-content="cave">どうくつ</span> as fast as she can, gasping for air, when <span class="popover" data-content="she">かのじょ</span> notices Akuto with his underlings.
                                
                                They’re standing atop a small <span class="popover" data-content="cliff">がけ</span>, maybe two meters (about seven feet) tall.
                            `,
                            `
                                “It’s you again?” Akuto says when he notices <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span>.
                                
                                “I’m not going to let you get that thing!” Harumi <span class="popover" data-content="(いう) says">言う</span> as <span class="popover" data-content="she">かのじょ</span> starts to climb the <span class="popover" data-content="cliff">がけ</span>.
                                
                                “I see you’re alone. I guess my little backup plan worked as expected.” Akuto exclaims, all but admitting that the word attacking you from behind and injuring you was all a part of <span class="popover" data-content="his">かれ の</span> plan.
                            `,
                            `
                                “You, two! Slow <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> down as I grab the treasure!” <span class="popover" data-content="he">かれ</span> says before proceeding forward, leaving the two of his underlings behind.
                                
                                “Yes, sir!” they respond before turning to Harumi and sending words her way.
                                
                                “Ugh... Let’s make this quick, I don’t have time for this.” Harumi groans, as <span class="popover" data-content="she">かのじょ</span> gets attacked by a <span class="popover" data-content="(ことば) word">言葉</span> while trying to scale the <span class="popover" data-content="cliff">がけ</span>, falling back down, and landing on her buttocks.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '崖(がけ)の戦い - Cliff battle 1',
                            range: grade6Range,
                            index: 1
                        }),
                        skin: 'harumi',
                        totalQuestions: 10,
                        beforeText: [
                            `
                                Harumi quickly gets up and fights the words, attacking from above, sent out by the Aku no Soshiki goons.
                            `
                        ],
                        afterText: [
                            `
                                Harumi somehow manages to beat the words despite the terrain disadvantage.
                            `
                        ]
                    },
                    {
                        name: '崖(がけ)の戦いの後 - After cliff battle',
                        skin: 'harumi',
                        text: [
                            `
                                “Now, get out of the way- H-Hey!” after the battle, Harumi again tries to climb the <span class="popover" data-content="cliff">がけ</span>, but before she can reach the top of it, the Aku no Soshiki members push <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> back down.
                                
                                “Oh, come on!” <span class="popover" data-content="she">かのじょ</span> laments in disbelief, not expecting them to be that petty.
                                
                                “What? We’re supposed to slow you down, so we do!” one of them rebukes.
                            `,
                            `
                                (What am I supposed to do now? They can just keep pushing me <span class="popover" data-content="(したへ) down (literally “to down (へ read as “e”)">下へ</span> forever...) Harumi thinks, trying to figure out a solution.
                                
                                Then, the sound of footsteps enters <span class="popover" data-content="her">かのじょ の</span> ears, slowly approaching from behind. Noticing that, Harumi turns around.
                                
                                “Nice timing! It’s about time I needed some help!” <span class="popover" data-content="she">かのじょ</span> says with a cheeky smile.
                            `
                        ]
                    },
                    {
                        name: '再開 - Reunion',
                        text: [
                            `
                                You make your way through the caves, using the stick Harumi gave you as a cane.
                                
                                Thankfully, you don’t get attacked on the way, thanks to her clearing the way ahead of you.
                                
                                Before long, you notice Harumi struggling below a small cliff, with two Aku no Soshiki members standing on top of it, slowing <span class="popover" data-content="her (as object of a verb) (を read as “o”)">かのじょ を</span> down.
                            `,
                            `
                                You lock eyes with her, and after a quick nod, <span class="popover" data-content="she">かのじょ</span> starts climbing the <span class="popover" data-content="cliff">がけ</span> again.
                                
                                “Not so fast- Ugh!” one of the goons says, before being interrupted by your attack.
                                
                                You’re standing at the foot of the <span class="popover" data-content="cliff">がけ</span>, fending off their attacks with your stick, allowing Harumi to climb all the way <span class="popover" data-content="(うえ へ) up (literally “to up”) (へ read as “e”)">上へ</span>.
                            `,
                            `
                                “Ah, damn! Let’s go; we probably bought enough time anyway.” one of them <span class="popover" data-content="(いう) says">言う</span> before they take off, going further inside the cave.
                                
                                “Hey, stop! Oh...” Harumi shouts and almost starts chasing them, before quickly turning around and noticing you, struggling to scale the <span class="popover" data-content="cliff">がけ</span> with your injured ankle.
                                
                                “Here, let me help you.” <span class="popover" data-content="she">かのじょ</span> extends her hand towards <span class="popover" data-content="you">あなた</span>, trying to help you up the <span class="popover" data-content="cliff">がけ</span>.
                                
                                “Wah!” but then, something falls from the ceiling, and lands on <span class="popover" data-content="her">かのじょ の</span> head.
                            `,
                            `
                                She lets go of <span class="popover" data-content="you">あなた</span>, resulting in <span class="popover" data-content="you">あなた</span> falling back <span class="popover" data-content="(したへ) down (literally “to down (へ read as “e”)">下へ</span>. Fortunately at least, the fall didn’t seem to worsen <span class="popover" data-content="your">あなた の</span> <span class="popover" data-content="injury">けが</span>.
                                
                                “Aaa! Get off me! O-Oh...” she throws the thing off <span class="popover" data-content="her">かのじょ の</span> head, and realizes it was a word.
                                
                                After that, more rogue <span class="popover" data-content="(ことば) words">言葉</span> appear, surrounding <span class="popover" data-content="(あなたたち) you (plural)">あなた達</span>.
                                
                                “Oh, not now! We don’t have time for this!” <span class="popover" data-content="she">かのじょ</span> cries out.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: '崖(がけ)の戦い - Cliff battle 2',
                            range: grade6Range,
                            index: 2
                        }),
                        totalQuestions: 10,
                        beforeText: [
                            `
                                The words attack both of you, Harumi on top of the cliff, and you at the bottom.
                            `
                        ],
                        afterText: [
                            `
                                Both of you manage to defeat most of the words, before the rest of them disperses.
                            `
                        ]
                    },
                    {
                        name: 'アクト - Akuto 2',
                        text: [
                            `
                                After the battle, Harumi helps you up the cliff, this time with no further obstacles.
                                
                                “Let’s go!” she says quickly, before taking off into the same direction the Aku no Soshiki members ran towards, with you slowly following behind.
                                
                                Not before long, you find yourself in a cave chamber, with the three men trying to pry open a chest sitting at the far end of it. That seems to be the treasure.
                            `,
                            `
                                “Not so fast!” Harumi shouts and sprints towards them.
                                
                                “I’m going to throw that line right back at you!” Akuto responds, sending out a huge group of words.
                            `
                        ]
                    },
                    {
                        ...storyBattleFragment({
                            name: 'アクト - Akuto 3',
                            range: grade6Range,
                            index: 3
                        }),
                        totalQuestions: 15,
                        beforeText: [
                            `
                                The words attack you and don’t let you get too close to Akuto.
                            `
                        ],
                        afterText: [
                            `
                                After a long battle, you manage to defeat all the words.
                            `
                        ]
                    },
                    {
                        name: 'お宝 - Treasure',
                        text: [
                            `
                                Despite defeating all the words, it seems like you were too late.
                                
                                The treasure chest is already open, and Akuto is rummaging through it.
                                
                                “We can still stop-” Harumi says before being suddenly cut off.
                                
                                “What is this?!” Akuto shouts after pulling out a piece of paper from inside the chest.
                            `,
                            `
                                “Oh, come on... We’re leaving! This was a huge waste of time!” he says with a temper after a moment of looking at the paper, and furiously tosses both it and the original treasure map on the ground.
                                
                                “H-Huh? What was that all about?” Harumi reacts in disbelief.
                                
                                The whole situation is so surreal none of you even think of following them.
                            `,
                            `
                                You pick up the <span class="popover" data-content="(かみ) paper">紙</span> and read “The real treasure is the kanji we learned along the way.”
                                
                                You also walk up to the chest and look inside, and there really is nothing more to be found other than the one piece of <span class="popover" data-content="(かみ) paper">紙</span> with the aforementioned message written on it.
                                
                                “Well, at least they didn’t obtain any dangerous weapons.” Harumi <span class="popover" data-content="(いう) says">言う</span> with a shrug and a puzzled expression.
                                
                                While you can’t help but agree with her, there is still one more big issue left on <span class="popover" data-content="your">あなた の</span> mind.
                            `,
                            `
                                How can <span class="popover" data-content="(あなたたちの) your (plural)">あなた達の</span> possibly split this treasure with the little girl who lent you the <span class="popover" data-content="(ちず) map">地図</span> in the first place?
                            `
                        ]
                    }
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