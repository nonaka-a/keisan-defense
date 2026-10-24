const BASE_INITIAL_HP = 50;
const WRONG_ANSWER_PENALTY = 5;

const waveData = [
    { title: 'はじまりの「たしざん」', monsters: ['add', 'add', 'add', 'add', 'add'] },
    { title: 'ひきざんも とうじょう！', monsters: ['add', 'subtract', 'add', 'subtract', 'add', 'subtract', 'add'] },
    { title: 'かけざんかいじゅうの しゅうげき！', monsters: ['add', 'subtract', 'multiply', 'add', 'subtract', 'multiply', 'add', 'multiply', 'multiply'] },
    { title: 'そらからの きょうい！', monsters: ['multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide', 'multiply', 'divide'] },
    { title: 'ぴょんぴょんパニック！', monsters: ['emoji', 'emoji', 'multiply', 'divide', 'emoji', 'emoji', 'multiply', 'divide', 'emoji', 'emoji'] },
    { title: 'ぶんしょうかいじんの なぞなぞ', monsters: ['word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word'] },
    { title: 'さいごの けっせん！', monsters: ['boss'] }
];

const items = {
    'damage_boost': { name: 'ゆうしゃのけん', description: 'でんせつの けん！ これが あれば、けいさんの こたえが ２ばいの ダメージに なる！', basePrice: 600, icon: 'images/damage-boost.png' },
    'gold_bonus': { name: 'おかねもちモンスター', description: 'モンスターが ゴールドを たくさん おとしてくれるように なるよ！', basePrice: 500, icon: 'images/gold-bonus.png' },
    'slow_field': { name: 'カメあるき', description: 'このうえを とおる てきは、ねばねばに つかまって あしが おそくなるよ。', basePrice: 150, icon: 'images/slow-field-icon.png', image: 'images/slow-field.png' },
    'sweep': { name: 'おおそうじ', description: 'ビューン！っと つよいかぜで、がめんの てきを ぜーんぶ ふきとばす！', basePrice: 100, icon: 'images/sweep.png' },
    'upgrade_base': { name: 'きょてんパワーアップ', description: 'きょてんを しゅうり！HPが ぜんぶ もどって、もっと じょうぶに なるよ！', basePrice: 50, icon: 'images/upgrade-base.png' },
};

const wordProblemNouns = {
    names: ["たかしくん", "みつこちゃん", "よしおくん", "エミリーちゃん"],
    items: ["あめ", "ガム", "えんぴつ", "じょうぎ", "けしごむ", "ノート"]
};

const riddles = [
    { question: '「ショートケーキのひ」ってなんにち？', answer: 22 },
    { question: '1ひくと「しろ」になるすうじは？', answer: 100 },
    { question: 'あめが やむじかんは、なんじ？', answer: 2 },
    { question: 'しっかりつたえているのに へやを まちがえられてしまうのは、なんかいにすんでいるひと？', answer: 5 }
];

const monsterBaseStats = {
    'add':      { hp: 15, baseSpeed: 0.5, firstAppearanceWave: 0 },
    'subtract': { hp: 7, baseSpeed: 0.4, firstAppearanceWave: 1 },
    'multiply': { hp: 50, baseSpeed: 0.25, firstAppearanceWave: 2 },
    'divide':   { hp: 10, baseSpeed: 0.6, isFlying: true, firstAppearanceWave: 3 },
    'emoji':    { hp: 10, baseSpeed: 0.3, isHopping: true, firstAppearanceWave: 4 },
    'word':     { hp: 300, baseSpeed: 0.2, firstAppearanceWave: 5 },
    'boss':     { hp: 230, baseSpeed: 0.25, isBoss: true, firstAppearanceWave: 6 },
    'fire':     { hp: 1, baseSpeed: 0.7, isFlying: true, firstAppearanceWave: 6 }
};