import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';

fs.readFile('kanjidic2.xml', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text'
    };

    const parser = new XMLParser(options);
    const parsedData = parser.parse(data);

    parsedData['kanjidic2']['character'].forEach(character => {
        const readingMeaning = character['reading_meaning'];
        if (!readingMeaning) {
            return;
        }
        const rmgroup = readingMeaning['rmgroup'];
        if (!rmgroup) {
            return;
        }

        if (Array.isArray(rmgroup.reading)) {
            rmgroup.reading = rmgroup.reading.filter(node => {
                return node['@_r_type'] === 'ja_on' || node['@_r_type'] === 'ja_kun';
            }).reduce((acc, curr) => {
                const readingArr = curr['@_r_type'] === 'ja_on'
                    ? acc.onReadings
                    : acc.kunReadings;
                readingArr.push(curr[options.textNodeName]);
                return acc;
            }, { kunReadings: [], onReadings: [] });
        }

        if (Array.isArray(rmgroup.meaning)) {
            rmgroup.meaning = rmgroup.meaning.filter(node => {
                return !node['@_m_lang'];   // no language attribute means English
            });
        }
    });

    fs.writeFile('kanjidic2.json', JSON.stringify(parsedData, null, 2), () => {
        console.log('JSON file written!');
    });
});