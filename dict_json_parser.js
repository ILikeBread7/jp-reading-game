import fs from 'node:fs';
import * as wanakana from 'wanakana';

const TERMS_TEXT_BY_CODE = new Map([
    // <dial> (dialect) entities
    [ "bra", { code: "bra", text: "Brazilian" } ],
    [ "hob", { code: "hob", text: "Hokkaido-ben" } ],
    [ "ksb", { code: "ksb", text: "Kansai-ben" } ],
    [ "ktb", { code: "ktb", text: "Kantou-ben" } ],
    [ "kyb", { code: "kyb", text: "Kyoto-ben" } ],
    [ "kyu", { code: "kyu", text: "Kyuushuu-ben" } ],
    [ "nab", { code: "nab", text: "Nagano-ben" } ],
    [ "osb", { code: "osb", text: "Osaka-ben" } ],
    [ "rkb", { code: "rkb", text: "Ryuukyuu-ben" } ],
    [ "thb", { code: "thb", text: "Touhoku-ben" } ],
    [ "tsb", { code: "tsb", text: "Tosa-ben" } ],
    [ "tsug", { code: "tsug", text: "Tsugaru-ben" } ],
    
    // <field> entities
    [ "agric", { code: "agric", text: "agriculture" } ],
    [ "anat", { code: "anat", text: "anatomy" } ],
    [ "archeol", { code: "archeol", text: "archeology" } ],
    [ "archit", { code: "archit", text: "architecture" } ],
    [ "art", { code: "art", text: "art, aesthetics" } ],
    [ "astron", { code: "astron", text: "astronomy" } ],
    [ "audvid", { code: "audvid", text: "audiovisual" } ],
    [ "aviat", { code: "aviat", text: "aviation" } ],
    [ "baseb", { code: "baseb", text: "baseball" } ],
    [ "biochem", { code: "biochem", text: "biochemistry" } ],
    [ "biol", { code: "biol", text: "biology" } ],
    [ "bot", { code: "bot", text: "botany" } ],
    [ "boxing", { code: "boxing", text: "boxing" } ],
    [ "Buddh", { code: "Buddh", text: "Buddhism" } ],
    [ "bus", { code: "bus", text: "business" } ],
    [ "cards", { code: "cards", text: "card games" } ],
    [ "chem", { code: "chem", text: "chemistry" } ],
    [ "chmyth", { code: "chmyth", text: "Chinese mythology" } ],
    [ "Christn", { code: "Christn", text: "Christianity" } ],
    [ "civeng", { code: "civeng", text: "civil engineering" } ],
    [ "cloth", { code: "cloth", text: "clothing" } ],
    [ "comp", { code: "comp", text: "computing" } ],
    [ "cryst", { code: "cryst", text: "crystallography" } ],
    [ "dent", { code: "dent", text: "dentistry" } ],
    [ "ecol", { code: "ecol", text: "ecology" } ],
    [ "econ", { code: "econ", text: "economics" } ],
    [ "elec", { code: "elec", text: "electricity, elec. eng." } ],
    [ "electr", { code: "electr", text: "electronics" } ],
    [ "embryo", { code: "embryo", text: "embryology" } ],
    [ "engr", { code: "engr", text: "engineering" } ],
    [ "ent", { code: "ent", text: "entomology" } ],
    [ "figskt", { code: "figskt", text: "figure skating" } ],
    [ "film", { code: "film", text: "film" } ],
    [ "finc", { code: "finc", text: "finance" } ],
    [ "fish", { code: "fish", text: "fishing" } ],
    [ "food", { code: "food", text: "food, cooking" } ],
    [ "gardn", { code: "gardn", text: "gardening, horticulture" } ],
    [ "genet", { code: "genet", text: "genetics" } ],
    [ "geogr", { code: "geogr", text: "geography" } ],
    [ "geol", { code: "geol", text: "geology" } ],
    [ "geom", { code: "geom", text: "geometry" } ],
    [ "go", { code: "go", text: "go (game)" } ],
    [ "golf", { code: "golf", text: "golf" } ],
    [ "gramm", { code: "gramm", text: "grammar" } ],
    [ "grmyth", { code: "grmyth", text: "Greek mythology" } ],
    [ "hanaf", { code: "hanaf", text: "hanafuda" } ],
    [ "horse", { code: "horse", text: "horse racing" } ],
    [ "internet", { code: "internet", text: "Internet" } ],
    [ "jpmyth", { code: "jpmyth", text: "Japanese mythology" } ],
    [ "kabuki", { code: "kabuki", text: "kabuki" } ],
    [ "law", { code: "law", text: "law" } ],
    [ "ling", { code: "ling", text: "linguistics" } ],
    [ "logic", { code: "logic", text: "logic" } ],
    [ "MA", { code: "MA", text: "martial arts" } ],
    [ "mahj", { code: "mahj", text: "mahjong" } ],
    [ "manga", { code: "manga", text: "manga" } ],
    [ "math", { code: "math", text: "mathematics" } ],
    [ "mech", { code: "mech", text: "mechanical engineering" } ],
    [ "med", { code: "med", text: "medicine" } ],
    [ "met", { code: "met", text: "meteorology" } ],
    [ "mil", { code: "mil", text: "military" } ],
    [ "min", { code: "min", text: "mineralogy" } ],
    [ "mining", { code: "mining", text: "mining" } ],
    [ "motor", { code: "motor", text: "motorsport" } ],
    [ "music", { code: "music", text: "music" } ],
    [ "noh", { code: "noh", text: "noh" } ],
    [ "ornith", { code: "ornith", text: "ornithology" } ],
    [ "paleo", { code: "paleo", text: "paleontology" } ],
    [ "pathol", { code: "pathol", text: "pathology" } ],
    [ "pharm", { code: "pharm", text: "pharmacology" } ],
    [ "phil", { code: "phil", text: "philosophy" } ],
    [ "photo", { code: "photo", text: "photography" } ],
    [ "physics", { code: "physics", text: "physics" } ],
    [ "physiol", { code: "physiol", text: "physiology" } ],
    [ "politics", { code: "politics", text: "politics" } ],
    [ "print", { code: "print", text: "printing" } ],
    [ "prowres", { code: "prowres", text: "professional wrestling" } ],
    [ "psy", { code: "psy", text: "psychiatry" } ],
    [ "psyanal", { code: "psyanal", text: "psychoanalysis" } ],
    [ "psych", { code: "psych", text: "psychology" } ],
    [ "rail", { code: "rail", text: "railway" } ],
    [ "rommyth", { code: "rommyth", text: "Roman mythology" } ],
    [ "Shinto", { code: "Shinto", text: "Shinto" } ],
    [ "shogi", { code: "shogi", text: "shogi" } ],
    [ "ski", { code: "ski", text: "skiing" } ],
    [ "sports", { code: "sports", text: "sports" } ],
    [ "stat", { code: "stat", text: "statistics" } ],
    [ "stockm", { code: "stockm", text: "stock market" } ],
    [ "sumo", { code: "sumo", text: "sumo" } ],
    [ "surg", { code: "surg", text: "surgery" } ],
    [ "telec", { code: "telec", text: "telecommunications" } ],
    [ "tradem", { code: "tradem", text: "trademark" } ],
    [ "tv", { code: "tv", text: "television" } ],
    [ "vet", { code: "vet", text: "veterinary terms" } ],
    [ "vidg", { code: "vidg", text: "video games" } ],
    [ "zool", { code: "zool", text: "zoology" } ],
    
    // <ke_inf> (kanji info) entities
    [ "ateji", { code: "ateji", text: "ateji (phonetic) reading" } ],
    [ "ik", { code: "ik", text: "word containing irregular kana usage" } ],
    [ "iK", { code: "iK", text: "word containing irregular kanji usage" } ],
    [ "io", { code: "io", text: "irregular okurigana usage" } ],
    [ "oK", { code: "oK", text: "word containing out-dated kanji or kanji usage" } ],
    [ "rK", { code: "rK", text: "rarely used kanji form" } ],
    [ "sK", { code: "sK", text: "search-only kanji form" } ],
    
    // <misc> (miscellaneous) entities
    [ "abbr", { code: "abbr", text: "abbreviation" } ],
    [ "arch", { code: "arch", text: "archaic" } ],
    [ "char", { code: "char", text: "character" } ],
    [ "chn", { code: "chn", text: "children's language" } ],
    [ "col", { code: "col", text: "colloquial" } ],
    [ "company", { code: "company", text: "company name" } ],
    [ "creat", { code: "creat", text: "creature" } ],
    [ "dated", { code: "dated", text: "dated term" } ],
    [ "dei", { code: "dei", text: "deity" } ],
    [ "derog", { code: "derog", text: "derogatory" } ],
    [ "doc", { code: "doc", text: "document" } ],
    [ "euph", { code: "euph", text: "euphemistic" } ],
    [ "ev", { code: "ev", text: "event" } ],
    [ "fam", { code: "fam", text: "familiar language" } ],
    [ "fem", { code: "fem", text: "female term or language" } ],
    [ "fict", { code: "fict", text: "fiction" } ],
    [ "form", { code: "form", text: "formal or literary term" } ],
    [ "given", { code: "given", text: "given name or forename, gender not specified" } ],
    [ "group", { code: "group", text: "group" } ],
    [ "hist", { code: "hist", text: "historical term" } ],
    [ "hon", { code: "hon", text: "honorific or respectful (sonkeigo) language" } ],
    [ "hum", { code: "hum", text: "humble (kenjougo) language" } ],
    [ "entSeq", { code: "entSeq", text: "idiomatic expression" } ],
    [ "joc", { code: "joc", text: "jocular, humorous term" } ],
    [ "leg", { code: "leg", text: "legend" } ],
    [ "m-sl", { code: "m-sl", text: "manga slang" } ],
    [ "male", { code: "male", text: "male term or language" } ],
    [ "myth", { code: "myth", text: "mythology" } ],
    [ "net-sl", { code: "net-sl", text: "Internet slang" } ],
    [ "obj", { code: "obj", text: "object" } ],
    [ "obs", { code: "obs", text: "obsolete term" } ],
    [ "on-mim", { code: "on-mim", text: "onomatopoeic or mimetic word" } ],
    [ "organization", { code: "organization", text: "organization name" } ],
    [ "oth", { code: "oth", text: "other" } ],
    [ "person", { code: "person", text: "full name of a particular person" } ],
    [ "place", { code: "place", text: "place name" } ],
    [ "poet", { code: "poet", text: "poetical term" } ],
    [ "pol", { code: "pol", text: "polite (teineigo) language" } ],
    [ "product", { code: "product", text: "product name" } ],
    [ "proverb", { code: "proverb", text: "proverb" } ],
    [ "quote", { code: "quote", text: "quotation" } ],
    [ "rare", { code: "rare", text: "rare term" } ],
    [ "relig", { code: "relig", text: "religion" } ],
    [ "sens", { code: "sens", text: "sensitive" } ],
    [ "serv", { code: "serv", text: "service" } ],
    [ "ship", { code: "ship", text: "ship name" } ],
    [ "sl", { code: "sl", text: "slang" } ],
    [ "station", { code: "station", text: "railway station" } ],
    [ "surname", { code: "surname", text: "family or surname" } ],
    [ "uk", { code: "uk", text: "word usually written using kana alone" } ],
    [ "unclass", { code: "unclass", text: "unclassified name" } ],
    [ "vulg", { code: "vulg", text: "vulgar expression or word" } ],
    [ "work", { code: "work", text: "work of art, literature, music, etc. name" } ],
    [ "X", { code: "X", text: "rude or X-rated term (not displayed in educational software)" } ],
    [ "yoji", { code: "yoji", text: "yojijukugo" } ],
    
    // <pos> (part-of-speech) entities
    [ "adj-f", { code: "adj-f", text: "noun or verb acting prenominally" } ],
    [ "adj-i", { code: "adj-i", text: "adjective (keiyoushi)" } ],
    [ "adj-ix", { code: "adj-ix", text: "adjective (keiyoushi) - yoi/ii class" } ],
    [ "adj-kari", { code: "adj-kari", text: "'kari' adjective (archaic)" } ],
    [ "adj-ku", { code: "adj-ku", text: "'ku' adjective (archaic)" } ],
    [ "adj-na", { code: "adj-na", text: "adjectival nouns or quasi-adjectives (keiyodoshi)" } ],
    [ "adj-nari", { code: "adj-nari", text: "archaic/formal form of na-adjective" } ],
    [ "adj-no", { code: "adj-no", text: "nouns which may take the genitive case particle 'no'" } ],
    [ "adj-pn", { code: "adj-pn", text: "pre-noun adjectival (rentaishi)" } ],
    [ "adj-shiku", { code: "adj-shiku", text: "'shiku' adjective (archaic)" } ],
    [ "adj-t", { code: "adj-t", text: "'taru' adjective" } ],
    [ "adv", { code: "adv", text: "adverb (fukushi)" } ],
    [ "adv-to", { code: "adv-to", text: "adverb taking the 'to' particle" } ],
    [ "aux", { code: "aux", text: "auxiliary" } ],
    [ "aux-adj", { code: "aux-adj", text: "auxiliary adjective" } ],
    [ "aux-v", { code: "aux-v", text: "auxiliary verb" } ],
    [ "conj", { code: "conj", text: "conjunction" } ],
    [ "cop", { code: "cop", text: "copula" } ],
    [ "ctr", { code: "ctr", text: "counter" } ],
    [ "exp", { code: "exp", text: "expressions (phrases, clauses, etc.)" } ],
    [ "int", { code: "int", text: "interjection (kandoushi)" } ],
    [ "n", { code: "n", text: "noun (common) (futsuumeishi)" } ],
    [ "n-adv", { code: "n-adv", text: "adverbial noun (fukushitekimeishi)" } ],
    [ "n-pr", { code: "n-pr", text: "proper noun" } ],
    [ "n-pref", { code: "n-pref", text: "noun, used as a prefix" } ],
    [ "n-suf", { code: "n-suf", text: "noun, used as a suffix" } ],
    [ "n-t", { code: "n-t", text: "noun (temporal) (jisoumeishi)" } ],
    [ "num", { code: "num", text: "numeric" } ],
    [ "pn", { code: "pn", text: "pronoun" } ],
    [ "pref", { code: "pref", text: "prefix" } ],
    [ "prt", { code: "prt", text: "particle" } ],
    [ "suf", { code: "suf", text: "suffix" } ],
    [ "unc", { code: "unc", text: "unclassified" } ],
    [ "v-unspec", { code: "v-unspec", text: "verb unspecified" } ],
    [ "v1", { code: "v1", text: "Ichidan verb" } ],
    [ "v1-s", { code: "v1-s", text: "Ichidan verb - kureru special class" } ],
    [ "v2a-s", { code: "v2a-s", text: "Nidan verb with 'u' ending (archaic)" } ],
    [ "v2b-k", { code: "v2b-k", text: "Nidan verb (upper class) with 'bu' ending (archaic)" } ],
    [ "v2b-s", { code: "v2b-s", text: "Nidan verb (lower class) with 'bu' ending (archaic)" } ],
    [ "v2d-k", { code: "v2d-k", text: "Nidan verb (upper class) with 'dzu' ending (archaic)" } ],
    [ "v2d-s", { code: "v2d-s", text: "Nidan verb (lower class) with 'dzu' ending (archaic)" } ],
    [ "v2g-k", { code: "v2g-k", text: "Nidan verb (upper class) with 'gu' ending (archaic)" } ],
    [ "v2g-s", { code: "v2g-s", text: "Nidan verb (lower class) with 'gu' ending (archaic)" } ],
    [ "v2h-k", { code: "v2h-k", text: "Nidan verb (upper class) with 'hu/fu' ending (archaic)" } ],
    [ "v2h-s", { code: "v2h-s", text: "Nidan verb (lower class) with 'hu/fu' ending (archaic)" } ],
    [ "v2k-k", { code: "v2k-k", text: "Nidan verb (upper class) with 'ku' ending (archaic)" } ],
    [ "v2k-s", { code: "v2k-s", text: "Nidan verb (lower class) with 'ku' ending (archaic)" } ],
    [ "v2m-k", { code: "v2m-k", text: "Nidan verb (upper class) with 'mu' ending (archaic)" } ],
    [ "v2m-s", { code: "v2m-s", text: "Nidan verb (lower class) with 'mu' ending (archaic)" } ],
    [ "v2n-s", { code: "v2n-s", text: "Nidan verb (lower class) with 'nu' ending (archaic)" } ],
    [ "v2r-k", { code: "v2r-k", text: "Nidan verb (upper class) with 'ru' ending (archaic)" } ],
    [ "v2r-s", { code: "v2r-s", text: "Nidan verb (lower class) with 'ru' ending (archaic)" } ],
    [ "v2s-s", { code: "v2s-s", text: "Nidan verb (lower class) with 'su' ending (archaic)" } ],
    [ "v2t-k", { code: "v2t-k", text: "Nidan verb (upper class) with 'tsu' ending (archaic)" } ],
    [ "v2t-s", { code: "v2t-s", text: "Nidan verb (lower class) with 'tsu' ending (archaic)" } ],
    [ "v2w-s", { code: "v2w-s", text: "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)" } ],
    [ "v2y-k", { code: "v2y-k", text: "Nidan verb (upper class) with 'yu' ending (archaic)" } ],
    [ "v2y-s", { code: "v2y-s", text: "Nidan verb (lower class) with 'yu' ending (archaic)" } ],
    [ "v2z-s", { code: "v2z-s", text: "Nidan verb (lower class) with 'zu' ending (archaic)" } ],
    [ "v4b", { code: "v4b", text: "Yodan verb with 'bu' ending (archaic)" } ],
    [ "v4g", { code: "v4g", text: "Yodan verb with 'gu' ending (archaic)" } ],
    [ "v4h", { code: "v4h", text: "Yodan verb with 'hu/fu' ending (archaic)" } ],
    [ "v4k", { code: "v4k", text: "Yodan verb with 'ku' ending (archaic)" } ],
    [ "v4m", { code: "v4m", text: "Yodan verb with 'mu' ending (archaic)" } ],
    [ "v4n", { code: "v4n", text: "Yodan verb with 'nu' ending (archaic)" } ],
    [ "v4r", { code: "v4r", text: "Yodan verb with 'ru' ending (archaic)" } ],
    [ "v4s", { code: "v4s", text: "Yodan verb with 'su' ending (archaic)" } ],
    [ "v4t", { code: "v4t", text: "Yodan verb with 'tsu' ending (archaic)" } ],
    [ "v5aru", { code: "v5aru", text: "Godan verb - -aru special class" } ],
    [ "v5b", { code: "v5b", text: "Godan verb with 'bu' ending" } ],
    [ "v5g", { code: "v5g", text: "Godan verb with 'gu' ending" } ],
    [ "v5k", { code: "v5k", text: "Godan verb with 'ku' ending" } ],
    [ "v5k-s", { code: "v5k-s", text: "Godan verb - Iku/Yuku special class" } ],
    [ "v5m", { code: "v5m", text: "Godan verb with 'mu' ending" } ],
    [ "v5n", { code: "v5n", text: "Godan verb with 'nu' ending" } ],
    [ "v5r", { code: "v5r", text: "Godan verb with 'ru' ending" } ],
    [ "v5r-i", { code: "v5r-i", text: "Godan verb with 'ru' ending (irregular verb)" } ],
    [ "v5s", { code: "v5s", text: "Godan verb with 'su' ending" } ],
    [ "v5t", { code: "v5t", text: "Godan verb with 'tsu' ending" } ],
    [ "v5u", { code: "v5u", text: "Godan verb with 'u' ending" } ],
    [ "v5u-s", { code: "v5u-s", text: "Godan verb with 'u' ending (special class)" } ],
    [ "v5uru", { code: "v5uru", text: "Godan verb - Uru old class verb (old form of Eru)" } ],
    [ "vi", { code: "vi", text: "intransitive verb" } ],
    [ "vk", { code: "vk", text: "Kuru verb - special class" } ],
    [ "vn", { code: "vn", text: "irregular nu verb" } ],
    [ "vr", { code: "vr", text: "irregular ru verb, plain form ends with -ri" } ],
    [ "vs", { code: "vs", text: "noun or participle which takes the aux. verb suru" } ],
    [ "vs-c", { code: "vs-c", text: "su verb - precursor to the modern suru" } ],
    [ "vs-i", { code: "vs-i", text: "suru verb - included" } ],
    [ "vs-s", { code: "vs-s", text: "suru verb - special class" } ],
    [ "vt", { code: "vt", text: "transitive verb" } ],
    [ "vz", { code: "vz", text: "Ichidan verb - zuru verb (alternative form of -jiru verbs)" } ],
    
    // <re_inf> (reading info) entities
    [ "gikun", { code: "gikun", text: "gikun (meaning as reading) or jukujikun (special kanji reading)" } ],
    [ "ik", { code: "ik", text: "word containing irregular kana usage" } ],
    [ "ok", { code: "ok", text: "out-dated or obsolete kana usage" } ],
    [ "rk", { code: "rk", text: "rarely used kana form" } ],
    [ "sk", { code: "sk", text: "search-only kana form" } ]
]);

