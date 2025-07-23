var $kt = $kt || {};

(() => {

    $kt.gameUi.showQuestion(
        {
            "entSeq": 1580120,
            "kanji": "出船",
            "kana": "でぶね",
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
                    "pos": [
                        "noun (common) (futsuumeishi)"
                    ],
                    "gloss": [
                        "outgoing ship",
                        "ship leaving port"
                    ],
                    "sInf": "also いでぶね"
                }
            ],
            "tags": [
                "h",
                "k3"
            ],
            "hint": "・ぶ・"
        }
    );

    $kt.gameUi.showLevelData('Level 1: あ行', 75, 10, 15, 0, 48);
    setTimeout(() => {
        $kt.gameUi.showLevelExp('Level 2: か行', 123, 5, 12, 10, 48, [
            { oldExpPercentage: 20, newExpPercentage: 100, addedExp: 3 },
            { char: 'か', oldExpPercentage: 10, newExpPercentage: 100, addedExp: 1 },
            { char: 'き', oldExpPercentage: 20, newExpPercentage: 40, addedExp: 2 }
        ]);
    }, 1000);
})();