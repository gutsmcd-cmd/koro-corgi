import './style.css';
import { CORGI } from './corgis';
import { FILMS, type Film, type Actor, type Key } from './films';

type Lang = 'ja' | 'en';
const store = {
  get: (k: string, d: string) => localStorage.getItem('koro-' + k) ?? d,
  set: (k: string, v: string) => localStorage.setItem('koro-' + k, v),
};
let lang = store.get('lang', 'ja') as Lang;
let big = store.get('big', '0') === '1';
let sound = store.get('sound', '0') === '1';
let mode = store.get('mode', 'all') as 'all' | 'one'; // all = play all films in a loop, one = repeat this film
let idx = 0, t = 0, playing = false, last = 0;

const T = {
  ja: { sub: 'コーギーのミニ映画', play: '再生', pause: '一時停止', prev: '前へ', next: '次へ', again: '最初から', all: 'ぜんぶ続けて', one: 'この映画をくり返す', sound: '音', on: 'オン', off: 'オフ', big: '大きい文字', list: '映画のリスト', sec: '秒', tap: '▶ を押すと始まります', foot: '広告なし・登録なし・オフラインでも見られます' },
  en: { sub: 'Corgi Mini Movies', play: 'Play', pause: 'Pause', prev: 'Previous', next: 'Next', again: 'Start over', all: 'Play all in a loop', one: 'Repeat this film', sound: 'Sound', on: 'On', off: 'Off', big: 'Large text', list: 'Films', sec: 's', tap: 'Press ▶ to start', foot: 'No ads, no sign-up, works offline' },
};

const $ = <E extends HTMLElement>(s: string) => document.querySelector(s) as E;
document.getElementById('app')!.innerHTML = `
<header>
  <div class="brand"><span class="logo">🐾</span><div><h1>Koro Corgi</h1><p id="sub"></p></div></div>
  <div class="tog"><button id="lang" class="pill"></button><button id="big" class="pill" aria-pressed="false"></button></div>
</header>
<main>
  <div id="stage" aria-live="polite"><div id="sky"></div><div id="sun"></div><div id="ground"></div><div id="layer"></div><div id="fx"></div>
    <div id="title"></div><div id="cap"></div><button id="bigplay" aria-label="play">▶</button></div>
  <div id="bar"><div id="fill"></div></div>
  <div class="ctrl">
    <button id="prev" class="r">⏮</button><button id="pp" class="r main">▶</button><button id="next" class="r">⏭</button><button id="again" class="r">↺</button>
  </div>
  <div class="opts"><button id="mode" class="pill"></button><button id="snd" class="pill"></button></div>
  <h2 id="lh"></h2><ol id="list"></ol>
  <footer id="foot"></footer>
</main>`;

const stage = $('#stage'), layer = $('#layer'), fxEl = $('#fx'), cap = $('#cap'), title = $('#title');

// ---------- drawing ----------
let actorEls: HTMLElement[] = [], fxEls: HTMLElement[] = [];
const FXE: Record<string, string[]> = { butterfly: ['🦋'], snow: ['❄', '•'], petal: ['🌸', '•'], zzz: ['z', 'Z'], confetti: ['🎉', '✨', '•'], rain: ['│'], heart: ['💗', '💕'], star: ['✨'], bubble: ['○'] };
function rnd(i: number) { const x = Math.sin(i * 99.13 + 7.7) * 43758.5453; return x - Math.floor(x); }

function build(f: Film) {
  $('#sky').style.background = `linear-gradient(${f.sky[0]}, ${f.sky[1]})`;
  $('#ground').style.background = f.ground;
  const sun = $('#sun'); sun.style.display = f.sun ? 'block' : 'none'; if (f.sun) sun.style.background = f.sun;
  layer.innerHTML = ''; fxEl.innerHTML = '';
  actorEls = f.actors.map((a) => {
    const el = document.createElement(a.img ? 'img' : 'div');
    el.className = 'actor';
    if (a.img) { (el as HTMLImageElement).src = CORGI[a.img]; (el as HTMLImageElement).alt = ''; (el as HTMLImageElement).draggable = false; }
    else el.textContent = a.emoji!;
    layer.appendChild(el); return el;
  });
  fxEls = [];
  if (f.fx) for (let i = 0; i < (f.fx === 'rain' ? 40 : 16); i++) {
    const e = document.createElement('div'); e.className = 'fx fx-' + f.fx;
    const set = FXE[f.fx]; e.textContent = set[i % set.length];
    fxEl.appendChild(e); fxEls.push(e);
  }
  title.textContent = f.title[lang];
}

