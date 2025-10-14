import fs from 'node:fs';
import * as wanakana from 'wanakana';
import { KANA_STRINGS, LEVEL_CHARS } from '../ui/level-chars.js';

const DEBUG = process.argv[2] !== 'prod';
const CONFIG = DEBUG
    ? { // debug config
        indentSize: 2,
        includeTags: true
    }
    : { // prod config
        indentSize: 0,
        includeTags: false
    };
console.log(DEBUG ? 'Running debug.' : 'Running prod!');

const READ_PATH = '';
const WRITE_PATH = '../ui/dicts/';

const LANGUAGES = new Map([
    ['kor', 'Korean'],
    ['chi', 'Chinese'],
    ['ger', 'German'],
    ['fre', 'French'],
    ['ain', 'Ainu'],
    ['lat', 'Latin'],
    ['eng', 'English'],
    ['ita', 'Italian'],
    ['dut', 'Dutch'],
    ['spa', 'Spanish'],
    ['afr', 'Afrikaans'],
    ['gre', 'Modern Greek'],
    ['per', 'Persian'],
    ['ara', 'Arabic'],
    ['rus', 'Russian'],
    ['haw', 'Hawaiian'],
    ['epo', 'Esperanto'],
    ['por', 'Portuguese'],
    ['swe', 'Swedish'],
    ['heb', 'Hebrew'],
    ['san', 'Sanskrit'],
    ['ind', 'Indonesian'],
    ['vie', 'Vietnamese'],
    ['fin', 'Finnish'],
    ['tur', 'Turkish'],
    ['hin', 'Hindi'],
    ['nor', 'Norwegian'],
    ['cze', 'Czech'],
    ['ukr', 'Ukrainian'],
    ['pol', 'Polish'],
    ['tha', 'Thai'],
    ['tgl', 'Tagalog'],
    ['grc', 'Ancient Greek'],
    ['tib', 'Tibetan'],
    ['tah', 'Tahitian'],
    ['hun', 'Hungarian'],
    ['alg', 'Algonquian languages'],
    ['bur', 'Burmese'],
    ['mon', 'Mongolian'],
    ['yid', 'Yiddish'],
    ['may', 'Malay'],
    ['bnt', 'Bantu languages'],
    ['fil', 'Filipino'],
    ['mal', 'Malayalam'],
    ['som', 'Somali'],
    ['khm', 'Central Khmer'],
    ['mnc', 'Manchu'],
    ['bre', 'Breton'],
    ['kur', 'Kurdish'],
    ['chn', 'Chinook Jargon'],
    ['amh', 'Amharic'],
    ['tam', 'Tamil'],
    ['mao', 'Maori'],
    ['dan', 'Danish'],
    ['slv', 'Slovenian'],
    ['geo', 'Georgian'],
    ['ice', 'Icelandic'],
    ['scr', 'Serbo-Croatian'],
    ['swa', 'Swahili'],
    ['urd', 'Urdu'],
    ['est', 'Estonian'],
    ['lit', 'Lithuanian'],
    ['rum', 'Romanian'],
    ['uzb', 'Uzbek'],
    ['arn', 'Mapudungun; Mapuche'],
    ['bul', 'Bulgarian']
]);

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
    [ "id", { code: "id", text: "idiomatic expression" } ],
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

const GLOSS_TYPES = new Map([
    [ 'lit', 'Literal' ],
    [ 'fig', 'Figurative' ],
    [ 'expl', 'Explanation' ],
    [ 'tm', 'Trademark' ]
]);

const CENSORED_MISC_TAGS = new Set([
    'vulg', 'sens', 'derog'
]);

const CENSORED_MISC_TEXTS = new Set(
    [...CENSORED_MISC_TAGS]
        .map(tag => TERMS_TEXT_BY_CODE.get(tag).text)
);