const TERMS_TEXT_BY_TEXT = new Map();
TERMS_TEXT_BY_CODE.forEach((value, key) => TERMS_TEXT_BY_TEXT.set(value.text, { code: value.code, text: value.text }));

const TERMS_MAPPER = TERMS_TEXT_BY_TEXT;

const UNUSED_KANJI_TERMS_SET = new Set(['uk', 'rK', 'sK']);
const UNUSED_KANA_TERMS_SET = new Set(['sk']);

const MASK_CHAR = '・';
const KANJI_PRIORITY_PREFIX = 'kp';
const KANA_PRIORITY_PREFIX = 'rp';
const MIN_ENTRIES_PER_CHAR = 5;

const LEVEL_KANJI = [
    { vocabTag: 'v5', kanjiChars: [...'日一国人年'] },
    { vocabTag: 'v5', kanjiChars: [...'大十二本中'] },

    { vocabTag: 'v4', kanjiChars: [...'会同事社'] }
];

const HIRAGANA = [
    { tag: 'a', chars: 'あいうえお' },
    { tag: 'm', chars: 'まみむめも' },
    { tag: 'r', chars: 'らりるれろ' },
    { tag: 'n', chars: 'なにぬねの' },
    { tag: 'k', chars: 'かきくけこがぎぐげご' },
    { tag: 's', chars: 'さしすせそざじずぜぞ' },
    { tag: 't', chars: 'たちっつてとだぢづでど' },
    { tag: 'h', chars: 'はひふへほばびぶべぼぱぴぷぺぽ' },
    { tag: 'y', chars: 'やゆよゃゅょ' },
    { tag: 'w', chars: 'わをん' }
];

