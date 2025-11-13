globalThis.$kt = globalThis.$kt || {};
const $kt = globalThis.$kt;

const NUMBER_OF_LEVELS = $kt.levels.maxLevel;

const [ HIRAGANA_LEVELS_START, HIRAGANA_LEVELS_END ] = $kt.levels.hiraganaLevelsRange;
const [ KATAKANA_LEVELS_START, KATAKANA_LEVELS_END ] = $kt.levels.katakanaLevelsRange;
const [ KANJI_GRADE_1_START, KANJI_GRADE_1_END ] = $kt.levels.getKanjiLevelsGrade1Range;
const [ KANJI_SPECIAL_START, KANJI_SPECIAL_END ] = $kt.levels.getKanjiLevelsSpecialRange;
const [ KANJI_GRADE_2_START, KANJI_GRADE_2_END ] = $kt.levels.getKanjiLevelsGrade2Range;
const [ KANJI_GRADE_3_START, KANJI_GRADE_3_END ] = $kt.levels.getKanjiLevelsGrade3Range;
const [ KANJI_GRADE_4_START, KANJI_GRADE_4_END ] = $kt.levels.getKanjiLevelsGrade4Range;
const [ KANJI_GRADE_5_START, KANJI_GRADE_5_END ] = $kt.levels.getKanjiLevelsGrade5Range;
const [ KANJI_GRADE_6_START, KANJI_GRADE_6_END ] = $kt.levels.getKanjiLevelsGrade6Range;
const [ KANJI_GRADE_JUNIOR_HIGH_START, KANJI_GRADE_JUNIOR_HIGH_END ] = $kt.levels.getKanjiLevelsJunioHighRange;
const [ KANJI_GRADE_JINMEIYO_START, KANJI_GRADE_JINMEIYO_END ] = $kt.levels.getKanjiLevelsJinmeiyoRange;
const [ KANJI_GRADE_HYOUGAI_START, KANJI_GRADE_HYOUGAI_END ] = $kt.levels.getKanjiLevelsHyougaiRange;

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

const LEVELS_KANJI_CATEGORY = {
    name: 'Kanji',
    entries: [],
    complexLevelEntries: [
        { name: 'All kanji levels', tag: 'level-kanji-all', levelStart: KANJI_GRADE_1_START, levelEnd: KANJI_GRADE_HYOUGAI_END },
        { name: 'Grade 1', tag: 'level-kanji-grade-1', levelStart: KANJI_GRADE_1_START, levelEnd: KANJI_GRADE_1_END },
        { name: 'Special', tag: 'level-kanji-special', levelStart: KANJI_SPECIAL_START, levelEnd: KANJI_SPECIAL_END },
        { name: 'Grade 2', tag: 'level-kanji-grade-2', levelStart: KANJI_GRADE_2_START, levelEnd: KANJI_GRADE_2_END },
        { name: 'Grade 3', tag: 'level-kanji-grade-3', levelStart: KANJI_GRADE_3_START, levelEnd: KANJI_GRADE_3_END },
        { name: 'Grade 4', tag: 'level-kanji-grade-4', levelStart: KANJI_GRADE_4_START, levelEnd: KANJI_GRADE_4_END },
        { name: 'Grade 5', tag: 'level-kanji-grade-5', levelStart: KANJI_GRADE_5_START, levelEnd: KANJI_GRADE_5_END },
        { name: 'Grade 6', tag: 'level-kanji-grade-6', levelStart: KANJI_GRADE_6_START, levelEnd: KANJI_GRADE_6_END },
        { name: 'All elementary', tag: 'level-kanji-elementary', levelStart: KANJI_GRADE_1_START, levelEnd: KANJI_GRADE_6_END },
        { name: 'Junior High', tag: 'level-kanji-junior-high', levelStart: KANJI_GRADE_JUNIOR_HIGH_START, levelEnd: KANJI_GRADE_JUNIOR_HIGH_END },
        { name: 'Jinmeiyo', tag: 'level-kanji-jinmeiyo', levelStart: KANJI_GRADE_JINMEIYO_START, levelEnd: KANJI_GRADE_JINMEIYO_END },
        { name: 'Hyougai', tag: 'level-kanji-hyougai', levelStart: KANJI_GRADE_HYOUGAI_START, levelEnd: KANJI_GRADE_HYOUGAI_END },
    ]
}