const FILTER_OUT_LEVEL_ENTRY_GLOSSES = [
    'Aum Shinrikyo', 'fascism', 'fascist',              // Cult or political
    'friendly relations between Japan and Israel',
    
    'erotic', 'sex position', 'masturbation',           // Sensitive
    'Judaism', 'Allah', 'Protestant',                   // Religion
    'fotiaoqiang', 'Minerva (goddess)', 'Vulcan (god)'  // Contain characters we don't want to deal with
];
const FILTER_OUT_LEVEL_ENTRY_MISCS = new Set([
    TERMS_TEXT_BY_CODE.get('sens').text,
    TERMS_TEXT_BY_CODE.get('obs').text
]);

const TERMS_TEXT_BY_TEXT = new Map();
TERMS_TEXT_BY_CODE.forEach((value, key) => TERMS_TEXT_BY_TEXT.set(value.text, { code: value.code, text: value.text }));

const TERMS_MAPPER = TERMS_TEXT_BY_TEXT;

const UNUSED_KANJI_TERMS_SET = new Set(['uk', 'rK', 'sK']);
const UNUSED_KANA_TERMS_SET = new Set(['sk']);

const MASK_CHAR = '・';
const KANJI_PRIORITY_PREFIX = 'kp';
const KANA_PRIORITY_PREFIX = 'rp';
const TARGET_ENTRIES_PER_CHAR = 20;
const MIN_ENTRIES_PER_CHAR = 15;

const JSON_FORMAT_INDENT_SIZE = CONFIG.indentSize;

const jlptKanjiData = JSON.parse(fs.readFileSync(READ_PATH + 'jlpt_kanji.json', 'utf-8'));
const jlptVocabData = JSON.parse(fs.readFileSync(READ_PATH + 'jlpt_vocab.json', 'utf-8'));

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

const CHAR_TO_LEVEL = new Map();
LEVEL_CHARS.forEach((chars, index) => {
    const level = index + 1;
    chars.forEach(char => {
        CHAR_TO_LEVEL.set(char, level);
    });
});

const data = JSON.parse(fs.readFileSync(READ_PATH + 'JMdict_e.json', 'utf-8'));
const dictEntries = data['JMdict']['entry'];
const entriesMap = new Map();

const SEARCH_ONLY_KANJI = 'search-only kanji form';
const censoredEntries = [];
const entries = dictEntries.flatMap((entry, index) => {
    const separatedEntry = [];

    elementToArray(entry['k_ele']).forEach((kanji, index, kanjiElements) => {
        if (kanji && elementToArray(kanji['ke_inf']).includes(SEARCH_ONLY_KANJI)) {
            // If all kanji are search-only
            // use only the first one
            if (index > 0) {
                return;
            }
            
            // If there is another kanji in the entry
            // that is not search-only use that one
            if (kanjiElements.some(k => !elementToArray(k['ke_inf']).includes(SEARCH_ONLY_KANJI))) {
                return;
            }

            // If the only kanji in the entry is search-only
            // proceed with kana but no kanji
            kanji = undefined;
        }

        elementToArray(entry['r_ele']).forEach(kana => {
            if (kanji && kana.re_restr && !elementToArray(kana.re_restr).includes(kanji.keb)) {
                return;
            }

            if (kana.re_inf && !UNUSED_KANA_TERMS_SET.isDisjointFrom(new Set(elementToArray(kana.re_inf).map(term => TERMS_MAPPER.get(term).code)))) {
                return;
            }

            const originalEntry = { kanji, kana };

            const filteredSenses = elementToArray(entry['sense'])
                .filter(sense => !sense.stagr || elementToArray(sense.stagr).includes(kana.reb))
                .filter(sense => !sense.stagk || elementToArray(sense.stagk).includes(kanji.keb))
                .filter(sense => sInfFilter(kanji, sense['s_inf']))
                .map(mapSense);

            const newEntry = { entSeq: entry['ent_seq'] };
            if (kanji) {
                newEntry.kanji = kanji.keb;
            }
            newEntry.kana = kana.reb;
            newEntry.sense = filteredSenses.map(sense => sense.sense);
            originalEntry.misc = filteredSenses
                .map(sense => sense.originalMisc)
                .filter(Boolean);

            newEntry.tags = createTags(newEntry, originalEntry);
            
            const filterVulgarSensesFunc = sense => {
                return !CENSORED_MISC_TEXTS.isDisjointFrom(new Set(sense.misc || []));
            };

            const censoredSenses = newEntry.sense
                .filter(filterVulgarSensesFunc);

            if (censoredSenses.length > 0) {
                const censoredEntry = { ...newEntry };
                censoredEntry.sense = censoredSenses;
                censoredEntry.tags = newEntry.tags
                    .filter(tag => CENSORED_MISC_TAGS.has(tag));
                censoredEntries.push(censoredEntry);

                if (kanji) {
                    entriesMap.set(kanji.keb, [...(entriesMap.get(kanji.keb) || []), censoredEntry]);
                }

                if (censoredSenses.length === newEntry.sense.length) {
                    return;
                }

                newEntry.sense = newEntry.sense
                    .filter(sense => !filterVulgarSensesFunc(sense));
                newEntry.tags = newEntry.tags
                    .filter(tag => !CENSORED_MISC_TAGS.has(tag));
            }

            if (kanji) {
                entriesMap.set(kanji.keb, [...(entriesMap.get(kanji.keb) || []), newEntry]);
            }

            const nomable = newEntry.kanji
                && !newEntry.kanji.includes('々')
                && kanjiElements
                    .some(otherKanji => {
                        return !(elementToArray(otherKanji['ke_inf']).includes(SEARCH_ONLY_KANJI))
                            && otherKanji.keb.includes('々')
                    });
            newEntry.flags = { nomable };
            separatedEntry.push(newEntry);
        });
    });

    // Show progress
    if (index % 10000 === 0) {
        console.log(`${Math.floor(100 * index / dictEntries.length)}%, ${index} / ${dictEntries.length}`);
    }

    return separatedEntry;
});

