import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';

fs.readFile('kanjidic2.xml', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const parser = new XMLParser();
    const parsedData = parser.parse(data);
    fs.writeFile('kanjidic2.json', JSON.stringify(parsedData, null, 2), () => {
        console.log('JSON file written!');
    });
});


