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
        this._nextButton = document.getElementById('dialogue-next-button');
    }

    _addEventListeners() {
        const closeFunction = this.close.bind(this);
        this._closeButton.addEventListener('click', closeFunction);
        this._nextButton.addEventListener('click', closeFunction);
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
        this._nextButton.classList.add('hidden');
        this._showIndividual(title, text, closeListener);
    }

    /**
     * 
     * @param {string} title 
     * @param {string[]} texts 
     * @param {() => void} closeListener 
     */
    showSequence(title, texts, closeListener) {
        this._nextButton.textContent = this._nextButton.dataset.textNext;
        this._nextButton.classList.remove('hidden');

        let index = 0;

        const helper = () => {
            const isLast = index === texts.length - 1;

            if (isLast) {
                this._nextButton.textContent = this._nextButton.dataset.textClose;
            }

            this._showIndividual(
                title,
                texts[index],
                isLast
                    ? closeListener
                    : microTaskedHelper
            );

            index++;
        }
        const microTaskedHelper = () => queueMicrotask(helper);

        helper();
    }

    /**
     * 
     * @param {string} title 
     * @param {string} text 
     * @param {() => void} closeListener 
     */
    _showIndividual(title, text, closeListener) {
        this._title.innerHTML = title;
        this._text.innerHTML = text;
        this._closeListener = closeListener;
        KantoreUiHelper.showOverlayElement(this._dialogue);
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