const KATAKANA = [
    { tag: 'A', chars: 'アイウエオ' },
    { tag: 'M', chars: 'マミムメモ' },
    { tag: 'R', chars: 'ラリルレロー' },
    { tag: 'N', chars: 'ナニヌネノ' },
    { tag: 'K', chars: 'カキクケコガギグゲゴ' },
    { tag: 'S', chars: 'サシスセソザジズゼゾ' },
    { tag: 'T', chars: 'タチッツテトダヂヅデドゥ' },
    { tag: 'H', chars: 'ハヒフヘホバビブベボパピプペポァィェォ' },
    { tag: 'Y', chars: 'ヤユヨャュョ' },
    { tag: 'W', chars: 'ワヲンヴ' }
];

const KANA_GYOUS = [ ...HIRAGANA, ...KATAKANA ];
const KANA_GYOU_TO_LEVEL_MAP = new Map(
    KANA_GYOUS.map((gyou, index) => [gyou.tag, index + 1])
);

const LEVEL_KANJI_MAP = new Map();
const KANJI_LEVEL_OFFSET = KANA_GYOUS.length;
LEVEL_KANJI.forEach((level, index) => {
    level.kanjiChars.forEach(char => {
        LEVEL_KANJI_MAP.set(char, { levelTag: `L${(KANJI_LEVEL_OFFSET + index + 1).toString().padStart(3, '0')}`, vocabTag: level.vocabTag });
    });
});

