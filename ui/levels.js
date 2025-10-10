'use strict';
import {
    LEVEL_CHARS,
    KANA_STRINGS,
    KANJI_GRADE_1_STRINGS,
    KANJI_GRADE_2_STRINGS,
    KANJI_GRADE_3_STRINGS,
    KANJI_GRADE_4_STRINGS,
    KANJI_GRADE_5_STRINGS,
    KANJI_GRADE_6_STRINGS,
    KANJI_JUNIORHIGH_STRINGS,
    KANJI_JINMEIYO_STRINGS,
    KANJI_NONSTANDARD_STRINGS
} from './level-chars.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

(() => {

    const LEVEL_NAMES = [
        ...KANA_STRINGS.map(string => `${string.charAt(0)}行`),
        ...KANJI_GRADE_1_STRINGS.map(string => `${string} (Grade 1)`),
        ...KANJI_GRADE_2_STRINGS.map(string => `${string} (Grade 2)`),
        ...KANJI_GRADE_3_STRINGS.map(string => `${string} (Grade 3)`),
        ...KANJI_GRADE_4_STRINGS.map(string => `${string} (Grade 4)`),
        ...KANJI_GRADE_5_STRINGS.map(string => `${string} (Grade 5)`),
        ...KANJI_GRADE_6_STRINGS.map(string => `${string} (Grade 6)`),
        ...KANJI_JUNIORHIGH_STRINGS.map(string => `${string} (Junior High)`),
        ...KANJI_JINMEIYO_STRINGS.map(string => `${string} (Jinmeiyou)`),
        ...KANJI_NONSTANDARD_STRINGS.map(string => `${string} (Hyougai)`),
    ];

    const REPS_PER_CHAR = 5;

    const HIRAGANA_RANGE_END = Math.floor(KANA_STRINGS.length / 2);
    const HIRAGANA_LEVELS_RANGE = [1, HIRAGANA_RANGE_END];
    const KATAKANA_LEVELS_RANGE = [HIRAGANA_RANGE_END + 1, KANA_STRINGS.length];

    let previousRangeEnd = KANA_STRINGS.length;
    const LEVEL_RANGES = Object.freeze([
        HIRAGANA_LEVELS_RANGE,
        KATAKANA_LEVELS_RANGE,
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_1_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_2_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_3_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_4_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_5_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_GRADE_6_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_JUNIORHIGH_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_JINMEIYO_STRINGS.length],
        [previousRangeEnd + 1, previousRangeEnd += KANJI_NONSTANDARD_STRINGS.length],
    ]);

    class KantoreLevels {

        /**
         * 
         * @param {number} level 
         * @param {boolean} breakLineKanjiLevels if true there will be a break line instead of a space for kanji levels
         * @returns 
         */
        static getLevelName(level, breakLineKanjiLevels) {
            const separator = breakLineKanjiLevels && level > KANA_STRINGS.length ? '<br>' : ' ';
            const name = LEVEL_NAMES[level - 1] || 'Endgame';
            return `Level ${level}:${separator}${name}`;
        }

        static getCharsWithRepsPerLevel(level) {
            return new Map(
                (LEVEL_CHARS[level - 1] || [])
                    .map(char => [ char, REPS_PER_CHAR ])
            );
        }

        static get maxLevel() {
            return LEVEL_CHARS.length;
        }

        static getTotalCharsForDisplay(level) {
            const [ start, end ] = KantoreLevels._getTotalCharsLevelRange(level);
            return KantoreLevels._getTotalCharsInRange(start, end);
        }

        static getTotalCharsUntilLevel(level) {
            const [ start, ] = KantoreLevels._getTotalCharsLevelRange(level);
            const end = level - 1;
            return KantoreLevels._getTotalCharsInRange(start, end);
        }

        static _getTotalCharsInRange(start, end) {
            let charsSum = 0;
            
            for (let level = start; level <= end; level++) {
                const index = level - 1;
                const currentLevelChars = LEVEL_CHARS[index];

                if (!currentLevelChars) {
                    break;
                }

                charsSum += currentLevelChars.length;
            }
            return charsSum;
        }

        static _getTotalCharsLevelRange(level) {
            const range = LEVEL_RANGES
                .find(range => level >= range[0] && level <= range[1]);

            if (range) {
                return range;
            }

            // Endgame
            return [
                LEVEL_CHARS.length + 1,
                LEVEL_CHARS.length + 1
            ];
        }

        static get hiraganaLevelsRange() {
            return HIRAGANA_LEVELS_RANGE;
        }

        static get katakanaanaLevelsRange() {
            return KATAKANA_LEVELS_RANGE;
        }

    }

    $kt.levels = KantoreLevels;

})();