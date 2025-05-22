var $kt = $kt || {};

(() => {

    class KantoreTemplates {

        /**
         * @param {string} levelName
         * @param {number} totalExp
         * @param {number} currentLevelExp
         * @param {number} toNextLevelExp
         * @param { [ { char?: string, oldExpWidth: number, newExpWidth: number, addedExp: number } ] } expData 
         */
        levelExp(levelName, totalExp, currentLevelExp, toNextLevelExp, expData) {
            return `
                <div id="level-total-exp">
                    Total EXP: ${totalExp}
                </div>
                <div id="level-next-level">
                    To next level: ${currentLevelExp} / ${toNextLevelExp}
                </div>
                <div id="level-name">
                    ${levelName}
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
                            <div class="level-exp-container">
                                <div class="level-exp-content" style="width:${exp.oldExpPercentage}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

    }

    $kt.templates = new KantoreTemplates();

})();