const HIRAGANA_MAP = new Map();
const KATAKANA_MAP = new Map();
[
    { kana: HIRAGANA, map: HIRAGANA_MAP },
    { kana: KATAKANA, map: KATAKANA_MAP }
].forEach(kanaMap => {
    kanaMap.kana.forEach((entry, index) => {
        [...entry.chars].forEach(char => {
            kanaMap.map.set(char, { tag: entry.tag, level: index });
        });
    });
});

const jlptKanjiData = JSON.parse(fs.readFileSync('jlpt_kanji.json', 'utf-8'));
const jlptVocabData = JSON.parse(fs.readFileSync('jlpt_vocab.json', 'utf-8'));

const KANJI_N5_TAG = 'k5';
const KANJI_N4_TAG = 'k4';
const KANJI_N3_TAG = 'k3';
const KANJI_N2_TAG = 'k2';
const KANJI_N1_TAG = 'k1';

const VOCAB_N5_TAG = 'v5';
const VOCAB_N4_TAG = 'v4';
const VOCAB_N3_TAG = 'v3';
const VOCAB_N2_TAG = 'v2';
const VOCAB_N1_TAG = 'v1';

const jlptLevels = [
    { kanjiTag: KANJI_N5_TAG, kanji: jlptKanjiData['n5'], vocabTag: VOCAB_N5_TAG, vocab: jlptVocabData['n5'] },
    { kanjiTag: KANJI_N4_TAG, kanji: jlptKanjiData['n4'], vocabTag: VOCAB_N4_TAG, vocab: jlptVocabData['n4'] },
    { kanjiTag: KANJI_N3_TAG, kanji: jlptKanjiData['n3'], vocabTag: VOCAB_N3_TAG, vocab: jlptVocabData['n3'] },
    { kanjiTag: KANJI_N2_TAG, kanji: jlptKanjiData['n2'], vocabTag: VOCAB_N2_TAG, vocab: jlptVocabData['n2'] },
    { kanjiTag: KANJI_N1_TAG, kanji: jlptKanjiData['n1'], vocabTag: VOCAB_N1_TAG, vocab: jlptVocabData['n1'] }
];

