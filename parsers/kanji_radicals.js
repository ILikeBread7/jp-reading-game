import fs from 'node:fs';
import { LEVEL_CHARS } from '../ui/level-chars.js';

const kanjidic = JSON.parse(fs.readFileSync('kanjidic2.json', 'utf-8'));

const radicalsMap = new Map(
    kanjidic.kanjidic2.character.map(char => [ char.literal, getRadicalSafe(char.radical) ])
);
const chars = LEVEL_CHARS.flat(Number.MAX_SAFE_INTEGER);

const radicalCharsMap = new Map([
    [ 1, { radical: '一', meaning: 'one' } ],
    [ 2, { radical: '丨', meaning: 'line' } ],
    [ 3, { radical: '丶', meaning: 'dot' } ],
    [ 4, { radical: '丿 (乀)', meaning: 'slash' } ],
    [ 5, { radical: '乙 (乚、乛、⺄)', meaning: 'second' } ],
    [ 6, { radical: '亅', meaning: 'hook' } ],
    [ 7, { radical: '二', meaning: 'two' } ],
    [ 8, { radical: '亠', meaning: 'lid' } ],
    [ 9, { radical: '人 (亻、𠆢)', meaning: 'man' } ],
    [ 10, { radical: '儿', meaning: 'son, legs' } ],
    [ 11, { radical: '入', meaning: 'enter' } ],
    [ 12, { radical: '八 (丷)', meaning: 'eight' } ],
    [ 13, { radical: '冂', meaning: 'wide' } ],
    [ 14, { radical: '冖', meaning: 'cloth cover' } ],
    [ 15, { radical: '冫', meaning: 'ice' } ],
    [ 16, { radical: '几', meaning: 'table' } ],
    [ 17, { radical: '凵', meaning: 'receptacle' } ],
    [ 18, { radical: '刀 (刂、⺈)', meaning: 'knife' } ],
    [ 19, { radical: '力', meaning: 'power' } ],
    [ 20, { radical: '勹', meaning: 'wrap' } ],
    [ 21, { radical: '匕', meaning: 'spoon' } ],
    [ 22, { radical: '匚', meaning: 'box' } ],
    [ 23, { radical: '匸', meaning: 'hiding enclosure' } ],
    [ 24, { radical: '十', meaning: 'ten' } ],
    [ 25, { radical: '卜', meaning: 'divination' } ],
    [ 26, { radical: '卩 (㔾)', meaning: 'seal (device)' } ],
    [ 27, { radical: '厂', meaning: 'cliff' } ],
    [ 28, { radical: '厶', meaning: 'private' } ],
    [ 29, { radical: '又', meaning: 'again' } ],
    [ 30, { radical: '口', meaning: 'mouth' } ],
    [ 31, { radical: '囗', meaning: 'enclosure' } ],
    [ 32, { radical: '土', meaning: 'earth' } ],
    [ 33, { radical: '士', meaning: 'scholar' } ],
    [ 34, { radical: '夂', meaning: 'go' } ],
    [ 35, { radical: '夊', meaning: 'go slowly' } ],
    [ 36, { radical: '夕', meaning: 'evening' } ],
    [ 37, { radical: '大', meaning: 'big' } ],
    [ 38, { radical: '女', meaning: 'woman' } ],
    [ 39, { radical: '子', meaning: 'child' } ],
    [ 40, { radical: '宀', meaning: 'roof' } ],
    [ 41, { radical: '寸', meaning: 'inch' } ],
    [ 42, { radical: '小 (⺌、⺍)', meaning: 'small' } ],
    [ 43, { radical: '尢 (尣)', meaning: 'lame' } ],
    [ 44, { radical: '尸', meaning: 'corpse' } ],
    [ 45, { radical: '屮', meaning: 'sprout' } ],
    [ 46, { radical: '山', meaning: 'mountain' } ],
    [ 47, { radical: '巛 (川)', meaning: 'river' } ],
    [ 48, { radical: '工', meaning: 'work' } ],
    [ 49, { radical: '己', meaning: 'oneself' } ],
    [ 50, { radical: '巾', meaning: 'turban' } ],
    [ 51, { radical: '干', meaning: 'dry' } ],
    [ 52, { radical: '幺 (么)', meaning: 'short thread' } ],
    [ 53, { radical: '广', meaning: 'dotted cliff' } ],
    [ 54, { radical: '廴', meaning: 'long stride' } ],
    [ 55, { radical: '廾', meaning: 'arch' } ],
    [ 56, { radical: '弋', meaning: 'shoot' } ],
    [ 57, { radical: '弓', meaning: 'bow' } ],
    [ 58, { radical: '彐 (彑)', meaning: 'snout' } ],
    [ 59, { radical: '彡', meaning: 'bristle' } ],
    [ 60, { radical: '彳', meaning: 'step' } ],
    [ 61, { radical: '心 (忄、⺗)', meaning: 'heart' } ],
    [ 62, { radical: '戈', meaning: 'halberd' } ],
    [ 63, { radical: '戶 (户、戸)', meaning: 'door' } ],
    [ 64, { radical: '手 (扌、龵)', meaning: 'hand' } ],
    [ 65, { radical: '支', meaning: 'branch' } ],
    [ 66, { radical: '攴 (攵)', meaning: 'rap, tap' } ],
    [ 67, { radical: '文', meaning: 'script' } ],
    [ 68, { radical: '斗', meaning: 'dipper' } ],
    [ 69, { radical: '斤', meaning: 'axe' } ],
    [ 70, { radical: '方', meaning: 'square' } ],
    [ 71, { radical: '无 (旡)', meaning: 'not' } ],
    [ 72, { radical: '日', meaning: 'sun' } ],
    [ 73, { radical: '曰', meaning: 'say' } ],
    [ 74, { radical: '月', meaning: 'moon' } ],
    [ 75, { radical: '木', meaning: 'tree' } ],
    [ 76, { radical: '欠', meaning: 'lack' } ],
    [ 77, { radical: '止', meaning: 'stop' } ],
    [ 78, { radical: '歹 (歺)', meaning: 'death' } ],
    [ 79, { radical: '殳', meaning: 'weapon' } ],
    [ 80, { radical: '毋 (母)', meaning: 'do not' } ],
    [ 81, { radical: '比', meaning: 'compare' } ],
    [ 82, { radical: '毛', meaning: 'fur' } ],
    [ 83, { radical: '氏', meaning: 'clan' } ],
    [ 84, { radical: '气', meaning: 'steam' } ],
    [ 85, { radical: '水 (氵、氺)', meaning: 'water' } ],
    [ 86, { radical: '火 (灬)', meaning: 'fire' } ],
    [ 87, { radical: '爪 (爫)', meaning: 'claw' } ],
    [ 88, { radical: '父', meaning: 'father' } ],
    [ 89, { radical: '爻', meaning: 'trigrams' } ],
    [ 90, { radical: '爿 (丬)', meaning: 'split wood' } ],
    [ 91, { radical: '片', meaning: 'slice' } ],
    [ 92, { radical: '牙', meaning: 'fang' } ],
    [ 93, { radical: '牛 (牜、⺧)', meaning: 'cow' } ],
    [ 94, { radical: '犬 (犭)', meaning: 'dog' } ],
    [ 95, { radical: '玄', meaning: 'profound' } ],
    [ 96, { radical: '玉 (王、玊)', meaning: 'jade' } ],
    [ 97, { radical: '瓜', meaning: 'melon' } ],
    [ 98, { radical: '瓦', meaning: 'tile' } ],
    [ 99, { radical: '甘', meaning: 'sweet' } ],
    [ 100, { radical: '生', meaning: 'life' } ],
    [ 101, { radical: '用', meaning: 'use' } ],
    [ 102, { radical: '田', meaning: 'field' } ],
    [ 103, { radical: '疋 (⺪)', meaning: 'bolt of cloth' } ],
    [ 104, { radical: '疒', meaning: 'sickness' } ],
    [ 105, { radical: '癶', meaning: 'footsteps' } ],
    [ 106, { radical: '白', meaning: 'white' } ],
    [ 107, { radical: '皮', meaning: 'skin' } ],
    [ 108, { radical: '皿', meaning: 'dish' } ],
    [ 109, { radical: '目 (⺫)', meaning: 'eye' } ],
    [ 110, { radical: '矛', meaning: 'spear' } ],
    [ 111, { radical: '矢', meaning: 'arrow' } ],
    [ 112, { radical: '石', meaning: 'stone' } ],
    [ 113, { radical: '示 (礻)', meaning: 'spirit' } ],
    [ 114, { radical: '禸', meaning: 'track' } ],
    [ 115, { radical: '禾', meaning: 'grain' } ],
    [ 116, { radical: '穴', meaning: 'cave' } ],
    [ 117, { radical: '立', meaning: 'stand' } ],
    [ 118, { radical: '竹 (⺮)', meaning: 'bamboo' } ],
    [ 119, { radical: '米', meaning: 'rice' } ],
    [ 120, { radical: '糸 (糹)', meaning: 'silk' } ],
    [ 121, { radical: '缶', meaning: 'jar' } ],
    [ 122, { radical: '网 (⺲、罓、⺳)', meaning: 'net' } ],
    [ 123, { radical: '羊 (⺶、⺷)', meaning: 'sheep' } ],
    [ 124, { radical: '羽', meaning: 'feather' } ],
    [ 125, { radical: '老 (耂)', meaning: 'old' } ],
    [ 126, { radical: '而', meaning: 'and' } ],
    [ 127, { radical: '耒', meaning: 'plough' } ],
    [ 128, { radical: '耳', meaning: 'ear' } ],
    [ 129, { radical: '聿 (⺺、⺻)', meaning: 'brush' } ],
    [ 130, { radical: '肉 (⺼)', meaning: 'meat' } ],
    [ 131, { radical: '臣', meaning: 'minister' } ],
    [ 132, { radical: '自', meaning: 'self' } ],
    [ 133, { radical: '至', meaning: 'arrive' } ],
    [ 134, { radical: '臼', meaning: 'mortar' } ],
    [ 135, { radical: '舌', meaning: 'tongue' } ],
    [ 136, { radical: '舛', meaning: 'oppose' } ],
    [ 137, { radical: '舟', meaning: 'boat' } ],
    [ 138, { radical: '艮', meaning: 'stopping' } ],
    [ 139, { radical: '色', meaning: 'color' } ],
    [ 140, { radical: '艸 (⺿)', meaning: 'grass' } ],
    [ 141, { radical: '虍', meaning: 'tiger' } ],
    [ 142, { radical: '虫', meaning: 'insect' } ],
    [ 143, { radical: '血', meaning: 'blood' } ],
    [ 144, { radical: '行', meaning: 'walk enclosure' } ],
    [ 145, { radical: '衣 (⻂)', meaning: 'clothes' } ],
    [ 146, { radical: '襾 (西、覀)', meaning: 'cover' } ],
    [ 147, { radical: '見', meaning: 'see' } ],
    [ 148, { radical: '角 (⻇)', meaning: 'horn' } ],
    [ 149, { radical: '言 (訁)', meaning: 'speech' } ],
    [ 150, { radical: '谷', meaning: 'valley' } ],
    [ 151, { radical: '豆', meaning: 'bean' } ],
    [ 152, { radical: '豕', meaning: 'pig' } ],
    [ 153, { radical: '豸', meaning: 'badger' } ],
    [ 154, { radical: '貝', meaning: 'shell' } ],
    [ 155, { radical: '赤', meaning: 'red' } ],
    [ 156, { radical: '走', meaning: 'run' } ],
    [ 157, { radical: '足 (⻊)', meaning: 'foot' } ],
    [ 158, { radical: '身', meaning: 'body' } ],
    [ 159, { radical: '車', meaning: 'cart' } ],
    [ 160, { radical: '辛', meaning: 'bitter' } ],
    [ 161, { radical: '辰', meaning: 'morning' } ],
    [ 162, { radical: '辵 (⻌、⻍、⻎)', meaning: 'walk' } ],
    [ 163, { radical: '邑 (⻏)', meaning: 'city' } ],
    [ 164, { radical: '酉', meaning: 'wine' } ],
    [ 165, { radical: '釆', meaning: 'distinguish' } ],
    [ 166, { radical: '里', meaning: 'village' } ],
    [ 167, { radical: '金 (釒)', meaning: 'gold' } ],
    [ 168, { radical: '長 (镸)', meaning: 'long' } ],
    [ 169, { radical: '門', meaning: 'gate' } ],
    [ 170, { radical: '阜 (⻖)', meaning: 'mound' } ],
    [ 171, { radical: '隶', meaning: 'slave' } ],
    [ 172, { radical: '隹', meaning: 'short-tailed bird' } ],
    [ 173, { radical: '雨', meaning: 'rain' } ],
    [ 174, { radical: '靑 (青)', meaning: 'blue' } ],
    [ 175, { radical: '非', meaning: 'wrong' } ],
    [ 176, { radical: '面 (靣)', meaning: 'face' } ],
    [ 177, { radical: '革', meaning: 'leather' } ],
    [ 178, { radical: '韋', meaning: 'tanned leather' } ],
    [ 179, { radical: '韭', meaning: 'leek' } ],
    [ 180, { radical: '音', meaning: 'sound' } ],
    [ 181, { radical: '頁', meaning: 'leaf' } ],
    [ 182, { radical: '風', meaning: 'wind' } ],
    [ 183, { radical: '飛', meaning: 'fly' } ],
    [ 184, { radical: '食 (飠)', meaning: 'eat' } ],
    [ 185, { radical: '首', meaning: 'head' } ],
    [ 186, { radical: '香', meaning: 'fragrant' } ],
    [ 187, { radical: '馬', meaning: 'horse' } ],
    [ 188, { radical: '骨', meaning: 'bone' } ],
    [ 189, { radical: '高 (髙)', meaning: 'tall' } ],
    [ 190, { radical: '髟', meaning: 'hair' } ],
    [ 191, { radical: '鬥', meaning: 'fight' } ],
    [ 192, { radical: '鬯', meaning: 'sacrificial wine' } ],
    [ 193, { radical: '鬲', meaning: 'cauldron' } ],
    [ 194, { radical: '鬼', meaning: 'ghost' } ],
    [ 195, { radical: '魚', meaning: 'fish' } ],
    [ 196, { radical: '鳥', meaning: 'bird' } ],
    [ 197, { radical: '鹵', meaning: 'salt' } ],
    [ 198, { radical: '鹿', meaning: 'deer' } ],
    [ 199, { radical: '麥', meaning: 'wheat' } ],
    [ 200, { radical: '麻', meaning: 'hemp' } ],
    [ 201, { radical: '黃', meaning: 'yellow' } ],
    [ 202, { radical: '黍', meaning: 'millet' } ],
    [ 203, { radical: '黑', meaning: 'black' } ],
    [ 204, { radical: '黹', meaning: 'embroidery' } ],
    [ 205, { radical: '黽', meaning: 'frog' } ],
    [ 206, { radical: '鼎', meaning: 'tripod' } ],
    [ 207, { radical: '鼓', meaning: 'drum' } ],
    [ 208, { radical: '鼠', meaning: 'rat' } ],
    [ 209, { radical: '鼻', meaning: 'nose' } ],
    [ 210, { radical: '齊 (斉)', meaning: 'even' } ],
    [ 211, { radical: '齒', meaning: 'tooth' } ],
    [ 212, { radical: '龍', meaning: 'dragon' } ],
    [ 213, { radical: '龜', meaning: 'turtle' } ],
    [ 214, { radical: '龠', meaning: 'flute' } ]
]);

const firstRadicalMap = new Map();

for (let i = chars.indexOf('日'); i < chars.length; i++) {
    const char = chars[i];

    const radical = radicalsMap.get(char);
    if (!radical) {
        continue;
    }
    const firstRadical = firstRadicalMap.get(radical);

    if (!firstRadical || radicalCharsMap.get(radical).radical.includes(firstRadical)) {
        firstRadicalMap.set(radical, char);
    }
}

console.log(
    [...firstRadicalMap.entries()]
        .filter(([key]) => !!key)
        .sort(([key1], [key2]) => key1 - key2)
        .map(([key, value]) => `[ '${value}', 'The ${radicalCharsMap.get(key).radical} radical of ${value} kanji means "${radicalCharsMap.get(key).meaning}".' ]`)
        .join(',\n')
);

function getRadicalInfo(radical) {
    if (Array.isArray(radical['rad_value'])) {
        return radical['rad_value'][0];
    }

    return radical['rad_value'];
}

function getRadical(radicalInfo) {
    return radicalInfo['#text'];
}

function getRadicalSafe(radical) {
    if (!radical) {
        return;
    }

    return Number(getRadical(getRadicalInfo(radical)));
}