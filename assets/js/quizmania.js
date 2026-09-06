/* QuizMania.it — global UX (theme, sound, stats, drawer)
   No dependencies, safe for static hosting.
*/

(function(){
  "use strict";

  const LS = {
    THEME: "qm_theme", // "dark" | "light" | "auto"
    SOUND: "qm_sound", // "1" | "0"
    QUIZLEN: "qm_quizlen", // integer as string
    STATS: "qm_stats_v1" // JSON
  };

  function safeJSONParse(s, fallback){
    try{return JSON.parse(s);}catch(_){return fallback;}
  }

  function getTheme(){
    return localStorage.getItem(LS.THEME) || "auto";
  }

  function applyTheme(){
    const t = getTheme();
    const root = document.documentElement;
    root.dataset.qmTheme = t;
    if(t === "dark"){
      root.style.colorScheme = "dark";
    }else if(t === "light"){
      root.style.colorScheme = "light";
    }else{
      root.style.colorScheme = "";
    }
  }

  function prefersDark(){
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effectiveTheme(){
    const t = getTheme();
    if(t === "auto") return prefersDark() ? "dark" : "light";
    return t;
  }

  function isSoundOn(){
    const v = localStorage.getItem(LS.SOUND);
    return v === null ? true : (v === "1");
  }

  // Tiny UI sound (WebAudio, no external files)
  let audioCtx = null;
  function beep(kind){
    if(!isSoundOn()) return;
    const A = window.AudioContext || window.webkitAudioContext;
    if(!A) return;
    try{
      if(!audioCtx) audioCtx = new A();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      const now = audioCtx.currentTime;
      const ok = kind === "ok";
      o.type = ok ? "sine" : "square";
      o.frequency.setValueAtTime(ok ? 740 : 220, now);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (ok ? 0.18 : 0.22));
      o.start(now);
      o.stop(now + (ok ? 0.2 : 0.24));
    }catch(_){
      // ignore audio errors
    }
  }

  function getQuizLen(){
    const v = parseInt(localStorage.getItem(LS.QUIZLEN) || "10", 10);
    if(Number.isFinite(v) && v >= 5 && v <= 50) return v;
    return 10;
  }

  function setQuizLen(n){
    const v = Math.max(5, Math.min(50, Math.floor(n)));
    localStorage.setItem(LS.QUIZLEN, String(v));
  }

  function getStats(){
    const raw = localStorage.getItem(LS.STATS);
    return safeJSONParse(raw || "{}", {});
  }

  function saveStats(stats){
    try{localStorage.setItem(LS.STATS, JSON.stringify(stats));}catch(_){/* ignore */}
  }

  function todayKey(){
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }

  function updateStreak(){
    const s = getStats();
    const t = todayKey();
    if(!s.streak) s.streak = {count:0,last:""};
    if(s.streak.last === t) return s.streak.count;

    // compare with yesterday
    const d = new Date();
    d.setDate(d.getDate()-1);
    const y = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

    if(s.streak.last === y){
      s.streak.count = (s.streak.count || 0) + 1;
    }else{
      s.streak.count = 1;
    }
    s.streak.last = t;
    saveStats(s);
    return s.streak.count;
  }

  function openDrawer(){
    const d = document.getElementById("qm-drawer");
    if(!d) return;
    d.classList.add("open");
  }

  function closeDrawer(){
    const d = document.getElementById("qm-drawer");
    if(!d) return;
    d.classList.remove("open");
  }

  function syncDrawerUI(){
    const theme = getTheme();
    const sound = isSoundOn();
    const len = getQuizLen();

    const swSound = document.querySelector('[data-qm-switch="sound"]');
    const swTheme = document.querySelector('[data-qm-switch="theme"]');
    const lenEl = document.querySelector('[data-qm-quizlen]');
    const lenVal = document.querySelector('[data-qm-quizlen-val]');

    if(swSound) swSound.classList.toggle("on", sound);
    if(swTheme) swTheme.classList.toggle("on", effectiveTheme() === "dark");
    if(lenEl){
      lenEl.value = String(len);
      if(lenVal) lenVal.textContent = String(len);
    }

    const themeLabel = document.querySelector('[data-qm-theme-label]');
    if(themeLabel) themeLabel.textContent = theme === "auto" ? "Auto" : (theme === "dark" ? "Scuro" : "Chiaro");
  }

  function cycleTheme(){
    const t = getTheme();
    const next = (t === "auto") ? "dark" : (t === "dark") ? "light" : "auto";
    localStorage.setItem(LS.THEME, next);
    applyTheme();
    syncDrawerUI();
  }

  function toggleSound(){
    const next = isSoundOn() ? "0" : "1";
    localStorage.setItem(LS.SOUND, next);
    syncDrawerUI();
    if(next === "1") beep("ok");
  }

  function bindGlobal(){
    document.addEventListener("click", (e) => {
      const t = e.target;
      const act = t && t.getAttribute && t.getAttribute("data-action");
      if(act === "open-settings") return openDrawer();
      if(act === "close-settings") return closeDrawer();
      if(act === "toggle-sound") return toggleSound();
      if(act === "cycle-theme") return cycleTheme();
    });

    const d = document.getElementById("qm-drawer");
    if(d){
      d.addEventListener("click", (e)=>{
        if(e.target === d) closeDrawer();
      });
    }

    const lenEl = document.querySelector('[data-qm-quizlen]');
    if(lenEl){
      lenEl.addEventListener("input", ()=>{
        const v = parseInt(lenEl.value || "10", 10);
        setQuizLen(v);
        syncDrawerUI();
      });
    }
  }

  function ensureDrawer(){
    if(document.getElementById('qm-drawer')) return;
    const d = document.createElement('div');
    d.id = 'qm-drawer';
    d.className = 'qm-drawer';
    d.innerHTML = `
      <div class="qm-drawer-panel" role="dialog" aria-modal="true" aria-label="Impostazioni">
        <div class="qm-drawer-title">
          <h3>Impostazioni</h3>
          <button class="qm-iconbtn" type="button" data-action="close-settings" aria-label="Chiudi">✖</button>
        </div>

        <div class="qm-toggle">
          <div>
            <div class="t">Tema</div>
            <div class="d">Cambia tra Auto / Scuro / Chiaro</div>
            <div class="d" style="margin-top:6px;opacity:.9">Attuale: <span data-qm-theme-label>Auto</span></div>
          </div>
          <button class="qm-switch" type="button" data-action="cycle-theme" data-qm-switch="theme" aria-label="Cambia tema"></button>
        </div>

        <div class="qm-toggle">
          <div>
            <div class="t">Suoni</div>
            <div class="d">Feedback audio su corretto/sbagliato</div>
          </div>
          <button class="qm-switch" type="button" data-action="toggle-sound" data-qm-switch="sound" aria-label="Attiva/disattiva suoni"></button>
        </div>

        <div class="qm-toggle">
          <div>
            <div class="t">Lunghezza quiz</div>
            <div class="d">Domande per partita: <b data-qm-quizlen-val>10</b></div>
          </div>
          <input data-qm-quizlen type="range" min="5" max="50" step="1" style="width:160px" />
        </div>

        <div class="qm-toggle">
          <div>
            <div class="t">Suggerimento</div>
            <div class="d">Fai una partita al giorno per aumentare la streak 🔥</div>
          </div>
          <div class="qm-chip" style="border-radius:999px">Streak: <span data-qm-streak>0</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(d);
  }

  // Public API
  window.QuizMania = {
    LS,
    beep,
    getQuizLen,
    getStats,
    saveStats,
    updateStreak,
    effectiveTheme,
    isSoundOn,
    applyTheme,
  };

  // Init
  document.addEventListener("DOMContentLoaded", ()=>{
    applyTheme();
    ensureDrawer();
    bindGlobal();
    syncDrawerUI();

    // streak badge (if present)
    const st = getStats();
    const elSt = document.querySelector('[data-qm-streak]');
    if(elSt){
      const v = (st.streak && st.streak.count) ? st.streak.count : 0;
      elSt.textContent = String(v);
    }
  });

})();
