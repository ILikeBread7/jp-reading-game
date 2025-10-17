import fs from 'node:fs';

const DEBUG = process.argv[2] !== 'prod';
const GENERATE_LEVELS = process.argv[2] === 'levels';
const CONFIG = DEBUG
    ? { // debug config
        indentSize: 2
    }
    : { // prod config
        indentSize: 0
    };
if (GENERATE_LEVELS) {
    console.log('Running generate levels.');
}
console.log(DEBUG ? 'Running debug.' : 'Running prod!');

const kanjidic = JSON.parse(fs.readFileSync('kanjidic2.json', 'utf-8'));
const kanjiTypes = JSON.parse(fs.readFileSync('kanji_types.json', 'utf-8'));
const kanjiTypeMap = Object.entries(kanjiTypes).reduce((acc, [ type, kanjiString ]) => {
    [ ...kanjiString ]
        .forEach(kanji => !acc.has(kanji) && acc.set(kanji, type));
    return acc;
}, new Map());

const kanjjiTypeOrder = {
    '象形': 1,
    '指事': 2,
    '会意': 3,
    '形声': 4,
    '会意兼形声': 5,
    '国字': 6,
    '漢字検定1.5': 7,
    '漢字検定1': 8,
    '漢字検定': 9
};

const data = kanjidic['kanjidic2']['character'].map(character => {
    const readingMeaning = character['reading_meaning'];
    const rmgroup = readingMeaning && readingMeaning['rmgroup'];
    const reading = rmgroup && rmgroup['reading'];
    const meaning = rmgroup && rmgroup['meaning'];
    const kanji = character['literal'];

    return {
        kanji,
        grade: character['misc']['grade'],
        freq: character['misc']['freq'],
        type: kanjiTypeMap.get(kanji),
        kunReadings: reading && reading['kunReadings'],
        onReadings: reading && reading['onReadings'],
        meaning: meaning && (elementToArray(meaning).map(meaning => meaning.toString()))
    }
}).sort((a, b) =>
    (numOrMax(a.grade) - numOrMax(b.grade))
    || (numOrMax(kanjjiTypeOrder[a.type]) - numOrMax(kanjjiTypeOrder[b.type]))
    || (numOrMax(a.freq) - numOrMax(b.freq))
);

const entriesForLevels = data.filter(entry => entry.grade || entry.type)

const TARGET_CHARS_PER_LEVEL = 5;
const MIN_CHARS_PER_LEVEL = TARGET_CHARS_PER_LEVEL - 1;
if (GENERATE_LEVELS) {
    generateLevels(entriesForLevels);
    process.exit();
}

if (DEBUG) {
    fs.writeFileSync('kanji_data.json', JSON.stringify(data, null, 2));
    console.log('kanji_data.json file written!');
}

const kanjidexData = entriesForLevels
    .map(entry => {
        delete entry.grade;
        delete entry.freq;
        delete entry.type;
        
        if (entry.kunReadings && entry.kunReadings.length === 0) {
            delete entry.kunReadings;
        }
        if (entry.onReadings && entry.onReadings.length === 0) {
            delete entry.onReadings;
        }

        return entry;
    });

const kanjidexTextContent = JSON.stringify(kanjidexData, null, CONFIG.indentSize);
fs.writeFileSync('../ui/kanjidex.json', kanjidexTextContent);
console.log('kanjidex.json file written!');

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}

function numOrMax(number) {
    return number ?? Number.MAX_SAFE_INTEGER;
}

function generateLevels(data) {
    const levels = [];
    let currentLevel = [];
    let lastGrade = 1;

    const firstOfType = new Set();

    let newGrade = 1;
    for (const entry of data) {
        const kanji = entry.kanji;

        // Grades 9 and 10 are both Jinmeiyo
        if (entry.grade !== 10 && entry.grade !== lastGrade) {
            newGrade = lastGrade = entry.grade;
            if (currentLevel.length > 0) {
                addLevel(levels, currentLevel, newGrade);
                newGrade = null;
                currentLevel = [];
            }
            levels.push([]);
        }

        currentLevel.push(kanji);
        const type = entry.type;
        if (type && !type.startsWith('漢字検定') && !firstOfType.has(type)) {
            firstOfType.add(type);
            currentLevel[currentLevel.length - 1] += `|${type}`;
        }

        if (currentLevel.length === TARGET_CHARS_PER_LEVEL) {
            addLevel(levels, currentLevel, newGrade);
            newGrade = null;
            currentLevel = [];
        }
    }

    if (currentLevel.length > 0) {
        addLevel(levels, currentLevel, newGrade);
    }

    const levelStrings = levels.map(level => {
        const kanjiTypeInfo = [];
        const levelString = level.map(kanji => {
            const split = kanji.split('|');
            const kanjiPart = split[0];
            if (split.length > 1) {
                const typePart = split.slice(1);
                kanjiTypeInfo.push(
                    ...typePart
                        .map(type => `${type}(${kanjiPart})`)
                    );
            }
            return kanjiPart;
        }).join('');
        
        const typeString = kanjiTypeInfo.length > 0 ? ` ${kanjiTypeInfo.join(', ')}` : '';
        return levelString + typeString;
    });

    const levelsTextToSave = JSON.stringify(levelStrings, null, 4)
        .replaceAll('"', "'")
        .replaceAll(/'(.{1,5}) (.+)',/g, "'$1', // $2")
        .replaceAll(/,\n    '',/g, '\n')
        .replaceAll(/(.*)(( \/\/ )|(, ))(Grade(\d+))\(.\)/g, "    // $5\n$1");
    fs.writeFileSync('levels.txt', levelsTextToSave);
    console.log('Levels file written!');
}

function addLevel(levels, level, newGrade) {
    if (newGrade) {
        level[0] += `|Grade${newGrade}`;
    }


    levels.push(level);

    for (let i = levels.length - 1; i > 0 && levels[i].length < MIN_CHARS_PER_LEVEL; i--) {
        const currentLevel = levels[i];
        const previousLevel = levels[i - 1];
        const missingCharsNumber = MIN_CHARS_PER_LEVEL - currentLevel.length;

        const charsToMove = previousLevel.splice(previousLevel.length - missingCharsNumber, missingCharsNumber);
        currentLevel.unshift(...charsToMove);
    }
}