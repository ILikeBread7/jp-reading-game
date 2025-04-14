import fs from 'node:fs';
import * as wanakana from 'wanakana';

const TERMS_TEXT_BY_CODE = {
    // <dial> (dialect) entities
    "bra": { code: "bra", text: "Brazilian" },
    "hob": { code: "hob", text: "Hokkaido-ben" },
    "ksb": { code: "ksb", text: "Kansai-ben" },
    "ktb": { code: "ktb", text: "Kantou-ben" },
    "kyb": { code: "kyb", text: "Kyoto-ben" },
    "kyu": { code: "kyu", text: "Kyuushuu-ben" },
    "nab": { code: "nab", text: "Nagano-ben" },
    "osb": { code: "osb", text: "Osaka-ben" },
    "rkb": { code: "rkb", text: "Ryuukyuu-ben" },
    "thb": { code: "thb", text: "Touhoku-ben" },
    "tsb": { code: "tsb", text: "Tosa-ben" },
    "tsug": { code: "tsug", text: "Tsugaru-ben" },
    
    // <field> entities
    "agric": { code: "agric", text: "agriculture" },
    "anat": { code: "anat", text: "anatomy" },
    "archeol": { code: "archeol", text: "archeology" },
    "archit": { code: "archit", text: "architecture" },
    "art": { code: "art", text: "art, aesthetics" },
    "astron": { code: "astron", text: "astronomy" },
    "audvid": { code: "audvid", text: "audiovisual" },
    "aviat": { code: "aviat", text: "aviation" },
    "baseb": { code: "baseb", text: "baseball" },
    "biochem": { code: "biochem", text: "biochemistry" },
    "biol": { code: "biol", text: "biology" },
    "bot": { code: "bot", text: "botany" },
    "boxing": { code: "boxing", text: "boxing" },
    "Buddh": { code: "Buddh", text: "Buddhism" },
    "bus": { code: "bus", text: "business" },
    "cards": { code: "cards", text: "card games" },
    "chem": { code: "chem", text: "chemistry" },
    "chmyth": { code: "chmyth", text: "Chinese mythology" },
    "Christn": { code: "Christn", text: "Christianity" },
    "civeng": { code: "civeng", text: "civil engineering" },
    "cloth": { code: "cloth", text: "clothing" },
    "comp": { code: "comp", text: "computing" },
    "cryst": { code: "cryst", text: "crystallography" },
    "dent": { code: "dent", text: "dentistry" },
    "ecol": { code: "ecol", text: "ecology" },
    "econ": { code: "econ", text: "economics" },
    "elec": { code: "elec", text: "electricity, elec. eng." },
    "electr": { code: "electr", text: "electronics" },
    "embryo": { code: "embryo", text: "embryology" },
    "engr": { code: "engr", text: "engineering" },
    "ent": { code: "ent", text: "entomology" },
    "figskt": { code: "figskt", text: "figure skating" },
    "film": { code: "film", text: "film" },
    "finc": { code: "finc", text: "finance" },
    "fish": { code: "fish", text: "fishing" },
    "food": { code: "food", text: "food, cooking" },
    "gardn": { code: "gardn", text: "gardening, horticulture" },
    "genet": { code: "genet", text: "genetics" },
    "geogr": { code: "geogr", text: "geography" },
    "geol": { code: "geol", text: "geology" },
    "geom": { code: "geom", text: "geometry" },
    "go": { code: "go", text: "go (game)" },
    "golf": { code: "golf", text: "golf" },
    "gramm": { code: "gramm", text: "grammar" },
    "grmyth": { code: "grmyth", text: "Greek mythology" },
    "hanaf": { code: "hanaf", text: "hanafuda" },
    "horse": { code: "horse", text: "horse racing" },
    "internet": { code: "internet", text: "Internet" },
    "jpmyth": { code: "jpmyth", text: "Japanese mythology" },
    "kabuki": { code: "kabuki", text: "kabuki" },
    "law": { code: "law", text: "law" },
    "ling": { code: "ling", text: "linguistics" },
    "logic": { code: "logic", text: "logic" },
    "MA": { code: "MA", text: "martial arts" },
    "mahj": { code: "mahj", text: "mahjong" },
    "manga": { code: "manga", text: "manga" },
    "math": { code: "math", text: "mathematics" },
    "mech": { code: "mech", text: "mechanical engineering" },
    "med": { code: "med", text: "medicine" },
    "met": { code: "met", text: "meteorology" },
    "mil": { code: "mil", text: "military" },
    "min": { code: "min", text: "mineralogy" },
    "mining": { code: "mining", text: "mining" },
    "motor": { code: "motor", text: "motorsport" },
    "music": { code: "music", text: "music" },
    "noh": { code: "noh", text: "noh" },
    "ornith": { code: "ornith", text: "ornithology" },
    "paleo": { code: "paleo", text: "paleontology" },
    "pathol": { code: "pathol", text: "pathology" },
    "pharm": { code: "pharm", text: "pharmacology" },
    "phil": { code: "phil", text: "philosophy" },
    "photo": { code: "photo", text: "photography" },
    "physics": { code: "physics", text: "physics" },
    "physiol": { code: "physiol", text: "physiology" },
    "politics": { code: "politics", text: "politics" },
    "print": { code: "print", text: "printing" },
    "prowres": { code: "prowres", text: "professional wrestling" },
    "psy": { code: "psy", text: "psychiatry" },
    "psyanal": { code: "psyanal", text: "psychoanalysis" },
    "psych": { code: "psych", text: "psychology" },
    "rail": { code: "rail", text: "railway" },
    "rommyth": { code: "rommyth", text: "Roman mythology" },
    "Shinto": { code: "Shinto", text: "Shinto" },
    "shogi": { code: "shogi", text: "shogi" },
    "ski": { code: "ski", text: "skiing" },
    "sports": { code: "sports", text: "sports" },
    "stat": { code: "stat", text: "statistics" },
    "stockm": { code: "stockm", text: "stock market" },
    "sumo": { code: "sumo", text: "sumo" },
    "surg": { code: "surg", text: "surgery" },
    "telec": { code: "telec", text: "telecommunications" },
    "tradem": { code: "tradem", text: "trademark" },
    "tv": { code: "tv", text: "television" },
    "vet": { code: "vet", text: "veterinary terms" },
    "vidg": { code: "vidg", text: "video games" },
    "zool": { code: "zool", text: "zoology" },
    
    // <ke_inf> (kanji info) entities
    "ateji": { code: "ateji", text: "ateji (phonetic) reading" },
    "ik": { code: "ik", text: "word containing irregular kana usage" },
    "iK": { code: "iK", text: "word containing irregular kanji usage" },
    "io": { code: "io", text: "irregular okurigana usage" },
    "oK": { code: "oK", text: "word containing out-dated kanji or kanji usage" },
    "rK": { code: "rK", text: "rarely used kanji form" },
    "sK": { code: "sK", text: "search-only kanji form" },
    
    // <misc> (miscellaneous) entities
    "abbr": { code: "abbr", text: "abbreviation" },
    "arch": { code: "arch", text: "archaic" },
    "char": { code: "char", text: "character" },
    "chn": { code: "chn", text: "children's language" },
    "col": { code: "col", text: "colloquial" },
    "company": { code: "company", text: "company name" },
    "creat": { code: "creat", text: "creature" },
    "dated": { code: "dated", text: "dated term" },
    "dei": { code: "dei", text: "deity" },
    "derog": { code: "derog", text: "derogatory" },
    "doc": { code: "doc", text: "document" },
    "euph": { code: "euph", text: "euphemistic" },
    "ev": { code: "ev", text: "event" },
    "fam": { code: "fam", text: "familiar language" },
    "fem": { code: "fem", text: "female term or language" },
    "fict": { code: "fict", text: "fiction" },
    "form": { code: "form", text: "formal or literary term" },
    "given": { code: "given", text: "given name or forename, gender not specified" },
    "group": { code: "group", text: "group" },
    "hist": { code: "hist", text: "historical term" },
    "hon": { code: "hon", text: "honorific or respectful (sonkeigo) language" },
    "hum": { code: "hum", text: "humble (kenjougo) language" },
    "id": { code: "id", text: "idiomatic expression" },
    "joc": { code: "joc", text: "jocular, humorous term" },
    "leg": { code: "leg", text: "legend" },
    "m-sl": { code: "m-sl", text: "manga slang" },
    "male": { code: "male", text: "male term or language" },
    "myth": { code: "myth", text: "mythology" },
    "net-sl": { code: "net-sl", text: "Internet slang" },
    "obj": { code: "obj", text: "object" },
    "obs": { code: "obs", text: "obsolete term" },
    "on-mim": { code: "on-mim", text: "onomatopoeic or mimetic word" },
    "organization": { code: "organization", text: "organization name" },
    "oth": { code: "oth", text: "other" },
    "person": { code: "person", text: "full name of a particular person" },
    "place": { code: "place", text: "place name" },
    "poet": { code: "poet", text: "poetical term" },
    "pol": { code: "pol", text: "polite (teineigo) language" },
    "product": { code: "product", text: "product name" },
    "proverb": { code: "proverb", text: "proverb" },
    "quote": { code: "quote", text: "quotation" },
    "rare": { code: "rare", text: "rare term" },
    "relig": { code: "relig", text: "religion" },
    "sens": { code: "sens", text: "sensitive" },
    "serv": { code: "serv", text: "service" },
    "ship": { code: "ship", text: "ship name" },
    "sl": { code: "sl", text: "slang" },
    "station": { code: "station", text: "railway station" },
    "surname": { code: "surname", text: "family or surname" },
    "uk": { code: "uk", text: "word usually written using kana alone" },
    "unclass": { code: "unclass", text: "unclassified name" },
    "vulg": { code: "vulg", text: "vulgar expression or word" },
    "work": { code: "work", text: "work of art, literature, music, etc. name" },
    "X": { code: "X", text: "rude or X-rated term (not displayed in educational software)" },
    "yoji": { code: "yoji", text: "yojijukugo" },
    
    // <pos> (part-of-speech) entities
    "adj-f": { code: "adj-f", text: "noun or verb acting prenominally" },
    "adj-i": { code: "adj-i", text: "adjective (keiyoushi)" },
    "adj-ix": { code: "adj-ix", text: "adjective (keiyoushi) - yoi/ii class" },
    "adj-kari": { code: "adj-kari", text: "'kari' adjective (archaic)" },
    "adj-ku": { code: "adj-ku", text: "'ku' adjective (archaic)" },
    "adj-na": { code: "adj-na", text: "adjectival nouns or quasi-adjectives (keiyodoshi)" },
    "adj-nari": { code: "adj-nari", text: "archaic/formal form of na-adjective" },
    "adj-no": { code: "adj-no", text: "nouns which may take the genitive case particle 'no'" },
    "adj-pn": { code: "adj-pn", text: "pre-noun adjectival (rentaishi)" },
    "adj-shiku": { code: "adj-shiku", text: "'shiku' adjective (archaic)" },
    "adj-t": { code: "adj-t", text: "'taru' adjective" },
    "adv": { code: "adv", text: "adverb (fukushi)" },
    "adv-to": { code: "adv-to", text: "adverb taking the 'to' particle" },
    "aux": { code: "aux", text: "auxiliary" },
    "aux-adj": { code: "aux-adj", text: "auxiliary adjective" },
    "aux-v": { code: "aux-v", text: "auxiliary verb" },
    "conj": { code: "conj", text: "conjunction" },
    "cop": { code: "cop", text: "copula" },
    "ctr": { code: "ctr", text: "counter" },
    "exp": { code: "exp", text: "expressions (phrases, clauses, etc.)" },
    "int": { code: "int", text: "interjection (kandoushi)" },
    "n": { code: "n", text: "noun (common) (futsuumeishi)" },
    "n-adv": { code: "n-adv", text: "adverbial noun (fukushitekimeishi)" },
    "n-pr": { code: "n-pr", text: "proper noun" },
    "n-pref": { code: "n-pref", text: "noun, used as a prefix" },
    "n-suf": { code: "n-suf", text: "noun, used as a suffix" },
    "n-t": { code: "n-t", text: "noun (temporal) (jisoumeishi)" },
    "num": { code: "num", text: "numeric" },
    "pn": { code: "pn", text: "pronoun" },
    "pref": { code: "pref", text: "prefix" },
    "prt": { code: "prt", text: "particle" },
    "suf": { code: "suf", text: "suffix" },
    "unc": { code: "unc", text: "unclassified" },
    "v-unspec": { code: "v-unspec", text: "verb unspecified" },
    "v1": { code: "v1", text: "Ichidan verb" },
    "v1-s": { code: "v1-s", text: "Ichidan verb - kureru special class" },
    "v2a-s": { code: "v2a-s", text: "Nidan verb with 'u' ending (archaic)" },
    "v2b-k": { code: "v2b-k", text: "Nidan verb (upper class) with 'bu' ending (archaic)" },
    "v2b-s": { code: "v2b-s", text: "Nidan verb (lower class) with 'bu' ending (archaic)" },
    "v2d-k": { code: "v2d-k", text: "Nidan verb (upper class) with 'dzu' ending (archaic)" },
    "v2d-s": { code: "v2d-s", text: "Nidan verb (lower class) with 'dzu' ending (archaic)" },
    "v2g-k": { code: "v2g-k", text: "Nidan verb (upper class) with 'gu' ending (archaic)" },
    "v2g-s": { code: "v2g-s", text: "Nidan verb (lower class) with 'gu' ending (archaic)" },
    "v2h-k": { code: "v2h-k", text: "Nidan verb (upper class) with 'hu/fu' ending (archaic)" },
    "v2h-s": { code: "v2h-s", text: "Nidan verb (lower class) with 'hu/fu' ending (archaic)" },
    "v2k-k": { code: "v2k-k", text: "Nidan verb (upper class) with 'ku' ending (archaic)" },
    "v2k-s": { code: "v2k-s", text: "Nidan verb (lower class) with 'ku' ending (archaic)" },
    "v2m-k": { code: "v2m-k", text: "Nidan verb (upper class) with 'mu' ending (archaic)" },
    "v2m-s": { code: "v2m-s", text: "Nidan verb (lower class) with 'mu' ending (archaic)" },
    "v2n-s": { code: "v2n-s", text: "Nidan verb (lower class) with 'nu' ending (archaic)" },
    "v2r-k": { code: "v2r-k", text: "Nidan verb (upper class) with 'ru' ending (archaic)" },
    "v2r-s": { code: "v2r-s", text: "Nidan verb (lower class) with 'ru' ending (archaic)" },
    "v2s-s": { code: "v2s-s", text: "Nidan verb (lower class) with 'su' ending (archaic)" },
    "v2t-k": { code: "v2t-k", text: "Nidan verb (upper class) with 'tsu' ending (archaic)" },
    "v2t-s": { code: "v2t-s", text: "Nidan verb (lower class) with 'tsu' ending (archaic)" },
    "v2w-s": { code: "v2w-s", text: "Nidan verb (lower class) with 'u' ending and 'we' conjugation (archaic)" },
    "v2y-k": { code: "v2y-k", text: "Nidan verb (upper class) with 'yu' ending (archaic)" },
    "v2y-s": { code: "v2y-s", text: "Nidan verb (lower class) with 'yu' ending (archaic)" },
    "v2z-s": { code: "v2z-s", text: "Nidan verb (lower class) with 'zu' ending (archaic)" },
    "v4b": { code: "v4b", text: "Yodan verb with 'bu' ending (archaic)" },
    "v4g": { code: "v4g", text: "Yodan verb with 'gu' ending (archaic)" },
    "v4h": { code: "v4h", text: "Yodan verb with 'hu/fu' ending (archaic)" },
    "v4k": { code: "v4k", text: "Yodan verb with 'ku' ending (archaic)" },
    "v4m": { code: "v4m", text: "Yodan verb with 'mu' ending (archaic)" },
    "v4n": { code: "v4n", text: "Yodan verb with 'nu' ending (archaic)" },
    "v4r": { code: "v4r", text: "Yodan verb with 'ru' ending (archaic)" },
    "v4s": { code: "v4s", text: "Yodan verb with 'su' ending (archaic)" },
    "v4t": { code: "v4t", text: "Yodan verb with 'tsu' ending (archaic)" },
    "v5aru": { code: "v5aru", text: "Godan verb - -aru special class" },
    "v5b": { code: "v5b", text: "Godan verb with 'bu' ending" },
    "v5g": { code: "v5g", text: "Godan verb with 'gu' ending" },
    "v5k": { code: "v5k", text: "Godan verb with 'ku' ending" },
    "v5k-s": { code: "v5k-s", text: "Godan verb - Iku/Yuku special class" },
    "v5m": { code: "v5m", text: "Godan verb with 'mu' ending" },
    "v5n": { code: "v5n", text: "Godan verb with 'nu' ending" },
    "v5r": { code: "v5r", text: "Godan verb with 'ru' ending" },
    "v5r-i": { code: "v5r-i", text: "Godan verb with 'ru' ending (irregular verb)" },
    "v5s": { code: "v5s", text: "Godan verb with 'su' ending" },
    "v5t": { code: "v5t", text: "Godan verb with 'tsu' ending" },
    "v5u": { code: "v5u", text: "Godan verb with 'u' ending" },
    "v5u-s": { code: "v5u-s", text: "Godan verb with 'u' ending (special class)" },
    "v5uru": { code: "v5uru", text: "Godan verb - Uru old class verb (old form of Eru)" },
    "vi": { code: "vi", text: "intransitive verb" },
    "vk": { code: "vk", text: "Kuru verb - special class" },
    "vn": { code: "vn", text: "irregular nu verb" },
    "vr": { code: "vr", text: "irregular ru verb, plain form ends with -ri" },
    "vs": { code: "vs", text: "noun or participle which takes the aux. verb suru" },
    "vs-c": { code: "vs-c", text: "su verb - precursor to the modern suru" },
    "vs-i": { code: "vs-i", text: "suru verb - included" },
    "vs-s": { code: "vs-s", text: "suru verb - special class" },
    "vt": { code: "vt", text: "transitive verb" },
    "vz": { code: "vz", text: "Ichidan verb - zuru verb (alternative form of -jiru verbs)" },
    
    // <re_inf> (reading info) entities
    "gikun": { code: "gikun", text: "gikun (meaning as reading) or jukujikun (special kanji reading)" },
    "ik": { code: "ik", text: "word containing irregular kana usage" },
    "ok": { code: "ok", text: "out-dated or obsolete kana usage" },
    "rk": { code: "rk", text: "rarely used kana form" },
    "sk": { code: "sk", text: "search-only kana form" }
};

