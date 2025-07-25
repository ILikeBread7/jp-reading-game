var $kt = $kt || {};

(() => {

    class SettingsChangedEvent extends Event {

        constructor(settingName, value) {
            super(settingName);
            this._value = value;
        }

        get value() {
            return this._value;
        }

    }

    class KantoreSettings {

        constructor() {
            this._settings = Object.assign({
                    bgmVolume: 1,
                    seVolume: 1,
                    showMeaning: true,
                    showHint: true,
                    showSubmitButton: $kt.enums.SUBMIT_BUTTON.AUTO
                }, $kt.persistence.getSettings() || {});

            this._events = new EventTarget();

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
                            this._events.dispatchEvent(new SettingsChangedEvent(key, value));
                            this._saveSettings();
                        })
                    });
                });

            // Map all property names to event names
            this._eventNames = Object.freeze(
                [
                    'fullscreen',
                    ...Object.keys({
                        ...Object.getOwnPropertyDescriptors(this),
                        ...Object.getOwnPropertyDescriptors(KantoreSettings.prototype)
                    })
                ]
                    .filter(prop => !prop.startsWith('_') && prop != 'constructor')
                    .reduce(
                        (acc, prop) => {
                            acc[this._fromCamelCaseToConstCase(prop)] = prop;
                            return acc;
                        }, {}
                    )
            );
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
            this._events.dispatchEvent(new SettingsChangedEvent(this._eventNames.CURRENT_HINT_INDEX, value));
        }

        _saveSettings() {
            $kt.persistence.setSettings(this._settings);
        }

        _fromCamelCaseToConstCase(name) {
            return name.replaceAll(/([A-Z])/g, '_$1').toUpperCase();
        }

    }

    $kt.settings = new KantoreSettings();

})();