const jlptKanjiMap = new Map();
const jlptVocabMap = new Map();
jlptLevels.forEach(level => {
    level.kanji.forEach(kanji => {
        jlptKanjiMap.set(kanji, level.kanjiTag);
    });

    level.vocab.forEach(word => {
        (word.kanji || [undefined]).forEach(kanji => {
            word.kana.forEach(kana => {
                const key = JSON.stringify(kanji ? [kanji, kana] : [kana]);
                if (!jlptVocabMap.has(key)) {
                    jlptVocabMap.set(key, level.vocabTag);
                }
            });
        });
    });
});

const jlptMismatchesMap = new Map();
jlptVocabMap.forEach((value, key) => {
    jlptMismatchesMap.set(key, 0);
});

const LEVEL_CHARS = [
    ...KANA_GYOUS.map(gyou => [...gyou.chars]),
    ...LEVEL_KANJI.map(level => level.kanjiChars)
];

const CHAR_TO_LEVEL = new Map();
LEVEL_CHARS.forEach((chars, index) => {
    const level = index + 1;
    chars.forEach(char => {
        CHAR_TO_LEVEL.set(char, level);
    });
});

fs.readFile('JMdict_e.json', 'utf-8', (err, jsonData) => {
    if (err) {
        console.error(err);
        return;
    }

    const data = JSON.parse(jsonData);
    const dictEntries = data['JMdict']['entry'];
    const entriesMap = new Map();

    const vulgarEntries = [];
    const entries = dictEntries.flatMap((entry, index) => {
        const separatedEntries = [];
    
        elementToArray(entry['k_ele']).forEach(kanji => {
            elementToArray(entry['r_ele']).forEach(kana => {
                if (kanji && kana.re_restr && !elementToArray(kana.re_restr).includes(kanji.keb)) {
                    return;
                }

                if (kana.re_inf && UNUSED_KANA_TERMS_SET.intersection(new Set(elementToArray(kana.re_inf).map(term => TERMS_MAPPER.get(term).code))).size > 0) {
                    return;
                }
    
                const filteredSense = elementToArray(entry['sense'])
                    .filter(sense => !sense.stagr || elementToArray(sense.stagr).includes(kana.reb))
                    .filter(sense => !sense.stagk || elementToArray(sense.stagk).includes(kanji.keb))
                    .filter(sense => sInfFilter(kanji, sense['s_inf']));
    
                const newEntry = {};
                newEntry.entSeq = entry['ent_seq'];
                if (kanji) {
                    newEntry.kanji = kanji;
                    entriesMap.set(kanji.keb, [...(entriesMap.get(kanji.keb) || []), newEntry]);
                }
                newEntry.kana = kana;
                newEntry.sense = filteredSense;

                const vulgMiscText = TERMS_TEXT_BY_CODE.get('vulg').text;
                const vulgarSenses = filteredSense
                    .filter(sense => elementToArray(sense.misc).includes(vulgMiscText));

                if (vulgarSenses.length > 0) {
                    const vulgarEntry = { ...newEntry };
                    vulgarEntry.sense = vulgarSenses;
                    vulgarEntry.tags = [ 'vulg' ];
                    vulgarEntries.push(vulgarEntry);

                    if (vulgarSenses.length === filteredSense) {
                        return;
                    }

                    newEntry.sense = filteredSense
                        .filter(sense => !elementToArray(sense.misc).includes(vulgMiscText));
                }

                newEntry.tags = createTags(newEntry);
                separatedEntries.push(newEntry);
            });
        });
    
        // Show progress
        if (index % 10000 === 0) {
            console.log(`${Math.floor(100 * index / dictEntries.length)}%, ${index} / ${dictEntries.length}`);
        }

        return separatedEntries;
    });

    entries.forEach(entry => createUniqueHint(entry, entriesMap));
    
    const priorities = createPriorities(entries);
    createLevelTagsFromPriorities(priorities, entries);

    // numOfEntriesPerChar.entries()
    //     .forEach(([key, value]) => console.log(key, value));

    // DEBUG
    const jlptMismatches = {};
    jlptMismatchesMap.forEach((value, key) => {
        if (value !== 1) {
            jlptMismatches[key] = value;
        }
    });

    fs.writeFile('jlpt_mismatches.json', JSON.stringify(
        jlptMismatches,
        null,
        2
    ), () => console.log('JLPT mismatches file written'));
    // END OF DEBUG

    fs.writeFile('dict.json', JSON.stringify(entries, null, 2), () => console.log('Dict file written!'));
    fs.writeFile('dict_vulgar.json', JSON.stringify(vulgarEntries, null, 2), () => console.log('Vulgar dict file written!'));
});

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}

