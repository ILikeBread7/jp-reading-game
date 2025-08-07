'use strict';

var $kt = $kt || {};

(() => {

    $kt.hints = [
        {
            name: 'Level 1: あ行',
            template: /*html*/
                `<div>あ - a</div>
                <div>い - i</div>
                <div>う - u</div>
                <div>え - e</div>
                <div>お - o</div>`
        },

        {
            name: 'Level 2: か行',
            template: /*html*/
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
                </div>`
        },

        {
            name: 'Level 3: さ行',
            template: /*html*/
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
        }
    ];

})();