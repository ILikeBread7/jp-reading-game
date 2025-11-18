import { audio } from './audio.js';
import { KantoreUiHelper } from './ui-helper.js';

class KantoreDialogue {

    constructor() {
        this._closeListener = null;
        this._getAllElements();
        this._addEventListeners();
    }

    _getAllElements() {
        this._dialogue = document.getElementById('dialogue');
        this._title = document.getElementById('dialogue-title');
        this._content = document.getElementById('dialogue-content');
        this._text = document.getElementById('dialogue-text');
        this._closeButton = document.getElementById('dialogue-close-button');
    }

    _addEventListeners() {
        this._closeButton.addEventListener('click', this.close.bind(this));
    }

    enterListener() {
        return this._eventListener();
    }

    clickListener(target) {
        return this._eventListener(target);
    }

    _eventListener(target) {
        if (!this.isVisible()) {
            return false;
        }

        if (
            !target
            || !this._content.contains(target)
        ) {
            this.close();
        }

        return true;
    }

    /**
     * 
     * @param {string} title 
     * @param {string} text 
     * @param {() => void} closeListener 
     */
    show(title, text, closeListener) {
        this._title.innerHTML = title;
        this._text.innerHTML = text;
        this._closeListener = closeListener;
        KantoreUiHelper.showOverlayElement(this._dialogue);
    }

    /**
     * 
     * @param {string} title 
     * @param {string[]} texts 
     * @param {() => void} closeListener 
     */
    showSequence(title, texts, closeListener) {
        let index = 0;

        const helper = () => {
            this.show(
                title,
                texts[index],
                index === texts.length - 1
                    ? closeListener
                    : microTaskedHelper
            );

            index++;
        }
        const microTaskedHelper = () => queueMicrotask(helper);

        helper();
    }

    close() {
        if (!this.isVisible()) {
            return;
        }

        KantoreUiHelper.hideOverlayElement(this._dialogue);
        audio.playEffect(audio.seTracks.CONFIRM);
        if (this._closeListener) {
            this._closeListener();
            this._closeListener = null;
        }
    }

    forceClose() {
        if (!this.isVisible()) {
            return;
        }
        
        KantoreUiHelper.hideOverlayElement(this._dialogue);
        this._closeListener = null;
    }

    isVisible() {
        return this._dialogue.checkVisibility({ visibilityProperty: true });
    }

}

export const dialogue = new KantoreDialogue();