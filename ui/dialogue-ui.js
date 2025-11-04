globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

class KantoreDialogue {

    constructor() {
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

        this._closeListener = () => {
            if (closeListener) {
                closeListener();
            }
            delete this._closeListener;
        };

        $kt.uiHelper.showOverlayElement(this._dialogue);
    }

    close() {
        $kt.uiHelper.hideOverlayElement(this._dialogue);
        $kt.audio.playEffect($kt.audio.seTracks.CONFIRM);
        this._closeListener();
    }

    isVisible() {
        return this._dialogue.checkVisibility({ visibilityProperty: true });
    }

}

export const dialogue = new KantoreDialogue();