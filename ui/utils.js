'use strict';

var $kt = $kt || {};

(() => {

    class KantoreUtils {

        /**
         * 
         * @param {[]} array 
         * @returns {[]} The same array shuffled in place
         */
        static shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                
                const tmp = array[i];
                array[i] = array[randomIndex];
                array[randomIndex] = tmp;
            }

            return array;
        }

    }

    $kt.utils = KantoreUtils;

})();