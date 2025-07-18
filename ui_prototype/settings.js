var $kt = $kt || {};

(() => {

    class KantoreSettings {

        constructor() {
            this._settings = Object.assign({
                    bgmVolume: 1,
                    seVolume: 1,
                    closeMeaning: false,
                    closeHint: false,
                    showSubmitButton: 'auto'
                }, $kt.persistence.getSettings() || {});


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

        /**
         * @param {'auto'|'always'|'never'} value 
         */
        set showSubmitButton(value) {
            this._settings.showSubmitButton = value;
            $kt.ui.adjustMobileOnlyElementsVisibility(value);
            this._saveSettings();
        }

        _saveSettings() {
            $kt.persistence.setSettings(this._settings);
        }

    }

    $kt.settings = new KantoreSettings();

})();