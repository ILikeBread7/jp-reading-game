import fs from 'node:fs';

const dictInput = [
    {
        "id": 1580120,
        "kana": [
            {
                "reb": "でふね"
            },
            {
                "reb": "でぶね"
            },
            {
                "reb": "しゅっせん"
            }
        ],
        "sense": [
            {
                "pos": [
                    "noun (common) (futsuumeishi)",
                    "noun or participle which takes the aux. verb suru",
                    "intransitive verb"
                ],
                "gloss": [
                    "departure of a ship (from a port)",
                    "setting sail"
                ]
            },
            {
                "stagr": [
                    "でふね",
                    "でぶね"
                ],
                "pos": "noun (common) (futsuumeishi)",
                "xref": "入り船",
                "s_inf": "also いでぶね",
                "gloss": [
                    "outgoing ship",
                    "ship leaving port"
                ]
            }
        ],
        "kanji": [
            {
                "keb": "出船"
            }
        ]
    },

    {
        "id": 1579350,
        "kana": [
            {
                "reb": "さん",
                "re_pri": [
                    "ichi1",
                    "news1",
                    "nf01"
                ]
            },
            {
                "reb": "み",
                "re_pri": "ichi1"
            }
        ],
        "sense": [
            {
                "pos": "numeric",
                "s_inf": "参 is used in legal documents",
                "gloss": [
                    "three",
                    3
                ]
            }
        ],
        "kanji": [
            {
                "keb": "三",
                "ke_pri": [
                    "ichi1",
                    "news1",
                    "nf01"
                ]
            },
            {
                "keb": "３"
            },
            {
                "keb": "参"
            },
            {
                "keb": "參",
                "ke_inf": "word containing out-dated kanji or kanji usage"
            },
            {
                "keb": "弎",
                "ke_inf": "word containing out-dated kanji or kanji usage"
            }
        ]
    },

    {
        "id": 2778650,
        "kana": [
            {
                "reb": "まえばり",
                "re_restr": [
                    "前貼り",
                    "前張り",
                    "前張"
                ]
            },
            {
                "reb": "まえバリ",
                "re_restr": "前バリ"
            }
        ],
        "sense": [
            {
                "pos": [
                    "noun (common) (futsuumeishi)",
                    "noun or participle which takes the aux. verb suru"
                ],
                "gloss": "covering private parts (esp. actors during filming)"
            },
            {
                "pos": "noun (common) (futsuumeishi)",
                "gloss": "minimal bikini bottom (held only by tiny straps or adhesive tape)"
            },
            {
                "stagk": [
                    "前張り",
                    "前張"
                ],
                "pos": "noun (common) (futsuumeishi)",
                "gloss": "lined hakama that bulge in the front"
            }
        ],
        "kanji": [
            {
                "keb": "前貼り"
            },
            {
                "keb": "前張り"
            },
            {
                "keb": "前張"
            },
            {
                "keb": "前バリ"
            }
        ]
    },

    {
        "id": 1052110,
        "kana": [
            {
                "reb": "コンシューマー",
                "re_pri": "gai1"
            },
            {
                "reb": "コンシューマ"
            }
        ],
        "sense": [
            {
                "pos": "noun (common) (futsuumeishi)",
                "gloss": "consumer"
            }
        ],
    }
];

const dictOutput = dictInput.flatMap(entry => {
    const result = [];

    elementToArray(entry.kanji).forEach(kanji => {
        elementToArray(entry.kana).forEach(kana => {
            if (kanji && kana.re_restr && !elementToArray(kana.re_restr).includes(kanji.keb)) {
                return;
            }

            const filteredSense = elementToArray(entry.sense)
                .filter(sense => !sense.stagr || elementToArray(sense.stagr).includes(kana.reb))
                .filter(sense => !sense.stagk || elementToArray(sense.stagk).includes(kanji.keb));

            const newEntry = {};
            newEntry.id = entry.id;
            if (kanji) {
                newEntry.kanji = kanji;
            }
            newEntry.kana = kana;
            newEntry.sense = filteredSense;
            result.push(newEntry);
        });
    });

    return result;
});

fs.writeFile('dict_separator_test.json', JSON.stringify(dictOutput, null, 2), () => console.log('Dict separator file written!'));

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [element];
}