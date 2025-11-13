'use strict';

var $kt = $kt || {};

(() => {

    $kt.enums ||= {};

    $kt.enums.SUBMIT_BUTTON = Object.freeze({
        AUTO: 1,
        NEVER: 2,
        ALWAYS: 3
    });

    $kt.enums.GAME_TYPE = Object.freeze({
        MAIN: 1,
        PRACTICE: 2,
        ARCADE: 3
    });

})();