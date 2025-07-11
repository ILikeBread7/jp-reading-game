var $kt = $kt || {};

(() => {

    class KantoreSettings {

        constructor() {
            this._settings = $kt.persistence.getSettings()
                || {
                    bgmVolume: 1,
                    seVolume: 1,
                    closeMeaning: false,
                    closeHint: false
                };


            Object.keys(this._settings)
                .forEach(key => {
                    const propertyDescriptor = Object.getOwnPropertyDescriptor(KantoreSettings.prototype, key);
                    Object.defineProperty(this, key, {
                        get: (propertyDescriptor && propertyDescriptor['get']) || (() => this._settings[key]),
                        set: (propertyDescriptor && propertyDescriptor['set']) || (value => {
                            this._settings[key] = value;
                            this._saveSettings();
                        })
                    });
                });
        }

        /**
         * @param {number} value
         */
        set bgmVolume(value) {
            this._settings.bgmVolume = value;
            $kt.audio.bgmVolumeChange(this._settings.bgmVolume);
            this._saveSettings();
        }

        /**
         * @param {number} value
         */
        set seVolume(value) {
            this._settings.seVolume = value;
            $kt.audio.seVolumeChange(this._settings.seVolume);
            this._saveSettings();
        }

        _saveSettings() {
            $kt.persistence.setSettings(this._settings);
        }

    }

    $kt.settings = new KantoreSettings();

})();