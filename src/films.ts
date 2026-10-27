// Each film: a short animated scene. Positions are % of the stage.
// key = [time s, x centre %, y bottom %, height %, rotate deg, facing (1 right / -1 left)]
export type Key = [number, number, number, number, number?, number?];
export interface Actor { img?: string; emoji?: string; keys: Key[]; hop?: [number, number]; wag?: number; from?: number; to?: number }
export interface Film {
  id: string; title: { ja: string; en: string }; dur: number;
  sky: [string, string]; ground: string; fx?: 'butterfly' | 'snow' | 'petal' | 'zzz' | 'confetti' | 'rain' | 'heart' | 'star' | 'bubble';
  fxFrom?: number; fxTo?: number; sun?: string; notes: number[]; tempo: number;
  actors: Actor[]; captions: [number, string, string][];
}

export const FILMS: Film[] = [
  {
    id: 'walk', title: { ja: '朝のおさんぽ', en: 'Morning Walk' }, dur: 24,
    sky: ['#ffe6ef', '#c9f0d2'], ground: '#9ed9a8', fx: 'butterfly', sun: '#ffd27a', notes: [0, 2, 4, 7, 4, 2, 4, 9], tempo: 0.5,
    actors: [
      { emoji: '🌳', keys: [[0, 82, 12, 34]] },
      { emoji: '🌷', keys: [[0, 12, 10, 8]] },
      { emoji: '🌼', keys: [[0, 64, 9, 6]] },
      { img: 'happy', hop: [3, 3], keys: [[0, -15, 10, 40, 0, 1], [9, 40, 10, 40, 0, 1], [12, 40, 10, 40, 0, -1], [14, 40, 10, 40, 0, 1], [22, 115, 10, 40, 0, 1]] },
    ],
    captions: [[1, 'いい天気！', 'What a lovely day!'], [9, 'あ、ちょうちょ！', 'Oh, a butterfly!'], [15, 'まって〜', 'Wait for me!'], [21, 'またあした', 'See you tomorrow']],
  },
  {
    id: 'ball', title: { ja: 'ボールあそび', en: 'Ball Time' }, dur: 22,
    sky: ['#e3f7e7', '#ffd9e6'], ground: '#a9e2b3', fx: 'heart', fxFrom: 17, notes: [0, 4, 7, 12, 7, 4, 5, 9], tempo: 0.35,
    actors: [
      { emoji: '⚽', hop: [25, 1.4], keys: [[0, 110, 10, 9, 0], [4, 70, 10, 9, -360], [8, 20, 10, 9, -720], [10, 20, 10, 9, -720], [14, 75, 10, 9, 0], [16, 52, 10, 9, 0]] },
      { img: 'excited', hop: [5, 2.6], keys: [[0, 30, 10, 42, 0, 1], [4, 45, 10, 42, 0, 1], [6, 45, 10, 42, 0, -1], [9, 28, 10, 42, 0, -1], [11, 28, 10, 42, 0, 1], [15, 62, 10, 42, 0, 1], [17, 50, 10, 42, 0, 1]] },
    ],
    captions: [[1, 'ボールだ！', 'A ball!'], [6, 'つかまえるぞ〜', 'I\'m gonna catch it!'], [11, 'こっちだよ！', 'This way!'], [17, 'とったよ！', 'Got it!']],
  },
  {
    id: 'snow', title: { ja: 'はじめての雪', en: 'First Snow' }, dur: 26,
    sky: ['#dfe9f7', '#fdeef4'], ground: '#ffffff', fx: 'snow', notes: [7, 4, 2, 0, 2, 4, 7, 12], tempo: 0.6,
    actors: [
      { emoji: '⛄', keys: [[0, 78, 10, 26]] },
      { emoji: '🌲', keys: [[0, 12, 12, 30]] },
      { img: 'lookup', keys: [[0, 42, 10, 42, 0, 1], [8, 42, 10, 42, 0, 1]] , to: 10 },
      { img: 'excited', hop: [6, 3], from: 10, keys: [[10, 42, 10, 42, 0, 1], [16, 62, 10, 42, 0, 1], [18, 62, 10, 42, 0, -1], [26, 35, 10, 42, 0, -1]] },
    ],
    captions: [[1, 'あれ？ 白いのがふってる…', 'Hm? Something white is falling…'], [7, 'つめたい！', 'It\'s cold!'], [11, 'でも、たのしい！', 'But it\'s so fun!'], [19, 'ゆきだるまさん、こんにちは', 'Hello, Mr. Snowman']],
  },
  {
    id: 'sakura', title: { ja: '桜の下で', en: 'Under the Cherry Blossoms' }, dur: 24,
    sky: ['#ffe1ec', '#fff7e8'], ground: '#b7e4bd', fx: 'petal', notes: [0, 2, 5, 7, 9, 7, 5, 2], tempo: 0.55,
    actors: [
      { emoji: '🌸', keys: [[0, 20, 40, 30]] },
      { emoji: '🌸', keys: [[0, 80, 46, 26]] },
      { emoji: '🍡', keys: [[0, 72, 10, 8]] },
      { img: 'bluebow', wag: 4, keys: [[0, 45, 10, 42, 0, 1], [10, 50, 10, 42, 0, 1], [24, 50, 10, 44, 0, 1]] },
    ],
    captions: [[1, 'ひらひら、ひらひら', 'Flutter, flutter'], [8, 'おはなに リボン、にあう？', 'Does my bow match the flowers?'], [15, 'だんご、ひとつください', 'One dango, please'], [21, 'はるって いいね', 'Spring is the best']],
  },
  {
    id: 'nap', title: { ja: 'おひるね', en: 'Nap Time' }, dur: 28,
    sky: ['#3d3f7a', '#e9a6c6'], ground: '#6fae86', fx: 'zzz', fxFrom: 8, sun: '#fff3c4', notes: [12, 7, 4, 0, 4, 7, 4, 0], tempo: 0.8,
    actors: [
      { emoji: '🌙', keys: [[0, 80, 70, 14]] },
      { emoji: '🧸', keys: [[0, 66, 10, 12]] },
      { img: 'tongue', keys: [[0, 40, 10, 42, 0, 1], [6, 40, 10, 42, 0, 1], [10, 40, 12, 38, 12, 1], [28, 40, 12, 38, 14, 1]] },
    ],
    captions: [[1, 'ふぁ〜あ…', 'Yaaawn…'], [5, 'ちょっとだけ ねようかな', 'Maybe just a little nap'], [12, 'すや…すや…', 'Zzz… zzz…'], [21, 'いい ゆめを みてね', 'Sweet dreams']],
  },
  {
    id: 'birthday', title: { ja: 'おたんじょうび', en: 'Birthday Surprise' }, dur: 24,
    sky: ['#ffd6e5', '#d7f5dd'], ground: '#f7c7d8', fx: 'confetti', fxFrom: 10, notes: [0, 0, 2, 0, 5, 4, 0, 0, 2, 0, 7, 5], tempo: 0.42,
    actors: [
      { emoji: '🎂', from: 8, keys: [[8, 70, -30, 16], [10, 70, 10, 16]] },
      { emoji: '🎈', hop: [4, 0.4], keys: [[0, 15, 60, 14], [24, 15, 70, 14]] },
      { emoji: '🎁', keys: [[0, 85, 10, 11]] },
      { img: 'bell', hop: [3, 1.6], keys: [[0, 35, 10, 44, 0, 1], [9, 35, 10, 44, 0, 1], [12, 40, 10, 46, 0, 1], [24, 40, 10, 46, 0, 1]] },
    ],
    captions: [[1, 'きょうは なんの日？', 'What day is it today?'], [10, 'サプライズ！', 'Surprise!'], [13, 'おたんじょうび おめでとう！', 'Happy birthday!'], [19, 'チリン♪ ありがとう！', 'Ding ding! Thank you!']],
  },
  {
    id: 'rain', title: { ja: '雨の日', en: 'Rainy Day' }, dur: 26,
    sky: ['#c4d3e3', '#e8f6ec'], ground: '#9cc9a5', fx: 'rain', fxTo: 15, notes: [4, 7, 9, 7, 4, 2, 0, 2], tempo: 0.5,
    actors: [
      { emoji: '🌈', from: 15, keys: [[15, 60, 45, 0], [18, 60, 45, 40]] },
      { emoji: '☂️', keys: [[0, 46, 44, 18, -10], [15, 46, 44, 18, -10], [17, 46, 120, 18, 30]], to: 17 },
      { img: 'lookup', to: 15, keys: [[0, 45, 10, 40, 0, 1]] },
      { img: 'happy', from: 15, hop: [4, 2], keys: [[15, 45, 10, 40, 0, 1], [26, 60, 10, 40, 0, 1]] },
      { emoji: '🐸', hop: [8, 1.5], keys: [[0, 85, 10, 7], [26, 70, 10, 7]] },
    ],
    captions: [[1, 'ぽつぽつ…雨だね', 'Pitter-patter… it\'s raining'], [7, 'かさがあって よかった', 'Good thing I have an umbrella'], [15, 'あ、やんだ！', 'Oh, it stopped!'], [19, 'にじだ〜！', 'A rainbow!']],
  },
  {
    id: 'sunset', title: { ja: 'ふたりの夕やけ', en: 'Sunset Friends' }, dur: 24,
    sky: ['#ffb38a', '#ffdbe8'], ground: '#86c79a', fx: 'heart', fxFrom: 12, sun: '#ff8a6b', notes: [0, 4, 7, 11, 12, 11, 7, 4], tempo: 0.6,
    actors: [
      { img: 'bluebow', hop: [3, 2], keys: [[0, -15, 10, 40, 0, 1], [8, 35, 10, 40, 0, 1], [24, 37, 10, 40, 0, 1]] },
      { img: 'tongue', hop: [3, 2], keys: [[0, 115, 10, 40, 0, -1], [9, 64, 10, 40, 0, -1], [24, 62, 10, 40, 0, -1]] },
    ],
    captions: [[1, 'ゆうやけ きれい', 'What a pretty sunset'], [9, 'いっしょに みよう', 'Let\'s watch it together'], [14, 'だいすきだよ', 'I love you'], [20, 'また あしたも あそぼうね', 'Let\'s play again tomorrow']],
  },
];
