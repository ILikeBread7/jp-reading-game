import { dialogue } from './dialogue-ui.js';
import { gameUi } from './game-ui.js';

globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

const REFOCUS_TIME = 10;

// KantoreUiHelper has access to private fields
// of this class (friend class)
class KantoreUi {

    constructor() {
        this._loadingLayers = 0;
        this._getAllElements();
        this._addEventListeners();
        this._animateDetails();
        this._initBackgroundPaticles();
    }

    showLoading() {
        if (this._loadingLayers === 0) {
            $kt.uiHelper.showOverlayElement(this._loadingDiv);
        }
        this._loadingLayers++;
    }

    hideLoading() {
        this._loadingLayers--;
        if (this._loadingLayers === 0) {
            $kt.uiHelper.hideOverlayElement(this._loadingDiv);
        }
    }

    hideStartupLoading() {
        this._loadingDiv.classList.remove('startup-loading');
    }

    _getAllElements() {
        this._loadingDiv = document.getElementById('loading');
        this._fullscreenButton = document.getElementById('fullscreen-button');
        this._nowPlaying = document.getElementById('now-playing');
        this._nowPlayingText = document.getElementById('now-playing-text');
    }

    _addEventListeners() {
        this._preventMenuItemUnfocus();

        document.addEventListener('keypress', this._documentEnterEventListener.bind(this));
        document.addEventListener('keydown', this._charEventListener.bind(this));
        document.addEventListener('click', this._documentClickEventListener.bind(this));

        [
            ...document.getElementsByClassName('menu-item'),
            ...document.getElementsByClassName('menu-item-label')
        ].forEach(element => {
            element.addEventListener('mouseenter', () => $kt.uiHelper.focusSelectedMenuItem(element));
            
            if (element.tagName === 'SELECT') {
                element.addEventListener('keypress', event => {
                    if (event.key === 'Enter') {
                        element.showPicker();
                    }
                });
            }

            if (element.type === 'checkbox') {
                element.addEventListener('keypress', event => {
                    if (event.key === 'Enter') {
                        element.click();
                    }
                });
            }

            const menuElement = this._findParentMenu(element);
            const elementId = element.id;
            element.addEventListener('focus', () => menuElement.dataset.lastUsedItem = elementId);
        });

        const menuItemPressedListenerCreator = element => {
            const se = (() => {
                const datasetSe = element.dataset.se;
                if (datasetSe) {
                    return $kt.audio.seTracks[datasetSe];
                }

                return element.hasAttribute('data-close-button') || element.classList.contains('back-button')
                    ? $kt.audio.seTracks.CANCEL
                    : $kt.audio.seTracks.CONFIRM;
            })();
            
            return () => $kt.audio.playEffect(se);
        }

        [
            ...document.getElementsByClassName('menu-button'),
            ...document.getElementsByClassName('icon-button')
        ].forEach(element => element.addEventListener('click', menuItemPressedListenerCreator(element)));

        [
            ...document.getElementsByClassName('menu-checkbox'),
            ...document.getElementsByTagName('select')
        ]
            .forEach(element => element.addEventListener('change', menuItemPressedListenerCreator(element)));
        
        [...document.getElementsByClassName('menu-destination-button')]
            .forEach(button => button.addEventListener('click', () => {
                const destination = document.getElementById(button.dataset.destination);
                $kt.uiHelper.hideMenu(button.parentNode);
                $kt.uiHelper.showMenu(destination);
            }));

        this._fullscreenButton.addEventListener('click', event => {
            $kt.uiHelper.toggleFullscreen();
            event.stopPropagation();
        });
        document.addEventListener('fullscreenchange', this._toggleFullscreenIcon.bind(this));

        this._nowPlaying.addEventListener('animationend', event => {
            if (event.target !== this._nowPlaying) {
                return;
            }

            this._nowPlaying.classList.remove('slide-transform');
        });

        $kt.audio.events.addEventListener($kt.audio.eventNames.BGM_STARTED, ({ detail }) => {
            this._nowPlayingText.textContent = `${detail.displayName} by ${detail.author}`;
            this._nowPlaying.classList.add('slide-transform');
        });
    }

    _toggleFullscreenIcon() {
        const fullscreenIcon = this._fullscreenButton.firstElementChild;
        const currentIconSrc = fullscreenIcon.src;
        fullscreenIcon.src = fullscreenIcon.dataset.exitIcon;
        fullscreenIcon.dataset.exitIcon = currentIconSrc;
    }

    focusTemporarily(element) {
        this._saveMenuItemToRefocus();
        element.focus({ focusVisible: false });
        this._refocusSavedMenuItem();
    }

    _preventMenuItemUnfocus() {
        document.body.addEventListener('pointerdown', this._saveMenuItemToRefocus.bind(this));
        document.body.addEventListener('pointerup', this._refocusSavedMenuItem.bind(this));
    }

    _saveMenuItemToRefocus() {
        if (
            document.activeElement
            && document.activeElement.tagName !== 'SELECT'
            && document.activeElement.classList.contains('menu-item')
        ) {
            this._elementToReactivate = document.activeElement;
            this._elementToReactivate.classList.add('to-refocus');
        }
    }