const ease = (x: number) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
function at(keys: Key[], time: number): Key {
  if (time <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (time <= b[0]) {
      const p = ease((time - a[0]) / (b[0] - a[0] || 1));
      const m = (j: number, d: number) => (a[j] ?? d) + ((b[j] ?? d) - (a[j] ?? d)) * p;
      return [time, m(1, 0), m(2, 0), m(3, 0), m(4, 0), p < 0.5 ? a[5] ?? 1 : b[5] ?? 1];
    }
  }
  return keys[keys.length - 1];
}

function draw() {
  const f = FILMS[idx], H = stage.clientHeight || 300;
  f.actors.forEach((a: Actor, i) => {
    const el = actorEls[i];
    const vis = t >= (a.from ?? -1) && t < (a.to ?? 1e9);
    el.style.opacity = vis ? '1' : '0';
    if (!vis) return;
    const [, x, y, h, r = 0, face = 1] = at(a.keys, t);
    let yy = y, rr = r;
    if (a.hop) yy += Math.abs(Math.sin(t * Math.PI * a.hop[1])) * a.hop[0];
    if (a.wag) rr += Math.sin(t * 3) * a.wag;
    const px = (h / 100) * H;
    if (a.img) { el.style.height = px + 'px'; el.style.width = 'auto'; } else { el.style.fontSize = px * 0.85 + 'px'; }
    el.style.left = x + '%'; el.style.bottom = yy + '%';
    el.style.transform = `translateX(-50%) rotate(${rr}deg) scaleX(${face})`;
  });
  const fxOn = t >= (f.fxFrom ?? 0) && t < (f.fxTo ?? 1e9);
  fxEls.forEach((e, i) => {
    const k = f.fx!, s = rnd(i), s2 = rnd(i + 50);
    let x = s * 100, y = 0, o = fxOn ? 1 : 0, sz = 14 + s2 * 14, rot = 0;
    if (k === 'snow' || k === 'petal' || k === 'confetti') { const sp = k === 'confetti' ? 0.25 : 0.08 + s2 * 0.06; y = 105 - ((t * sp * 100 + s * 300) % 115); x += Math.sin(t + i) * 4; rot = t * 60 * (s - 0.5); }
    else if (k === 'rain') { y = 105 - ((t * 1.6 * 100 + s * 400) % 115); sz = 18; }
    else if (k === 'heart' || k === 'zzz' || k === 'bubble') { y = ((t - (f.fxFrom ?? 0)) * 12 + s * 80) % 100; x = k === 'zzz' ? 46 + Math.sin(t + i) * 6 + i : x; o *= y < 85 ? 1 : 0.3; }
    else if (k === 'butterfly') { if (i > 2) { o = 0; } x = (t * 6 + s * 100) % 110 - 5; y = 40 + Math.sin(t * 1.5 + i) * 15 + i * 6; sz = 30; }
    e.style.left = x + '%'; e.style.bottom = y + '%'; e.style.opacity = String(o);
    e.style.fontSize = sz + 'px'; e.style.transform = `rotate(${rot}deg)`;
  });
  const c = [...f.captions].reverse().find((c) => t >= c[0]);
  const txt = c ? (lang === 'ja' ? c[1] : c[2]) : '';
  if (cap.textContent !== txt) { cap.textContent = txt; cap.classList.remove('pop'); void cap.offsetWidth; if (txt) cap.classList.add('pop'); }
  title.style.opacity = t < 2.5 ? '1' : '0';
  $('#fill').style.width = (t / f.dur) * 100 + '%';
}

// ---------- gentle music box ----------
let ac: AudioContext | null = null, nextNote = 0, noteI = 0;
function tone(semi: number, when: number) {
  if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sine'; o.frequency.value = 523.25 * Math.pow(2, semi / 12);
  g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(0.06, when + 0.02); g.gain.exponentialRampToValueAtTime(0.0008, when + 1.2);
  o.connect(g).connect(ac.destination); o.start(when); o.stop(when + 1.3);
}
function music() {
  if (!sound || !playing || !ac) return;
  const f = FILMS[idx];
  while (nextNote < ac.currentTime + 0.3) {
    if (nextNote < ac.currentTime) nextNote = ac.currentTime + 0.05;
    tone(f.notes[noteI % f.notes.length], nextNote); noteI++; nextNote += f.tempo;
  }
}