function sInfFilter(kanji, sInf) {
    switch (sInf) {
        case 'only 只':
            return kanji.keb === '只';
        case 'only 〜取る':
            return kanji.keb.endsWith('取る');
    }

    return true;
}

function createUniqueHint(entry, entriesMap) {
    if (!entry.kanji) {
        return;
    }

    const otherEntries = entriesMap.get(entry.kanji.keb)
        .filter(other => other !== entry);

    if (otherEntries.length > 0) {
        const sameLengthReadingOthers = otherEntries.filter(other => other.kana.reb.length === entry.kana.reb.length && other.kana.reb !== entry.kana.reb);
        if (sameLengthReadingOthers.length > 0) {
            const charMatches = [...entry.kana.reb].map(char => false);
            sameLengthReadingOthers.forEach(other => {
                [...other.kana.reb].forEach((char, index) => {
                    charMatches[index] ||= char === entry.kana.reb.charAt(index);
                });
            });

            const firstUniqueCharIndex = charMatches.indexOf(false);
            if (firstUniqueCharIndex === -1) {
                console.warn(`No unique first character found for entSeq: ${entry.entSeq}, kanji: ${entry.kanji.keb}, kana: ${entry.kana.reb}`);
            } else {
                entry.hint = charMatches.map((value, index) => index === firstUniqueCharIndex ? entry.kana.reb.charAt(index) : MASK_CHAR).join('');
            }
        } else {
            entry.hint = [...entry.kana.reb].map(_ => MASK_CHAR).join('');
        }
    }
}

