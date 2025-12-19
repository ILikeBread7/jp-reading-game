import { LIVES_ANIMATION_TYPE } from './enums.js';
import { KantoreUtils } from './utils.js';

export class KantoreTemplates {

    /**
     * 
     * @param {[{
     *      pos: [string],
     *      misc: [string]?,
     *      gloss: [string|{ value: string, type: string }],
     *      lsource: [ { lang: string, value: string?, wasei: boolean? } ],
     *      sInf: string?
     *  }]} meanings
     */
    static questionMeaning(meanings) {
        const SEPARATOR = '; ';
        return meanings.map(m => /*html*/`
            <ul class="meaning-entry">
            <li><span>Definition:</span> ${m.gloss.map(g => typeof g === 'string' ? g : `${g.value} (${g.type})`).join(SEPARATOR)}</li>
                <li><span>Part of speech:</span> ${m.pos.join(SEPARATOR)}</li>
                ${KT._coa(m.lsource) && /*html*/`<li><span>From:</span> ${m.lsource.map(KT._mapLanguageSource).join(SEPARATOR)}</li>`}
                ${KT._coa(m.misc) && /*html*/`<li><span>Additional info:</span> ${m.misc.join(SEPARATOR)}</li>`}
                ${KT._coa(m.field) && /*html*/`<li><span>Field:</span> ${m.field.join(SEPARATOR)}</li>`}
                ${KT._coa(m.dial) && /*html*/`<li><span>Dialect:</span> ${m.dial.join(SEPARATOR)}</li>`}
            </ul>
        `).join('');
    }

    static _mapLanguageSource(lsource) {
        if (!lsource.value) {
            return lsource.lang;
        }
        return `${lsource.value} (${lsource.lang})${KT._coa(lsource.wasei) && ' (wasei word)'}`;
    }

    static hintLoading() {
        return /*html*/`
            <div class="spinner-container">
                <div class="hint-spinner"></div>
                Loading<span class="loading-dots">...</span>
            </div>
        `;
    }

    static kanjiHintEntry(kanjiData) {
        const allReadings = [
            KT._kanjiReadings(kanjiData.kunReadings),
            KT._kanjiReadings(kanjiData.onReadings)
        ].filter(Boolean)
        .join('; ');

        return /*html*/`
            <div>
                <span class="hint-emphasis">${kanjiData.kanji}</span>,
                ${
                    KT._tif(
                        allReadings.length > 0
                        && /*html*/ `Readings: ${allReadings}`
                    )
                }
                ${
                    KT._tif(
                        kanjiData.meaning
                        && /*html*/ `Meanings: <span class="hint-emphasis">${kanjiData.meaning.join('; ')}</span>`
                    )
                }
            </div>
        `;
    }

    static _kanjiReadings(readings) {
        if (!readings) {
            return '';
        }

        return /*html*/ `<span class="hint-emphasis">${readings.map(reading => /*html*/ `<span class="nowrap">${reading}</span>`).join(', ')}</span>`;
    }