const allEntries = [ ...entries, ...censoredEntries ];
allEntries.forEach(entry => createUniqueHint(entry, entriesMap));

const priorities = createPriorities(entries);
createLevelTagsFromPriorities(priorities, entries);

if (DEBUG) {
    const jlptMismatches = {};
    jlptMismatchesMap.forEach((value, key) => {
        if (value !== 1) {
            jlptMismatches[key] = value;
        }
    });

    fs.writeFile(WRITE_PATH + 'jlpt_mismatches.json', JSON.stringify(
        jlptMismatches,
        null,
        2
    ), () => console.log('JLPT mismatches file written'));
    
    fs.writeFile(WRITE_PATH + 'dict.json', JSON.stringify(entries, null, JSON_FORMAT_INDENT_SIZE), () => console.log('Dict file written!'));
    fs.writeFile(WRITE_PATH + 'dict_censored.json', JSON.stringify(censoredEntries, null, JSON_FORMAT_INDENT_SIZE), () => console.log('Vulgar dict file written!'));
}

separateIntoTagEntries(allEntries)
    .forEach((tagEntries, tag) =>
        fs.writeFile(
            `${WRITE_PATH}${tag}.json`,
            JSON.stringify(tagEntries, null, JSON_FORMAT_INDENT_SIZE),
            () => console.log(`${tag} tag dict file written!`)
        )
    );

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

function mapSense(sense) {
    const result = {
        pos: elementToArray(sense.pos),
        gloss: elementToArray(sense.gloss).map(g => typeof g === 'object' ? { value: g.value, type: GLOSS_TYPES.get(g.g_type) } : g.toString())
    };

    if (sense.misc || sense.s_inf) {
        result.misc = [...(elementToArray(sense.misc)), sense.s_inf].filter(Boolean);
    }

    if (sense.lsource) {
        result.lsource = elementToArray(sense.lsource).map(ls => {
            const lsource = { lang: LANGUAGES.get(ls.lang || 'eng') };
            if (ls.value) {
                lsource.value = ls.value;
            }
            if (ls.ls_type) {
                lsource.type = ls.ls_type;
            }
            if (ls.ls_wasei) {
                lsource.wasei = true;
            }
            return lsource;
        });
    }

    if (sense.field) {
        result.field = elementToArray(sense.field);
    }

    if (sense.dial) {
        result.dial = elementToArray(sense.dial);
    }

    return { sense: result, originalMisc: sense.misc && elementToArray(sense.misc) };
}