function createTags(entry) {
    const tags = [
        ...createKanaTags(entry),
        ...createJLPTKanjiTags(entry),
        ...createJLPTVocabTags(entry),
        ...createFrequencyTags(entry)
    ];

    return tags;
}

function createKanaTags(entry) {
    return [
        ...createTagsForKana(entry, HIRAGANA_MAP),
        ...createTagsForKana(entry, KATAKANA_MAP)
    ]
}

function createTagsForKana(entry, kanaMap) {
    const maxKana = [...entry.kana.reb]
        .map(char => kanaMap.get(char))
        .reduce((acc, curr) => (acc && curr) && (curr.level > acc.level ? curr : acc));

    if (maxKana) {
        return [ maxKana.tag ];
    }

    return [];
}

function createJLPTKanjiTags(entry) {
    if (!entry.kanji) {
        return [];
    }

    const kanjiList = [...entry.kanji.keb]
        .filter(char => wanakana.isKanji(char));

    if (kanjiList.length > 0) {
        const topLevel = kanjiList
            .map(char => jlptKanjiMap.get(char))
            .reduce((acc, curr) => (acc && curr) && (curr < acc ? curr : acc));

        if (topLevel) {
            return [ topLevel ];
        }
    }

    return [];
}

function createJLPTVocabTags(entry) {
    const exceptionTags = handleJLPTVocabExceptions(entry);
    if (exceptionTags !== null) {
        return exceptionTags;
    }

    const matches = [];
    
    if (entry.kanji) {
        const key = JSON.stringify([entry.kanji.keb, entry.kana.reb]);
        const match = jlptVocabMap.get(key);
        if (match) {
            matches.push({ key, match });
        }
    }

    // No kanji or kanji isn't used
    if (
        !entry.kanji
        || elementToArray(entry.kanji['ke_inf']).find(keInf => UNUSED_KANJI_TERMS_SET.has(getTermCodeOrUndefined(TERMS_MAPPER.get(keInf))))
        || UNUSED_KANJI_TERMS_SET
            .intersection(
                new Set(
                    entry.sense
                        .flatMap(sense => elementToArray(sense.misc))
                        .map(term => getTermCodeOrUndefined(TERMS_MAPPER.get(term)))
                )
            )
            .size > 0
    ) {
        const key = JSON.stringify([entry.kana.reb]);
        const match = jlptVocabMap.get(key);
        if (match) {
            matches.push({ key, match });
        }
    }

    // Pick the match with the lowest level
    const result = matches.length ? matches.reduce((acc, curr) => curr.match > acc.match ? curr : acc) : undefined;

    if (result) {
        jlptMismatchesMap.set(result.key, jlptMismatchesMap.get(result.key) + 1);
        return [ result.match ];
    }

    return [];
}

function createFrequencyTags(entry) {
    return [
        ...((entry.kanji && entry.kanji.ke_pri && elementToArray(entry.kanji.ke_pri)) || []).map(pri => `${KANJI_PRIORITY_PREFIX}${pri}`),
        ...((entry.kana && entry.kana.re_pri && elementToArray(entry.kana.re_pri)) || []).map(pri => `${KANA_PRIORITY_PREFIX}${pri}`)
    ]
}

