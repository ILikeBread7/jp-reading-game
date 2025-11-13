import { SUBMIT_BUTTON_VISIBILITY } from './enums.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

class KantoreSettings {

    constructor() {
        this._settings = Object.assign({
                bgmVolume: 1,
                seVolume: 1,
                showMeaning: true,
                showHint: true,
                showSubmitButton: SUBMIT_BUTTON_VISIBILITY.AUTO
            }, $kt.persistence.getSettings() || {});

        this._createSettingsPropertyAccessors();
        this._createEvents();
    }

    get events() {
        return this._events;
    }

    get eventNames() {
        return this._eventNames;
    }

    /**
     * @param {number} value
     */
    set currentHintIndex(value) {
        this._dispatchSettingChangedEvent(this._eventNames.CURRENT_HINT_INDEX, value);
    }

    _createSettingsPropertyAccessors() {
        // Pass through all get/set property accessors
        // to the underlying _settings object
        // unless explicitly defined in this class
        Object.keys(this._settings)
            .forEach(key => {
                const propertyDescriptor = Object.getOwnPropertyDescriptor(KantoreSettings.prototype, key);
                Object.defineProperty(this, key, {
                    get: (propertyDescriptor && propertyDescriptor['get']) || (() => this._settings[key]),
                    set: (propertyDescriptor && propertyDescriptor['set']) || (value => {
                        this._settings[key] = value;
                        this._dispatchSettingChangedEvent(key, value);
                        this._saveSettings();
                    })
                });
            });
    }

    _createEvents() {
        this._events = new EventTarget();

        // Map all property names to event names
        this._eventNames = Object.freeze(
            Object.entries({
                ...Object.getOwnPropertyDescriptors(KantoreSettings.prototype),
                ...Object.getOwnPropertyDescriptors(this)
            })
                .filter(([, description]) => description.set)
                .map(([prop, ]) => prop)
                .reduce(
                    (acc, prop) => {
                        acc[this._fromCamelCaseToConstCase(prop)] = prop;
                        return acc;
                    }, {}
                )
        );
    }

    _saveSettings() {
        $kt.persistence.setSettings(this._settings);
    }

    _fromCamelCaseToConstCase(name) {
        return name.replaceAll(/([A-Z])/g, '_$1').toUpperCase();
    }

    _dispatchSettingChangedEvent(eventName, value) {
        this._events.dispatchEvent(new CustomEvent(eventName, { detail : {value} } ));
    }

}

$kt.settings = new KantoreSettings();