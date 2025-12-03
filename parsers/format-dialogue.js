import * as readline from 'node:readline';
import { stdin, stdout } from 'node:process';

function format(fullText) {
    return fullText
        .trim()
        .replaceAll(
            /\[([^\x00-\x7F]+)\|([a-z|A-Z|,|;|\(\|\)|\-|\\s]*)\]/g,
            `<span class="popover" data-content="$2">$1</span>`
        )
        .split('\n\n\n\n')
        .map(text => '                        `\n                            ' + text.replaceAll('\n', '\n                            ') + '\n                        `').join(',\n');
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


