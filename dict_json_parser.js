import fs from 'node:fs';

fs.readFile('JMdict_e.json', 'utf-8', (err, jsonData) => {
    if (err) {
        console.error(err);
        return;
    }

    const data = JSON.parse(jsonData);
    const result = [];
    data['JMdict']['entry'].forEach(e => {
        const entry = {
            id: e['ent_seq'],
            kana: elementToArray(e['r_ele']),
            sense: elementToArray(e['sense'])
        };

        const kEle = e['k_ele'];
        if (kEle) {
            entry.kanji = elementToArray(kEle);
        }

        result.push(entry);
    });

    fs.writeFile('dict.json', JSON.stringify(result, null, 2), () => {
        'Dict file written!'
    });
});

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}