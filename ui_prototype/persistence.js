var $kt = $kt || {};

(() => {

    const PERSISTENCE_PREFIX = '$Kantore_';
    const SETTINGS_KEY = 'settings';

    class KantorePersistence {

        static getSettings() {
            return this._get(SETTINGS_KEY);
        }

        static setSettings(value) {
            this._set(SETTINGS_KEY, value);
        }

        static _get(key) {
            return JSON.parse(localStorage.getItem(PERSISTENCE_PREFIX + key));
        }

        static _set(key, value) {
            localStorage.setItem(PERSISTENCE_PREFIX + key, JSON.stringify(value));
        }

    }

    $kt.persistence = KantorePersistence;

})();