import { KantoreTemplates } from './templates.js';

class KantoreStoryModeUi {

    constructor() {

    }

    initialize() {
        this._createMenus();
    }

    _createMenus() {
        const hubMenu = [
            { name: 'Hiragana', entries: [] },
            { name: 'Katakana', entries: [] },
            { name: 'Grade 1', entries: [] },
            { name: 'Grade 2', entries: [] },
            { name: 'Grade 3', entries: [] },
            { name: 'Grade 4', entries: [] },
            { name: 'Grade 5', entries: [] },
            { name: 'Grade 6', entries: [] },
            { name: 'Junior High', entries: [] },
            { name: 'Jinmeiyo (postgame)', entries: [] },
            { name: 'Hyougai (postgame)', entries: [] },
        ];

        const hubMenuId = 'story-mode-menu';
        const parentMenuId = 'main-menu';
        const menuHtml = KantoreTemplates.storyModeMenu(hubMenuId, parentMenuId, hubMenu);
        document.body.insertAdjacentHTML('beforeend', menuHtml);
    }

}

export const storyModeUi = new KantoreStoryModeUi();