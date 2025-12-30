import { audio } from './audio.js';
import { KantoreUiHelper } from './ui-helper.js';

const ACTIVE_CLASS_NAME = 'active';
const FOCUS_TIMEOUT = 100;

class KantoreDialogue {

    constructor() {
        this._closeListener = null;
        this._popovers = null;
        this._getAllElements();
        this._addEventListeners();
    }

    _getAllElements() {
        this._dialogue = document.getElementById('dialogue');
        this._title = document.getElementById('dialogue-title');
        this._content = document.getElementById('dialogue-content');
        this._text = document.getElementById('dialogue-text');
        this._textContent = document.getElementById('dialogue-text-content');
        this._closeButton = document.getElementById('dialogue-close-button');
        this._nextButton = document.getElementById('dialogue-next-button');
    }

    _addEventListeners() {
        const closeFunction = this.close.bind(this);
        this._closeButton.addEventListener('click', closeFunction);
        this._nextButton.addEventListener('click', closeFunction);
        this._textContent.addEventListener('scroll', this._repositionPopoversOnScroll.bind(this));
        window.addEventListener('resize', () => {
            this._positionPopovers();
            this._repositionPopoversOnScroll();
        });
    }

    enterListener() {
        return this._eventListener();
    }

    clickListener(target) {
        return this._eventListener(target);
    }

    keyListener(key) {
        if (!this.isVisible()) {
            return false;
        }

        switch (key) {
            case 'Shift':
                return this._shiftListener();
            case ' ':   // Space
                this.close();
                return true;
        }

        return false;
    }

    _shiftListener() {
        const popovers = this._popovers;
        if (!popovers || popovers.length === 0) {
            return true;
        }

        const currentActiveIndex = popovers
            .findIndex(popover => popover.classList.contains(ACTIVE_CLASS_NAME));
        if (currentActiveIndex >= 0) {
            const current = popovers[currentActiveIndex];
            current.classList.remove(ACTIVE_CLASS_NAME);
        }

        const next = popovers[currentActiveIndex + 1];
        if (next) {
            next.classList.add(ACTIVE_CLASS_NAME);
        }

        return true;
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

    _repositionPopoversOnScroll() {
        const popovers = this._popovers;
        if (!popovers || popovers === 0) {
            return;
        }

        const top = this._textContent.scrollTop;
        popovers.forEach(popover => {
            popover.style.setProperty('--top-offset', `${-top}px`);
        });
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
        // Prevent underlying menu button
        // from being "clicked" on enter
        // sometimes doesn't work without microtask
        queueMicrotask(() => {
            const focusedItem = document.activeElement;
            if (focusedItem) {
                focusedItem.blur();
            }
        });

        this._title.innerHTML = title;
        this._text.innerHTML = text;
        this._closeListener = closeListener;
        KantoreUiHelper.showOverlayElement(this._dialogue);
        this._addPopoverClickListeners();
        this._textContent.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setTimeout(this.focus.bind(this), FOCUS_TIMEOUT);
    }

    _addPopoverClickListeners() {
        const popovers = [...this._text.getElementsByClassName('popover')];
        this._popovers = popovers;

        const clickListener = event => {
            const target = event.target;
            popovers.forEach(popover => {
                if (target === popover) {
                    popover.classList.toggle(ACTIVE_CLASS_NAME);
                } else {
                    popover.classList.remove(ACTIVE_CLASS_NAME)
                }
            });
        };

        popovers.forEach(popover => {
            popover.addEventListener('click', clickListener);
        });
        this._positionPopovers();
    }

    _positionPopovers() {
        const popovers = this._popovers;
        if (!popovers || popovers.length === 0) {
            return;
        }

        const containerWidth = this._text.clientWidth;

        const OFFSET_PROPERTY = '--left-offset';
        popovers.forEach(popover => {
            const popoverStyle = getComputedStyle(popover, '::before');
            const popoverWidth = parseFloat(popoverStyle.width);
            const rightBound = popoverWidth + parseFloat(popoverStyle.left);
            const margin = parseFloat(popoverStyle.fontSize) * 0.75;    // 0.75em

            if (rightBound > containerWidth) {
                const offsetPx = -(rightBound - containerWidth);
                const offsetValue = popoverWidth >= containerWidth - margin * 2
                    ? `${offsetPx}px`
                    : `${offsetPx - margin}px`;

                popover.style.setProperty(OFFSET_PROPERTY, offsetValue);
            } else {
                popover.style.removeProperty(OFFSET_PROPERTY);
            }
        });
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
        this._popovers = null;
    }

    forceClose() {
        if (!this.isVisible()) {
            return;
        }
        
        KantoreUiHelper.hideOverlayElement(this._dialogue);
        this._closeListener = null;
        this._popovers = null;
    }

    isVisible() {
        return this._dialogue.checkVisibility({ visibilityProperty: true });
    }

    focus() {
        this._textContent.focus({ focusVisible: false });
    }

}

export const dialogue = new KantoreDialogue();