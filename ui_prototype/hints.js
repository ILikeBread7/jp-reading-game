'use strict';

var $kt = $kt || {};

(() => {

    $kt.hints = [
        /*html*/
        `<style>
            .hint-u-shop::before {
                content: '🚘';
            }

            .hint-u-shop::after {
                content: '🏪';
                position: relative;
                top: -0.25em;
            }
        </style>
        
        <div>
            <span class="hint-emphasis">あ - a</span>,
            "<span class="hint-emphasis">A</span>pple"
            🍎
            🍎<span class="hint-overlap" data-content="あ"></span>
        </div>
        <div>
            <span class="hint-emphasis">い - i</span>,
            "Spaghett<span class="hint-emphasis">i</span>"
            🍝
            🍝<span class="hint-overlap" data-content="い"></span>
        </div>
        <div>
            <span class="hint-emphasis">う - u</span>,
            "Drive-thr<span class="hint-emphasis">u</span>"
            <span class="hint-u-shop"></span>
            <span class="hint-u-shop"></span><span class="hint-double-icon-overlap" data-content="う"></span>
        </div>
        <div>
            <span class="hint-emphasis">え - e</span>,
            "<span class="hint-emphasis">E</span>lephant"
            🐘
            🐘<span class="hint-overlap" data-content="え"></span>
        </div>
        <div>
            <span class="hint-emphasis">お - o</span>,
            "<span class="hint-emphasis">O</span>yster"
            🦪
            🦪<span class="hint-overlap" data-content="お"></span>
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
                🧔🎻<span class="hint-double-icon-overlap" data-content="ま"></span>
            </div>
            <div>
                <span class="hint-emphasis">み - mi</span>,
                "Origa<span class="hint-emphasis">mi</span>"
                📃🦢
                📃🦢<span class="hint-double-icon-overlap" data-content="み"></span>
            </div>
            <div>
                <span class="hint-emphasis">む - mu</span>,
                "<span class="hint-emphasis">Mu</span>cho"
                👐
                👐<span class="hint-overlap" data-content="む"></span>
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
                📱<span class="hint-overlap" data-content="も"></span>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-ruby::after {
                content: '💎';
                filter: hue-rotate(140deg) saturate(250%);
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
                🐇<span class="hint-overlap" data-content="ら"></span>
            </div>
            <div>
                <span class="hint-emphasis">り - ri</span>,
                "<span class="hint-emphasis">Ri</span>o De Janeiro"
                🇧🇷🏙
                🇧🇷🏙<span class="hint-double-icon-overlap" data-content="り"></span>
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
                🦌<span class="hint-overlap" data-content="れ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ろ - ro</span>,
                "<span class="hint-emphasis">Ro</span>ar"
                🦁📢
                🦁📢<span class="hint-double-icon-overlap" data-content="ろ"></span>
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
                🧆<span class="hint-overlap" data-content="な"></span>
            </div>
            <div>
                <span class="hint-emphasis">に - ni</span>,
                "<span class="hint-emphasis">Ni</span>ece"
                👧
                👧<span class="hint-overlap" data-content="に"></span>
            </div>
            <div>
                <span class="hint-emphasis">ぬ - nu</span>,
                "G<span class="hint-emphasis">nu</span>"
                🐃
                🐃<span class="hint-overlap" data-content="ぬ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ね - ne</span>,
                "<span class="hint-emphasis">Ne</span>cromancy"
                💀🧙‍♂
                💀🧙‍♂<span class="hint-double-icon-overlap" data-content="ね"></span>
            </div>
            <div>
                <span class="hint-emphasis">の - no</span>,
                "<span class="hint-emphasis">No</span>ise"
                🔊
                🔊<span class="hint-overlap" data-content="の"></span>
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
            }

            .hint-shogi::before {
                content: '☗';
                filter: sepia(100%) saturate(50%);
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
                    🛶<span class="hint-overlap" data-content="か"></span>
                </div>
                <div>
                    <span class="hint-emphasis">き - ki</span>,
                    "<span class="hint-emphasis">Ki</span>elbasa"
                    <span class="hint-kielbasa"></span>
                    <span class="hint-kielbasa"></span><span class="hint-overlap" data-content="き"></span>
                </div>
                <div>
                    <span class="hint-emphasis">く - ku</span>,
                    "<span class="hint-emphasis">Ku</span>dos"
                    🙋
                    🙋<span class="hint-overlap" data-content="く"></span>
                </div>
                <div>
                    <span class="hint-emphasis">け - ke</span>,
                    "<span class="hint-emphasis">Ke</span>rmit"
                    🐸
                    🐸<span class="hint-overlap" data-content="け"></span>
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
                    🗑<span class="hint-overlap" data-content="が"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぎ - gi</span>,
                    "Sho<span class="hint-emphasis">gi</span>"
                    <span class="hint-shogi"></span>
                    <span class="hint-shogi"></span><span class="hint-overlap hint-gi-overlap">ぎ</span>
                </div>
                <div>
                    <span class="hint-emphasis">ぐ - gu</span>,
                    "<span class="hint-emphasis">Gu</span>cci"
                    👜
                    👜<span class="hint-overlap" data-content="ぐ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">げ - ge</span>,
                    "<span class="hint-emphasis">Ge</span>isha"
                    💃👘
                    💃👘<span class="hint-double-icon-overlap" data-content="げ"></span>
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
        `<style>
            .hint-sauerkraut::after {
                content: '🥘';
                filter: grayscale(75%) brightness(150%);
            }

            .hint-shiitake::after {
                content: '🍄';
                filter: hue-rotate(35deg) grayscale(25%);
            }

            .hint-zucchini::after {
                content: '🍠';
                filter: hue-rotate(175deg) sepia(66%) saturate(200%);
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">さ - sa</span>,
                    "<span class="hint-emphasis">Sa</span>uerkraut"
                    <span class="hint-sauerkraut"></span>
                    <span class="hint-sauerkraut"></span><span class="hint-overlap" data-content="さ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">し - shi</span>,
                    "<span class="hint-emphasis">Shi</span>itake"
                    <span class="hint-shiitake"></span>
                    <span class="hint-shiitake"></span><span class="hint-overlap" data-content="し"></span>
                </div>
                <div>
                    <span class="hint-emphasis">す - su</span>,
                    "<span class="hint-emphasis">Su</span>baru"
                    🌌
                    🌌<span class="hint-overlap" data-content="す"></span>
                </div>
                <div>
                    <span class="hint-emphasis">せ - se</span>,
                    "<span class="hint-emphasis">Se</span>ance"
                    👻
                    👻<span class="hint-overlap" data-content="せ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">そ - so</span>,
                    "<span class="hint-emphasis">So</span>ftball"
                    🥎
                    🥎<span class="hint-overlap" data-content="そ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ざ - za</span>,
                    "<span class="hint-emphasis">Za</span>greb"
                    🇭🇷🏙
                    🇭🇷🏙<span class="hint-double-icon-overlap" data-content="ざ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">じ - ji</span>,
                    "Mount Fu<span class="hint-emphasis">ji</span>"
                    🗻
                    🗻<span class="hint-overlap" data-content="じ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ず - zu</span>,
                    "<span class="hint-emphasis">Zu</span>cchini"
                    <span class="hint-zucchini"></span>
                    <span class="hint-zucchini"></span><span class="hint-overlap" data-content="ず"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぜ - ze</span>,
                    "<span class="hint-emphasis">Ze</span>lda"
                    👸
                    👸<span class="hint-overlap" data-content="ぜ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぞ - zo</span>,
                    "<span class="hint-emphasis">Zo</span>ra spider"
                    🕷
                    🕷<span class="hint-overlap" data-content="ぞ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            The "shi" and "ji" are a little different because is no "si" (like in "<span class="hint-emphasis">si</span>ege") or "zi" (like in "jacuz<span class="hint-emphasis">zi</span>") sound in Japanese.
        </div>
        <div class="hint-explanation">
            They can still be written as "si" and "zi" but the "shi" and "ji" spellings are closer to the actual pronunciation.
        </div>`,

        /*html*/
        `<style>
            .hint-chia::after {
                content: '🍚';
                filter: invert(75%) brightness(175%);
            }

            .hint-te-overlap {
                top: -0.1em;
            }

            .hint-toilet::after {
                content: '🚽';
                transform: scaleX(-1);
                display: inline-block;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">た - ta</span>,
                    "<span class="hint-emphasis">Ta</span>co"
                    🌮
                    🌮<span class="hint-overlap" data-content="た"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ち - chi</span>,
                    "<span class="hint-emphasis">Chi</span>a"
                    <span class="hint-chia"></span>
                    <span class="hint-chia"></span><span class="hint-overlap" data-content="ち"></span>
                </div>
                <div>
                    <span class="hint-emphasis">つ - tsu</span>,
                    "Juju<span class="hint-emphasis">tsu</span>"
                    🥋
                    🥋<span class="hint-overlap" data-content="つ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">て - te</span>,
                    "<span class="hint-emphasis">Te</span>nnis"
                    🎾
                    🎾<span class="hint-overlap hint-te-overlap">て</span>
                </div>
                <div>
                    <span class="hint-emphasis">と - to</span>,
                    "<span class="hint-emphasis">To</span>ilet"
                    <span class="hint-toilet"></span>
                    <span class="hint-toilet"></span><span class="hint-overlap" data-content="と"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">だ - da</span>,
                    "<span class="hint-emphasis">Da</span>ikon"
                    <img class="hint-svg-icon" src="icons/hints/daikon.svg"/>
                    <img class="hint-svg-icon" src="icons/hints/daikon.svg"/><span class="hint-overlap" data-content="だ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぢ - di</span>,
                    Same sound as じ (ji)
                </div>
                <div>
                    <span class="hint-emphasis">づ - dzu</span>,
                    Same sound as ず (zu)
                </div>
                <div>
                    <span class="hint-emphasis">で - de</span>,
                    "<span class="hint-emphasis">De</span>vilish"
                    👹
                    👹<span class="hint-overlap" data-content="で"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ど - do</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="ど"></span>
                </div>
            </div>
        </div>
        <div>
            <span class="hint-emphasis">っ - ltsu (small tsu)</span> - doubles the next sound,
            が<span class="hint-emphasis">っこ</span>う (ga<span class="hint-emphasis">kko</span>u).
            Similar to the word "boo<span class="hint-emphasis">kk</span>eeping".
        </div>
        <div class="hint-explanation">
            The "dzu" character is pronounced "zu", same as "ず", but for disambiguation purposes can be spelled differently.
            Inputting "zu" in this game is recognized as "ず", so disambiguation is needed.
        </div>
        <div class="hint-explanation">
            The "tsu", "dzu" and "ltsu" can also be written as "tu", "du" and "ltu" but the "tsu" and "dzu" spellings are closer to the actual pronunciation.
        </div>
        <div class="hint-explanation">
            Small tsu (<span class="hint-emphasis">っ</span>) is usually written as a double letter instead of "ltsu" except when it needs to be written by itself.
        </div>
        <div class="hint-explanation">
            It can also be written as "xtsu" but "ltsu" might be easier to remember ("<span class="hint-emphasis">l</span>ittle tsu").
        </div>`,

        /*html*/
        `<style>
            .hint-ha-overlap {
                top: 0em;
            }

            .hint-horse::after {
                content: '🐴';
                transform: scaleX(-1);
                display: inline-block;
            }

            .hint-po-overlap {
                top: -0.01em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">は - ha</span>,
                    "<span class="hint-emphasis">Ha</span>iku"
                    📃
                    📃<span class="hint-overlap hint-ha-overlap">は</span>
                </div>
                <div>
                    <span class="hint-emphasis">ひ - hi</span>,
                    "Mo<span class="hint-emphasis">hi</span>can"
                    🏹🪶
                    🏹🪶<span class="hint-double-icon-overlap" data-content="ひ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ふ - fu</span>,
                    "<span class="hint-emphasis">Fu</span>ji"
                    🗻
                    🗻<span class="hint-overlap" data-content="ふ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">へ - he</span>,
                    "<span class="hint-emphasis">He</span>y"
                    👋
                    👋<span class="hint-overlap" data-content="へ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ほ - ho</span>,
                    "<span class="hint-emphasis">Ho</span>rse"
                    <span class="hint-horse"></span>
                    <span class="hint-horse"></span><span class="hint-overlap" data-content="ほ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ば - ba</span>,
                    "<span class="hint-emphasis">Ba</span>you"
                    🏞️
                    🏞️<span class="hint-overlap" data-content="ば"></span>
                </div>
                <div>
                    <span class="hint-emphasis">び - bi</span>,
                    "Zom<span class="hint-emphasis">bi</span>e"
                    🧟
                    🧟<span class="hint-overlap" data-content="び"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぶ - bu</span>,
                    "<span class="hint-emphasis">Bu</span>ddhism"
                    🧘
                    🧘<span class="hint-overlap" data-content="ぶ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">べ - be</span>,
                    "<span class="hint-emphasis">Be</span>ethoven"
                    🤵🎹
                    🤵🎹<span class="hint-double-icon-overlap" data-content="べ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぼ - bo</span>,
                    "<span class="hint-emphasis">Bo</span>ard game"
                    🎲
                    🎲<span class="hint-overlap" data-content="ぼ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ぱ - pa</span>,
                    "<span class="hint-emphasis">Pa</span>cifism"
                    ☮️
                    ☮️<span class="hint-overlap" data-content="ぱ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぴ - pi</span>,
                    "<span class="hint-emphasis">Pi</span>zza"
                    🍕
                    🍕<span class="hint-overlap" data-content="ぴ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぷ - pu</span>,
                    "Cap<span class="hint-emphasis">pu</span>ccino"
                    ☕
                    ☕<span class="hint-overlap" data-content="ぷ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぺ - pe</span>,
                    "<span class="hint-emphasis">Pe</span>ar"
                    🍐
                    🍐<span class="hint-overlap" data-content="ぺ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ぽ - po</span>,
                    "<span class="hint-emphasis">Po</span>ng"
                    🕹️
                    🕹️<span class="hint-overlap hint-po-overlap" data-content="ぽ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            Characters in this section can have an additional marking (<span class="hint-emphasis">゜</span>) at top-right called "handakuten",
            which turns the "h" sounds into "p" sounds.
        </div>
        <div class="hint-explanation">
            It only applies here, to the "h" sounds, and nowhere else.
        </div>
        <div class="hint-explanation">
            "Fu" can also be written as "hu", but "fu" is again closer to the real pronunciation.
        </div>
        <div class="hint-explanation">
            When used as grammatical particles は (ha) and へ (he) are read as "wa" and "e" respectively.
            This doesn't apply when they're used as a part of a word, and isn't relevant to this game, but it's important to know when reading full sentences.
        </div>`,

        /*html*/
        `<style>
            .hint-pyo-overlap {
                left: -2.2em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">や - ya</span>,
                    "<span class="hint-emphasis">Ya</span>p"
                    🗣️
                    🗣️<span class="hint-overlap" data-content="や"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゆ - yu</span>,
                    "<span class="hint-emphasis">Yu</span>kata"
                    👘
                    👘<span class="hint-overlap" data-content="ゆ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">よ - yo</span>,
                    "New <span class="hint-emphasis">Yo</span>rk"
                    🗽
                    🗽<span class="hint-overlap" data-content="よ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ゃ - lya</span>,
                    <span class="hint-emphasis">みゃ - mya</span>,
                    "<span class="hint-emphasis">Mya</span>nmar"
                    🇲🇲
                    🇲🇲<span class="hint-double-characters-overlap" data-content="みゃ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゅ - lyu</span>,
                    <span class="hint-emphasis">きゅ - kyu</span>,
                    "<span class="hint-emphasis">Kyu</span>"
                    🥋
                    🥋<span class="hint-double-characters-overlap" data-content="きゅ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ょ - lyo</span>,
                    <span class="hint-emphasis">ぴょ - pyo</span>,
                    "<span class="hint-emphasis">Pyo</span>ngyang"
                    🇰🇵🏙
                    🇰🇵🏙<span class="hint-double-characters-overlap hint-pyo-overlap" data-content="ぴょ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            The small (ゃ, ゅ, and ょ) characters are placed after characters ending in an "i" sound,
            e.g. きゃ, しゃ, ちゃ, にゃ, ひゃ, みゃ, りゃ.
        </div>
        <div class="hint-explanation">
            This makes them become joined sounds spelled like
            the first sound of the first character
            (so for き "ki" the first sound is "k")
            joined with the full "y" character, so "ya" for ゃ
            resulting in "kya" for きゃ.
        </div>
        <div class="hint-explanation">
            The same applies for all combinations of characters ending with "i" (including ones with dakuten or handakuten)
            and all small "y" characters, e.g. ぎゅ "gyu", ぴょ "pyo", etc.
        </div>
        <div class="hint-explanation">
            Once again しゃ "sha", しゅ "shu", しょ "sho", and じゃ "ja", じゅ "ju", じょ "jo" are special because of the pronunciation
            but they can still be spelled "sya", "syu", "sho", and "jya", "jyu", "jyo".
        </div>
        <div class="hint-explanation">
            Same as with small tsu, ゃ, ゅ, and ょ would only be written as "lya", "lyu", and "lyo" if they appear alone.
            They can also be written as "xya", "xyu", and "xyo".
        </div>`,

        /*html*/
        `<div>
            <span class="hint-emphasis">わ - wa</span>,
            "<span class="hint-emphasis">Wa</span>gyu beef"
            🐮🥩
            🐮🥩<span class="hint-double-icon-overlap" data-content="わ"></span>
        </div>
        <div>
            <span class="hint-emphasis">を - wo</span>,
            Same sound as お (o)
        </div>
        <div>
            <span class="hint-emphasis">ん - n</span>,
            "Vale<span class="hint-emphasis">n</span>tine's"
            💕
            💕<span class="hint-overlap" data-content="ん"></span>
        </div>

        <div class="hint-explanation">
            を "wo" is mainly used as a grammatical particle and rarely appears in individual words.
            The spelling is used for disambiguation and reflects how it was pronounced historically but not nowadays.
        </div>
        <div class="hint-explanation">
            The ん "n" sound doesn't combine with other sounds,
            so for example んい "n" + "i" is always different from に "ni"
            and is pronounced as two seperate sounds, "n" followed by "i".
        </div>
        <div class="hint-explanation">
            If writing ん "n" as is would create ambiguity
            it should be followed by an apostrophe (').
            For example あんい "an'i" without the apostrophe would be spelled "ani" which could also mean あに.
        </div>`,
        
        /*html*/
        `<style>
            .hint-u-shop::before {
                content: '🚘';
            }

            .hint-u-shop::after {
                content: '🏪';
                position: relative;
                top: -0.25em;
            }
        </style>
        
        <div>
            <span class="hint-emphasis">ア - a</span>,
            "<span class="hint-emphasis">A</span>pple"
            🍎
            🍎<span class="hint-overlap" data-content="ア"></span>
        </div>
        <div>
            <span class="hint-emphasis">イ - i</span>,
            "Spaghett<span class="hint-emphasis">i</span>"
            🍝
            🍝<span class="hint-overlap" data-content="イ"></span>
        </div>
        <div>
            <span class="hint-emphasis">ウ - u</span>,
            "Drive-thr<span class="hint-emphasis">u</span>"
            <span class="hint-u-shop"></span>
            <span class="hint-u-shop"></span><span class="hint-double-icon-overlap" data-content="ウ"></span>
        </div>
        <div>
            <span class="hint-emphasis">エ - e</span>,
            "<span class="hint-emphasis">E</span>lephant"
            🐘
            🐘<span class="hint-overlap" data-content="エ"></span>
        </div>
        <div>
            <span class="hint-emphasis">オ - o</span>,
            "<span class="hint-emphasis">O</span>yster"
            🦪
            🦪<span class="hint-overlap" data-content="オ"></span>
        </div>

        <div class="hint-explanation">
            The first set of characters (hiragana) is finished so let's move on to the second one (katakana).
        </div>
        <div class="hint-explanation">
            Katakana is mostly used for foreign words, loanwords, onomatopoeias, and general sound mimicry.
        </div>
        <div class="hint-explanation">
            All characters in hiragana have a one to one equivalent in katakana
            so assume that everything that applies to hiragana also applies to
            katakana and the equivalent characters unless stated otherwise.
        </div>`,

        /*html*/
        `<style>
            .hint-me-overlap {
                left: -0.875em;
            }
        </style>
        
        <div>
            <div>
                <span class="hint-emphasis">マ - ma</span>,
                "<span class="hint-emphasis">Ma</span>estro"
                🧔🎻
                🧔🎻<span class="hint-double-icon-overlap" data-content="マ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ミ - mi</span>,
                "Origa<span class="hint-emphasis">mi</span>"
                📃🦢
                📃🦢<span class="hint-double-icon-overlap" data-content="ミ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ム - mu</span>,
                "<span class="hint-emphasis">Mu</span>cho"
                👐
                👐<span class="hint-overlap" data-content="ム"></span>
            </div>
            <div>
                <span class="hint-emphasis">メ - me</span>,
                "<span class="hint-emphasis">Me</span>lee"
                ⚔
                ⚔<span class="hint-overlap hint-me-overlap">メ</span>
            </div>
            <div>
                <span class="hint-emphasis">モ - mo</span>,
                "<span class="hint-emphasis">Mo</span>bile"
                📱
                📱<span class="hint-overlap" data-content="モ"></span>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-ruby::after {
                content: '💎';
                filter: hue-rotate(140deg) saturate(250%);
            }

            .hint-ru-overlap {
                top: -0.015em;
            }

            .hint-line-overlap {
                left: -1.11em;
            }
        </style>
        
        <div>
            <div>
                <span class="hint-emphasis">ラ - ra</span>,
                "<span class="hint-emphasis">Ra</span>bbit"
                🐇
                🐇<span class="hint-overlap" data-content="ラ"></span>
            </div>
            <div>
                <span class="hint-emphasis">リ - ri</span>,
                "<span class="hint-emphasis">Ri</span>o De Janeiro"
                🇧🇷🏙
                🇧🇷🏙<span class="hint-double-icon-overlap" data-content="リ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ル - ru</span>,
                "<span class="hint-emphasis">Ru</span>by"
                <span class="hint-ruby"></span>
                <span class="hint-ruby"></span><span class="hint-overlap hint-ru-overlap">ル</span>
            </div>
            <div>
                <span class="hint-emphasis">レ - re</span>,
                "<span class="hint-emphasis">Re</span>indeer"
                🦌
                🦌<span class="hint-overlap" data-content="レ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ロ - ro</span>,
                "<span class="hint-emphasis">Ro</span>ar"
                🦁📢
                🦁📢<span class="hint-double-icon-overlap" data-content="ロ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ー - -</span>,
                "Baz<span class="hint-emphasis">aa</span>r"
                🛍️
                🛍️<span class="hint-overlap hint-line-overlap" data-content="ー"></span>
            </div>
            <div class="hint-explanation">
                Here's the first difference.
                In katakana there is an additional character "ー" (written with a hyphen "-") which lenghtens the previous sound.
            </div>
            <div class="hint-explanation">
                It can also be used with hiragana but is much more common in katakana, that's why it's covered now.
            </div>
        </div>`,

        /*html*/
        `<div>
            <div>
                <span class="hint-emphasis">ナ - na</span>,
                "<span class="hint-emphasis">Na</span>chos"
                🧆
                🧆<span class="hint-overlap" data-content="ナ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ニ - ni</span>,
                "<span class="hint-emphasis">Ni</span>ece"
                👧
                👧<span class="hint-overlap" data-content="ニ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ヌ - nu</span>,
                "G<span class="hint-emphasis">nu</span>"
                🐃
                🐃<span class="hint-overlap" data-content="ヌ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ネ - ne</span>,
                "<span class="hint-emphasis">Ne</span>cromancy"
                💀🧙‍♂
                💀🧙‍♂<span class="hint-double-icon-overlap" data-content="ネ"></span>
            </div>
            <div>
                <span class="hint-emphasis">ノ - no</span>,
                "<span class="hint-emphasis">No</span>ise"
                🔊
                🔊<span class="hint-overlap" data-content="ノ"></span>
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
            }

            .hint-shogi::before {
                content: '☗';
                filter: sepia(100%) saturate(50%);
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
                    <span class="hint-emphasis">カ - ka</span>,
                    "<span class="hint-emphasis">Ka</span>yak"
                    🛶
                    🛶<span class="hint-overlap" data-content="カ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">キ - ki</span>,
                    "<span class="hint-emphasis">Ki</span>elbasa"
                    <span class="hint-kielbasa"></span>
                    <span class="hint-kielbasa"></span><span class="hint-overlap" data-content="キ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ク - ku</span>,
                    "<span class="hint-emphasis">Ku</span>dos"
                    🙋
                    🙋<span class="hint-overlap" data-content="ク"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ケ - ke</span>,
                    "<span class="hint-emphasis">Ke</span>rmit"
                    🐸
                    🐸<span class="hint-overlap" data-content="ケ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">コ - ko</span>,
                    "<span class="hint-emphasis">Ko</span>ng"
                    🦧
                    🦧<span class="hint-overlap hint-ko-overlap">コ</span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ガ - ga</span>,
                    "<span class="hint-emphasis">Ga</span>rbage"
                    🗑
                    🗑<span class="hint-overlap" data-content="ガ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ギ - gi</span>,
                    "Sho<span class="hint-emphasis">gi</span>"
                    <span class="hint-shogi"></span>
                    <span class="hint-shogi"></span><span class="hint-overlap hint-gi-overlap">ギ</span>
                </div>
                <div>
                    <span class="hint-emphasis">グ - gu</span>,
                    "<span class="hint-emphasis">Gu</span>cci"
                    👜
                    👜<span class="hint-overlap" data-content="グ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゲ - ge</span>,
                    "<span class="hint-emphasis">Ge</span>isha"
                    💃👘
                    💃👘<span class="hint-double-icon-overlap" data-content="ゲ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゴ - go</span>,
                    "<span class="hint-emphasis">Go</span>ng"
                    🟠
                    🟠<span class="hint-overlap hint-go-overlap">ゴ</span>
                </div>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-sauerkraut::after {
                content: '🥘';
                filter: grayscale(75%) brightness(150%);
            }

            .hint-shiitake::after {
                content: '🍄';
                filter: hue-rotate(35deg) grayscale(25%);
            }

            .hint-zucchini::after {
                content: '🍠';
                filter: hue-rotate(175deg) sepia(66%) saturate(200%);
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">サ - sa</span>,
                    "<span class="hint-emphasis">Sa</span>uerkraut"
                    <span class="hint-sauerkraut"></span>
                    <span class="hint-sauerkraut"></span><span class="hint-overlap" data-content="サ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">シ - shi</span>,
                    "<span class="hint-emphasis">Shi</span>itake"
                    <span class="hint-shiitake"></span>
                    <span class="hint-shiitake"></span><span class="hint-overlap" data-content="シ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ス - su</span>,
                    "<span class="hint-emphasis">Su</span>baru"
                    🌌
                    🌌<span class="hint-overlap" data-content="ス"></span>
                </div>
                <div>
                    <span class="hint-emphasis">セ - se</span>,
                    "<span class="hint-emphasis">Se</span>ance"
                    👻
                    👻<span class="hint-overlap" data-content="セ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ソ - so</span>,
                    "<span class="hint-emphasis">So</span>ftball"
                    🥎
                    🥎<span class="hint-overlap" data-content="ソ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ザ - za</span>,
                    "<span class="hint-emphasis">Za</span>greb"
                    🇭🇷🏙
                    🇭🇷🏙<span class="hint-double-icon-overlap" data-content="ザ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ジ - ji</span>,
                    "Mount Fu<span class="hint-emphasis">ji</span>"
                    🗻
                    🗻<span class="hint-overlap" data-content="ジ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ズ - zu</span>,
                    "<span class="hint-emphasis">Zu</span>cchini"
                    <span class="hint-zucchini"></span>
                    <span class="hint-zucchini"></span><span class="hint-overlap" data-content="ズ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゼ - ze</span>,
                    "<span class="hint-emphasis">Ze</span>lda"
                    👸
                    👸<span class="hint-overlap" data-content="ゼ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゾ - zo</span>,
                    "<span class="hint-emphasis">Zo</span>ra spider"
                    🕷
                    🕷<span class="hint-overlap" data-content="ゾ"></span>
                </div>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-chia::after {
                content: '🍚';
                filter: invert(75%) brightness(175%);
            }

            .hint-te-overlap {
                top: -0.1em;
            }

            .hint-toilet::after {
                content: '🚽';
                transform: scaleX(-1);
                display: inline-block;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">タ - ta</span>,
                    "<span class="hint-emphasis">Ta</span>co"
                    🌮
                    🌮<span class="hint-overlap" data-content="タ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">チ - chi</span>,
                    "<span class="hint-emphasis">Chi</span>a"
                    <span class="hint-chia"></span>
                    <span class="hint-chia"></span><span class="hint-overlap" data-content="チ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ツ - tsu</span>,
                    "Juju<span class="hint-emphasis">tsu</span>"
                    🥋
                    🥋<span class="hint-overlap" data-content="ツ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">テ - te</span>,
                    "<span class="hint-emphasis">Te</span>nnis"
                    🎾
                    🎾<span class="hint-overlap hint-te-overlap">テ</span>
                </div>
                <div>
                    <span class="hint-emphasis">ト - to</span>,
                    "<span class="hint-emphasis">To</span>ilet"
                    <span class="hint-toilet"></span>
                    <span class="hint-toilet"></span><span class="hint-overlap" data-content="ト"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ィ - li</span>
                </div>
                <div>
                    <span class="hint-emphasis">ティ - teli (ti)</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="ティ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">テゥ - telu (tu)</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="テゥ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ダ - da</span>,
                    "<span class="hint-emphasis">Da</span>ikon"
                    <img class="hint-svg-icon" src="icons/hints/daikon.svg"/>
                    <img class="hint-svg-icon" src="icons/hints/daikon.svg"/><span class="hint-overlap" data-content="ダ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヂ - di</span>,
                    Same sound as ジ (ji)
                </div>
                <div>
                    <span class="hint-emphasis">ヅ - dzu</span>,
                    Same sound as ズ (zu)
                </div>
                <div>
                    <span class="hint-emphasis">デ - de</span>,
                    "<span class="hint-emphasis">De</span>vilish"
                    👹
                    👹<span class="hint-overlap" data-content="デ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ド - do</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="ド"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ゥ - lu</span>
                </div>
                <div>
                    <span class="hint-emphasis">ディ - deli (di)</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="ディ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">デゥ - delu (du)</span>,
                    "<span class="hint-emphasis">Do</span>g"
                    🐕
                    🐕<span class="hint-overlap" data-content="デゥ"></span>
                </div>
            </div>
        </div>
        <div>
            <span class="hint-emphasis">ッ - ltsu (small tsu)</span>
        </div>
        <div class="hint-explanation">
            In katakana vowels (アイウエオ) have their small versions (ァィゥェォ)
            that can be combined with テ "te" and デ "de" characters to create new sounds.
        </div>
        <div class="hint-explanation">
            The spellings "teli", "telu", "deli", and "delu" are for disambiguation,
            as "ti" usually means チ, "tu" is ツ, "di" is ヂ, and "du" is ヅ.
            They can also be spelled "texi", "texu", "dexi", and "dexu" respectively.
        </div>
        <div class="hint-explanation">
            These can also be used in hiragana (ぁぃぅぇぉ) but again are less common.
        </div>`,

        /*html*/
        `<style>
            .hint-ha-overlap {
                top: 0em;
            }

            .hint-horse::after {
                content: '🐴';
                transform: scaleX(-1);
                display: inline-block;
            }

            .hint-po-overlap {
                top: -0.01em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ハ - ha</span>,
                    "<span class="hint-emphasis">Ha</span>iku"
                    📃
                    📃<span class="hint-overlap hint-ha-overlap">ハ</span>
                </div>
                <div>
                    <span class="hint-emphasis">ヒ - hi</span>,
                    "Mo<span class="hint-emphasis">hi</span>can"
                    🏹🪶
                    🏹🪶<span class="hint-double-icon-overlap" data-content="ヒ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">フ - fu</span>,
                    "<span class="hint-emphasis">Fu</span>ji"
                    🗻
                    🗻<span class="hint-overlap" data-content="フ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヘ - he</span>,
                    "<span class="hint-emphasis">He</span>y"
                    👋
                    👋<span class="hint-overlap" data-content="ヘ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ホ - ho</span>,
                    "<span class="hint-emphasis">Ho</span>rse"
                    <span class="hint-horse"></span>
                    <span class="hint-horse"></span><span class="hint-overlap" data-content="ホ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">バ - ba</span>,
                    "<span class="hint-emphasis">Ba</span>you"
                    🏞️
                    🏞️<span class="hint-overlap" data-content="バ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ビ - bi</span>,
                    "Zom<span class="hint-emphasis">bi</span>e"
                    🧟
                    🧟<span class="hint-overlap" data-content="ビ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ブ - bu</span>,
                    "<span class="hint-emphasis">Bu</span>ddhism"
                    🧘
                    🧘<span class="hint-overlap" data-content="ブ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ベ - be</span>,
                    "<span class="hint-emphasis">Be</span>ethoven"
                    🤵🎹
                    🤵🎹<span class="hint-double-icon-overlap" data-content="ベ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ボ - bo</span>,
                    "<span class="hint-emphasis">Bo</span>ard game"
                    🎲
                    🎲<span class="hint-overlap" data-content="ボ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">パ - pa</span>,
                    "<span class="hint-emphasis">Pa</span>cifism"
                    ☮️
                    ☮️<span class="hint-overlap" data-content="パ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ピ - pi</span>,
                    "<span class="hint-emphasis">Pi</span>zza"
                    🍕
                    🍕<span class="hint-overlap" data-content="ピ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">プ - pu</span>,
                    "Cap<span class="hint-emphasis">pu</span>ccino"
                    ☕
                    ☕<span class="hint-overlap" data-content="プ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ペ - pe</span>,
                    "<span class="hint-emphasis">Pe</span>ar"
                    🍐
                    🍐<span class="hint-overlap" data-content="ペ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ポ - po</span>,
                    "<span class="hint-emphasis">Po</span>ng"
                    🕹️
                    🕹️<span class="hint-overlap hint-po-overlap" data-content="ポ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            Characters in this section can have an additional marking (<span class="hint-emphasis">゜</span>) at top-right called "handakuten",
            which turns the "h" sounds into "p" sounds.
        </div>
        <div class="hint-explanation">
            It only applies here, to the "h" sounds, and nowhere else.
        </div>
        <div class="hint-explanation">
            "Fu" can also be written as "hu", but "fu" is again closer to the real pronunciation.
        </div>
        <div class="hint-explanation">
            When used as grammatical particles ハ (ha) and ヘ (he) are read as "wa" and "e" respectively.
            This doesn't apply when they're used as a part of a word, and isn't relevant to this game, but it's important to know when reading full sentences.
        </div>`,

        /*html*/
        `<style>
            .hint-pyo-overlap {
                left: -2.2em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ヤ - ya</span>,
                    "<span class="hint-emphasis">Ya</span>p"
                    🗣️
                    🗣️<span class="hint-overlap" data-content="ヤ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ユ - yu</span>,
                    "<span class="hint-emphasis">Yu</span>kata"
                    👘
                    👘<span class="hint-overlap" data-content="ユ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヨ - yo</span>,
                    "New <span class="hint-emphasis">Yo</span>rk"
                    🗽
                    🗽<span class="hint-overlap" data-content="ヨ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ャ - lya</span>,
                    <span class="hint-emphasis">ミャ - mya</span>,
                    "<span class="hint-emphasis">Mya</span>nmar"
                    🇲🇲
                    🇲🇲<span class="hint-double-characters-overlap" data-content="ミャ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ュ - lyu</span>,
                    <span class="hint-emphasis">キュ - kyu</span>,
                    "<span class="hint-emphasis">Kyu</span>"
                    🥋
                    🥋<span class="hint-double-characters-overlap" data-content="キュ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ョ - lyo</span>,
                    <span class="hint-emphasis">ピョ - pyo</span>,
                    "<span class="hint-emphasis">Pyo</span>ngyang"
                    🇰🇵🏙
                    🇰🇵🏙<span class="hint-double-characters-overlap hint-pyo-overlap" data-content="ピョ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            The small (ャ, ュ, and ョ) characters are placed after characters ending in an "i" sound,
            e.g. キャ, シャ, チャ, ニャ, ヒャ, ミャ, リャ.
        </div>
        <div class="hint-explanation">
            This makes them become joined sounds spelled like
            the first sound of the first character
            (so for キ "ki" the first sound is "k")
            joined with the full "y" character, so "ya" for ャ
            resulting in "kya" for キャ.
        </div>
        <div class="hint-explanation">
            The same applies for all combinations of characters ending with "i" (including ones with dakuten or handakuten)
            and all small "y" characters, e.g. ギュ "gyu", ピョ "pyo", etc.
        </div>
        <div class="hint-explanation">
            Once again シャ "sha", シュ "shu", ショ "sho", and ジャ "ja", ジュ "ju", ジョ "jo" are special because of the pronunciation
            but they can still be spelled "sya", "syu", "sho", and "jya", "jyu", "jyo".
        </div>
        <div class="hint-explanation">
            Same as with small tsu, ャ, ュ, and ョ would only be written as "lya", "lyu", and "lyo" if they appear alone.
            They can also be written as "xya", "xyu", and "xyo".
        </div>`,

        /*html*/
        `<div>
            <span class="hint-emphasis">ワ - wa</span>,
            "<span class="hint-emphasis">Wa</span>gyu beef"
            🐮🥩
            🐮🥩<span class="hint-double-icon-overlap" data-content="ワ"></span>
        </div>
        <div>
            <span class="hint-emphasis">ヲ - wo</span>,
            Same sound as オ (o)
        </div>
        <div>
            <span class="hint-emphasis">ン - n</span>,
            "Vale<span class="hint-emphasis">n</span>tine's"
            💕
            💕<span class="hint-overlap" data-content="ン"></span>
        </div>

        <div class="hint-explanation">
            ヲ "wo" is mainly used as a grammatical particle and rarely appears in individual words.
            The spelling is used for disambiguation and reflects how it was pronounced historically but not nowadays.
        </div>
        <div class="hint-explanation">
            The ン "n" sound doesn't combine with other sounds,
            so for example ンイ "n" + "i" is always different from ニ "ni"
            and is pronounced as two seperate sounds, "n" followed by "i".
        </div>
        <div class="hint-explanation">
            If writing ン "n" as is would create ambiguity
            it should be followed by an apostrophe (').
            For example アンイ "an'i" without the apostrophe would be spelled "ani" which could also mean アニ.
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