function createUniqueHint(entry, entriesMap) {
    if (!entry.kanji) {
        return;
    }

    const katakana = wanakana.toKatakana(entry.kana);
    const otherEntries = entriesMap.get(entry.kanji)
        .map(other => ({ ...other, kana: wanakana.toKatakana(other.kana) }))
        .filter(other => katakana !== other.kana);

    if (otherEntries.length > 0) {
        const sameLengthReadingOthers = otherEntries.filter(other => other.kana.length === katakana.length);
        if (sameLengthReadingOthers.length > 0) {
            const otherKanas = sameLengthReadingOthers.map(entry => wanakana.toKatakana(entry.kana));
            const otherDistinctKanas = [ ...new Set(otherKanas) ];
            const mask = generateMask(katakana, otherDistinctKanas);
            if (mask) {
                entry.hint = [...entry.kana].map((char, index) => mask[index] ? char : MASK_CHAR).join('');
            } else {
                console.warn(`No unique hint mask found for id: ${entry.entSeq}, kanji: ${entry.kanji}, kana: ${entry.kana}`);
                const exceptionHint = generateExceptionHint(entry);
                if (exceptionHint) {
                    entry.hint = exceptionHint;
                    console.warn(`Exception hint mask for id: ${entry.entSeq}, kanji: ${entry.kanji}, kana: ${entry.kana}, hint: ${entry.hint}`);
                }
            }
        }

        // If mask wasn't generated in the previous step
        // add a general mask
        if (!entry.hint) {
            entry.hint = [...entry.kana].map(_ => MASK_CHAR).join('');
        }
    }
}

function generateExceptionHint(entry) {
    if (entry.kanji === '私') {
        switch (entry.kana) {
            case 'わたし':
            case 'あたし':
                return entry.kana.charAt(0).padEnd(entry.kana.length, MASK_CHAR);
            default: return;
        }
    }

    return;
}

/**
 * 
 * @param {string} word 
 * @param {[string]} others 
 * @returns {[boolean]} mask, true if character should be shown, false if masked
 */
function generateMask(word, others) {
    const mask = new Array(word.length).fill(false);

    for (let i = 0; i < mask.length && others.length > 0; i++) {
        let maxDisambiguation = { index: -1, value: 0 };

        for (let j = 0; j < mask.length; j++) {
            if (mask[j]) {
                continue;
            }

            const currentChar = word.charAt(j);
            const currentDisambiguation = others
                .filter(other => other.charAt(j) !== currentChar)
                .length;
            
            if (currentDisambiguation > maxDisambiguation.value) {
                maxDisambiguation.index = j;
                maxDisambiguation.value = currentDisambiguation;
            }
        }

        if (!maxDisambiguation.value) {
            break;
        }

        mask[maxDisambiguation.index] = true;

        // Keep only the other words that are still ambiguous
        // (look the same after applying the mask)
        const maskedWord = maskWord(word, mask);
        others = others
            .filter(other => maskedWord === maskWord(other, mask));
    }

    // Can't disambiguate, requires all characters to be known
    if (!mask.includes(false)) {
        return;
    }

    return mask;
}

function maskWord(word, mask) {
    return mask.map((_, index) => mask[index] ? word.charAt(index) : MASK_CHAR).join('');
}

function createTags(entry, originalEntry) {
    const tags = [
        ...createJLPTKanjiTags(entry),
        ...createJLPTVocabTags(entry, originalEntry),
        ...createFrequencyTags(entry, originalEntry),
        ...createCategoryTags(entry, originalEntry)
    ];

    return tags;
}

