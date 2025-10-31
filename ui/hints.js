import { LEVEL_CHARS } from './level-chars.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

(() => {

    let kanjidexMap = null;
    let kanjidexPromise = null;

    const ENDGAME_HINT = /*html*/ `
        <div class="centered-text">
            <div>Congratulations! You completed all levels!</div>
            <div class="hint-explanation">
                Now you can try the practice mode or you can
                stay in this mode and review all material from
                all existing levels!
            </div>
            <div class="hint-explanation">
                I would also love to see your feedback in the comments on the
                <a target="_blank" href="https://ilikebread7.itch.io/kantore">itch.io</a> page for this game or wherever else you're playing it right now!
            </div>
            <div class="hint-explanation">Thank you for playing this game and I hope you had fun and learned something!</div>
        </div>`;

    const SPECIAL_HINT = /*html*/ `
        <div>
            <span class="hint-emphasis">々 - kanji repetition mark</span>
        </div>
        <div>
            <span class="hint-emphasis">ヵ - lka (small ka)</span>
        </div>
        <div>
            <span class="hint-emphasis">ヶ - lke (small ke)</span>
        </div>
        <div class="hint-explanation">
            The kanji repetition mark 々 (also called "noma") repeats the previous kanji.
            For example: 人々 (ひとびと) instead of 人人.
        </div>
        <div class="hint-explanation">
            It's used when there are two of the same kanji next to each other within the same word.
            It doesn't have to be used but it usually is.
        </div>
        <div class="hint-explanation">
            The ヵ and ヶ are usually read か (ka) and are used for quantities of certain things.
            For example: 一ヶ月 (いっかげつ) one month.
            They can be used interchangeably.
        </div>`;

    const KANA_HINTS = [
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
            type it into the input below the question
            using the above hints.
        </div>
        <div class="hint-explanation">
            Press ENTER to confirm your answer.
        </div>
        <div class="hint-explanation">
            Press ENTER with an empty input
            to get an extra hint but you won't receive any exp.
        </div>`,

        /*html*/
        `<div>
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
                "R<span class="hint-emphasis">u</span>" (<span class="hint-emphasis">る</span>) is c<span class="hint-emphasis">u</span>rled like it has rhe<span class="hint-emphasis">u</span>matism,
                and "r<span class="hint-emphasis">o</span>" (<span class="hint-emphasis">ろ</span>) is n<span class="hint-emphasis">o</span>t.
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
            The し (shi) and じ (ji) are a little different because is no "si" (like in "<span class="hint-emphasis">si</span>ege") or "zi" (like in "jacuz<span class="hint-emphasis">zi</span>") sound in Japanese.
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
            The ち (chi) character is different, like し (shi) in the previous section.
            It can still be written as "ti" but "chi" is closer to the actual pronunciation.
        </div>
        <div class="hint-explanation">
            The づ (dzu) character is pronounced "zu", same as "ず", but for disambiguation purposes can be spelled differently.
            Inputting "zu" in this game is recognized as "ず", so disambiguation is needed.
        </div>
        <div class="hint-explanation">
            The つ (tsu), づ (dzu) and っ (ltsu) can also be written as "tu", "du" and "ltu" but the "tsu" and "dzu" spellings are closer to the actual pronunciation.
        </div>
        <div class="hint-explanation">
            Small tsu (<span class="hint-emphasis">っ</span>) is usually written as a double letter instead of "ltsu" except when it needs to be written by itself.
        </div>
        <div class="hint-explanation">
            It can also be written as "xtsu" but "ltsu" might be easier to remember ("smal<span class="hint-emphasis">l</span> tsu" or "<span class="hint-emphasis">l</span>ittle tsu").
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
            ふ (fu) can also be written as "hu", but "fu" is again closer to the real pronunciation.
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
                    <span class="nowrap">🇰🇵🏙</span>
                    🇰🇵🏙<span class="hint-double-characters-overlap hint-pyo-overlap" data-content="ぴょ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            The small ゃ, ゅ, and ょ characters are placed after characters ending in an "i" sound,
            e.g. きゃ, しゃ, ちゃ, にゃ, ひゃ, みゃ, りゃ.
        </div>
        <div class="hint-explanation">
            This makes them become joined sounds spelled like
            the first sound of the first character
            (so for き (ki) the first sound is "k")
            joined with the full "y" character, so "ya" for ゃ
            resulting in "kya" for きゃ.
        </div>
        <div class="hint-explanation">
            The same applies for all combinations of characters ending with "i" (including ones with dakuten or handakuten)
            and all small "y" characters, e.g. ぎゅ (gyu), ぴょ (pyo), etc.
        </div>
        <div class="hint-explanation">
            Once again しゃ (sha), しゅ (shu), しょ (sho), and じゃ (ja), じゅ (ju), じょ (jo) are special because of the pronunciation
            but they can still be spelled "sya", "syu", "sho", and "jya", "jyu", "jyo".
            The same applies to ちゃ (cha / cya / tya), ちゅ (chu / cyu / tyu), ちょ (cho / cyo / tyo), ぢゃ (dya, pronounced "ja"), ぢゅ (dyu, pronounced "ju"), and ぢょ (dyo, pronounced "jo").
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
            を (wo) is mainly used as a grammatical particle and rarely appears in individual words.
            The spelling is used for disambiguation and reflects how it was pronounced historically but not nowadays.
        </div>
        <div class="hint-explanation">
            The ん (n) sound doesn't combine with other sounds,
            so for example んい ("n" + "i") is always different from に (ni)
            and is pronounced as two seperate sounds, "n" followed by "i".
        </div>
        <div class="hint-explanation">
            If writing ん (n) as is would create ambiguity
            it should be followed by an apostrophe (').
            For example あんい (an'i) without the apostrophe would be spelled "ani" which could also mean あに.
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
            the equivalent characters in katakana unless stated otherwise.
        </div>`,

        /*html*/
        `<div>
            <div>
                <span class="hint-emphasis">マ - ma</span>,
                "<span class="hint-emphasis">Ma</span>estro"
                🧔🎻
                🧔🎻<span class="hint-double-icon-overlap hint-ma-overlap" data-content="マ"></span>
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
                ⚔<span class="hint-overlap">メ</span>
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

            .hint-du-overlap {
                left: -2.075em;
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
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ィ - li (small i)</span>
                </div>
                <div>
                    <span class="hint-emphasis">ティ - teli (ti)</span>,
                    "<span class="hint-emphasis">Ti</span>er"
                    📶
                    📶<span class="hint-double-characters-overlap" data-content="ティ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">テゥ - telu (tu)</span>,
                    "Vanua<span class="hint-emphasis">tu</span>"
                    🇻🇺
                    🇻🇺<span class="hint-double-characters-overlap" data-content="テゥ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ッ - ltsu (small tsu)</span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ゥ - lu (small u)</span>
                </div>
                <div>
                    <span class="hint-emphasis">ディ - deli (di)</span>,
                    "<span class="hint-emphasis">Di</span>va"
                    💃
                    💃<span class="hint-double-characters-overlap" data-content="ディ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">デゥ - delu (du)</span>,
                    "Katman<span class="hint-emphasis">du</span>"
                    <span class="nowrap">🇳🇵🏙</span>
                    🇳🇵🏙<span class="hint-double-characters-overlap hint-du-overlap" data-content="デゥ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ェ - le (small e)</span>
                </div>
                <div>
                    <span class="hint-emphasis">チェ - che</span>,
                    "<span class="hint-emphasis">Che</span>rry"
                    🍒
                    🍒<span class="hint-double-characters-overlap" data-content="チェ"></span>
                </div>
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ウィ - uli (wi)</span>,
                    "<span class="hint-emphasis">Wi</span>ener"
                    🌭
                    🌭<span class="hint-double-characters-overlap" data-content="ウィ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ウェ - ule (we)</span>,
                    "<span class="hint-emphasis">We</span>ight"
                    🏋
                    🏋<span class="hint-double-characters-overlap" data-content="ウェ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">イェ - ile (ye)</span>,
                    "<span class="hint-emphasis">Ye</span>llow"
                    🟨
                    🟨<span class="hint-double-characters-overlap" data-content="イェ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            In katakana vowels (アイウエオ) have small versions (ァィゥェォ)
            which can be combined with some other characters
            (usually テ (te), デ (de), チ (chi), ウ (u), イ (i), and フ (fu) which will be shown later).
        </div>
        <div class="hint-explanation">
            This level will focus on ィ (small i), ゥ (small u), and ェ (small e).
        </div>
        <div class="hint-explanation">
            The non-literal spellings are for disambiguation.
            チェ (che) is usually spelled "che" bacause there is no other "che" sound
            in Japanese.
        </div>
        <div class="hint-explanation">
            If combined with a small vowel the ウ (u) character is read more like "w".
            ウィ (uli) and ウェ (ule) can be spelled as "wi" and "we"
            as there are no "wi" and "we" sounds in modern Japanese
            but there used to be so the spellings "uli" and "ule" are less ambiguous.
        </div>
        <div class="hint-explanation">
            イ (i) is usually only combined with ェ (small e)
            where it is read like "y".
            イェ is read as "ye" and can be spelled as
            "ye", "ile", or "ixe".
        </div>
        <div class="hint-explanation">
            They can also be used in hiragana (ぁぃぅぇぉ) but are less common.
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
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ファ - fa</span>,
                    "<span class="hint-emphasis">Fa</span>rm"
                    👨‍🌾
                    👨‍🌾<span class="hint-double-characters-overlap" data-content="ファ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">フィ - fi</span>,
                    "<span class="hint-emphasis">Fi</span>eld"
                    🌾
                    🌾<span class="hint-double-characters-overlap" data-content="フィ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">フェ - fe</span>,
                    "<span class="hint-emphasis">Fe</span>ncing"
                    🤺
                    🤺<span class="hint-double-characters-overlap" data-content="フェ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">フォ - fo</span>,
                    "<span class="hint-emphasis">Fo</span>rest"
                    🌲
                    🌲<span class="hint-double-characters-overlap" data-content="フォ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ウォ - ulo (wo)</span>,
                    "<span class="hint-emphasis">Wo</span>rn"
                    🏚
                    🏚<span class="hint-double-characters-overlap" data-content="ウォ"></span>
                </div>
            </div>
        </div>
        <div class="hint-explanation">
            Small vowels (ァィェォ) can be combined with フ (fu) to create "fa", "fi", "fe", and "fo" sounds.
            They are usually spelled as is because these spellings don't exist elsewhere in Japanese so there is no need for any disambiguation.
        </div>
        <div class="hint-explanation">
            ウ (u) can also be combined with ォ (small o)
            similar to other combinations shown in the previous level.
            This time it cannot be spelled "wo" as there is another
            character spelled "wo" already.
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
                    <span class="nowrap">🇰🇵🏙</span>
                    🇰🇵🏙<span class="hint-double-characters-overlap hint-pyo-overlap" data-content="ピョ"></span>
                </div>
            </div>
        </div>`,

        /*html*/
        `<style>
            .hint-vi-overlap {
                left: -2.2em;
            }
        </style>
        
        <div class="columns-container">
            <div class="column-half-width">
                <div>
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
            </div>
            <div class="column-half-width">
                <div>
                    <span class="hint-emphasis">ヴ - vu</span>,
                    "Sca<span class="hint-emphasis">vu</span>zzo"
                    🇮🇹🏙
                    🇮🇹🏙<span class="hint-double-icon-overlap" data-content="ヴ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヴァ - va</span>,
                    "<span class="hint-emphasis">Va</span>ledictorian"
                    👨‍🎓
                    👨‍🎓<span class="hint-double-characters-overlap" data-content="ヴァ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヴィ - vi</span>,
                    "<span class="hint-emphasis">Vi</span>enna"
                    🇦🇹🏙
                    🇦🇹🏙<span class="hint-double-characters-overlap hint-vi-overlap" data-content="ヴィ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヴェ - ve</span>,
                    "<span class="hint-emphasis">Ve</span>getable"
                    🥦
                    🥦<span class="hint-double-characters-overlap" data-content="ヴェ"></span>
                </div>
                <div>
                    <span class="hint-emphasis">ヴォ - vo</span>,
                    "<span class="hint-emphasis">Vo</span>ice"
                    🎙️
                    🎙️<span class="hint-double-characters-overlap" data-content="ヴォ"></span>
                </div>
            </div>
            <div class="hint-explanation">
                In katakana ウ (u) can also be used with dakuten to create ヴ (vu).
            </div>
            <div class="hint-explanation">
                It can also be combined with small vowels to create all the other "v" sounds.
            </div>
        </div>`,
    ];

    class KantoreHints {

        static get length() {
            return LEVEL_CHARS.length + 1;
        }

        static loadKanjidex() {
            if (kanjidexMap) {
                return;
            }

            kanjidexPromise = fetch('kanjidex.json')
                .then(response => response.json())
                .then(kanjidex => {
                    kanjidexMap = kanjidex.reduce((acc, entry) => {
                        acc.set(entry.kanji, entry);
                        return acc;
                    }, new Map());
                });
        }

        /**
         * 
         * @param {number} index 
         * @param {(hint: string) => void} callback 
         */
        static getHint(index, callback) {
            const hint = KH._getNonKanjiHint(index);
            if (hint) {
                callback(hint);
                return;
            }

            const chars = LEVEL_CHARS[index];
            KH.getKanjiHint(chars, callback);
        }

        /**
         * 
         * @param {string[]} kanjiChars 
         * @param {(hint: string) => void} callback 
         */
        static getKanjiHint(kanjiChars, callback) {
            if (kanjidexMap) {
                callback(KH._getKanjiHintSync(kanjiChars));
                return;
            }

            kanjidexPromise.then(() => {
                callback(KH._getKanjiHintSync(kanjiChars));
            });
        }

        /**
         * 
         * @param {number} index 
         * @returns {string|undefined} hint if non-kanji (kana, special or endgame) level, undefined otherwise
         */
        static _getNonKanjiHint(index) {
            if (index < KANA_HINTS.length) {
                return KANA_HINTS[index];
            }

            if (index < LEVEL_CHARS.length) {
                const chars = LEVEL_CHARS[index];
                if (chars.includes('々')) {
                    return SPECIAL_HINT;
                }
                return;
            }

            return ENDGAME_HINT;
        }

        static _getKanjiHintSync(kanjiChars) {
            return KH._getKanjiHintsOnly(kanjiChars)
                + KH._getKanjiHintExplanations(kanjiChars);
        }

        static _getKanjiHintsOnly(kanjiChars) {
            return /*html*/ `
                <div>
                    ${
                        kanjiChars
                            .map(kanji => $kt.templates.kanjiHintEntry(kanjidexMap.get(kanji)))
                            .join('')
                    }
                </div>
            `;
        }

        static _getKanjiHintExplanations(kanjiChars) {
            const explanations = kanjiChars
                .flatMap(KH._getKanjiHintExplanationForSingleKanji)
                .filter(Boolean);

            if (explanations.length === 0) {
                return '';
            }

            return explanations
                .map(explanation => /*html*/ `<div class="hint-explanation">${explanation}</div>`)
                .join('');
        }

        static _getKanjiHintExplanationForSingleKanji(kanji) {
            switch (kanji) {
                case '日': return [
                    'Hiragana and katakana are done so we can move on to kanji.',
                    'The readings written in hiragana are called kun-yomi, they are related to native Japanese words.',
                    `Ones written in katakana are called on-yomi, they are readings borrowed from Chinese.
                    Even though they're written in katakana, the words they're used in will still be written in hiragana.`,
                    `Ones with a dot (.) in the middle indicate that the reading is split into two parts,
                    the first part corresponds to the kanji, and the second part is written in hiragana.
                    For example, kanji 大 and reading <span class="nowrap"><span class="hint-emphasis">おお</span>.きい</span> becomes <span class="hint-emphasis">大</span>きい.`,
                    `Ones with a dash at the beginning or end are prefixes or suffixes respectively.
                    For example, kanji 出 and reading <span class="hint-emphasis">-で</span> in word 日の<span class="hint-emphasis">出</span> becomes ひの<span class="hint-emphasis">で</span>.`,
                    `Sometimes when a kanji is used in the middle of a word it's first syllable will have a dakuten ゛ (or handakuten ゜) added.
                    For example: 人人 (ひと<span class="hint-emphasis">び</span>と) - the second character's reading has び instead of ひ.
                    This doesn't always happen, and there are no strict rules to it.
                    Some words even have two versions, one with dakuten and one without.`,
                    `There's no need to memorize every possible reading.
                    Some of them are used way more often than others so
                    pay attention to what readings you see the most and only try to remember those.`,
                    `A good (but not perfect) rule of thumb to figure out which reading to use
                    is:<br>
                    &nbsp - word consists of only one kanji (<span class="hint-emphasis">人</span> - ひと),
                    kanji with hiragana (<span class="hint-emphasis nowrap">大きい</span> - おおきい),
                    multiple kanji with, or separated by, hiragana (<span class="hint-emphasis nowrap">日の出</span> - <span class="nowrap">ひので</span>),
                    or a single kanji repeated (<span class="hint-emphasis nowrap">人人</span> - <span class="nowrap">ひとびと</span>) - <span class="nowrap">kun-yomi</span><br>
                    &nbsp - word is a name (person or place) - kun-yomi<br>
                    &nbsp - word consists of multiple kanji with no hiragana between or after them (<span class="hint-emphasis nowrap">十人</span> - <span class="nowrap">じゅうにん</span>) - on-yomi<br>
                    There are a lot of exceptions, some words can be read in multiple ways, some words mix kun-yomi with on-yomi, so keep that in mind.`
                ];

                case '月': return [
                    `There are different types of kanji,
                    all kanji introduced so far are called "shoukei"
                    which means that they're supposed to visually represent
                    their meanings.`,
                    `For example the 人 kanji is supposed to look like a person,
                    手 is supposed to look like a hand, etc.`,
                    `Naturally, over the course of history the characters evolved
                    and might not necessarily resemble what they represent anymore.`,
                    'Other types of kanji will be explained as they appear in later levels.'
                ];

                default: return '';
            }
        }

    }

    const KH = $kt.hints = KantoreHints;

})();