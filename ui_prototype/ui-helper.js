var $kt = $kt || {};

(() => {

    // Has access to private fields of
    // KantoreUi, KantoreSettingsUi, KantoreGameUi and KantoreTitleUi
    // to facilitate communication
    // between them (friend class)
    class KantoreUiHelper {

        /**
         * 
         * @param {HTMLElement} element 
         * @param {HTMLElement} [elementToFocus]
         */
        static showOverlayElement(element) {
            element.style.visibility = 'visible';
            element.style.setProperty('--current-opacity', 'var(--visible-opacity)');

            const firstChildElement = element.firstElementChild;
            if (firstChildElement && firstChildElement.classList.contains('menu')) {
                element.ontransitionend = event => {
                    if (event.target !== element) {
                        return;
                    }
                    $kt.uiHelper.showMenu(firstChildElement);
                    element.ontransitionend = null;
                };
            } else {
                $kt.ui._answerInput.blur();
            }
        }

        static hideOverlayElement(element) {
            element.style.removeProperty('visibility');
            element.style.removeProperty('--current-opacity');
        }

        /**
         * 
         * @param {string} settingName 
         * @param {(value) => {}} settingChangedListener 
         */
        static connectSettingToListener(settingName, settingChangedListener) {
            settingChangedListener($kt.settings[settingName]);
            $kt.settings.events.addEventListener(settingName, event => settingChangedListener(event.value));
        }

        /**
         * 
         * @param {$kt.settings.eventNames} settingName 
         * @param {HTMLElement} element 
         * @param {() => {}?} elementAdditionalListener optional
         */
        static connectElementToSetting(settingName, element, elementAdditionalListener) {
            const [ settingChangedListener, elementChangedListener ] =
                element.type === 'checkbox'
                    ? [
                        value => element.checked = value,
                        () => $kt.settings[settingName] = element.checked
                    ]
                    : [
                        value => element.value = value,
                        () => $kt.settings[settingName] = Number(element.value)
                    ];
            
            $kt.uiHelper.connectSettingToListener(settingName, settingChangedListener);
            element.addEventListener('change', elementChangedListener);
            if (elementAdditionalListener) {
                element.addEventListener('change', elementAdditionalListener);
            }
        }

        static setshowMeaningSetting(newValue) {
            $kt.settingsUi._showMeaning.checked = newValue;
            $kt.settings.showMeaning = newValue;
        }

        static setshowHintSetting(newValue) {
            $kt.settingsUi._showHint.checked = newValue;
            $kt.settings.showHint = newValue;
        }

        static isSettingsVisible() {
            return $kt.settingsUi._settingsDiv.checkVisibility({ visibilityProperty: true });
        }

        static showSettings() {
            $kt.uiHelper.showOverlayElement($kt.settingsUi._settingsDiv);
        }

        static hideSettings() {
            $kt.uiHelper.hideOverlayElement($kt.settingsUi._settingsDiv);
            if ($kt.titleUi._titleScene.checkVisibility()) {
                if ($kt.titleUi._credits.checkVisibility()) {
                    $kt.uiHelper.showMenu($kt.ui._credits.parentNode);
                } else {
                    $kt.titleUi.startTitleScene();
                }
            } else {
                $kt.gameUi.focusAnswerInput();
            }
        }

        static focusSelectedMenuItem(element) {
            $kt.uiHelper.focusMenuItem(element);

            // This prevents multiple sounds from focusing
            // on the same checkbox over and over again
            // directly or through a label
            if (!element.parentNode.classList.contains('menu-item-label')) {
                $kt.audio.playEffect($kt.audio.tracks.SE_TEST_1);
            }

        }

        static focusDefaultMenuItem(element) {
            $kt.uiHelper.focusMenuItem(element);
        }

        static focusMenuItem(element) {
            element.focus({ focusVisible: true });
        }

        static startGame() {
            $kt.gameUi.startGame();
        }

        static switchToScene(scene) {
            const scenes = [...document.getElementsByClassName('scene-container')];
            scenes.forEach(scene => scene.style.display = 'none');
            scene.style.display = 'initial';
            $kt.uiHelper.setSettingsClass(scene.dataset.settingsClass, scenes.map(scene => scene.dataset.settingsClass));
        }

        static backToTitle() {
            $kt.uiHelper.switchToScene($kt.titleUi._titleScene);
            $kt.uiHelper.hideSettings();
            $kt.settingsUi._settingsDiv.ontransitionend = event => {
                if (event.target === $kt.settingsUi._settingsDiv) {
                    $kt.titleUi.startTitleScene();
                    $kt.settingsUi._settingsDiv.ontransitionend = null;
                }
            };
        }

        static showMenu(menuElement) {
            const defaultItem = document.getElementById(menuElement.dataset.defaultItem);
            menuElement.classList.remove('hidden');
            [...document.getElementsByClassName('for-' + menuElement.id)]
                .forEach(element => element.classList.remove('hidden'));
            $kt.uiHelper.focusDefaultMenuItem(defaultItem);
        }

        static hideMenu(menuElement) {
            menuElement.classList.add('hidden');
            [...document.getElementsByClassName('for-' + menuElement.id)]
                .forEach(element => element.classList.add('hidden'));
        }

        /**
         * 
         * @param {string} className Class name to be added
         * @param {[string]} allSettingsClassNames Class names to be removed before adding the new one
         */
        static setSettingsClass(className, allSettingsClassNames) {
            $kt.settingsUi._settingsDiv.classList.remove(...allSettingsClassNames);
            $kt.settingsUi._settingsDiv.classList.add(className);
        }

        static isSettingsButton(element) {
            return $kt.settingsUi._settingsButton.contains(element);
        }

        static focusTemporarily(element) {
            return $kt.ui.focusTemporarily(element);
        }

        static toggleFullscreen() {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
        }

        /**
         * 
         * @param {$kt.enums.SUBMIT_BUTTON} visibility 
         */
        static adjustMobileOnlyElementsVisibility(visibility) {
            const adjustVisibilityFunction = $kt.uiHelper._createAdjustVisibilityFunction(visibility);
            [...document.getElementsByClassName('mobile-only')]
                .forEach(adjustVisibilityFunction);
        }

        /**
         * 
         * @param {$kt.enums.SUBMIT_BUTTON} visibility 
         */
        static _createAdjustVisibilityFunction(visibility) {
            const { AUTO, NEVER, ALWAYS } = $kt.enums.SUBMIT_BUTTON;
            switch (visibility) {
                case AUTO:
                    return element => element.style.removeProperty('display');
                case NEVER:
                    return element => element.style.display = 'none';
                case ALWAYS:
                    return element => element.style.display = 'initial';
            }
        }

        static initializeHintSelects(initialHintsNumber) {
            $kt.settingsUi._hintSelect.innerHTML = '';
            $kt.gameUi._hintSelect.innerHTML = '';
            const maxHints = Math.min(initialHintsNumber, $kt.hints.length);
            for (let hintIndex = 0; hintIndex < maxHints; hintIndex++) {
                $kt.uiHelper.addNewHintToSelects(hintIndex);
            }
        }

        static addNewHintToSelects(newHintIndex) {
            this._addNewHintToSelect($kt.settingsUi._hintSelect, newHintIndex);
            this._addNewHintToSelect($kt.gameUi._hintSelect, newHintIndex);
        }

        static _addNewHintToSelect(select ,newHintIndex) {
            const option = document.createElement('option');
            option.value = newHintIndex;
            option.text = $kt.hints[newHintIndex].name;
            select.add(option, 0);
        }

    }

    $kt.uiHelper = KantoreUiHelper;

})();