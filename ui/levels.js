'use strict';
import { KANA_CHARS, KANJI_CHARS_GRADE1, KANJI_CHARS_STRINGS } from './level-chars.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

(() => {

    const LEVELS = [
        KANA_CHARS,
        KANJI_CHARS_GRADE1
    ];
    const LEVEL_CHARS = LEVELS.flatMap(x => x);

    const REPS_PER_CHAR = 5;

    const HIRAGANA_LEVELS_RANGE = Object.freeze([1, 10]);
    const KATAKANA_LEVELS_RANGE = Object.freeze([11, 20]);

    const LEVEL_RANGES = Object.freeze([
        HIRAGANA_LEVELS_RANGE,
        KATAKANA_LEVELS_RANGE,
        [21, 21], // Kanji first grade
    ]);

    class KantoreLevels {

        static getLevelName(level) {
            let name;

            const index = level - 1;
            if (level <= KANA_CHARS.length) {
                name = `${KANA_CHARS[index][0]}行`;
            } else {
                const kanjiLevel = level - KANA_CHARS.length;
                const grade = this._findGradeForKanjiLevel(kanjiLevel);
                const gradeName = this._getGradeName(grade);
                name = `${KANJI_CHARS_STRINGS[kanjiLevel - 1]} (${gradeName})`;
            }

            return name ? `Level ${level}: ${name}` : 'Endgame';
        }

        static _findGradeForKanjiLevel(kanjiLevel) {
            let grade = 1;

            while (LEVELS[grade] && (kanjiLevel -= LEVELS[grade].length) > 0) {
                grade++;
            }

            return grade;
        }

        static _getGradeName(grade) {
            switch (grade) {
                case 1: return '1st Grade';
                case 2: return '2nd Grade';
                case 3: return '3rd Grade';
                case 4:
                case 5:
                case 6:
                    return `${grade}th Grade`;
                case 7: return 'Junior High School';
                case 8: return 'Jinmeiyou';
                case 9: return 'Non-standard Kanji';
                default: return;
            }
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