const LEVELS_CATEGORY = {
    name: 'Main game mode levels', entries: [
        { name: 'All levels', level: NUMBER_OF_LEVELS + 1 },
        LEVELS_HIRAGANA_CATEGORY,
        LEVELS_KATAKANA_CATEGORY,
        LEVELS_KANJI_CATEGORY
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

const NUMBER_OF_ENTRIES_PER_PRIORITY = 500;

const PRIORITY_NUMBERS = (() => {
    const result = [];
    for (let i = 1; i < 48; i++) {
        result.push({ number: i, tag: i.toString().padStart(2, '0')});
    }
    return result;
})();

const createFreqCategoryFunction = (text, tagPrefix) => {
    return {
        name: `Most frequent by ${text}`,
        entries: PRIORITY_NUMBERS.map(({number, tag}) => {
            const start = NUMBER_OF_ENTRIES_PER_PRIORITY * (number - 1) + 1;
            const end = number * NUMBER_OF_ENTRIES_PER_PRIORITY;
            return { name: `${start} - ${end} frequent ${text}s`, tag: `${tagPrefix}${tag}`};
        }),
        complexEntries: [
            { name: `All most frequent by ${text}`, tag: `freq-${text}-all` },
            ...(() => {
                const result = [];
                for (let endNumber = 2; endNumber < PRIORITY_NUMBERS.length; endNumber *= 2) {
                    const end = endNumber * NUMBER_OF_ENTRIES_PER_PRIORITY;
                    const tags = PRIORITY_NUMBERS.slice(0, endNumber).map(({ tag }) => `${tagPrefix}${tag}`);
                    result.push({ name: `${end} most frequent by ${text}`, tags: tags, tag: `freq-${text}-${end}` });
                }
                return result;
            })()
        ]
    };
};
const FREQ_READING_CATEGORY = createFreqCategoryFunction('reading', 'rpnf');
const FREQ_WRITING_CATEGORY = createFreqCategoryFunction('writing', 'kpnf');

const freqTagsFunctionCreator = tag => number => [ `rp${tag}${number}`, `kp${tag}${number}` ];
const FREQ_NUMBERS = [ 1, 2 ];
const FREQ_GAI_TAGS = FREQ_NUMBERS.flatMap(freqTagsFunctionCreator('gai')).filter(tag => tag !== 'kpgai2');
const FREQ_ICHI_TAGS = FREQ_NUMBERS.flatMap(freqTagsFunctionCreator('ichi'));
const FREQ_SPEC_TAGS = FREQ_NUMBERS.flatMap(freqTagsFunctionCreator('spec'));
const FREQ_NEWS_TAGS = FREQ_NUMBERS.flatMap(freqTagsFunctionCreator('news'));
const filterMostFrequentOnly = tag => tag.endsWith('1') || tag.endsWith('spec2');

const mapEntryToTag = entry => entry.tag;
const FREQ_ALL_TAGS = [
    ...FREQ_GAI_TAGS,
    ...FREQ_ICHI_TAGS,
    ...FREQ_SPEC_TAGS,
    ...FREQ_NEWS_TAGS,
    ...FREQ_READING_CATEGORY.entries.map(mapEntryToTag),
    ...FREQ_WRITING_CATEGORY.entries.map(mapEntryToTag)
];

const FREQUENCY = {
    name: 'Expressions by frequency', entries: [
        FREQ_READING_CATEGORY,
        FREQ_WRITING_CATEGORY,
        {
            name: 'Other frequent expressions', entries: [],
            complexEntries: [
                { name: 'All other frequent expressions', tags: [ ...FREQ_GAI_TAGS, ...FREQ_ICHI_TAGS, ...FREQ_SPEC_TAGS, ...FREQ_NEWS_TAGS ], tag: 'freq-other-all' },
                { name: 'All most frequent expressions', tags: [ ...FREQ_GAI_TAGS, ...FREQ_ICHI_TAGS, ...FREQ_SPEC_TAGS, ...FREQ_NEWS_TAGS ].filter(filterMostFrequentOnly), tag: 'freq-other-most' },
                { name: 'Most frequent foreign words', tags: FREQ_GAI_TAGS.filter(filterMostFrequentOnly), tag: 'freq-gai-most' },
                { name: 'All frequent foreign words', tags: FREQ_GAI_TAGS, tag: 'freq-gai' },
                { name: 'All frequent other words', tags: [ ...FREQ_ICHI_TAGS, ...FREQ_SPEC_TAGS, ...FREQ_NEWS_TAGS ], tag: 'freq-ichi-spec-news' }
            ]
        }
    ],
    complexEntries: [
        { name: 'All frequent expressions', tags: FREQ_ALL_TAGS, tag: 'frequency-all' },
        { name: 'Common words only', tags: [ ...FREQ_ICHI_TAGS, ...FREQ_SPEC_TAGS, ...FREQ_NEWS_TAGS ].filter(filterMostFrequentOnly), tag: 'freq-ichi-spec-news-most' }
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
    FREQUENCY,
    {
        name: 'Expressions by field', entries: [
            ENGINEERING_AND_INDUSTRY,
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
            }
        ],
        complexEntries: [
            { name: 'All fields', tag: 'fields-all' }
        ]
    }
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

class BeatenLevelsDict extends ComplexDict {

    constructor() {
        super([]);
    }

    load() {
        const currentLastBeatenLevel = this._getCurrentLevel() - 1;
        const firstNotLoadedSubdict = this._subdicts.length + 1;

        if (currentLastBeatenLevel >= firstNotLoadedSubdict) {
            const newSubdicts = $kt.utils.shuffle(
                dicts.getLevelDicts(firstNotLoadedSubdict, currentLastBeatenLevel)
            );
            this._subdicts.push(...newSubdicts);
            newSubdicts.forEach(subdict => this._notYetLoadedSubdicts.add(subdict));
        }

        return super.load();
    }

    _getCurrentLevel() {
        const gameStatus = $kt.persistence.getGameStatus();
        if (gameStatus) {
            return gameStatus.level;
        }

        return 1;
    }

}

class KantoreDicts {

    constructor() {
        this._dicts = new Map();
        this._createLevelDicts();
        this._createCategoryDicts();
        this._createArcadeDicts();
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

    getLevelDicts(startLevel, endLevel) {
        return this._levelDicts.slice(startLevel - 1, endLevel);
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
            const dictName = `L${i.toString().padStart(4, '0')}`;
            const dict = new BaseDict(dictName);
            this._levelDicts.push(dict);
            this._dicts.set(dictName, dict);
        }

        // Add dict to be used after all levels are finished
        const finalDict = new ComplexDict($kt.utils.shuffle([...this._levelDicts])); // Copying the array to not modify the original
        this._levelDicts.push(finalDict);
        Object.freeze(this._levelDicts);
    }

    _createCategoryDicts() {
        CATEGORIES.forEach(this._addDicts.bind(this));
        
        const globalAllEntry = new ComplexDict(
            $kt.utils.shuffle(
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

        this._addBeatenLevelsEntry();

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
                        $kt.utils.shuffle(dictTags).map(tag => this._getOrCreateCategoryDict(tag))
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

                    this._dicts.set(tag, new ComplexDict($kt.utils.shuffle(levelsSubdicts)));
                });

                category.entries.unshift(...category.complexLevelEntries);
                delete category.complexLevelEntries;
            }
        }

        addDictsInner(category);
    };

    _createArcadeDicts() {
        this._dicts.set('arcade-easy', new ComplexDict(
            $kt.utils.shuffle(this.getLevelDicts(HIRAGANA_LEVELS_START, KATAKANA_LEVELS_END))
        ));
        this._dicts.set('arcade-normal', this._dicts.get('level-kanji-elementary'));
        this._dicts.set('arcade-hard', this._dicts.get('level-kanji-junior-high'));
        this._dicts.set('arcade-very-hard', this._dicts.get('level-kanji-jinmeiyo'));
        this._dicts.set('arcade-extremely-hard', this._dicts.get('level-kanji-hyougai'));
    }

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

    _addBeatenLevelsEntry() {
        const tag = 'levels-beaten';
        const beatenLevelsDict = new BeatenLevelsDict();
        this._dicts.set(tag, beatenLevelsDict);

        const entry = { name: 'Beaten levels only', tag };
        LEVELS_CATEGORY.entries.splice(1, 0, entry);
    }

}

export const dicts = new KantoreDicts();