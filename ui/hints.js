import { LEVEL_CHARS } from './level-chars.js';
import { KantoreTemplates } from './templates.js';

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

const KANJI_EXTRA_TEXT = new Map([
            ['日', 
                'Hiragana and katakana are done so we can move on to kanji.',
                'The readings written in hiragana are called kun-yomi, they are related to native Japanese words.',
                /*html*/`Ones written in katakana are called on-yomi, they are readings borrowed from Chinese.
                Even though they're written in katakana, the words they're used in will still be written in hiragana.`,
                /*html*/`Ones with a dot (.) in the middle indicate that the reading is split into two parts,
                the first part corresponds to the kanji, and the second part is written in hiragana.
                For example, kanji 大 and reading <span class="nowrap"><span class="hint-emphasis">おお</span>.きい</span> becomes <span class="hint-emphasis">大</span>きい.`,
                /*html*/`Ones with a dash at the beginning or end are prefixes or suffixes respectively.
                For example, kanji 出 and reading <span class="hint-emphasis">-で</span> in word 日の<span class="hint-emphasis">出</span> becomes ひの<span class="hint-emphasis">で</span>.`,
                /*html*/`Sometimes when a kanji is used in the middle of a word it's first syllable will have a dakuten ゛ (or handakuten ゜) added.
                For example: 人人 (ひと<span class="hint-emphasis">び</span>と) - the second character's reading has び instead of ひ.
                This doesn't always happen, and there are no strict rules to it.
                Some words even have two versions, one with dakuten and one without.`,
                /*html*/`There's no need to memorize every possible reading.
                Some of them are used way more often than others so
                pay attention to what readings you see the most and only try to remember those.`,
                /*html*/`A good (but not perfect) way to figure out which reading to use
                is:
                <ul id="kanji-readings-explanations-list">
                    <li>
                        word consists of only one kanji (<span class="hint-emphasis">人</span> - ひと),
                        kanji with hiragana (<span class="hint-emphasis nowrap">大きい</span> - おおきい),
                        multiple kanji with, or separated by, hiragana (<span class="hint-emphasis nowrap">日の出</span> - <span class="nowrap">ひので</span>),
                        or a single kanji repeated (<span class="hint-emphasis nowrap">人人</span> - <span class="nowrap">ひとびと</span>) - <span class="nowrap">kun-yomi</span> (in general if there's any hiragana it's usually kun-yomi)
                    </li>
                    <li>word is a name (person or place) - kun-yomi</li>
                    <li>word consists of multiple kanji with no hiragana between or after them (<span class="hint-emphasis nowrap">十人</span> - <span class="nowrap">じゅうにん</span>) - on-yomi</li>
                </ul>
                There are a lot of exceptions, some words can be read in multiple ways, some words mix kun-yomi with on-yomi, so keep that in mind.`
            ],

            ['月', 
                `There are different types of kanji,
                all kanji introduced so far are called "shoukei"
                which means that they're supposed to visually represent
                their meanings.`,
                `For example the 人 kanji is supposed to look like a person,
                手 is supposed to look like a hand, etc.`,
                `Naturally, over the course of history the characters evolved
                and might not necessarily resemble what they represent anymore.`,
                'Other types of kanji will be explained as they appear in later levels.'
            ],

            ['一', 
                `The 一 character is an example of a new type of kanji
                called "shiji".`,
                `These characters are still supposed to visually represent
                their meanings, but because their meanings are usually more abstract
                they don't necessarily represent any physical object.`,
                `Like in this example the meaning of the kanji 一 is "one",
                so it's represented as a single line.`
            ],

            ['見', 
                `The 見 character is another type of kanji
                called "kaii", which are compound characters.`,
                `These characters are created by putting together
                two or more other characters that all contribute
                to the overall meaning (either by shape or their own actual meaning).`,
                `In this case the kanji for eye 目 and radical for legs 儿
                are put together to create 見 with the meaning of "see" or "look"
                (as if giving legs to an eye and sending it at whatever you want to look at).`
            ],

            ['百', 
                `The 百 character the first example of the most common
                type of kanji called "keisei".`,
                `These characters combine two parts "kei" (shape) and "sei" (sound).`,
                `The "shape" part is usually on the left or at the top and hints at
                the meaning of the kanji.`,
                `The "sound" part, usually on the right or at the bottom, hints at the way the kanji is pronounced.`,
                `In this example the "shape" is 一 (いち meaning "one") which indicates
                "beginning", "measurement unit" or just "one"
                (the meaning of 百 is one hundred, so including "one"),
                and "sound" is 白 (はく) which relates to the pronunciation of 百 (ひゃく).`,
                `For these types of kanji the sound relates to on-yomi only.
                It's also not always a perfect match as the sounds have changed over time.`
            ],

            ['町', 
                `Some characters combine "keisei" (shape and sound) and "kaii" (compound meaning).
                One example of it is kanji 町 (town) which combines
                田 (rice field) and 丁 (street / ward or tools).`,
                `For kaii the 丁 part is supposed to resemble a nail, so putting nails into a rice field
                signifies construction which indicates a town.`,
                `For keisei 田 (rice field) indicates agriculture,
                and 丁 is read as ちょう which matches the on-yomi reading of 町 (also ちょう).`
            ],

            ['匂', 
                `The 匂 character is an example of the last type of kanji
                called "kokuji" which are kanji created in Japan,
                not borrowed from China.`,
                `They have no special characteristics
                and are only mentioned for the sake of completeness.`
            ],

            ['万', 'The 一 part of 万 kanji means "one ".'],
            ['串', 'The 丨 part of 串 kanji means "line ".'],
            ['丸', 'The 丶 part of 丸 kanji means "dot ".'],
            ['乗', 'The 丿 (乀) part of 乗 kanji means "slash ".'],
            ['乱', 'The 乙 (乚、乛) part of 乱 kanji means "second ".'],
            ['事', 'The 亅 part of 事 kanji means "hook ".'],
            ['井', 'The 二 part of 井 kanji means "two ".'],
            ['京', 'The 亠 part of 京 kanji means "lid ".'],
            ['会', 'The 人 (亻、𠆢) part of 会 kanji means "man ".'],
            ['元', 'The 儿 part of 元 kanji means "son, legs ".'],
            ['全', 'The 入 part of 全 kanji means "enter ".'],
            ['公', 'The 八 (丷) part of 公 kanji means "eight ".'],
            ['内', 'The 冂 part of 内 kanji means "wide ".'],
            ['写', 'The 冖 part of 写 kanji means "cloth cover ".'],
            ['冬', 'The 冫 part of 冬 kanji means "ice ".'],
            ['処', 'The 几 part of 処 kanji means "table ".'],
            ['凶', 'The 凵 part of 凶 kanji means "receptacle ".'],
            ['分', 'The 刀 (刂、⺈) part of 分 kanji means "knife ".'],
            ['動', 'The 力 part of 動 kanji means "power ".'],
            ['包', 'The 勹 part of 包 kanji means "wrap ".'],
            ['北', 'The 匕 part of 北 kanji means "spoon ".'],
            ['匠', 'The 匚 part of 匠 kanji means "box ".'],
            ['区', 'The 匸 part of 区 kanji means "hiding enclosure ".'],
            ['午', 'The 十 part of 午 kanji means "ten ".'],
            ['占', 'The 卜 part of 占 kanji means "divination ".'],
            ['印', 'The 卩 (㔾) part of 印 kanji means "seal (device) ".'],
            ['原', 'The 厂 part of 原 kanji means "cliff ".'],
            ['去', 'The 厶 part of 去 kanji means "private ".'],
            ['友', 'The 又 part of 友 kanji means "again ".'],
            ['右', 'The 口 part of 右 kanji means "mouth ".'],
            ['国', 'The 囗 part of 国 kanji means "enclosure ".'],
            ['地', 'The 土 part of 地 kanji means "earth ".'],
            ['売', 'The 士 part of 売 kanji means "scholar ".'],
            ['変', 'The 夂 part of 変 kanji means "go ".'],
            ['夏', 'The 夊 part of 夏 kanji means "go slowly ".'],
            ['外', 'The 夕 part of 外 kanji means "evening ".'],
            ['太', 'The 大 part of 太 kanji means "big ".'],
            ['妹', 'The 女 part of 妹 kanji means "woman ".'],
            ['字', 'The 子 part of 字 kanji means "child ".'],
            ['家', 'The 宀 part of 家 kanji means "roof ".'],
            ['寺', 'The 寸 part of 寺 kanji means "inch ".'],
            ['少', 'The 小 (⺌、⺍) part of 少 kanji means "small ".'],
            ['就', 'The 尢 (尣) part of 就 kanji means "lame ".'],
            ['局', 'The 尸 part of 局 kanji means "corpse ".'],
            ['屯', 'The 屮 part of 屯 kanji means "sprout ".'],
            ['岩', 'The 山 part of 岩 kanji means "mountain ".'],
            ['州', 'The 巛 (川) part of 州 kanji means "river ".'],
            ['工', 'The 工 part of 工 kanji means "work ".'],
            ['巻', 'The 己 part of 巻 kanji means "oneself ".'],
            ['市', 'The 巾 part of 市 kanji means "turban ".'],
            ['平', 'The 干 part of 平 kanji means "dry ".'],
            ['幼', 'The 幺 (么) part of 幼 kanji means "short thread ".'],
            ['広', 'The 广 part of 広 kanji means "dotted cliff ".'],
            ['建', 'The 廴 part of 建 kanji means "long stride ".'],
            ['弁', 'The 廾 part of 弁 kanji means "arch ".'],
            ['式', 'The 弋 part of 式 kanji means "shoot ".'],
            ['強', 'The 弓 part of 強 kanji means "bow ".'],
            ['当', 'The 彐 (彑) part of 当 kanji means "snout ".'],
            ['形', 'The 彡 part of 形 kanji means "bristle ".'],
            ['後', 'The 彳 part of 後 kanji means "step ".'],
            ['思', 'The 心 (忄、⺗) part of 思 kanji means "heart ".'],
            ['戦', 'The 戈 part of 戦 kanji means "halberd ".'],
            ['戸', 'The 戶 (户、戸) part of 戸 kanji means "door ".'],
            ['才', 'The 手 (扌、龵) part of 才 kanji means "hand ".'],
            ['支', 'The 支 part of 支 kanji means "branch ".'],
            ['数', 'The 攴 (攵) part of 数 kanji means "rap, tap ".'],
            ['斎', 'The 文 part of 斎 kanji means "script ".'],
            ['料', 'The 斗 part of 料 kanji means "dipper ".'],
            ['新', 'The 斤 part of 新 kanji means "axe ".'],
            ['方', 'The 方 part of 方 kanji means "square ".'],
            ['既', 'The 无 (旡) part of 既 kanji means "not ".'],
            ['時', 'The 日 part of 時 kanji means "sun ".'],
            ['書', 'The 曰 part of 書 kanji means "say ".'],
            ['朝', 'The 月 part of 朝 kanji means "moon ".'],
            ['校', 'The 木 part of 校 kanji means "tree ".'],
            ['歌', 'The 欠 part of 歌 kanji means "lack ".'],
            ['止', 'The 止 part of 止 kanji means "stop ".'],
            ['死', 'The 歹 (歺) part of 死 kanji means "death ".'],
            ['殺', 'The 殳 part of 殺 kanji means "weapon ".'],
            ['毎', 'The 毋 (母) part of 毎 kanji means "do not ".'],
            ['比', 'The 比 part of 比 kanji means "compare ".'],
            ['毛', 'The 毛 part of 毛 kanji means "fur ".'],
            ['民', 'The 氏 part of 民 kanji means "clan ".'],
            ['氣', 'The 气 part of 氣 kanji means "steam ".'],
            ['活', 'The 水 (氵、氺) part of 活 kanji means "water ".'],
            ['点', 'The 火 (灬) part of 点 kanji means "fire ".'],
            ['爪', 'The 爪 (爫) part of 爪 kanji means "claw ".'],
            ['父', 'The 父 part of 父 kanji means "father ".'],
            ['爽', 'The 爻 part of 爽 kanji means "trigrams ".'],
            ['爿', 'The 爿 (丬) part of 爿 kanji means "split wood ".'],
            ['版', 'The 片 part of 版 kanji means "slice ".'],
            ['牙', 'The 牙 part of 牙 kanji means "fang ".'],
            ['牛', 'The 牛 (牜、⺧) part of 牛 kanji means "cow ".'],
            ['状', 'The 犬 (犭) part of 状 kanji means "dog ".'],
            ['率', 'The 玄 part of 率 kanji means "profound ".'],
            ['理', 'The 玉 (王、玊) part of 理 kanji means "jade ".'],
            ['瓜', 'The 瓜 part of 瓜 kanji means "melon ".'],
            ['瓶', 'The 瓦 part of 瓶 kanji means "tile ".'],
            ['甘', 'The 甘 part of 甘 kanji means "sweet ".'],
            ['産', 'The 生 part of 産 kanji means "life ".'],
            ['用', 'The 用 part of 用 kanji means "use ".'],
            ['画', 'The 田 part of 画 kanji means "field ".'],
            ['疑', 'The 疋 (⺪) part of 疑 kanji means "bolt of cloth ".'],
            ['病', 'The 疒 part of 病 kanji means "sickness ".'],
            ['発', 'The 癶 part of 発 kanji means "footsteps ".'],
            ['的', 'The 白 part of 的 kanji means "white ".'],
            ['皮', 'The 皮 part of 皮 kanji means "skin ".'],
            ['皿', 'The 皿 part of 皿 kanji means "dish ".'],
            ['直', 'The 目 (⺫) part of 直 kanji means "eye ".'],
            ['矛', 'The 矛 part of 矛 kanji means "spear ".'],
            ['知', 'The 矢 part of 知 kanji means "arrow ".'],
            ['研', 'The 石 part of 研 kanji means "stone ".'],
            ['社', 'The 示 (礻) part of 社 kanji means "spirit ".'],
            ['禽', 'The 禸 part of 禽 kanji means "track ".'],
            ['科', 'The 禾 part of 科 kanji means "grain ".'],
            ['空', 'The 穴 part of 空 kanji means "cave ".'],
            ['章', 'The 立 part of 章 kanji means "stand ".'],
            ['算', 'The 竹 (⺮) part of 算 kanji means "bamboo ".'],
            ['米', 'The 米 part of 米 kanji means "rice ".'],
            ['組', 'The 糸 (糹) part of 組 kanji means "silk ".'],
            ['缶', 'The 缶 part of 缶 kanji means "jar ".'],
            ['置', 'The 网 (⺲、罓、⺳) part of 置 kanji means "net ".'],
            ['美', 'The 羊 (⺶、⺷) part of 美 kanji means "sheep ".'],
            ['羽', 'The 羽 part of 羽 kanji means "feather ".'],
            ['考', 'The 老 (耂) part of 考 kanji means "old ".'],
            ['耐', 'The 而 part of 耐 kanji means "and ".'],
            ['耕', 'The 耒 part of 耕 kanji means "plough ".'],
            ['聞', 'The 耳 part of 聞 kanji means "ear ".'],
            ['粛', 'The 聿 (⺺、⺻) part of 粛 kanji means "brush ".'],
            ['肉', 'The 肉 (⺼) part of 肉 kanji means "meat ".'],
            ['臣', 'The 臣 part of 臣 kanji means "minister ".'],
            ['自', 'The 自 part of 自 kanji means "self ".'],
            ['至', 'The 至 part of 至 kanji means "arrive ".'],
            ['興', 'The 臼 part of 興 kanji means "mortar ".'],
            ['舌', 'The 舌 part of 舌 kanji means "tongue ".'],
            ['舞', 'The 舛 part of 舞 kanji means "oppose ".'],
            ['船', 'The 舟 part of 船 kanji means "boat ".'],
            ['良', 'The 艮 part of 良 kanji means "stopping ".'],
            ['色', 'The 色 part of 色 kanji means "color ".'],
            ['花', 'The 艸 (⺿) part of 花 kanji means "grass ".'],
            ['虚', 'The 虍 part of 虚 kanji means "tiger ".'],
            ['蚕', 'The 虫 part of 蚕 kanji means "insect ".'],
            ['血', 'The 血 part of 血 kanji means "blood ".'],
            ['行', 'The 行 part of 行 kanji means "walk enclosure ".'],
            ['表', 'The 衣 (⻂) part of 表 kanji means "clothes ".'],
            ['西', 'The 襾 (西、覀) part of 西 kanji means "cover ".'],
            ['親', 'The 見 part of 親 kanji means "see ".'],
            ['角', 'The 角 (⻇) part of 角 kanji means "horn ".'],
            ['言', 'The 言 (訁) part of 言 kanji means "speech ".'],
            ['谷', 'The 谷 part of 谷 kanji means "valley ".'],
            ['豆', 'The 豆 part of 豆 kanji means "bean ".'],
            ['象', 'The 豕 part of 象 kanji means "pig ".'],
            ['貌', 'The 豸 part of 貌 kanji means "badger ".'],
            ['買', 'The 貝 part of 買 kanji means "shell ".'],
            ['赦', 'The 赤 part of 赦 kanji means "red ".'],
            ['走', 'The 走 part of 走 kanji means "run ".'],
            ['路', 'The 足 (⻊) part of 路 kanji means "foot ".'],
            ['身', 'The 身 part of 身 kanji means "body ".'],
            ['転', 'The 車 part of 転 kanji means "cart ".'],
            ['辞', 'The 辛 part of 辞 kanji means "bitter ".'],
            ['農', 'The 辰 part of 農 kanji means "morning ".'],
            ['通', 'The 辵 (⻌、⻍) part of 通 kanji means "walk ".'],
            ['部', 'The 邑 (⻏) part of 部 kanji means "city ".'],
            ['配', 'The 酉 part of 配 kanji means "wine ".'],
            ['釈', 'The 釆 part of 釈 kanji means "distinguish ".'],
            ['野', 'The 里 part of 野 kanji means "village ".'],
            ['銀', 'The 金 (釒) part of 銀 kanji means "gold ".'],
            ['長', 'The 長 (镸) part of 長 kanji means "long ".'],
            ['間', 'The 門 part of 間 kanji means "gate ".'],
            ['院', 'The 阜 (⻖) part of 院 kanji means "mound ".'],
            ['隷', 'The 隶 part of 隷 kanji means "slave ".'],
            ['集', 'The 隹 part of 集 kanji means "short-tailed bird ".'],
            ['電', 'The 雨 part of 電 kanji means "rain ".'],
            ['青', 'The 靑 (青) part of 青 kanji means "blue ".'],
            ['非', 'The 非 part of 非 kanji means "wrong ".'],
            ['面', 'The 面 (靣) part of 面 kanji means "face ".'],
            ['革', 'The 革 part of 革 kanji means "leather ".'],
            ['韓', 'The 韋 part of 韓 kanji means "tanned leather ".'],
            ['韮', 'The 韭 part of 韮 kanji means "leek ".'],
            ['響', 'The 音 part of 響 kanji means "sound ".'],
            ['頭', 'The 頁 part of 頭 kanji means "leaf ".'],
            ['風', 'The 風 part of 風 kanji means "wind ".'],
            ['飛', 'The 飛 part of 飛 kanji means "fly ".'],
            ['食', 'The 食 (飠) part of 食 kanji means "eat ".'],
            ['首', 'The 首 part of 首 kanji means "head ".'],
            ['香', 'The 香 part of 香 kanji means "fragrant ".'],
            ['馬', 'The 馬 part of 馬 kanji means "horse ".'],
            ['骨', 'The 骨 part of 骨 kanji means "bone ".'],
            ['高', 'The 高 (髙) part of 高 kanji means "tall ".'],
            ['髪', 'The 髟 part of 髪 kanji means "hair ".'],
            ['鬥', 'The 鬥 part of 鬥 kanji means "fight ".'],
            ['鬱', 'The 鬯 part of 鬱 kanji means "sacrificial wine ".'],
            ['鬻', 'The 鬲 part of 鬻 kanji means "cauldron ".'],
            ['魅', 'The 鬼 part of 魅 kanji means "ghost ".'],
            ['魚', 'The 魚 part of 魚 kanji means "fish ".'],
            ['鳥', 'The 鳥 part of 鳥 kanji means "bird ".'],
            ['鹸', 'The 鹵 part of 鹸 kanji means "salt ".'],
            ['鹿', 'The 鹿 part of 鹿 kanji means "deer ".'],
            ['麦', 'The 麥 part of 麦 kanji means "wheat ".'],
            ['麻', 'The 麻 part of 麻 kanji means "hemp ".'],
            ['黄', 'The 黃 part of 黄 kanji means "yellow ".'],
            ['黎', 'The 黍 part of 黎 kanji means "millet ".'],
            ['黒', 'The 黑 part of 黒 kanji means "black ".'],
            ['黽', 'The 黽 part of 黽 kanji means "frog ".'],
            ['鼎', 'The 鼎 part of 鼎 kanji means "tripod ".'],
            ['鼓', 'The 鼓 part of 鼓 kanji means "drum ".'],
            ['鼠', 'The 鼠 part of 鼠 kanji means "rat ".'],
            ['鼻', 'The 鼻 part of 鼻 kanji means "nose ".'],
            ['齊', 'The 齊 (斉) part of 齊 kanji means "even ".'],
            ['齢', 'The 齒 part of 齢 kanji means "tooth ".'],
            ['龍', 'The 龍 part of 龍 kanji means "dragon ".'],
            ['龜', 'The 龜 part of 龜 kanji means "turtle ".']

]);

export class KantoreHints {

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
                        .map(kanji => KantoreTemplates.kanjiHintEntry(kanjidexMap.get(kanji)))
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
        return KANJI_EXTRA_TEXT.get(kanji) || '';
    }

}

const KH = KantoreHints;