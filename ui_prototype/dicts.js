'use strict';

var $kt = $kt || {};

(() => {

    const NUMBER_OF_LEVELS = $kt.levels.maxLevel;

    const [ HIRAGANA_LEVELS_START, HIRAGANA_LEVELS_END ] = $kt.levels.hiraganaLevelsRange;
    const [ KATAKANA_LEVELS_START, KATAKANA_LEVELS_END ] = $kt.levels.katakanaanaLevelsRange;
    const LEVELS_CATEGORY = {
        name: 'Levels', entries: (() => {
            const levels = [
                { name: 'All levels', level: NUMBER_OF_LEVELS + 1 },
            ];
            for (let level = 1; level <= NUMBER_OF_LEVELS; level++) {
                levels.push({ name: $kt.levels.getLevelName(level), level });
            }
            return levels;
        })(),
        complexEntries: [
            { name: 'All hiragana levels', tag: 'level-hiragana-all', levelStart: HIRAGANA_LEVELS_START, levelEnd: HIRAGANA_LEVELS_END },
            { name: 'All katakana levels', tag: 'level-katakana-all', levelStart: KATAKANA_LEVELS_START, levelEnd: KATAKANA_LEVELS_END }
        ]
    }

    const INFORMAL = {
        name: 'Informal expressions', entries: [
            { name: 'Slang', tag: 'sl' },
            { name: 'Manga slang', tag: 'm-sl' },
            { name: 'Internet slang', tag: 'net-sl' },
            { name: 'Vulgar', tag: 'vulg' }
        ],
        complexEntries: [
            { name: 'All informal expressions', tag: 'informal-all' }
        ]
    };

    const DIALECTS = {
        name: 'Dialects', entries: [
            { name: 'Brazilian', tag: 'bra' },
            { name: 'Hokkaido-ben', tag: 'hob' },
            { name: 'Kansai-ben', tag: 'ksb' },
            { name: 'Kantou-ben', tag: 'ktb' },
            { name: 'Kyoto-ben', tag: 'kyb' },
            { name: 'Kyuushuu-ben', tag: 'kyu' },
            { name: 'Nagano-ben', tag: 'nab' },
            { name: 'Osaka-ben', tag: 'osb' },
            { name: 'Ryuukyuu-ben', tag: 'rkb' },
            { name: 'Touhoku-ben', tag: 'thb' },
            { name: 'Tosa-ben', tag: 'tsb' },
            { name: 'Tsugaru-ben', tag: 'tsug' }
        ], complexEntries: [
            { name: 'All dialects', tag: 'dialects-all' }
        ]
    };

    const JLPT = {
        name: 'JLPT', entries: [
            { name: 'JLPT N5 vocabulary', tag: 'v5' },
            { name: 'JLPT N4 vocabulary', tag: 'v4' },
            { name: 'JLPT N3 vocabulary', tag: 'v3' },
            { name: 'JLPT N2 vocabulary', tag: 'v2' },
            { name: 'JLPT N1 vocabulary', tag: 'v1' },
            { name: 'JLPT N5 kanji', tag: 'k5' },
            { name: 'JLPT N4 kanji', tag: 'k4' },
            { name: 'JLPT N3 kanji', tag: 'k3' },
            { name: 'JLPT N2 kanji', tag: 'k2' },
            { name: 'JLPT N1 kanji', tag: 'k1' }
        ],
        complexEntries: [
            { name: 'All JLPT', tag: 'jlpt-all' },
            { name: 'All JLPT vocabulary', tag: 'jlpt-v', tags: [ 'v5', 'v4', 'v3', 'v2', 'v1' ] },
            { name: 'All JLPT kanji', tag: 'jlpt-k', tags: [ 'k5', 'k4', 'k3', 'k2', 'k1' ] }
        ]
    };

    const OTHER = {
        name: 'Other', entries: [
            { name: 'Idiomatic expression', tag: 'id' },
            { name: 'Proverb', tag: 'proverb' },
            { name: 'Archaic', tag: 'arch' },
            { name: 'Ateji', tag: 'ateji' }
        ]
    };

    const CATEGORIES = [
        LEVELS_CATEGORY,
        INFORMAL,
        DIALECTS,
        JLPT,
        OTHER
    ];

    const CATEGORY_TAGS = [
        'Buddh',
        'Christn',
        'MA',
        'Shinto',
        'agric',
        'anat',
        'arch',
        'archeol',
        'archit',
        'art',
        'astron',
        'ateji',
        'audvid',
        'aviat',
        'baseb',
        'biochem',
        'biol',
        'bot',
        'boxing',
        'bra',
        'bus',
        'cards',
        'chem',
        'chmyth',
        'civeng',
        'cloth',
        'comp',
        'cryst',
        'dent',
        'dict',
        'ecol',
        'econ',
        'elec',
        'electr',
        'embryo',
        'engr',
        'ent',
        'figskt',
        'film',
        'finc',
        'fish',
        'food',
        'gardn',
        'genet',
        'geogr',
        'geol',
        'geom',
        'go',
        'golf',
        'gramm',
        'grmyth',
        'hanaf',
        'hob',
        'horse',
        'id',
        'internet',
        'jpmyth',
        'k1',
        'k2',
        'k3',
        'k4',
        'k5',
        'kabuki',
        'kpgai1',
        'kpichi1',
        'kpichi2',
        'kpnews1',
        'kpnews2',
        'kpnf01',
        'kpnf02',
        'kpnf03',
        'kpnf04',
        'kpnf05',
        'kpnf06',
        'kpnf07',
        'kpnf08',
        'kpnf09',
        'kpnf10',
        'kpnf11',
        'kpnf12',
        'kpnf13',
        'kpnf14',
        'kpnf15',
        'kpnf16',
        'kpnf17',
        'kpnf18',
        'kpnf19',
        'kpnf20',
        'kpnf21',
        'kpnf22',
        'kpnf23',
        'kpnf24',
        'kpnf25',
        'kpnf26',
        'kpnf27',
        'kpnf28',
        'kpnf29',
        'kpnf30',
        'kpnf31',
        'kpnf32',
        'kpnf33',
        'kpnf34',
        'kpnf35',
        'kpnf36',
        'kpnf37',
        'kpnf38',
        'kpnf39',
        'kpnf40',
        'kpnf41',
        'kpnf42',
        'kpnf43',
        'kpnf44',
        'kpnf45',
        'kpnf46',
        'kpnf47',
        'kpnf48',
        'kpspec1',
        'kpspec2',
        'ksb',
        'ktb',
        'kyb',
        'kyu',
        'law',
        'ling',
        'logic',
        'm-sl',
        'mahj',
        'manga',
        'math',
        'mech',
        'med',
        'met',
        'mil',
        'min',
        'mining',
        'motor',
        'music',
        'nab',
        'net-sl',
        'noh',
        'notag',
        'ornith',
        'osb',
        'paleo',
        'pathol',
        'pharm',
        'phil',
        'photo',
        'physics',
        'physiol',
        'politics',
        'print',
        'proverb',
        'prowres',
        'psy',
        'psyanal',
        'psych',
        'rail',
        'rkb',
        'rommyth',
        'rpgai1',
        'rpgai2',
        'rpichi1',
        'rpichi2',
        'rpnews1',
        'rpnews2',
        'rpnf01',
        'rpnf02',
        'rpnf03',
        'rpnf04',
        'rpnf05',
        'rpnf06',
        'rpnf07',
        'rpnf08',
        'rpnf09',
        'rpnf10',
        'rpnf11',
        'rpnf12',
        'rpnf13',
        'rpnf14',
        'rpnf15',
        'rpnf16',
        'rpnf17',
        'rpnf18',
        'rpnf19',
        'rpnf20',
        'rpnf21',
        'rpnf22',
        'rpnf23',
        'rpnf24',
        'rpnf25',
        'rpnf26',
        'rpnf27',
        'rpnf28',
        'rpnf29',
        'rpnf30',
        'rpnf31',
        'rpnf32',
        'rpnf33',
        'rpnf34',
        'rpnf35',
        'rpnf36',
        'rpnf37',
        'rpnf38',
        'rpnf39',
        'rpnf40',
        'rpnf41',
        'rpnf42',
        'rpnf43',
        'rpnf44',
        'rpnf45',
        'rpnf46',
        'rpnf47',
        'rpnf48',
        'rpspec1',
        'rpspec2',
        'shogi',
        'ski',
        'sl',
        'sports',
        'stat',
        'stockm',
        'sumo',
        'surg',
        'telec',
        'thb',
        'tradem',
        'tsb',
        'tsug',
        'tv',
        'v1',
        'v2',
        'v3',
        'v4',
        'v5',
        'vet',
        'vidg',
        'vulg',
        'zool'
    ];

    class BaseDict {

        /**
         * 
         * @param {string} name 
         * @param {Promise<[] | undefined>} promise 
         * @param {[] | undefined} data 
         */
        constructor(name, promise, data) {
            this._name = name;
            this._promise = promise;
            
            if (data) {
                this._data = data;
            } else if (promise) {
                promise.then(data => this._data = data);
            }
        }

        preload() {
            this.load();
        }

        async load() {
            if (this._promise) {
                return this._promise;
            }
            
            return this._promise = fetch(`dicts/${this._name}.json`)
                .then(data => data.json())
                .then(data => {
                    this._data = Object.freeze(data);
                    return this._data;
                })
                .catch(err => {
                    console.error(err);
                    delete this._promise;
                });
        }

        get isLoaded() {
            return !!this._data;
        }

        get data() {
            return this._data;
        }

        filter(filter) {
            if (this.isLoaded) {
                return new BaseDict(
                    this._name,
                    this._promise,
                    this._data.filter(filter)
                );
            }
            
            return new BaseDict(
                this._name,
                this.load().then(() => this._data.filter(filter))
            );
        }

    }

    class ComplexDict {

        constructor(subdicts) {
            this._data = [];
            this._subdicts = subdicts;
            this._notYetLoadedSubdicts = new Set(subdicts);
            this._keepLoading = false;
        }

        preload() {
            if (this.isLoaded) {
                return;
            }

            this._keepLoading = false;
            this._promise = this._loadNextSubdict()
                .catch(err => {
                    console.error(err);
                    delete this._promise;
                });
        }

        async load() {
            this._addAlreadyLoadedSubdicts();
            this._keepLoading = true;
            const promise = this._loadNextSubdict();
            this._promise ??= promise;
            return this._promise;
        }

        stopLoading() {
            this._keepLoading = false;
        }

        get isLoaded() {
            this._addAlreadyLoadedSubdicts();
            return this._data.length > 0;
        }

        get data() {
            return this._data;
        }

        get isComplex() {
            return true;
        }

        async _loadNextSubdict() {
            if (this._notYetLoadedSubdicts.size === 0) {
                return Promise.resolve();
            }

            const subdict = this._notYetLoadedSubdicts.values().next().value;
            return subdict.load().then(() => {
                if (this._notYetLoadedSubdicts.delete(subdict)) {
                    this._data.push(...subdict.data);
                }

                if (this._keepLoading) {
                    this._loadNextSubdict();
                }
            });
        }

        _addAlreadyLoadedSubdicts() {
            this._notYetLoadedSubdicts.forEach(subdict => {
                if (subdict.isLoaded) {
                    this._notYetLoadedSubdicts.delete(subdict);
                    this._data.push(...subdict.data);
                }
            });
        }

    }

    class KantoreDicts {

        constructor() {
            this._dicts = new Map();
            this._createLevelDicts();
            this._createCategoryDicts();
            Object.freeze(this._dicts);
        }

        /**
         * 
         * @param {number} level 
         * @returns {BaseDict | undefined}
         */
        getLevelDict(level) {
            return this._levelDicts[level - 1];
        }

        /**
         * 
         * @param {string} tag 
         * @returns {BaseDict | undefined}
         */
        getCategoryDict(tag) {
            return this._dicts.get(tag);
        }

        get categories() {
            return CATEGORIES;
        }

        _createLevelDicts() {
            this._levelDicts = [];

            for (let i = 1; i <= NUMBER_OF_LEVELS; i++) {
                const dictName = `L${i.toString().padStart(3, '0')}`;
                const dict = new BaseDict(dictName);
                this._levelDicts.push(dict);
                this._dicts.set(dictName, dict);
            }

            // Add dict to be used after all levels are finished
            const finalDict = new ComplexDict(this._shuffle([...this._levelDicts])); // Copying the array to not modify the original
            this._levelDicts.push(finalDict);
            Object.freeze(this._levelDicts);
        }

        _createCategoryDicts() {
            CATEGORIES.forEach(category => {
                category.entries.forEach(({ tag, level }) => {
                    if (level) {
                        return;
                    }

                    this._dicts.set(tag, new BaseDict(tag));
                });

                if (category.complexEntries) {
                    category.complexEntries.forEach(({ tag, tags, levelStart, levelEnd = NUMBER_OF_LEVELS }) => {
                        if (levelStart) {
                            const levelsSubdicts = [];
                            for (let level = levelStart; level <= levelEnd; level++) {
                                levelsSubdicts.push(this.getLevelDict(level));
                            }
                            
                            this._dicts.set(tag, new ComplexDict(this._shuffle(levelsSubdicts)));
                            return;
                        }
                        
                        // If there are no tags it's the "All" entry
                        const dictTags = tags || category.entries.map(({ tag }) => tag);

                        this._dicts.set(tag, new ComplexDict(
                            this._shuffle(dictTags).map(tag => this.getCategoryDict(tag))
                        ));
                    });

                    category.entries.unshift(...category.complexEntries);
                    delete category.complexEntries;
                }

            });

            Object.freeze(CATEGORIES);
        }

        /**
         * 
         * @param {[]} array 
         * @returns {[]} The same array shuffled in place
         */
        _shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                
                const tmp = array[i];
                array[i] = array[randomIndex];
                array[randomIndex] = tmp;
            }

            return array;
        }

    }

    $kt.dicts = new KantoreDicts();

})();