// ---------- player ----------
function load(i: number, autoplay = playing) {
  idx = (i + FILMS.length) % FILMS.length; t = 0; noteI = 0;
  build(FILMS[idx]); draw(); renderList();
  setPlaying(autoplay);
}
function setPlaying(p: boolean) {
  playing = p; last = performance.now();
  $('#pp').textContent = p ? '⏸' : '▶'; $('#pp').setAttribute('aria-label', p ? T[lang].pause : T[lang].play);
  $('#bigplay').style.display = p ? 'none' : 'flex';
  if (p && sound) { ac ??= new AudioContext(); ac.resume(); nextNote = 0; }
}
function loop(now: number) {
  if (playing) {
    t += Math.min(0.1, (now - last) / 1000);
    const f = FILMS[idx];
    if (t >= f.dur) { if (mode === 'one') { t = 0; noteI = 0; } else { load(idx + 1, true); } }
    draw(); music();
  }
  last = now; requestAnimationFrame(loop);
}

function renderList() {
  $('#list').innerHTML = FILMS.map((f, i) => `<li><button data-i="${i}" class="${i === idx ? 'on' : ''}"><span class="n">${i + 1}</span><span class="tt">${f.title[lang]}</span><span class="d">${f.dur}${T[lang].sec}</span></button></li>`).join('');
}
function texts() {
  const L = T[lang]; document.documentElement.lang = lang;
  $('#sub').textContent = L.sub; $('#lang').textContent = lang === 'ja' ? 'English' : '日本語';
  $('#big').textContent = L.big + (big ? ' ✓' : ''); $('#big').setAttribute('aria-pressed', String(big));
  $('#mode').textContent = '🔁 ' + (mode === 'all' ? L.all : L.one);
  $('#snd').textContent = (sound ? '🔔 ' : '🔕 ') + L.sound + ': ' + (sound ? L.on : L.off);
  $('#lh').textContent = L.list; $('#foot').textContent = L.foot;
  $('#prev').setAttribute('aria-label', L.prev); $('#next').setAttribute('aria-label', L.next); $('#again').setAttribute('aria-label', L.again);
  $('#bigplay').title = L.tap;
  document.body.classList.toggle('big', big);
  title.textContent = FILMS[idx].title[lang]; cap.textContent = ''; renderList(); draw(); setPlaying(playing);
}

$('#pp').onclick = () => setPlaying(!playing);
$('#bigplay').onclick = () => setPlaying(true);
stage.onclick = (e) => { if (e.target === $('#bigplay')) return; setPlaying(!playing); };
$('#prev').onclick = () => load(idx - 1);
$('#next').onclick = () => load(idx + 1);
$('#again').onclick = () => load(idx);
$('#list').onclick = (e) => { const b = (e.target as HTMLElement).closest('button'); if (b) { load(+b.dataset.i!, true); stage.scrollIntoView({ behavior: 'smooth', block: 'center' }); } };
$('#lang').onclick = () => { lang = lang === 'ja' ? 'en' : 'ja'; store.set('lang', lang); texts(); };
$('#big').onclick = () => { big = !big; store.set('big', big ? '1' : '0'); texts(); };
$('#mode').onclick = () => { mode = mode === 'all' ? 'one' : 'all'; store.set('mode', mode); texts(); };
$('#snd').onclick = () => { sound = !sound; store.set('sound', sound ? '1' : '0'); if (sound) { ac ??= new AudioContext(); ac.resume(); nextNote = 0; } texts(); };
document.addEventListener('keydown', (e) => { if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'BUTTON') { e.preventDefault(); setPlaying(!playing); } if (e.key === 'ArrowRight') load(idx + 1); if (e.key === 'ArrowLeft') load(idx - 1); });
window.addEventListener('resize', draw);

load(0, false); texts(); requestAnimationFrame(loop);
if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js');
(window as any).__koro = { films: FILMS.length, get t() { return t; }, get idx() { return idx; }, get playing() { return playing; } };