function createJLPTKanjiTags(entry) {
    if (!entry.kanji) {
        return [];
    }

    const kanjiList = [...entry.kanji]
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

function createJLPTVocabTags(entry, originalEntry) {
    const exceptionTags = handleJLPTVocabExceptions(entry);
    if (exceptionTags !== null) {
        return exceptionTags;
    }

    const matches = [];
    
    if (entry.kanji) {
        const key = JSON.stringify([entry.kanji, entry.kana]);
        const match = jlptVocabMap.get(key);
        if (match) {
            matches.push({ key, match });
        }
    }

    // No kanji or kanji isn't used
    if (
        !entry.kanji
        || elementToArray(originalEntry.kanji['ke_inf']).find(keInf => UNUSED_KANJI_TERMS_SET.has(getTermCodeOrUndefined(TERMS_MAPPER.get(keInf))))
        || !UNUSED_KANJI_TERMS_SET
            .isDisjointFrom(
                new Set(
                    entry.sense
                        .flatMap(sense => elementToArray(sense.misc))
                        .map(term => getTermCodeOrUndefined(TERMS_MAPPER.get(term)))
                )
            )
    ) {
        const key = JSON.stringify([entry.kana]);
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


function createCategoryTags(entry, originalEntry) {
    const result = [];

    originalEntry.misc.flat()
        .map(misc => TERMS_TEXT_BY_TEXT.get(misc).code)
        .forEach(tag => {
            if (!result.includes(tag)) {
                result.push(tag);
            }
        });

    if (entry.kanji) {
        const keInf = elementToArray(originalEntry.kanji['ke_inf']);
        if (keInf.includes(TERMS_TEXT_BY_CODE.get('ateji').text)) {
            result.push('ateji');
        }
    }

    const field = entry.sense.flatMap(sense => sense.field);
    const dialect = entry.sense.flatMap(sense => sense.dial);
    
    [ ...field, ...dialect ]
        .filter(Boolean)
        .map(tagText => TERMS_TEXT_BY_TEXT.get(tagText).code)
        .forEach(tag => {
            if (!result.includes(tag)) {
                result.push(tag);
            }
        });

    return result;
}

function createFrequencyTags(entry, originalEntry) {
    return [
        ...((entry.kanji && originalEntry.kanji.ke_pri && elementToArray(originalEntry.kanji.ke_pri)) || []).map(pri => `${KANJI_PRIORITY_PREFIX}${pri}`),
        ...((entry.kana && originalEntry.kana.re_pri && elementToArray(originalEntry.kana.re_pri)) || []).map(pri => `${KANA_PRIORITY_PREFIX}${pri}`)
    ]
}

function createLevelTagsFromPriorities(priorities, entries) {
    const acceptableCharsSet = new Set();
    const noDedupEntSeqChars = new Set(['ヶ', 'ヵ', '箇', '個']);

    LEVEL_CHARS.forEach((chars, index, array) => {
        const currentLevel = index + 1;
        const totalLevels = array.length;
        chars.forEach(char => acceptableCharsSet.add(char));

        chars.forEach(char => {
            console.log(`Creating level tags for: ${char}, Level: ${currentLevel} / ${totalLevels}`);
            const dedupEntSeq = !noDedupEntSeqChars.has(char);

            const existingEntryKeys = new Set();
            const isKanji = wanakana.isKanji(char) || noDedupEntSeqChars.has(char);
            const [ order, orderEntries, generateKeyFunction ] = isKanji
                ? [ priorities.orderKanji, priorities.kanjiEntries, generateKanjiKey ]
                : [ priorities.orderKana, priorities.kanaEntries, generateKanaKey ];
            
            const charFilter = isKanji
                ? entry => entry.kanji && entry.kanji.includes(char) && new Set(entry.kanji).isSubsetOf(acceptableCharsSet)
                : entry => entry.kana.includes(char) && new Set(entry.kana).isSubsetOf(acceptableCharsSet);
                
            let lastPriority;
            const charEntries = [];
            for (
                let i = 0;
                i < order.length && charEntries.length < TARGET_ENTRIES_PER_CHAR;
                i++
            ) {
                const currentOrder = lastPriority = order[i];
                const charPriorityEntries = (orderEntries.get(currentOrder) || []).filter(charFilter);
                addAndDeduplicate(charPriorityEntries, charEntries, generateKeyFunction, existingEntryKeys, dedupEntSeq);
            }
            console.log(` - Last priority: ${lastPriority}`);
            
            if (charEntries.length < MIN_ENTRIES_PER_CHAR) {
                console.log(` - Adding all entries, size with priorities only: ${charEntries.length}`);
                addAndDeduplicate(entries.filter(charFilter), charEntries, generateKeyFunction, existingEntryKeys, dedupEntSeq, MIN_ENTRIES_PER_CHAR);
            }
            console.log(` - Total number of entries: ${charEntries.length}`);
            if (charEntries.length === 0) {
                console.error(` - No entries for char: ${char}!`);
            }

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

function addAndDeduplicate(source, destination, generateKeyFunction, existingEntryKeys, dedupEntSeq, maxLength) {
    for (const entry of source) {
        if (maxLength !== undefined && destination.length >= maxLength) {
            break;
        }

        if (entry.nomable && acceptableCharsSet.has('々')) {
            continue;
        }

        const entSeq = entry.entSeq;
        if (dedupEntSeq && existingEntryKeys.has(entSeq)) {
            continue;
        }

        const key = generateKeyFunction(entry);
        if (existingEntryKeys.has(key)) {
            continue;
        }

        if (isLevelEntryToBeFilteredOut(entry)) {
            continue;
        }

        existingEntryKeys.add(key);
        if (dedupEntSeq) {
            existingEntryKeys.add(entSeq);
        }
        destination.push(entry);
    };
}

function isLevelEntryToBeFilteredOut(entry) {
    return (
            entry.sense.flatMap(sense => sense.misc)
                .some(misc => FILTER_OUT_LEVEL_ENTRY_MISCS.has(misc))
        )
        || entry.sense.flatMap(sense => sense.gloss).some(
            entryGloss => 
                FILTER_OUT_LEVEL_ENTRY_GLOSSES
                    .some(
                        filterOutGloss => (
                            typeof entryGloss === 'string'
                                ? entryGloss
                                : entryGloss.value
                            ).includes(filterOutGloss)
                    )
    );
}

function generateKanaKey(entry) {
    return wanakana.toKatakana(entry.kana);
}

function generateKanjiKey(entry) {
    return `${entry.kanji || ''}_${wanakana.toKatakana(entry.kana)}`;
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
        ...[1, 2].map(num => [`spec${num}`, `ichi${num}`, `news${num}`, `gai${num}`]),
        ...[(() => {
            const result = [];
            for (let i = 1; i <= 48; i++) {
                result.push(`nf${i.toString().padStart(2, '0')}`);
            }
            return result;
        })()]
    ].flat();

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

function separateIntoTagEntries(entries) {
    const NO_TAG = 'notag';

    return entries.reduce((acc, entry) => {
        const tags = entry.tags.length > 0 ? entry.tags : [ NO_TAG ];
        
        if (!CONFIG.includeTags) {
            delete entry.tags;
            delete entry.flags;
        }
        
        tags.forEach(tag => {
            if (isKanaLevelTag(tag)) {
                const kanaEntry = { ...entry, hint: entry.kanji };
                delete kanaEntry.kanji;
                addToTagMap(kanaEntry, tag, acc);

                // Entry has kanji and
                // it's only tag is the level tag
                if (entry.kanji && tags.length === 1) {
                    addToTagMap(entry, NO_TAG, acc);
                }
            } else {
                addToTagMap(entry, tag, acc);
            }
        });

        return acc;
    }, new Map());
}

function addToTagMap(entry, tag, map) {
    const tagEntries = map.get(tag) || [];
    tagEntries.push(entry);
    map.set(tag, tagEntries);
}

function isKanaLevelTag(tag) {
    const KANA_LEVEL_PREFIX = 'L';

    if (!tag.startsWith(KANA_LEVEL_PREFIX)) {
        return false;
    }

    const level = Number(tag.substring(KANA_LEVEL_PREFIX.length));
    return level <= KANA_STRINGS.length;
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