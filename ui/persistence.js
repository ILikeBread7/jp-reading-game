const PERSISTENCE_PREFIX = '$Kantore_';
const SETTINGS_KEY = 'settings';
const GAME_STATUS_KEY = 'gameStatus';
const GAME_QUESTION_KEY = 'gameQuestion';
const FLAGS_KEY = 'flags';

const events = new EventTarget();

export class KantorePersistence {

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

    static addGameStatusChangedEventListener(listener) {
        this._addChangedEventListener(GAME_STATUS_KEY, listener);
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

    static addFlagsChangedEventListener(listener) {
        this._addChangedEventListener(FLAGS_KEY, listener);
    }

    static _get(key) {
        return JSON.parse(localStorage.getItem(PERSISTENCE_PREFIX + key));
    }

    static _set(key, value) {
        const storageKey = PERSISTENCE_PREFIX + key;
        localStorage.setItem(storageKey, JSON.stringify(value));
        events.dispatchEvent(new CustomEvent(storageKey, { detail: value }));
    }

    static _remove(key) {
        localStorage.removeItem(PERSISTENCE_PREFIX + key);
    }

    static _addChangedEventListener(key, listener) {
        events.addEventListener(PERSISTENCE_PREFIX + key, listener);
    }

}