    /**
     * @param {string} levelName
     * @param {number} totalExp
     * @param {number} currentLevelExp
     * @param {number} toNextLevelExp
     * @param {number} maxedCharacters 
     * @param {number} totalCharacters 
     * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage: number, addedExp: number } ] } expData 
     */
    static levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData) {
        return /*html*/`
            ${KT.levelData(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, expData[0].oldExpPercentage, expData[0].newExpPercentage >= 100)}
            <div class="fade-in-out" id="level-exp-tmp-bars">
                ${expData[0].addedExp > 0 ? /*html*/`<div>Total: +${expData[0].addedExp}XP!</div>` : 'Correct answer!'}
                ${expData.slice(1).map(exp => /*html*/`
                    <div>
                        ${exp.char}: +${exp.addedExp}XP!
                        ${KT._tif(exp.newExpPercentage >= 100) && KT._expMaxSpan()}
                        <div class="level-exp-container">
                            <div class="level-exp-content" style="width:${exp.oldExpPercentage}%;"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * @param {string} levelName
     * @param {number} totalExp
     * @param {number} currentLevelExp
     * @param {number} toNextLevelExp
     * @param {number} maxedCharacters 
     * @param {number} totalCharacters 
     * @param {number} [levelExpPercentage=currentLevelExp * 100 / toNextLevelExp] 
     * @param {boolean} [isLevelMax=false] 
     */
    static levelData(levelName, totalExp, currentLevelExp, toNextLevelExp, maxedCharacters, totalCharacters, levelExpPercentage = currentLevelExp * 100 / toNextLevelExp, isLevelMax = false) {
        return /*html*/`
            <div id="level-total-exp">
                Total EXP: ${totalExp}
            </div>
            ${
                KT._tif(toNextLevelExp > 0)
                && /*html*/`
                    <div id="level-next-level">
                        To next level: ${currentLevelExp} / ${toNextLevelExp}
                    </div>
                `
            }
            <div id="level-name">
                ${levelName} ${KT._tif(totalCharacters) && `(${maxedCharacters}/${totalCharacters})`}
                ${KT._tif(isLevelMax) && KT._expMaxSpan()}
            </div>
            <div id="level-exp-bars">
                <div class="level-exp-container" id="level-current-level-exp-container">
                    <div class="level-exp-content" id="level-current-level-exp-content" style="width:${Number.isFinite(levelExpPercentage) ? levelExpPercentage : 100}%;"></div>
                </div>
            </div>
        `;
    }

    /**
     * 
     * @param {string} levelName 
     * @param {number} totalCorrectAnswers 
     * @returns 
     */
    static practiceData(levelName, totalCorrectAnswers) {
        return /*html*/`
            <div id="practice-data-container">
                <div id="level-name">
                    ${levelName}
                </div>
                <div id="level-total-exp">
                    Total correct answers: ${totalCorrectAnswers}
                </div>
                ${
                    KT._tif(totalCorrectAnswers > 0) && /*html*/
                    `<div class="fade-in-out">
                        Correct answer!
                    </div>`
                }
            </div>
        `;
    }

    /**
     * 
     * @param {string} levelName 
     * @param {number} lives 
     * @param {LIVES_ANIMATION_TYPE} livesAnimationType 
     * @param {number} currentAnswers 
     * @param {number} totalQuestions 
     * @returns 
     */
    static arcadeData(levelName, lives, livesAnimationType, currentAnswers, totalQuestions) {
        return /*html*/`
            <div id="arcade-data-container">
                <div id="level-name">
                    ${levelName}
                </div>
                <div id="level-exp-data">
                    <div class="question-cells-container">
                        ${[...KantoreUtils.range(1, totalQuestions)].map(value => {
                            return /*html*/`<div class="question-cell ${this._tif(value === currentAnswers + 1) && 'active'} ${this._tif(value <= currentAnswers) && 'filled'}">${value}</div>`;
                        }).join('')}
                    </div>
                    <div class="${KT._mapLivesAnimationTypeToCssClass(livesAnimationType)} ${KT._tif(lives === 0) && `empty-lives`}" id="arcade-lives">
                        Lives: <span class="lives">${Array(lives).fill('命').join('')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 
     * @param {LIVES_ANIMATION_TYPE} livesAnimationType 
     */
    static _mapLivesAnimationTypeToCssClass(livesAnimationType) {
        switch(livesAnimationType) {
            case LIVES_ANIMATION_TYPE.SHAKE:
                return 'shake';
            case LIVES_ANIMATION_TYPE.JUMP:
                return 'jump';

            default:
            case LIVES_ANIMATION_TYPE.NONE:
                return '';
        }
    }

    static _expMaxSpan() {
        return /*html*/`
            <span class="fade-hidden exp-max">
                <span class="exp-max-chars-container">
                    <span class="jumpable exp-max-char">M</span>
                    <span class="jumpable exp-max-char">a</span>
                    <span class="jumpable exp-max-char">x</span>
                    <span class="jumpable exp-max-char">!</span>
                </span>
            </span>
        `;
    }

    static categoriesMenu(categories) {
        const category = { name: 'Categories', entries: categories };
        const parentMenuId = '';    // empty for the first element
        const parentCategoryCssName = 'main';
        return KT._categoryMenu(category, parentMenuId, parentCategoryCssName);
    }

    static _categoryMenu(category, parentMenuId, parentCategoryCssName) {
        const entries = category.entries;
        if (!entries) {
            return;
        }
        const { categoryId, categoryCssName } = KantoreTemplates._createCategoryIdAndCssName(category, parentCategoryCssName);

        return /*html*/`
            <div class="centered menu hidden scrollable scrollable-container" id="${categoryId}">
                ${entries.map(entry => KT._entryButton(entry, categoryCssName)).join('')}
                <button class="menu-item menu-button ${parentMenuId && `menu-destination-button`} back-button" id="category-${categoryCssName}-back-button" ${parentMenuId && `data-destination="${parentMenuId}"`}>Go back</button>
            </div>
        ` + entries.map(entry => KT._categoryMenu(entry, categoryId, categoryCssName)).join('');
    }

    static _entryButton(entry, categoryCssName) {
        if (entry.entries) {
            return KT._subcategoryEntryButton(entry, categoryCssName);
        }
        return KT._categoryEntryButton(entry, categoryCssName);
    }

    static _categoryEntryButton(entry, categoryCssName) {
        const buttonCssName = KT._cssName(entry.name);
        const dictData = entry.level
            ? /*html*/`data-level-dict="${entry.level}"`
            : /*html*/`data-tag-dict="${entry.tag}"`

        return /*html*/`
            <button class="menu-item menu-button category-entry-button" id="category-${categoryCssName}-entry-${buttonCssName}-button" ${dictData}>${entry.name}</button>
        `;
    }

    static _subcategoryEntryButton(subcategory, parentCategoryCssName) {
        const buttonCssName = KT._cssName(subcategory.name);
        const { categoryId, categoryCssName } = KT._createCategoryIdAndCssName(subcategory, parentCategoryCssName);
        
        return /*html*/`
            <button class="menu-item menu-button menu-destination-button" id="category-${categoryCssName}-entry-${buttonCssName}-button" data-destination="${categoryId}">${subcategory.name}</button>
        `;
    }

    static _createCategoryIdAndCssName(category, parentCategoryCssName) {
        const currentCategoryCssName = KT._cssName(category.name);
        const categoryCssName = `${parentCategoryCssName}-${currentCategoryCssName}`;
        const categoryId = `category-${categoryCssName}-container`;
        return { categoryId, categoryCssName };
    }

    static _cssName(name) {
        return name
            .replaceAll(/[^0-9a-zA-Z ]/g, '')   // Remove all non-alphanumeric characters
            .trim()
            .replaceAll(/\s+/g, '-')    // Replace all spaces (and sequences of spaces) with dashes
            .toLowerCase();
    }

    static controls() {
        return /*html*/ `
            <div class="hint-explanation">
                Read the word at the top of the screen and
                type it into the input below the question
                using the hints shown on the screen.
            </div>
            <div class="hint-explanation">
                Press ENTER to confirm your answer.
            </div>
            <div class="hint-explanation">
                Press ENTER with an empty input
                to get an extra hint but you won't receive any exp.
            </div>
            <div>
                Navigation:<br>
                Arrow keys - navigate menus<br>
                ENTER / Left click - confirm<br>
                SHIFT - Go back (in menus)<br>
                TAB - Open settings<br>
            </div>
            <div class="hint-explanation">
                You can close this message by pressing ENTER,
                clicking the X icon at top-right,
                or clicking anywhere outside this mesage box.
            </div>
        `;
    }

    static arcadeModeExplanation() {
        return /*html*/ `
            <div class="hint-explanation">
                Answer 15 questions to beat arcade mode!
            </div>
            <div class="hint-explanation">
                You have 60 seconds per question.
            </div>
            <div class="hint-explanation">
                If you don't know the answer
                you can skip a question by submitting
                an empty answer
                (press ENTER with an empty input box).
            </div>
            <div class="hint-explanation">
                That will cost you a life
                (indicated with the <span class="lives">命</span>
                kanji on the right side of the screen),
                but if you don't answer (or skip) in time
                the game will end even if you still have lives remaining.
            </div>
            <div class="hint-explanation">
                Every 5 correct answers you replenish one life.
            </div>
            <div class="hint-explanation">
                To start close this message be pressing ENTER,
                clicking the X icon in the top-right corner,
                or clicking anywhere outside of this message box.
            </div>
            <div class="hint-explanation">
                Good luck and have fun!
            </div>
        `;
    }

    static storyModeMenu(menuId, parentMenuId, entries) {
        return /*html*/ `
            <div class="centered menu hidden scrollable scrollable-container story-menu" id="${menuId}">
                ${entries.map(entry => KT._storyModeHubEntryButton(menuId, entry)).join('')}
                <button class="menu-item menu-button menu-destination-button back-button" id="${menuId}-back-button" data-destination="${parentMenuId}">Go back</button>
            </div>
        ` + entries.map(hubEntry => {
                const submenuHtmlId = `${menuId}-${KT._cssName(hubEntry.name)}`;
                return /*html*/ `
                    <div class="centered menu hidden scrollable scrollable-container story-menu" id="${submenuHtmlId}">
                        ${
                            hubEntry
                                .entries
                                .map(levelEntry => KT._storyModeLevelEntryButton(submenuHtmlId, levelEntry))
                                .join('')
                        }
                        <button class="menu-item menu-button menu-destination-button back-button default-colors" id="${submenuHtmlId}-back-button" data-destination="${menuId}">Go back</button>
                    </div>
                `;
            }).join('');
    }

    static _storyModeHubEntryButton(menuId, entry) {
        const buttonCssName = KT._cssName(entry.name);
        const destinationMenuId = `${menuId}-${buttonCssName}`;

        return /*html*/`
            <button class="menu-item menu-button menu-destination-button story-entry-button" id="${menuId}-entry-${buttonCssName}-button" data-destination="${destinationMenuId}">${entry.name}</button>
        `;
    }

    static _storyModeLevelEntryButton(menuId, entry) {
        const buttonCssName = KT._cssName(entry.name);

        return /*html*/`
            <button class="menu-item menu-button story-mode-entry-button ${entry.skin || 'default-colors'}" id="${menuId}-entry-${buttonCssName}-button">${entry.name}</button>
        `;
    }

    static storyModeFailureText() {
        return /*html*/ `<div class="centered-text">
            You can try again,
            study up in the learning mode,
            or get a refresher in practice mode.
        </div>`;
    }

    static storyToBeContinuedText() {
        return /*html*/ `<div class="centered-text">
            This is it for now, but
            the story will continue in future updates.<br>
            <br>
            Thanks for playing!
        </div>`;
    }

    /**
     * Function for html templates, if value is falsey returns elseValue
     * @returns value if condition is met, elseValue otherwise
     * @param {boolean} condition 
     * @param {any} value 
     * @param {any} elseValue default '' (empty string)
     * @returns 
     */
    static _tif(value, elseValue = '') {
        return value || elseValue;
    }

    /**
     * Function for html templates, if value is null or undefined returns elseValue
     * @param {any} value 
     * @param {any} elseValue default '' (empty string)
     * @returns 
     */
    static _coa(value, elseValue = '') {
        return value ?? elseValue;
    }

}

const KT = KantoreTemplates;