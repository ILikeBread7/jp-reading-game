export const KANA_CHARS_STRINGS = [
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

const KANJI_CHARS_GRADE1_STRINGS = [
    '人木山日雨'
];

export const KANJI_CHARS_STRINGS = [
    ...KANJI_CHARS_GRADE1_STRINGS
];

export const KANA_CHARS = KANA_CHARS_STRINGS.map(string => [...string]);
export const KANJI_CHARS_GRADE1 = KANJI_CHARS_GRADE1_STRINGS.map(string => [...string]);