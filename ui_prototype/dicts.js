'use strict';

var $kt = $kt || {};

(() => {

    const NUMBER_OF_LEVELS = $kt.levels.maxLevel;

    const [ HIRAGANA_LEVELS_START, HIRAGANA_LEVELS_END ] = $kt.levels.hiraganaLevelsRange;
    const [ KATAKANA_LEVELS_START, KATAKANA_LEVELS_END ] = $kt.levels.katakanaanaLevelsRange;
    
    const createLevelEntries = (levelStart, levelEnd, levels = []) => {
        for (let level = levelStart; level <= levelEnd; level++) {
            levels.push({ name: $kt.levels.getLevelName(level), level });
        }
        return levels;
    };
    
    const LEVELS_HIRAGANA_CATEGORY = {
        name: 'Hiragana',
        entries: createLevelEntries(HIRAGANA_LEVELS_START, HIRAGANA_LEVELS_END),
        complexLevelEntries: [
            { name: 'All hiragana levels', tag: 'level-hiragana-all', levelStart: HIRAGANA_LEVELS_START, levelEnd: HIRAGANA_LEVELS_END }
        ]
    }

    const LEVELS_KATAKANA_CATEGORY = {
        name: 'Katakana',
        entries: createLevelEntries(KATAKANA_LEVELS_START, KATAKANA_LEVELS_END),
        complexLevelEntries: [
            { name: 'All katakana levels', tag: 'level-katakana-all', levelStart: KATAKANA_LEVELS_START, levelEnd: KATAKANA_LEVELS_END }
        ]
    }

    const LEVELS_CATEGORY = {
        name: 'Main game mode levels', entries: [
            { name: 'All levels', level: NUMBER_OF_LEVELS + 1 },
            LEVELS_HIRAGANA_CATEGORY,
            LEVELS_KATAKANA_CATEGORY
        ]
    }

    const CENSORED = {
        name: 'Sensitive expressions', entries: [
            { name: 'Derogatory', tag: 'derog' },
            { name: 'Sensitive', tag: 'sens' },
            { name: 'Vulgar', tag: 'vulg' }
        ],
        complexEntries: [
            { name: 'All sensitive expressions', tag: 'censored-all' }
        ]
    }

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

    const MEDICINE = {
        name: 'Medicine', entries: [
            { name: 'Anatomy', tag: 'anat' },
            { name: 'Embryology', tag: 'embryo' },
            { name: 'Dentistry', tag: 'dent' },
            { name: 'Biochemistry', tag: 'biochem' },
            { name: 'Genetics', tag: 'genet' },
            { name: 'Medicine', tag: 'med' },
            { name: 'Pathology', tag: 'pathol' },
            { name: 'Pharmacology', tag: 'pharm' },
            { name: 'Physiology', tag: 'physiol' },
            { name: 'Psychiatry', tag: 'psy' },
            { name: 'Psychoanalysis', tag: 'psyanal' },
            { name: 'Psychology', tag: 'psych' },
            { name: 'Surgery', tag: 'surg' },
            { name: 'Veterinary terms', tag: 'vet' }
        ],
        complexEntries: [
            { name: 'All medical terms', tag: 'medicine-all' }
        ]
    };

    const SCIENCE = {
        name: 'Science', entries: [
            { name: 'Physics', tag: 'physics' },
            { name: 'Archeology', tag: 'archeol' },
            { name: 'Astronomy', tag: 'astron' },
            { name: 'Agriculture', tag: 'agric' },
            { name: 'Botany', tag: 'bot' },
            { name: 'Chemistry', tag: 'chem' },
            { name: 'Biology', tag: 'biol' },
            { name: 'Crystallography', tag: 'cryst' },
            { name: 'Ecology', tag: 'ecol' },
            { name: 'Entomology', tag: 'ent' },
            { name: 'Geography', tag: 'geogr' },
            { name: 'Geology', tag: 'geol' },
            { name: 'Meteorology', tag: 'met' },
            { name: 'Mineralogy', tag: 'min' },
            { name: 'Ornithology', tag: 'ornith' },
            { name: 'Paleontology', tag: 'paleo' },
            { name: 'Zoology', tag: 'zool' }
        ],
        complexEntries: [
            { name: 'All scientific terms', tag: 'science-all' }
        ]
    };

    const MATHEMATICS = {
        name: 'Mathematics', entries: [
            { name: 'Geometry', tag: 'geom' },
            { name: 'Logic', tag: 'logic' },
            { name: 'Mathematics', tag: 'math' },
            { name: 'Statistics', tag: 'stat' }
        ],
        complexEntries: [
            { name: 'All mathematical terms', tag: 'mathematics-all' }
        ]
    };

    const ENGINEERING_AND_INDUSTRY = {
        name: 'Engineering and Industry', entries: [
            { name: 'Architecture', tag: 'archit' },
            { name: 'Aviation', tag: 'aviat' },
            { name: 'Civil engineering', tag: 'civeng' },
            { name: 'Computing', tag: 'comp' },
            { name: 'Electricity, elec. eng.', tag: 'elec' },
            { name: 'Electronics', tag: 'electr' },
            { name: 'Engineering', tag: 'engr' },
            { name: 'Internet', tag: 'internet' },
            { name: 'Mechanical engineering', tag: 'mech' },
            { name: 'Military', tag: 'mil' },
            { name: 'Mining', tag: 'mining' },
            { name: 'Printing', tag: 'print' },
            { name: 'Railway', tag: 'rail' },
            { name: 'Telecommunications', tag: 'telec' },
            { name: 'Clothing', tag: 'cloth' }
        ],
        complexEntries: [
            { name: 'All engineering and industry', tag: 'eng-ind-all' }
        ]
    };

    const SOCIETY = {
        name: 'Society', entries: [
            { name: 'Law', tag: 'law' },
            { name: 'Politics', tag: 'politics' },
            { name: 'Philosophy', tag: 'phil' },
            { name: 'Stock market', tag: 'stockm' }
        ],
        complexEntries: [
            { name: 'All societal terms', tag: 'society-all' }
        ]
    };

    const LINGUISTICS = {
        name: 'Linguistics', entries: [
            { name: 'Grammar', tag: 'gramm' },
            { name: 'Linguistics', tag: 'ling' }
        ],
        complexEntries: [
            { name: 'All linguistic terms', tag: 'linguistics-all' }
        ]
    };

    const ARTS = {
        name: 'Arts', entries: [
            { name: 'Art, aesthetics', tag: 'art' },
            { name: 'Audiovisual', tag: 'audvid' },
            { name: 'Film', tag: 'film' },
            { name: 'Kabuki', tag: 'kabuki' },
            { name: 'Manga', tag: 'manga' },
            { name: 'Music', tag: 'music' },
            { name: 'Noh', tag: 'noh' },
            { name: 'Photography', tag: 'photo' },
            { name: 'Television', tag: 'tv' }
        ],
        complexEntries: [
            { name: 'All artistic terms', tag: 'art-all' }
        ]
    };

    const HOBBIES = {
        name: 'Hobbies', entries: [
            { name: 'Fishing', tag: 'fish' },
            { name: 'Gardening, horticulture', tag: 'gardn' },
            { name: 'Food, cooking', tag: 'food' }
        ],
        complexEntries: [
            { name: 'All hobby terms', tag: 'hobby-all' }
        ]
    };

    const SPORTS = {
        name: 'Sports', entries: [
            { name: 'Baseball', tag: 'baseb' },
            { name: 'Boxing', tag: 'boxing' },
            { name: 'Figure skating', tag: 'figskt' },
            { name: 'Golf', tag: 'golf' },
            { name: 'Horse racing', tag: 'horse' },
            { name: 'Martial arts', tag: 'MA' },
            { name: 'Motorsport', tag: 'motor' },
            { name: 'Professional wrestling', tag: 'prowres' },
            { name: 'Skiing', tag: 'ski' },
            { name: 'Sports', tag: 'sports' },
            { name: 'Sumo', tag: 'sumo' }
        ],
        complexEntries: [
            { name: 'All sports terms', tag: 'sports-all' }
        ]
    };

    const GAMES = {
        name: 'Games', entries: [
            { name: 'Mahjong', tag: 'mahj' },
            { name: 'Card games', tag: 'cards' },
            { name: 'Go (game)', tag: 'go' },
            { name: 'Hanafuda', tag: 'hanaf' },
            { name: 'Shogi', tag: 'shogi' },
            { name: 'Video games', tag: 'vidg' }
        ],
        complexEntries: [
            { name: 'All game terms', tag: 'game-all' }
        ]
    };

    const RELIGION_AND_MYTHS = {
        name: 'Religion and Myths', entries: [
            { name: 'Buddhism', tag: 'Buddh' },
            { name: 'Chinese mythology', tag: 'chmyth' },
            { name: 'Christianity', tag: 'Christn' },
            { name: 'Greek mythology', tag: 'grmyth' },
            { name: 'Japanese mythology', tag: 'jpmyth' },
            { name: 'Roman mythology', tag: 'rommyth' },
            { name: 'Shinto', tag: 'Shinto' },
            { name: 'Deity', tag: 'dei' },
            { name: 'Legend', tag: 'leg' },
            { name: 'Mythology', tag: 'myth' }
        ],
        complexEntries: [
            { name: 'All religious and mythical terms', tag: 'reg-myth-all' }
        ]
    };

    const ECONOMICS = {
        name: 'Economics', entries: [
            { name: 'Business', tag: 'bus' },
            { name: 'Economics', tag: 'econ' },
            { name: 'Finance', tag: 'finc' }
        ],
        complexEntries: [
            { name: 'All economy terms', tag: 'economics-all' }
        ]
    };

    const PEOPLE_PLACES_AND_NAMES = {
        name: 'People, places, and names', entries: [
            { name: 'Given name or forename', tag: 'given' },
            { name: 'Company name', tag: 'company' },
            { name: 'Organization name', tag: 'organization' },
            { name: 'Full name of a particular person', tag: 'person' },
            { name: 'Place name', tag: 'place' },
            { name: 'Family or surname', tag: 'surname' }
        ],
        complexEntries: [
            { name: 'All people and place names', tag: 'people-places-all' }
        ]
    };

    const PROPER_NAMES = {
        name: 'Proper names', entries: [
            { name: 'Trademark', tag: 'tradem' },
            { name: 'Character', tag: 'char' },
            { name: 'Creature', tag: 'creat' },
            { name: 'Document', tag: 'doc' },
            { name: 'Event', tag: 'ev' },
            { name: 'Fiction', tag: 'fict' },
            { name: 'Group', tag: 'group' },
            { name: 'Object', tag: 'obj' },
            { name: 'Product name', tag: 'product' },
            { name: 'Service', tag: 'serv' },
            { name: 'Ship name', tag: 'ship' },
            { name: 'Unclassified name', tag: 'unclass' },
            { name: 'Work of art, literature, music, etc.', tag: 'work' }
        ],
        complexEntries: [
            { name: 'All proper names', tag: 'proper-names-all' }
        ]
    };

    const OLD_AND_RARE_LANGUAGE = {
        name: 'Old and rare language', entries: [
            { name: 'Archaic', tag: 'arch' },
            { name: 'Dated term', tag: 'dated' },
            { name: 'Historical term', tag: 'hist' },
            { name: 'Obsolete term', tag: 'obs' },
            { name: 'Rare term', tag: 'rare' }
        ],
        complexEntries: [
            { name: 'All old and rare terms', tag: 'old-rare-all' }
        ]
    };

    const INFORMAL_LANGUAGE = {
        name: 'Informal language', entries: [
            { name: "Children's language", tag: 'chn' },
            { name: 'Colloquial', tag: 'col' },
            { name: 'Familiar language', tag: 'fam' },
            { name: 'Female term or language', tag: 'fem' },
            { name: 'Jocular, humorous term', tag: 'joc' },
            { name: 'Manga slang', tag: 'm-sl' },
            { name: 'Male term or language', tag: 'male' },
            { name: 'Internet slang', tag: 'net-sl' },
            { name: 'Slang', tag: 'sl' }
        ],
        complexEntries: [
            { name: 'All informal expressions', tag: 'informal-all' }
        ]
    };

    const FORMAL_AND_LITERARY_LANGUAGE = {
        name: 'Formal and literary language', entries: [
            { name: 'Formal or literary term', tag: 'form' },
            { name: 'Honorific or respectful (sonkeigo) language', tag: 'hon' },
            { name: 'Humble (kenjougo) language', tag: 'hum' },
            { name: 'Poetical term', tag: 'poet' },
            { name: 'Polite (teineigo) language', tag: 'pol' }
        ],
        complexEntries: [
            { name: 'All formal expressions', tag: 'formal-all' }
        ]
    };

    const EXPRESSIONS = {
        name: 'Expressions', entries: [
            { name: 'Ateji', tag: 'ateji' },
            { name: 'Euphemistic', tag: 'euph' },
            { name: 'Abbreviation', tag: 'abbr' },
            { name: 'Idiomatic expression', tag: 'id' },
            { name: 'Onomatopoeic or mimetic word', tag: 'on-mim' },
            { name: 'Proverb', tag: 'proverb' },
            { name: 'Quotation', tag: 'quote' },
            { name: 'Yojijukugo', tag: 'yoji' },
            { name: 'Usually written using kana alone', tag: 'uk' }
        ],
        complexEntries: [
            { name: 'All expressions', tag: 'expressions-all' }
        ]
    };

    const CATEGORIES = [
        LEVELS_CATEGORY,
        {
            name: 'General language',
            entries: [
                INFORMAL_LANGUAGE,
                FORMAL_AND_LITERARY_LANGUAGE,
                DIALECTS,
                PEOPLE_PLACES_AND_NAMES,
                PROPER_NAMES,
                OLD_AND_RARE_LANGUAGE,
                EXPRESSIONS,
                JLPT
            ],
            complexEntries: [
                { name: 'All general language', tag: 'general-all' }
            ]
        },
        {
            name: 'Sports, Games, and Hobbies',
            entries: [
                SPORTS,
                GAMES,
                HOBBIES
            ],
            complexEntries: [
                { name: 'All sports, games, and hobbies', tag: 'sports-games-hobbies-all' }
            ]
        },
        {
            name: 'Humanities',
            entries: [
                SOCIETY,
                ARTS,
                LINGUISTICS,
                RELIGION_AND_MYTHS,
                ECONOMICS
            ],
            complexEntries: [
                { name: 'All humanistic terms', tag: 'humanities-all' }
            ]
        },
        {
            name: 'Sciences and Mathematics',
            entries: [
                SCIENCE,
                MEDICINE,
                MATHEMATICS
            ],
            complexEntries: [
                { name: 'All sciences and mathematics', tag: 'science-math-all' }
            ]
        },
        ENGINEERING_AND_INDUSTRY
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
            CATEGORIES.forEach(this._addDicts.bind(this));
            
            const globalAllEntry = new ComplexDict(
                this._shuffle(
                    this._dicts.values()
                        .filter(dict => !dict.isComplex)
                        .toArray()
                )
            );
            const globalAllTag = 'global-all';
            this._dicts.set(globalAllTag, globalAllEntry);
            CATEGORIES.unshift({ name: 'All terms and expressions', tag: globalAllTag });
            
            this._addDicts(CENSORED);
            CATEGORIES.push(CENSORED);

            Object.freeze(CATEGORIES);
        }

        _addDicts(category) {
            const addDictsInner = category => {
                if (category.level) {
                    return;
                }
    
                const tag = category.tag;
                if (tag) {
                    this._dicts.set(tag, new BaseDict(tag));
                    return;
                }
    
                if (category.entries) {
                    category.entries.forEach(addDictsInner);
                }
    
                if (category.complexEntries) {
                    category.complexEntries.forEach(({ tag, tags }) => {
                        // If there are no tags it's the "All" entry
                        const dictTags = tags || this._findAllTags(category);
    
                        this._dicts.set(tag, new ComplexDict(
                            this._shuffle(dictTags).map(tag => this.getCategoryDict(tag))
                        ));
                    });
    
                    category.entries.unshift(...category.complexEntries);
                    delete category.complexEntries;
                }
    
                if (category.complexLevelEntries) {
                    category.complexLevelEntries.forEach(({ tag, levelStart, levelEnd = NUMBER_OF_LEVELS }) => {
                        
                        const levelsSubdicts = [];
                        for (let level = levelStart; level <= levelEnd; level++) {
                            levelsSubdicts.push(this.getLevelDict(level));
                        }
    
                        this._dicts.set(tag, new ComplexDict(this._shuffle(levelsSubdicts)));
                    });
    
                    category.entries.unshift(...category.complexLevelEntries);
                    delete category.complexLevelEntries;
                }
            }

            addDictsInner(category);
        };

        _findAllTags(entry) {
            const findAllTagsInner = entry => {
                if (entry.entries) {
                    return entry.entries.flatMap(findAllTagsInner);
                }
    
                return entry.tag || [];
            }

            return findAllTagsInner(entry);
        };

        _getOrCreateCategoryDict(tag) {
            const dict = this.getCategoryDict(tag);
            if (dict) {
                return dict;
            }

            const newDict = new BaseDict(tag);
            this._dicts.set(tag, newDict);
            return newDict;
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