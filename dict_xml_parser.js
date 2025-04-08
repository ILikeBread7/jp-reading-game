import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';

fs.readFile('JMdict_e', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const parser = new XMLParser();
    const parsedData = parser.parse(data);
    fs.writeFile('JMdict_e.json', JSON.stringify(parsedData, null, 2), () => {
        console.log('JSON file written!');
    });
});


