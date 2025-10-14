import fs from 'node:fs';

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
    '国字': 6
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

fs.writeFileSync('kanji_data.json', JSON.stringify(data, null, 2));
console.log('kanji_data.json file written!');

data.forEach(kanjiData => {
    delete kanjiData.grade;
    delete kanjiData.freq;
    if (kanjiData.kunReadings && kanjiData.kunReadings.length === 0) {
        delete kanjiData.kunReadings;
    }
    if (kanjiData.onReadings && kanjiData.onReadings.length === 0) {
        delete kanjiData.onReadings;
    }
});

const kanjidexTextContent = `export const KANJIDEX = ${JSON.stringify(data, null, 4)};

export const KANJIDEX_MAP = KANJIDEX.reduce((acc, entry) => {
    acc.set(entry.kanji, entry);
    return acc;
}, new Map());`;

fs.writeFileSync('../ui/kanjidex.js', kanjidexTextContent);
console.log('kanjidex.js file written!');

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}

function numOrMax(number) {
    return number ?? Number.MAX_SAFE_INTEGER;
}