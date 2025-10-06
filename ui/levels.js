'use strict';

var $kt = $kt || {};

(() => {

    const LEVEL_NAMES = [
        'あ行',
        'ま行',
        'ら行',
        'な行',
        'か行',
        'さ行',
        'た行',
        'は行',
        'や行',
        'わ行',
        'ア行',
        'マ行',
        'ラ行',
        'ナ行',
        'カ行',
        'サ行',
        'タ行',
        'ハ行',
        'ヤ行',
        'ワ行',
        '人木山日雨 (1st Grade)'
    ];

    const LEVEL_CHARS = [
        [...'あいうえお'],
        [...'まみむめも'],
        [...'らりるれろ'],
        [...'なにぬねの'],
        [...'かきくけこがぎぐげご'],
        [...'さしすせそざじずぜぞ'],
        [...'たちっつてとだぢづでど'],
        [...'はひふへほばびぶべぼぱぴぷぺぽ'],
        [...'やゆよゃゅょ'],
        [...'わをん'],
        [...'アイウエオ'],
        [...'マミムメモ'],
        [...'ラリルレロー'],
        [...'ナニヌネノ'],
        [...'カキクケコガギグゲゴ'],
        [...'サシスセソザジズゼゾ'],
        [...'タチッツテトダヂヅデドィゥェ'],
        [...'ハヒフヘホバビブベボパピプペポァォ'],
        [...'ヤユヨャュョ'],
        [...'ワヲンヴ'],
        [...'人木山日雨']
    ];

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
            const name = LEVEL_NAMES[level - 1] || 'End game';
            return `Level ${level}: ${name}`;
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