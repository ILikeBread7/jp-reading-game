export const KANA_STRINGS = [
    'あいうえお',
    'まみむめも',
    'らりるれろ',
    'なにぬねの',
    'かきくけこがぎぐげご',
    'さしすせそざじずぜぞ',
    'たちっつてとだぢづでど',
    'はひふへほばびぶべぼぱぴぷぺぽ',
    'やゆよゃゅょ',
    'わをん',
    'アイウエオ',
    'マミムメモ',
    'ラリルレロー',
    'ナニヌネノ',
    'カキクケコガギグゲゴ',
    'サシスセソザジズゼゾ',
    'タチッツテトダヂヅデドィゥェ',
    'ハヒフヘホバビブベボパピプペポァォ',
    'ヤユヨャュョ',
    'ワヲンヴ'
];

export const KANJI_GRADE_1_STRINGS = [
    '人木山日雨',
    '一月二所数',
];

export const SPECIAL_STRINGS = [ 
    '々ヵヶ'
]

export const KANJI_GRADE_2_STRINGS = [
    '丸弓工才万'
];

export const KANJI_GRADE_3_STRINGS = [
    '央去号皿仕'
];

export const KANJI_GRADE_4_STRINGS = [
    '以加功札史'
];

export const KANJI_GRADE_5_STRINGS = [
    '圧永可刊旧'
];

export const KANJI_GRADE_6_STRINGS = [
    '穴冊処庁幼'
];

export const KANJI_JUNIORHIGH_STRINGS = [
    '握扱依威偉'
];

export const KANJI_JINMEIYO_STRINGS = [
    '伊智弘嶋龍'
];

export const KANJI_NONSTANDARD_STRINGS = [
    '罠嘘蛙咳蛾'
];

const LEVEL_STRINGS = [
    KANA_STRINGS,
    KANJI_GRADE_1_STRINGS,
    SPECIAL_STRINGS,
    KANJI_GRADE_2_STRINGS,
    KANJI_GRADE_3_STRINGS,
    KANJI_GRADE_4_STRINGS,
    KANJI_GRADE_5_STRINGS,
    KANJI_GRADE_6_STRINGS,
    KANJI_JUNIORHIGH_STRINGS,
    KANJI_JINMEIYO_STRINGS,
    KANJI_NONSTANDARD_STRINGS
];

export const LEVEL_CHARS = LEVEL_STRINGS
    .flatMap(strings => strings.map(string => [...string]));