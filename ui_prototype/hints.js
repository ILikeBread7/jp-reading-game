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
            "<span class="hint-emphasis">O</span>yster"
            🦪
            🦪<span class="hint-overlap">お</span>
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
                "<span class="hint-emphasis">Ra</span>bbit"
                🐇
                🐇<span class="hint-overlap">ら</span>
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
                "<span class="hint-emphasis">Ro</span>ar"
                🦁📢
                🦁📢<span class="hint-double-icon-overlap">ろ</span>
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
        `<div>
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
                "<span class="hint-emphasis">No</span>ise"
                🔊
                🔊<span class="hint-overlap">の</span>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-kielbasa::after {
                content: '🥒';
                filter:
                    hue-rotate(250deg)
                    saturate(175%)
                    brightness(75%);
            }

            .hint-ko-overlap {
                top: -0.05em;
                left: -1.05em;
            }

            .hint-shogi {
                position: relative;
                filter: sepia(100%) saturate(50%)
            }

            .hint-shogi::after {
                content: '歩';
                position: absolute;
                left: 0.5em;
                top: 0.85em;
                font-size: 0.5em;
                -webkit-text-stroke: initial;
                color: #000000;
            }

            .hint-gi-overlap {
                top: 0em;
                left: -0.95em;
            }

            .hint-go-overlap {
                top: 0.03em;
                left: -1.15em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">か - ka</span>,
                    "<span class="hint-emphasis">Ka</span>yak"
                    🛶
                    🛶<span class="hint-overlap">か</span>
                </div>
                <div>
                    <span class="hint-emphasis">き - ki</span>,
                    "<span class="hint-emphasis">Ki</span>elbasa"
                    <span class="hint-kielbasa"></span>
                    <span class="hint-kielbasa"></span><span class="hint-overlap">き</span>
                </div>
                <div>
                    <span class="hint-emphasis">く - ku</span>,
                    "<span class="hint-emphasis">Ku</span>dos"
                    🙋
                    🙋<span class="hint-overlap">く</span>
                </div>
                <div>
                    <span class="hint-emphasis">け - ke</span>,
                    "<span class="hint-emphasis">Ke</span>rmit"
                    🐸
                    🐸<span class="hint-overlap">け</span>
                </div>
                <div>
                    <span class="hint-emphasis">こ - ko</span>,
                    "<span class="hint-emphasis">Ko</span>ng"
                    🦧
                    🦧<span class="hint-overlap hint-ko-overlap">こ</span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">が - ga</span>,
                    "<span class="hint-emphasis">Ga</span>rbage"
                    🗑
                    🗑<span class="hint-overlap">が</span>
                </div>
                <div>
                    <span class="hint-emphasis">ぎ - gi</span>,
                    "Sho<span class="hint-emphasis">gi</span>"
                    <span class="hint-shogi">☗</span>
                    <span class="hint-shogi">☗</span><span class="hint-overlap hint-gi-overlap">ぎ</span>
                </div>
                <div>
                    <span class="hint-emphasis">ぐ - gu</span>,
                    "<span class="hint-emphasis">Gu</span>cci"
                    👜
                    👜<span class="hint-overlap">ぐ</span>
                </div>
                <div>
                    <span class="hint-emphasis">げ - ge</span>,
                    "<span class="hint-emphasis">Ge</span>isha"
                    💃👘
                    💃👘<span class="hint-double-icon-overlap">げ</span>
                </div>
                <div>
                    <span class="hint-emphasis">ご - go</span>,
                    "<span class="hint-emphasis">Go</span>ng"
                    🟠
                    🟠<span class="hint-overlap hint-go-overlap">ご</span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            From now on some of the characters will have an additional marking (<span class="hint-emphasis">゛</span>) at top-right called "dakuten".
        </div>
        <div class="hint-explanation">
            It turns some sounds into voiced sounds, for example here it turns "k" sounds into "g" sounds.
        </div>
        <div class="hint-explanation">
            It doesn't apply to any of the previous characters,
            but it will apply to most of the future ones
            and will be explained whenever it does apply.
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