import { dialogue } from './dialogue-ui.js';
import { gameUi } from './game-ui.js';
import { audio } from './audio.js';
import { GAME_TYPE, SUBMIT_BUTTON_VISIBILITY } from './enums.js';
import { settings } from './settings.js';
import { settingsUi } from './settings-ui.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

// Has access to private fields of
// KantoreUi, KantoreSettingsUi, KantoreGameUi and KantoreTitleUi
// to facilitate communication
// between them (friend class)
export class KantoreUiHelper {

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
                KantoreUiHelper.showMenu(firstChildElement);
                element.ontransitionend = null;
            };
        } else {
            gameUi._answerInput.blur();
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
        settingChangedListener(settings[settingName]);
        settings.events.addEventListener(settingName, event => settingChangedListener(event.detail.value));
    }

    /**
     * 
     * @param {settings.eventNames} settingName 
     * @param {HTMLElement} element 
     * @param {() => {}?} elementAdditionalListener optional
     */
    static connectElementToSetting(settingName, element, elementAdditionalListener) {
        const [ settingChangedListener, elementChangedListener ] =
            element.type === 'checkbox'
                ? [
                    value => element.checked = value,
                    () => settings[settingName] = element.checked
                ]
                : [
                    value => element.value = value,
                    () => settings[settingName] = Number(element.value)
                ];
        
        KantoreUiHelper.connectSettingToListener(settingName, settingChangedListener);
        element.addEventListener('change', elementChangedListener);
        if (elementAdditionalListener) {
            element.addEventListener('change', elementAdditionalListener);
        }
    }

    static setshowMeaningSetting(newValue) {
        settingsUi._showMeaning.checked = newValue;
        settings.showMeaning = newValue;
    }

    static setshowHintSetting(newValue) {
        settingsUi._showHint.checked = newValue;
        settings.showHint = newValue;
    }

    static isSettingsVisible() {
        return settingsUi._settingsDiv.checkVisibility({ visibilityProperty: true });
    }

    static showSettings() {
        KantoreUiHelper.showOverlayElement(settingsUi._settingsDiv);
    }

    static hideSettings() {
        KantoreUiHelper.hideOverlayElement(settingsUi._settingsDiv);
        if ($kt.titleUi._titleScene.checkVisibility()) {
            if ($kt.titleUi._credits.checkVisibility()) {
                KantoreUiHelper.showMenu($kt.titleUi._credits.parentNode);
            } else {
                $kt.titleUi.startTitleScene();
            }
        } else {
            gameUi.focusAnswerInput();
        }
    }

    static focusSelectedMenuItem(element) {
        KantoreUiHelper.focusMenuItem(element);

        // This prevents multiple sounds from focusing
        // on the same checkbox over and over again
        // directly or through a label
        if (!element.parentNode.classList.contains('menu-item-label')) {
            audio.playEffectWithCooldown(audio.seTracks.SELECT);
        }
    }

    static focusDefaultMenuItem(element) {
        KantoreUiHelper.focusMenuItem(element);
    }

    static focusMenuItem(element) {
        element.focus({ focusVisible: true });
    }

    static startGameMain() {
        gameUi.startGame(GAME_TYPE.MAIN);
        document.body.classList.add(
            'game', 'game-main'
        );
    }

    static startGamePractice(categoryName, dict) {
        gameUi.startGame(GAME_TYPE.PRACTICE, categoryName, dict);
        document.body.classList.add(
            'game', 'game-practice'
        );
    }

    static startGameArcade(categoryName, dict) {
        gameUi.startGame(GAME_TYPE.ARCADE, categoryName, dict);
        document.body.classList.add(
            'game', 'game-arcade'
        );
    }

    static _removeGameModeClasses() {
        document.body.removeAttribute('class');
    }

    static switchToScene(scene) {
        KantoreUiHelper._removeGameModeClasses();
        const scenes = [...document.getElementsByClassName('scene-container')];
        scenes.forEach(scene => scene.style.display = 'none');
        scene.style.display = 'initial';
        KantoreUiHelper.setSceneClass(scene.dataset.sceneClass, scenes.map(scene => scene.dataset.sceneClass));
    }

    static backToTitle() {
        dialogue.forceClose();
        KantoreUiHelper.switchToScene($kt.titleUi._titleScene);
        KantoreUiHelper.hideSettings();
        settingsUi._settingsDiv.ontransitionend = event => {
            if (event.target === settingsUi._settingsDiv) {
                $kt.titleUi.startTitleScene();
                settingsUi._settingsDiv.ontransitionend = null;
            }
        };
        gameUi.dispatchBackToTitleEvent();
    }

    static showMenu(menuElement) {
        menuElement.classList.remove('hidden');
        [...document.getElementsByClassName('for-' + menuElement.id)]
            .forEach(element => element.classList.remove('hidden'));
        
        const dataset = menuElement.dataset;

        if (!dataset.defaultItem) {
            const firstItem = menuElement.getElementsByClassName('menu-item')[0];
            dataset.defaultItem = firstItem.id;
            KantoreUiHelper.focusDefaultMenuItem(firstItem);
            return;
        }

        let itemToFocus = document.getElementById(dataset.lastUsedItem || dataset.defaultItem);
        if (!itemToFocus.checkVisibility()) {
            const defaultItem = document.getElementById(dataset.defaultItem);
            itemToFocus = defaultItem;
        }
        KantoreUiHelper.focusDefaultMenuItem(itemToFocus);
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
    static setSceneClass(className, allSettingsClassNames) {
        const body = document.body;
        body.classList.remove(...allSettingsClassNames);
        body.classList.add(className);
    }

    static isSettingsButton(element) {
        return settingsUi._settingsButton.contains(element);
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
     * @param {SUBMIT_BUTTON} visibility 
     */
    static adjustMobileOnlyElementsVisibility(visibility) {
        const adjustVisibilityFunction = KantoreUiHelper._createAdjustVisibilityFunction(visibility);
        [...document.getElementsByClassName('mobile-only')]
            .forEach(adjustVisibilityFunction);
    }

    /**
     * 
     * @param {SUBMIT_BUTTON} visibility 
     */
    static _createAdjustVisibilityFunction(visibility) {
        switch (visibility) {
            case SUBMIT_BUTTON_VISIBILITY.AUTO:
                return element => element.style.removeProperty('display');
            case SUBMIT_BUTTON_VISIBILITY.NEVER:
                return element => element.style.display = 'none';
            case SUBMIT_BUTTON_VISIBILITY.ALWAYS:
                return element => element.style.display = 'initial';
        }
    }

    static initializeHintSelects(initialHintsNumber) {
        settingsUi._hintSelect.innerHTML = '';
        gameUi._hintSelect.innerHTML = '';
        const maxHints = Math.min(initialHintsNumber, $kt.hints.length);
        for (let hintIndex = 0; hintIndex < maxHints; hintIndex++) {
            KantoreUiHelper.addNewHintToSelects(hintIndex);
        }
    }

    static addNewHintToSelects(newHintIndex) {
        this._addNewHintToSelect(settingsUi._hintSelect, newHintIndex);
        this._addNewHintToSelect(gameUi._hintSelect, newHintIndex);
    }

    static _addNewHintToSelect(select ,newHintIndex) {
        const option = document.createElement('option');
        option.value = newHintIndex;
        option.text = $kt.levels.getLevelName(newHintIndex + 1);
        select.add(option, 0);
    }

}