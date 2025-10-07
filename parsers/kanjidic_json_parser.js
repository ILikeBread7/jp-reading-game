import fs from 'node:fs';

const kanjidic = JSON.parse(fs.readFileSync('kanjidic2.json', 'utf-8'));

const data = kanjidic['kanjidic2']['character'].map(character => {
    const readingMeaning = character['reading_meaning'];
    const rmgroup = readingMeaning && readingMeaning['rmgroup'];
    const reading = rmgroup && rmgroup['reading'];
    const meaning = rmgroup && rmgroup['meaning'];

    return {
        kanji: character['literal'],
        grade: character['misc']['grade'],
        freq: character['misc']['freq'],
        kunReadings: reading && reading['kunReadings'],
        onReadings: reading && reading['onReadings'],
        meaning: meaning && (elementToArray(meaning).map(meaning => meaning.toString()))
    }
}).sort((a, b) => (numOrMax(a.grade) - numOrMax(b.grade)) || (numOrMax(a.freq) - numOrMax(b.freq)));

fs.writeFileSync('kanji_data.json', JSON.stringify(data, null, 2));
console.log('kanji_data.json file written!');

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}

function numOrMax(number) {
    return number ?? Number.MAX_SAFE_INTEGER;
}