const TERMS_TEXT_BY_TEXT = {};
Object.entries(TERMS_TEXT_BY_CODE).forEach(([key, value]) => TERMS_TEXT_BY_TEXT[value.text] = { code: value.code, text: value.text });

const TERMS_MAPPER = TERMS_TEXT_BY_CODE;

const aGyou = 'あいうえおぁぃぅぇぉ';
const kaGyou = 'かきくけこがぎぐげご' + aGyou;
const saGyou = 'さしすせそざじずぜぞ' + kaGyou;
const taGyou = 'たちっつてとだぢづでど' + saGyou;
const naGyou = 'なにぬねの' + taGyou;
const haGyou = 'はひふへほばびぶべぼぱぴぷぺぽ' + naGyou;
const maGyou = 'まみむめも' + haGyou;
const yaGyou = 'やゆよゃゅょ' + maGyou;
const raGyou = 'らりるれろ' + yaGyou;
const waGyou = 'わを' + raGyou;
const nGyou = 'ん' + waGyou;

const hiragana = [
    { tag: 'a', chars: aGyou },
    { tag: 'k', chars: kaGyou },
    { tag: 's', chars: saGyou },
    { tag: 't', chars: taGyou },
    { tag: 'n', chars: naGyou },
    { tag: 'h', chars: haGyou },
    { tag: 'm', chars: maGyou },
    { tag: 'y', chars: yaGyou },
    { tag: 'r', chars: raGyou },
    { tag: 'w', chars: waGyou },
    { tag: 'n', chars: nGyou }
];
const katakana = hiragana.map(entry => ({ tag: entry.tag.toUpperCase(), chars: 'ー' + wanakana.toKatakana(entry.chars) }));
[...hiragana, ...katakana].forEach(gyou => gyou.regExp = new RegExp(regExpString(gyou.chars)));

