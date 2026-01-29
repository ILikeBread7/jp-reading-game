import fs from 'node:fs';
import { LEVEL_CHARS } from '../ui/level-chars.js';

const kanjidic = JSON.parse(fs.readFileSync('kanjidic2.json', 'utf-8'));
const kanjiTypes = JSON.parse(fs.readFileSync('kanji_types.json', 'utf-8'));

const radicalsMap = new Map(
    kanjidic.kanjidic2.character.map(char => [ char.literal, getRadicalSafe(char.radical) ])
);
const kanjiTypeMap = Object.entries(kanjiTypes).reduce((acc, [ type, kanjiString ]) => {
    [ ...kanjiString ]
        .forEach(kanji => !acc.has(kanji) && acc.set(kanji, type));
    return acc;
}, new Map());
const chars = LEVEL_CHARS.flat(Number.MAX_SAFE_INTEGER);

const firstRadicalMap = new Map();

for (let i = chars.indexOf('月') + 1; i < chars.length; i++) {
    const char = chars[i];

    const radical = radicalsMap.get(char);

    if (!firstRadicalMap.has(radical)) {
        firstRadicalMap.set(radical, char);
    }
}

console.log(
    [...firstRadicalMap.entries()]
        .filter(([key]) => !!key)
        .sort(([key1], [key2]) => key1 - key2)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
);

function getRadicalInfo(radical) {
    if (Array.isArray(radical['rad_value'])) {
        return radical['rad_value'][0];
    }

    return radical['rad_value'];
}

function getRadical(radicalInfo) {
    return radicalInfo['#text'];
}

function getRadicalSafe(radical) {
    if (!radical) {
        return;
    }

    return Number(getRadical(getRadicalInfo(radical)));
}