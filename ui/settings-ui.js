import { audio } from './audio.js';
import { SUBMIT_BUTTON_VISIBILITY } from './enums.js';
import { KantoreUiHelper } from './ui-helper.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

const EVENTS = $kt.settings.eventNames;

// KantoreUiHelper has access to private fields
// of this class (friend class)
class KantoreSettingsUi {

    constructor() {
        this._getAllElements();
        this._addEventListeners();
        this._addSubmitButtonOptions();
        this._connectSettings();
    }

    tabEventListener() {
        if (KantoreUiHelper.isSettingsVisible()) {
            this._hideSettingsAndPlaySound();
        } else {
            this._showSettingsAndPlaySound();
        }
    }

    _getAllElements() {
        this._settingsDiv = document.getElementById('settings');
        this._settingsContainer = document.getElementById('settings-container');
        this._settingsButton = document.getElementById('settings-button');

        this._nowPlaying = document.getElementById('settings-now-playing');

        this._bgmVolume = document.getElementById('bgm-volume');
        this._seVolume = document.getElementById('se-volume');
        
        this._showMeaning = document.getElementById('close-meaning');
        this._showHint = document.getElementById('close-hint');
        this._fullscreen = document.getElementById('settings-fullscreen');
        this._hintSelect = document.getElementById('settings-hint-select');
        this._submitButtonSelect = document.getElementById('settings-submit-button-select');

        this._backToMenu = document.getElementById('back-to-main-menu-button');
        this._returnToGame = document.getElementById('return-to-game-button');
    }

    _addEventListeners() {
        this._settingsButton.addEventListener('click', KantoreUiHelper.showSettings);
        this._settingsDiv.addEventListener('click', e => {
            if (!this._settingsContainer.contains(e.target)) {
                this._hideSettingsAndPlaySound();
            }
        });

        this._fullscreen.addEventListener('change', KantoreUiHelper.toggleFullscreen);
        document.addEventListener('fullscreenchange', () => this._fullscreen.checked = !!document.fullscreenElement);

        this._backToMenu.addEventListener('click', KantoreUiHelper.backToTitle);
        this._returnToGame.addEventListener('click', KantoreUiHelper.hideSettings);

        audio.events.addEventListener(audio.eventNames.BGM_STARTED, ({ detail }) => {
            this._nowPlaying.textContent = `Now playing: ${detail.displayName} by ${detail.author}`;
            this._nowPlaying.classList.remove('hidden');
        });
    }

    _addSubmitButtonOptions() {
        [
            { value: SUBMIT_BUTTON_VISIBILITY.AUTO, text: 'Auto' },
            { value: SUBMIT_BUTTON_VISIBILITY.NEVER, text: 'Always hide' },
            { value: SUBMIT_BUTTON_VISIBILITY.ALWAYS, text: 'Always show' }
        ].forEach(({ value, text }) => this._addOptionToSelect(this._submitButtonSelect, value, text));
    }

    _addOptionToSelect(select, value, text) {
        const option = document.createElement('option');
        option.value = value;
        option.text = text;
        select.add(option);
    }

    _connectSettings() {
        KantoreUiHelper.connectElementToSetting(EVENTS.BGM_VOLUME, this._bgmVolume);
        KantoreUiHelper.connectElementToSetting(EVENTS.SE_VOLUME, this._seVolume, () => audio.playEffect(audio.seTracks.SELECT));
        KantoreUiHelper.connectElementToSetting(EVENTS.SHOW_MEANING, this._showMeaning);
        KantoreUiHelper.connectElementToSetting(EVENTS.SHOW_HINT, this._showHint);
        KantoreUiHelper.connectElementToSetting(EVENTS.SHOW_SUBMIT_BUTTON, this._submitButtonSelect);
        KantoreUiHelper.connectElementToSetting(EVENTS.CURRENT_HINT_INDEX, this._hintSelect);
    }

    _showSettingsAndPlaySound() {
        KantoreUiHelper.showSettings();
        audio.playEffect(audio.seTracks.CONFIRM);
    }

    _hideSettingsAndPlaySound() {
        KantoreUiHelper.hideSettings();
        audio.playEffect(audio.seTracks.CANCEL);
    }

}

$kt.settingsUi = new KantoreSettingsUi();