    _refocusSavedMenuItem() {
        setTimeout(() => {
            if (this._elementToReactivate) {
                if (!document.activeElement || !document.activeElement.classList.contains('menu-item')) {
                    $kt.uiHelper.focusMenuItem(this._elementToReactivate);
                }
                this._elementToReactivate.classList.remove('to-refocus');
                this._elementToReactivate = null;
            }
        }, REFOCUS_TIME);
    }

    _documentEnterEventListener(event) {
        if (event.key !== 'Enter' || this._isMenuItemFocused() || this._isLoadingVisible()) {
            return;
        }

        if (dialogue.enterListener(event))  {
            return;
        }

        if ($kt.titleUi.enterListener(event)) {
            return;
        }

        if (gameUi.enterListener(event)) {
            return;
        }
    }

    _charEventListener(event) {
        const key = event.key;

        if (key === 'Tab') {
            $kt.settingsUi.tabEventListener();
            event.preventDefault();
        }

        if (this._isMenuItemFocused()) {
            if (key === 'Shift') {
                const parentMenu = this._findParentMenu(document.activeElement);
                if (parentMenu.hasAttribute('data-no-back-button')) {
                    return;
                }

                const dataset = parentMenu.dataset;

                if (!dataset.backButton) {
                    const backButton = parentMenu.getElementsByClassName('back-button')[0];
                    if (backButton) {
                        dataset.goBackButton = backButton.id;
                        backButton.click();
                    }
                    return;
                }

                const backButton = dataset.backButton;
                if (backButton) {
                    document.getElementById(backButton).click();
                    return;
                }
            }

            if ($kt.titleUi.keyListener(key)) {
                return;
            }

            if (key === 'ArrowUp') {
                $kt.uiHelper.focusSelectedMenuItem(this._findPreviousMenuItem(document.activeElement));
                event.preventDefault();
            } else if (key === 'ArrowDown') {
                $kt.uiHelper.focusSelectedMenuItem(this._findNextMenuItem(document.activeElement));
                event.preventDefault();
            }

            return;
        }

        if (this._isLoadingVisible()) {
            return;
        }

        if (gameUi.keyListener(key)) {
            return;
        }
    }

    _findParentMenu(element) {
        let node = element;

        while (!node.classList.contains('menu')) {
            node = node.parentNode;
        }

        return node;
    }

    _findNextMenuItem(startElement) {
        return this._findMenuItem(startElement, element => element.nextElementSibling, element => element.parentNode.firstElementChild);
    }

    _findPreviousMenuItem(startElement) {
        return this._findMenuItem(startElement, element => element.previousElementSibling, element => element.parentNode.lastElementChild);
    }

    _findMenuItem(startElement, getNextElementFunction, getDefaultElementFunction) {
        if (startElement.parentNode.classList.contains('menu-item-label')) {
            startElement = startElement.parentNode;
        }
        let element = startElement;

        do {
            element = getNextElementFunction(element);
        } while (element && !this._isElementMenuItem(element));
        
        if (!element && getDefaultElementFunction) {
            element = getDefaultElementFunction(startElement);
            if (!this._isElementMenuItem(element)) {
                element = this._findMenuItem(element, getNextElementFunction);
            }
        }

        return element;
    }

    _isElementMenuItem(element) {
        return element && (element.classList.contains('menu-item') || element.classList.contains('menu-item-label')) && element.checkVisibility() && !element.disabled;
    }
    
    _documentClickEventListener(event) {
        if ($kt.uiHelper.isSettingsVisible()) {
            return;
        }

        const target = event.target;

        if (dialogue.clickListener(target)) {
            return;
        }
        
        if ($kt.uiHelper.isSettingsButton(target)) {
            return;
        }

        if (gameUi.clickListener(target)) {
            return;
        }

        if ($kt.titleUi.clickListener()) {
            return;
        }
    }
    
    _animateDetails() {
        const detailsElements = document.getElementsByTagName('details');
        [...detailsElements].forEach(details => {
                const summary = details.firstElementChild;

                summary.addEventListener('click', event => {
                    event.preventDefault();
                    $kt.settings[details.dataset.settingName] = !details.open;
                })

                details.addEventListener('animationend', event => {
                    if (event.animationName === 'close') {
                        details.open = false;
                        details.classList.remove('closing');
                    }
                });
            }
        );
    }

    _initBackgroundPaticles() {
        if (particlesJS) {
            particlesJS.load('particles-js', 'particlesjs-config.json');
        } else {
            console.error('particles.js was not loaded!', `particlesJS object is ${particlesJS}`);
        }
    }

    _isMenuItemFocused() {
        const focusedItem = document.activeElement
        return focusedItem && focusedItem.classList.contains('menu-item');
    }

    _isLoadingVisible() {
        return this._loadingDiv.checkVisibility({ visibilityProperty: true });
    }

}

$kt.ui = new KantoreUi();