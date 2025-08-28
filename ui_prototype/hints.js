'use strict';

var $kt = $kt || {};

(() => {

    $kt.hints = [
        /*html*/
        `<style>
            .hint-u-shop {
                position: relative;
                top: -0.25em;
            }

            .hint-o-cross {
                position: relative;
            }

            .hint-o-cross::after {
                content: '✝';
                position: absolute;
                left: 0.2em;
                top: 0.0325em;
            }
        </style>
        
        <div>
            <span class="hint-emphasis">あ - a</span>,
            "<span class="hint-emphasis">A</span>pple"
            🍎
            🍎<span class="hint-overlap">あ</span>
        </div>
        <div>
            <span class="hint-emphasis">い - i</span>,
            "Spaghett<span class="hint-emphasis">i</span>"
            🍝
            🍝<span class="hint-overlap">い</span>
        </div>
        <div>
            <span class="hint-emphasis">う - u</span>,
            "Drive-thr<span class="hint-emphasis">u</span>"
            🚘<span class="hint-u-shop">🏪</span>
            🚘<span class="hint-u-shop">🏪</span><span class="hint-double-icon-overlap">う</span>
        </div>
        <div>
            <span class="hint-emphasis">え - e</span>,
            "<span class="hint-emphasis">E</span>lephant"
            🐘
            🐘<span class="hint-overlap">え</span>
        </div>
        <div>
            <span class="hint-emphasis">お - o</span>,
            "<span class="hint-emphasis">O</span>bituary"
            <span class="hint-o-cross">🗞</span>
            <span class="hint-o-cross">🗞</span><span class="hint-overlap">お</span>
        </div>

        <div class="hint-explanation">
            Read the word at the top of the screen and
            type it into the input below using the above hints.
        </div>
        <div class="hint-explanation">
            Press ENTER to confirm your answer.
        </div>
        <div class="hint-explanation">
            Press ENTER with an empty input
            to get an extra hint but you won't receive any exp.
        </div>`,

        /*html*/
        `<style>
            .hint-mi-overlap {
                top: 0.155em;
            }

            .hint-me-overlap {
                left: -0.875em;
            }
        </style>
        
        <div>
            <div>
                <span class="hint-emphasis">ま - ma</span>,
                "<span class="hint-emphasis">Ma</span>estro"
                🧔🎻
                🧔🎻<span class="hint-double-icon-overlap">ま</span>
            </div>
            <div>
                <span class="hint-emphasis">み - mi</span>,
                "Acade<span class="hint-emphasis">mi</span>a"
                🏫
                🏫<span class="hint-overlap hint-mi-overlap">み</span>
            </div>
            <div>
                <span class="hint-emphasis">む - mu</span>,
                "<span class="hint-emphasis">Mu</span>cho"
                👐
                👐<span class="hint-overlap">む</span>
            </div>
            <div>
                <span class="hint-emphasis">め - me</span>,
                "<span class="hint-emphasis">Me</span>lee"
                ⚔
                ⚔<span class="hint-overlap hint-me-overlap">め</span>
            </div>
            <div>
                <span class="hint-emphasis">も - mo</span>,
                "<span class="hint-emphasis">Mo</span>bile"
                📱
                📱<span class="hint-overlap">も</span>
            </div>
        </div>`,

        /*html*/
        `<div class="columns-container">
            <div class="column-half-width">か - ka</div>
            <div class="column-half-width">が - ga</div>
            <div class="column-half-width">き - ki</div>
            <div class="column-half-width">ぎ - gi</div>
            <div class="column-half-width">く - ku</div>
            <div class="column-half-width">ぐ - gu</div>
            <div class="column-half-width">け - ke</div>
            <div class="column-half-width">げ - ge</div>
            <div class="column-half-width">こ - ko</div>
            <div class="column-half-width">ご - go</div>
        </div>`,
        
        /*html*/
        `<div class="columns-container">
            <div class="column-half-width">さ - sa</div>
            <div class="column-half-width">ざ - za</div>
            <div class="column-half-width">し - shi</div>
            <div class="column-half-width">じ - ji</div>
            <div class="column-half-width">す - su</div>
            <div class="column-half-width">ず - zu</div>
            <div class="column-half-width">せ - se</div>
            <div class="column-half-width">ぜ - ze</div>
            <div class="column-half-width">そ - so</div>
            <div class="column-half-width">ぞ - zo</div>
        </div>`
    ];

})();