function createLevelTagsFromPriorities(priorities, entries) {
    const acceptableCharsSet = new Set();

    LEVEL_CHARS.forEach((chars, index, array) => {
        const currentLevel = index + 1;
        const totalLevels = array.length;
        chars.forEach(char => acceptableCharsSet.add(char));

        chars.forEach(char => {
            console.log(`Creating level tags for: ${char}, Level: ${currentLevel} / ${totalLevels}`);
    
            const existingEntryKeys = new Set();
            const isKanji = wanakana.isKanji(char);
            const [ order, orderEntries, generateKeyFunction ] = isKanji
                ? [ priorities.orderKanji, priorities.kanjiEntries, generateKajiKey ]
                : [ priorities.orderKana, priorities.kanaEntries, generateKanaKey ];
            
            const charFilter = isKanji
                ? entry => entry.kanji && entry.kanji.keb.includes(char) && new Set(entry.kanji.keb).isSubsetOf(acceptableCharsSet)
                : entry => entry.kana.reb.includes(char) && new Set(entry.kana.reb).isSubsetOf(acceptableCharsSet);
                
            let lastPriority;
            const charEntries = [];
            for (
                let i = 0;
                i < order.length && charEntries.length < MIN_ENTRIES_PER_CHAR;
                i++
            ) {
                const currentOrder = lastPriority = order[i];
                const charPriorityEntries = (orderEntries.get(currentOrder) || []).filter(charFilter);
                addAndDeduplicate(charPriorityEntries, charEntries, generateKeyFunction, existingEntryKeys);
            }
            console.log(` - Last priority: ${lastPriority}`);
            
            if (charEntries.length < MIN_ENTRIES_PER_CHAR) {
                console.log(` - Adding all entries, size with priorities only: ${charEntries.length}`);
                addAndDeduplicate(entries.filter(charFilter), charEntries, generateKeyFunction, existingEntryKeys);
            }
            console.log(` - Total number of entries: ${charEntries.length}`);
    
            const level = CHAR_TO_LEVEL.get(char);
            if (!level) {
                console.warn('Char with no level!', char);
            }
            const levelTag = levelNumberToTag(level);
            charEntries
                .filter(entry => !entry.tags.includes(levelTag))
                .forEach(entry => entry.tags.push(levelTag));
        });
    });
}

function addAndDeduplicate(source, destination, generateKeyFunction, existingEntryKeys) {
    source.forEach(entry => {
        const key = generateKeyFunction(entry);
        if (existingEntryKeys.has(key)) {
            return;
        }

        existingEntryKeys.add(key);
        destination.push(entry);
    });
}

function generateKanaKey(entry) {
    return `${entry.entSeq}_${entry.kana.reb}`;
}

function generateKajiKey(entry) {
    return `${entry.kanji && entry.kanji.keb || ''}_${entry.kana.reb}`;
}

function createPriorities(entries) {
    const reduceBuilder = tagPrefix =>
        (acc, entry) => {
            entry.tags
                .filter(tag => tag.startsWith(tagPrefix))
                .forEach(tag => {
                    const entryList = acc.get(tag) || [];
                    entryList.push(entry);
                    acc.set(tag, entryList);
                })
            return acc;
        };

    const order = [
        ...[1, 2].map(num => [`ichi${num}`, `spec${num}`, `news${num}`, `gai${num}`]),
        ...[(() => {
            const result = [];
            for (let i = 1; i <= 48; i++) {
                result.push(`nf${i.toString().padStart(2, '0')}`);
            }
            return result;
        })()]
    ].flatMap(x => x);

    return {
        orderKanji: order.map(o => `${KANJI_PRIORITY_PREFIX}${o}`),
        orderKana: order.map(o => `${KANA_PRIORITY_PREFIX}${o}`),
        kanjiEntries: entries.reduce(reduceBuilder(KANJI_PRIORITY_PREFIX), new Map()),
        kanaEntries: entries.reduce(reduceBuilder(KANA_PRIORITY_PREFIX), new Map())
    }
}

function getTermCodeOrUndefined(term) {
    return term ? term.code : undefined;
}

function levelNumberToTag(level) {
    return `L${level.toString().padStart(3, '0')}`;
}

// Returns the tags array if applicable
// or null if not an exception
function handleJLPTVocabExceptions(entry) {
    switch (entry.entSeq) {
        case 1059720: // シーン - scene, sight (not JLPT word); not to be confused with シーン - silently, quietly (JLPT N2)
        case 5741603: // 坊っちゃん - the novel title instead of the word
        case 5740764: // ワンピース - the manga title instead of the dress
        case 5744958: // 同盟 - organization name instead of the word
        case 1136480: // 夜行 - や行 instead of "やこう" / "やぎょう"
        case 2714230: // 藁 - internet slang instead of the word
        case 2841466: // アクセル - jump in figure skating instead of accelerator (gas pedal)
        case 2851543: // キャリア - carrier (in chemistry / physics) instead of career
        case 2857525: // シック - clothing instead of the word
        case 2860832: // タイム - thyme instead of time
        case 5048739: // ダース - Darth Vader instead of dozen
        case 2863580: // デザート - desert instead of dessert
        case 2843630: // バット - shallow tray (usu. steel or plastic) instead of bat (in baseball, cricket, etc.)
        case 2855195: // ホース - horse instead of hose
        case 2841291: // ホール - whole instead of hole or hall
        case 2842181: // ランプ - rump (food) instead of lamp or ramp
        case 2848480: // レース - lathe instead of race or lace
        case 2849827: // ミス - myth instead of miss or Ms. or Miss
        case 1021010: // イエス - Jesus insetad of the word "yes"
            return [];
    }

    return null;
}