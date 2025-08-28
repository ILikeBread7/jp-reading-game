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
                "Origa<span class="hint-emphasis">mi</span>"
                📃🦢
                📃🦢<span class="hint-double-icon-overlap">み</span>
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
        `<style>
            .hint-ruby::after {
                content: '💎';
                filter:
                    hue-rotate(140deg)
                    saturate(250%)
                    ;
            }

            .hint-ru-overlap {
                top: -0.015em;
            }
        </style>
        
        <div>
            <div>
                <span class="hint-emphasis">ら - ra</span>,
                "<span class="hint-emphasis">Ra</span>o"
                🦁
                🦁<span class="hint-overlap">ら</span>
            </div>
            <div>
                <span class="hint-emphasis">り - ri</span>,
                "<span class="hint-emphasis">Ri</span>o De Janeiro"
                🌎🏙
                🌎🏙<span class="hint-double-icon-overlap">り</span>
            </div>
            <div>
                <span class="hint-emphasis">る - ru</span>,
                "<span class="hint-emphasis">Ru</span>by"
                <span class="hint-ruby"></span>
                <span class="hint-ruby"></span><span class="hint-overlap hint-ru-overlap">る</span>
            </div>
            <div>
                <span class="hint-emphasis">れ - re</span>,
                "<span class="hint-emphasis">Re</span>indeer"
                🦌
                🦌<span class="hint-overlap">れ</span>
            </div>
            <div>
                <span class="hint-emphasis">ろ - ro</span>,
                "<span class="hint-emphasis">Ro</span>ad"
                🛣
                🛣<span class="hint-overlap">ろ</span>
            </div>
            <div class="hint-explanation">
                Remembering the difference between る (ru) and ろ (ro)
                might be tricky, but you can try remembering it like this:
            </div>
            <div class="hint-explanation">
                R<span class="hint-emphasis">u</span> (<span class="hint-emphasis">る</span>) is c<span class="hint-emphasis">u</span>rled like it has rhe<span class="hint-emphasis">u</span>matism,
                and r<span class="hint-emphasis">o</span> (<span class="hint-emphasis">ろ</span>) is n<span class="hint-emphasis">o</span>t.
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-no-overlap {
                left: -2.45em;
            }
        </style>
        
        <div>
            <div>
                <span class="hint-emphasis">な - na</span>,
                "<span class="hint-emphasis">Na</span>chos"
                🧆
                🧆<span class="hint-overlap">な</span>
            </div>
            <div>
                <span class="hint-emphasis">に - ni</span>,
                "<span class="hint-emphasis">Ni</span>ece"
                👧
                👧<span class="hint-overlap">に</span>
            </div>
            <div>
                <span class="hint-emphasis">ぬ - nu</span>,
                "G<span class="hint-emphasis">nu</span>"
                🐃
                🐃<span class="hint-overlap">ぬ</span>
            </div>
            <div>
                <span class="hint-emphasis">ね - ne</span>,
                "<span class="hint-emphasis">Ne</span>cromancy"
                💀🧙‍♂
                💀🧙‍♂<span class="hint-double-icon-overlap">ね</span>
            </div>
            <div>
                <span class="hint-emphasis">の - no</span>,
                "<span class="hint-emphasis">No</span> hablo español"
                🙅🗣🇪🇸
                🙅🗣🇪🇸<span class="hint-overlap hint-no-overlap">の</span>
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