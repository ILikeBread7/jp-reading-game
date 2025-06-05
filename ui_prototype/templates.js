var $kt = $kt || {};

(() => {

    class KantoreTemplates {

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param { [ { char?: string, oldExpPercentage: number, newExpPercentage: number, addedExp: number } ] } expData 
         */
        levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData) {
            const expMaxSpan = `
                <span class="fade-hidden exp-max">
                    <span class="exp-max-chars-container">
                        <span class="jumpable exp-max-char">M</span>
                        <span class="jumpable exp-max-char">a</span>
                        <span class="jumpable exp-max-char">x</span>
                        <span class="jumpable exp-max-char">!</span>
                    </span>
                </span>
            `;
            
            return `
                <div id="level-total-exp">
                    Total EXP: ${totalExp}
                </div>
                <div id="level-next-level">
                    To next level: ${currentLevelExp} / ${toNextLevelExp}
                </div>
                <div id="level-name">
                    ${levelName}
                    ${this._tif(expData[0].newExpPercentage >= 100, expMaxSpan)}
                </div>
                <div id="level-exp-bars">
                    <div class="level-exp-container" id="level-current-level-exp-container">
                        <div class="level-exp-content" id="level-current-level-exp-content" style="width:${expData[0].oldExpPercentage}%;"></div>
                    </div>
                </div>
                <div class="fade-hidden" id="level-exp-tmp-bars">
                    <div>Total: +${expData[0].addedExp}XP!</div>
                    ${expData.slice(1).map(exp => `
                        <div>
                            ${exp.char}: +${exp.addedExp}XP!
                            ${this._tif(exp.newExpPercentage >= 100, expMaxSpan)}
                            <div class="level-exp-container">
                                <div class="level-exp-content" style="width:${exp.oldExpPercentage}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        /**
         * Function for html templates
         * @returns value if condition is met, elseValue otherwise
         * @param {boolean} condition 
         * @param {any} value 
         * @param {any} elseValue default '' (empty string)
         * @returns 
         */
        _tif(condition, value, elseValue = '') {
            return condition ? value : elseValue;
        }

    }

    $kt.templates = new KantoreTemplates();

})();