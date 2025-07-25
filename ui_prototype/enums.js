'use strict';

var $kt = $kt || {};

(() => {

    $kt.enums ||= {};

    $kt.enums.QUESTION_TYPE = Object.freeze({
        KANA: 1,
        KANJI: 2
    });
    
    $kt.enums.SUBMIT_BUTTON = Object.freeze({
        AUTO: 1,
        NEVER: 2,
        ALWAYS: 3
    });

})();