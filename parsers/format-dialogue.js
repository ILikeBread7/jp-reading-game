import * as readline from 'node:readline';
import { stdin, stdout } from 'node:process';

function format(fullText) {
    return fullText.trim().split('\n\n\n\n')
        .map(text => '                        `\n                            ' + text.replaceAll('\n', '\n                            ') + '\n                        `').join(',\n')
}

let debounceTimeout = null;
function debounce(func) {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
    }

    debounceTimeout = setTimeout(func, 100);
}

const read = readline.createInterface({ input: stdin, output: stdout });

let fullText = '';

read.on('line', line => {
    fullText += line + '\n';
    debounce(logFormattedTextAndClear);
});

function logFormattedTextAndClear() {
    console.log(format(fullText));
    fullText = '';
}


