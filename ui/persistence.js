'use strict';

var $kt = $kt || {};

(() => {

    const PERSISTENCE_PREFIX = '$Kantore_';
    const SETTINGS_KEY = 'settings';
    const GAME_STATUS_KEY = 'gameStatus';
    const GAME_QUESTION_KEY = 'gameQuestion';
    const FLAGS_KEY = 'flags';

    class KantorePersistence {

        static getSettings() {
            return this._get(SETTINGS_KEY);
        }

        static setSettings(value) {
            this._set(SETTINGS_KEY, value);
        }

        static getGameStatus() {
            return this._get(GAME_STATUS_KEY);
        }

        static setGameStatus(value) {
            this._set(GAME_STATUS_KEY, value);
        }

        static getGameQuestion() {
            return this._get(GAME_QUESTION_KEY);
        }

        static removeGameQuestion() {
            this._remove(GAME_QUESTION_KEY);
        }

        static setGameQuestion(value) {
            this._set(GAME_QUESTION_KEY, value);
        }

        static getFlags() {
            return this._get(FLAGS_KEY);
        }

        static setFlags(value) {
            this._set(FLAGS_KEY, value);
        }

        static _get(key) {
            return JSON.parse(localStorage.getItem(PERSISTENCE_PREFIX + key));
        }

        static _set(key, value) {
            localStorage.setItem(PERSISTENCE_PREFIX + key, JSON.stringify(value));
        }

        static _remove(key) {
            localStorage.removeItem(PERSISTENCE_PREFIX + key);
        }

    }

    $kt.persistence = KantorePersistence;

})();