'use strict';

var $kt = $kt || {};

(() => {

    class KantoreTemplates {

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
                        <div class="level-exp-content" id="level-current-level-exp-content" style="width:${levelExpPercentage}%;"></div>
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
                <div id="level-name">
                    ${levelName}
                </div>
                <div id="level-total-exp">
                    Total correct answers: ${totalCorrectAnswers}
                </div>
            `;
        }

        /**
         * 
         * @param {string} levelName 
         * @param {number} currentAnswers 
         * @param {number} totalQuestions 
         * @param {number} [currentAnswersPercentage=currentAnswers * 100 / totalQuestions] 
         * @returns 
         */
        static arcadeData(levelName, currentAnswers, totalQuestions, currentAnswersPercentage = currentAnswers * 100 / totalQuestions) {
            return /*html*/`
                <div id="level-name">
                    ${levelName}
                </div>
                <div id="level-next-level">
                    Correct answers: ${currentAnswers} / ${totalQuestions}
                </div>
                <div id="level-exp-bars">
                    <div class="level-exp-container" id="level-current-level-exp-container">
                        <div class="level-exp-content" id="level-current-level-exp-content" style="width:${currentAnswersPercentage}%;"></div>
                    </div>
                </div>
            `;
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

    const KT = $kt.templates = KantoreTemplates;

})();