fs.readFile('JMdict_e.json', 'utf-8', (err, jsonData) => {
    if (err) {
        console.error(err);
        return;
    }

    const data = JSON.parse(jsonData);
    const result = [];
    data['JMdict']['entry'].forEach(e => {
        const entry = {
            id: e['ent_seq'],
            kana: elementToArray(e['r_ele']),
            sense: elementToArray(e['sense'])
        };

        const kEle = e['k_ele'];
        if (kEle) {
            entry.kanji = elementToArray(kEle);
        }

        entry.tags = createTags(entry);

        result.push(entry);
    });

    fs.writeFile('dict.json', JSON.stringify(result, null, 2), () => {
        'Dict file written!'
    });
});

function elementToArray(element) {
    if (Array.isArray(element)) {
        return element;
    }

    return [ element ];
}

function createTags(entry) {
    const tags = [];

    tags.push(...createKanaTags(entry));

    return tags;
}

function createKanaTags(entry) {
    return [
        ...createTagsForKana(entry, hiragana),
        ...createTagsForKana(entry, katakana)
    ];
}

function regExpString(str) {
    return `^[${[...str].join('|')}]+$`;
}

function createTagsForKana(entry, kana) {
    for (let i = 0; i < kana.length; i++) {
        const kanaGyou = kana[i];
        if (entry.kana.find(k => k.reb.match(kanaGyou.regExp))) {
            return [kanaGyou.tag];
        }
    }

    return [];
}