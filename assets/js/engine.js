/* QuizMania.it — Quiz Engine (multiple choice, JSON or generator)
   Data format (questions.json):
   [{ q: "...", options:["..."], correct:0, explain:"..." (optional), difficulty:"easy|medium|hard" (optional) }]
*/

(function(){
  "use strict";

  function $(sel, root){
    return (root || document).querySelector(sel);
  }

  function el(tag, cls, txt){
    const e = document.createElement(tag);
    if(cls) e.className = cls;
    if(txt !== undefined) e.textContent = txt;
    return e;
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function clamp(n,a,b){return Math.max(a,Math.min(b,n));}

  function pickUnique(pool, count){
    const copy = pool.slice();
    shuffle(copy);
    return copy.slice(0, Math.min(count, copy.length));
  }

  // Built-in generators for “infinite” practice quizzes
  const Generators = {
    operazioni: (n=40)=>{
      const out = [];
      const ops = ["+","-","×","÷"];
      for(let i=0;i<n;i++){
        const op = ops[Math.floor(Math.random()*ops.length)];
        let a,b,ans;
        if(op === "+"){
          a = 5 + Math.floor(Math.random()*95);
          b = 5 + Math.floor(Math.random()*95);
          ans = a + b;
        }else if(op === "-"){
          a = 10 + Math.floor(Math.random()*90);
          b = 1 + Math.floor(Math.random()*a);
          ans = a - b;
        }else if(op === "×"){
          a = 2 + Math.floor(Math.random()*13);
          b = 2 + Math.floor(Math.random()*13);
          ans = a * b;
        }else{
          b = 2 + Math.floor(Math.random()*12);
          ans = 2 + Math.floor(Math.random()*12);
          a = ans * b;
        }

        const wrong = new Set();
        while(wrong.size < 3){
          const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random()*6));
          const w = ans + delta;
          if(w !== ans && w >= 0) wrong.add(w);
        }
        const options = shuffle([ans, ...Array.from(wrong)]).map(String);
        out.push({
          q: `Calcola: ${a} ${op} ${b}`,
          options,
          correct: options.indexOf(String(ans)),
          difficulty: op === "÷" ? "medium" : "easy",
          explain: `Soluzione: ${a} ${op} ${b} = ${ans}.`
        });
      }
      return out;
    },
    tabelline: (n=60)=>{
      const out = [];
      for(let i=0;i<n;i++){
        const a = 2 + Math.floor(Math.random()*11);
        const b = 2 + Math.floor(Math.random()*11);
        const ans = a * b;
        const wrong = new Set();
        while(wrong.size < 3){
          const wa = 2 + Math.floor(Math.random()*11);
          const wb = 2 + Math.floor(Math.random()*11);
          const w = wa * wb;
          if(w !== ans) wrong.add(w);
        }
        const options = shuffle([ans, ...Array.from(wrong)]).map(String);
        out.push({
          q: `Quanto fa ${a} × ${b}?`,
          options,
          correct: options.indexOf(String(ans)),
          difficulty: "easy",
          explain: `Ricorda: ${a} × ${b} = ${ans}.`
        });
      }
      return out;
    },
    geografia_capitali: (n=60)=>{
      const capitals = [
        ["Italia","Roma"],["Francia","Parigi"],["Spagna","Madrid"],["Germania","Berlino"],["Portogallo","Lisbona"],
        ["Regno Unito","Londra"],["Irlanda","Dublino"],["Svizzera","Berna"],["Austria","Vienna"],["Grecia","Atene"],
        ["Paesi Bassi","Amsterdam"],["Belgio","Bruxelles"],["Svezia","Stoccolma"],["Norvegia","Oslo"],["Finlandia","Helsinki"],
        ["Danimarca","Copenaghen"],["Polonia","Varsavia"],["Ungheria","Budapest"],["Repubblica Ceca","Praga"],["Romania","Bucarest"],
        ["Bulgaria","Sofia"],["Croazia","Zagabria"],["Serbia","Belgrado"],["Slovenia","Lubiana"],["Turchia","Ankara"],
        ["Russia","Mosca"],["Ucraina","Kyiv"],["Canada","Ottawa"],["Stati Uniti","Washington, D.C."],["Messico","Città del Messico"],
        ["Brasile","Brasília"],["Argentina","Buenos Aires"],["Cile","Santiago"],["Perù","Lima"],["Colombia","Bogotà"],
        ["Egitto","Il Cairo"],["Marocco","Rabat"],["Tunisia","Tunisi"],["Algeria","Algeri"],["Sudafrica","Pretoria"],
        ["Nigeria","Abuja"],["Etiopia","Addis Abeba"],["Kenya","Nairobi"],["India","Nuova Delhi"],["Cina","Pechino"],
        ["Giappone","Tokyo"],["Corea del Sud","Seoul"],["Thailandia","Bangkok"],["Indonesia","Giacarta"],["Australia","Canberra"],
        ["Nuova Zelanda","Wellington"],["Arabia Saudita","Riyadh"],["Israele","Gerusalemme"],["Emirati Arabi Uniti","Abu Dhabi"],
      ];

      const pool = capitals.map(x=>x[0]);
      const out = [];
      const picks = pickUnique(capitals, Math.min(n, capitals.length));
      for(const [country, cap] of picks){
        const wrongCaps = new Set();
        while(wrongCaps.size < 3){
          const w = capitals[Math.floor(Math.random()*capitals.length)][1];
          if(w !== cap) wrongCaps.add(w);
        }
        const options = shuffle([cap, ...Array.from(wrongCaps)]);
        out.push({
          q: `Qual è la capitale di ${country}?`,
          options,
          correct: options.indexOf(cap),
          difficulty: "easy",
          explain: `La capitale di ${country} è ${cap}.`
        });
      }
      // If asked for more than list length, continue random
      while(out.length < n){
        const [country, cap] = capitals[Math.floor(Math.random()*capitals.length)];
        const wrongCaps = new Set();
        while(wrongCaps.size < 3){
          const w = capitals[Math.floor(Math.random()*capitals.length)][1];
          if(w !== cap) wrongCaps.add(w);
        }
        const options = shuffle([cap, ...Array.from(wrongCaps)]);
        out.push({q:`Qual è la capitale di ${country}?`, options, correct: options.indexOf(cap), difficulty:"easy", explain:`La capitale di ${country} è ${cap}.`});
      }
      return out;
    },

    geografia_mista: (n=80)=>{
      const base = Generators.geografia_capitali(Math.max(40, Math.floor(n*0.6)));
      const extra = [
        {q:"Qual è il continente in cui si trova l'Italia?", options:["Europa","Asia","Africa","America"], correct:0, explain:"L'Italia si trova in Europa."},
        {q:"Qual è il fiume più lungo d'Italia?", options:["Po","Tevere","Arno","Adige"], correct:0, explain:"Il Po è il fiume più lungo d'Italia."},
        {q:"Qual è la catena montuosa che attraversa l'Italia da Nord a Sud?", options:["Appennini","Alpi","Ande","Urali"], correct:0, explain:"Gli Appennini attraversano l'Italia."},
        {q:"Qual è l'oceano più grande della Terra?", options:["Pacifico","Atlantico","Indiano","Artico"], correct:0, explain:"Il Pacifico è l'oceano più grande."},
        {q:"Che cos'è un arcipelago?", options:["Un insieme di isole","Un deserto","Un fiume","Una pianura"], correct:0, explain:"Un arcipelago è un insieme di isole."},
        {q:"Qual è la regione italiana con capoluogo Milano?", options:["Lombardia","Veneto","Piemonte","Emilia-Romagna"], correct:0, explain:"Milano è capoluogo della Lombardia."},
        {q:"Qual è la capitale dell'Unione Europea (sede di molte istituzioni)?", options:["Bruxelles","Parigi","Strasburgo","Lussemburgo"], correct:0, explain:"Bruxelles ospita molte istituzioni UE."},
        {q:"Qual è il mare che bagna Venezia?", options:["Mar Adriatico","Mar Tirreno","Mar Ionio","Mar Ligure"], correct:0, explain:"Venezia si affaccia sul Mar Adriatico."}
      ];
      const out = [];
      while(out.length < n){
        if(out.length < base.length) out.push(base[out.length]);
        else out.push(extra[Math.floor(Math.random()*extra.length)]);
      }
      return out;
    },
    inglese_base: (n=60)=>{
      const vocab = [
        ["apple","mela"],["cat","gatto"],["dog","cane"],["book","libro"],["school","scuola"],["house","casa"],
        ["water","acqua"],["sun","sole"],["moon","luna"],["red","rosso"],["blue","blu"],["green","verde"],
        ["one","uno"],["two","due"],["three","tre"],["happy","felice"],["sad","triste"],["fast","veloce"],
        ["slow","lento"],["food","cibo"],["milk","latte"],["bread","pane"],["friend","amico"],["family","famiglia"],
        ["teacher","insegnante"],["student","studente"],["pen","penna"],["chair","sedia"],["table","tavolo"],["window","finestra"],
      ];
      const out = [];
      for(let i=0;i<n;i++){
        const [en,it] = vocab[Math.floor(Math.random()*vocab.length)];
        const wrong = new Set();
        while(wrong.size < 3){
          const w = vocab[Math.floor(Math.random()*vocab.length)][1];
          if(w !== it) wrong.add(w);
        }
        const options = shuffle([it, ...Array.from(wrong)]);
        out.push({
          q: `Come si traduce in italiano “${en}”?`,
          options,
          correct: options.indexOf(it),
          difficulty: "easy",
          explain: `“${en}” in italiano è “${it}”.`
        });
      }
      return out;
    },
    bambini_3_5: (n=40)=>{
      const pool = [
        {q:"Di che colore è una banana matura?", options:["Gialla","Blu","Nera","Viola"], correct:0, explain:"La banana matura è gialla."},
        {q:"Quante ruote ha una bicicletta?", options:["1","2","3","4"], correct:1, explain:"Una bicicletta ha 2 ruote."},
        {q:"Quale animale fa “miao”?", options:["Cane","Gatto","Mucca","Pecora"], correct:1, explain:"Il gatto fa “miao”."},
        {q:"Qual è la forma di una palla?", options:["Quadrata","Tonda","Triangolare","Rettangolare"], correct:1, explain:"Una palla è tonda."},
        {q:"Che cosa usi per vedere?", options:["Naso","Orecchie","Occhi","Mani"], correct:2, explain:"Usi gli occhi per vedere."},
        {q:"Quale è il contrario di “grande”?", options:["Piccolo","Lungo","Alto","Forte"], correct:0, explain:"Il contrario di grande è piccolo."},
        {q:"Quale animale vive nell’acqua?", options:["Pesce","Gatto","Cavallo","Gallina"], correct:0, explain:"Il pesce vive nell’acqua."},
        {q:"In quale momento si dorme di solito?", options:["Notte","Mattina","Pomeriggio","Mezzogiorno"], correct:0, explain:"Di solito si dorme di notte."},
      ];
      const out = [];
      while(out.length < n){
        out.push(pool[Math.floor(Math.random()*pool.length)]);
      }
      return out;
    }
    ,
    bambini_6_12: (n=80)=>{
      // Mix of easy school questions for kids.
      const pool = [
        {q:"Qual è la capitale d'Italia?", options:["Roma","Milano","Torino","Napoli"], correct:0, explain:"La capitale d'Italia è Roma."},
        {q:"Quanti giorni ha una settimana?", options:["5","6","7","8"], correct:2, explain:"Una settimana ha 7 giorni."},
        {q:"Quale pianeta è chiamato “Pianeta Rosso”?", options:["Marte","Venere","Giove","Mercurio"], correct:0, explain:"Marte è detto Pianeta Rosso."},
        {q:"Qual è il plurale di “foglia”?", options:["Foglie","Fogliei","Foglias","Foglia"], correct:0, explain:"Il plurale corretto è “foglie”."},
        {q:"Quanto fa 8 + 7?", options:["14","15","16","17"], correct:1, explain:"8 + 7 = 15."},
        {q:"Quale animale è un mammifero?", options:["Delfino","Squalo","Trota","Polpo"], correct:0, explain:"Il delfino è un mammifero."},
        {q:"Qual è il contrario di “freddo”?", options:["Caldo","Lento","Buio","Sordo"], correct:0, explain:"Il contrario di freddo è caldo."},
        {q:"Qual è la forma con 3 lati?", options:["Triangolo","Quadrato","Cerchio","Rettangolo"], correct:0, explain:"Il triangolo ha 3 lati."}
      ];
      const out = [];
      const ops = Generators.operazioni(Math.max(30, Math.floor(n*0.35)));
      const tabs = Generators.tabelline(Math.max(20, Math.floor(n*0.2)));
      const caps = Generators.geografia_capitali(Math.max(20, Math.floor(n*0.25)));
      const en = Generators.inglese_base(Math.max(15, Math.floor(n*0.2)));
      const mixed = shuffle([ ...ops, ...tabs, ...caps, ...en, ...pool ]);
      while(out.length < n){
        out.push(mixed[out.length % mixed.length]);
      }
      return out;
    },
    eta_6_8: (n=70)=>{
      const base = Generators.bambini_6_12(n);
      return base.map(x=>({ ...x, difficulty: x.difficulty || "easy" }));
    },
    eta_9_11: (n=80)=>{
      const out = [];
      out.push(...Generators.operazioni(60));
      out.push(...Generators.geografia_mista(40));
      out.push(...Generators.inglese_base(35));
      out.push(...Generators.tabelline(40));
      shuffle(out);
      return out.slice(0,n);
    },
    eta_12_14: (n=90)=>{
      const out = [];
      out.push(...Generators.operazioni(70));
      out.push(...Generators.geografia_mista(50));
      out.push(...Generators.inglese_base(40));
      // add some medium questions
      const extra = [
        {q:"In grammatica, che cos'è un “verbo”?", options:["Una parola che indica un'azione o uno stato","Un nome di persona","Un aggettivo","Una preposizione"], correct:0, explain:"Il verbo indica azione o stato."},
        {q:"Qual è il simbolo chimico dell'acqua?", options:["H2O","CO2","O2","NaCl"], correct:0, explain:"L'acqua è H2O."},
        {q:"Quale numero è un multiplo di 9?", options:["27","26","25","24"], correct:0, explain:"27 è multiplo di 9 (9×3)."},
        {q:"Quale periodo storico viene dopo il Medioevo?", options:["Età Moderna","Preistoria","Età del Bronzo","Paleolitico"], correct:0, explain:"Dopo il Medioevo inizia l'Età Moderna."}
      ];
      for(let i=0;i<40;i++) out.push(extra[i % extra.length]);
      shuffle(out);
      return out.slice(0,n);
    },
    eta_15_18: (n=100)=>{
      const out = [];
      out.push(...Generators.geografia_mista(60));
      // add higher level, evergreen
      const extra = [
        {q:"Che cos'è l'inflazione?", options:["Aumento generale dei prezzi nel tempo","Diminuzione dei prezzi","Aumento degli stipendi","Una tassa"], correct:0, explain:"Inflazione = aumento generale dei prezzi."},
        {q:"Quale gas è più presente nell'atmosfera terrestre?", options:["Azoto","Ossigeno","Anidride carbonica","Idrogeno"], correct:0, explain:"L'azoto è il gas più abbondante."},
        {q:"In informatica, che cos'è un algoritmo?", options:["Una sequenza di istruzioni per risolvere un problema","Un computer","Un virus","Un file"], correct:0, explain:"Un algoritmo è una procedura step-by-step."},
        {q:"In letteratura, chi ha scritto “I Promessi Sposi”?", options:["Alessandro Manzoni","Dante Alighieri","Giovanni Verga","Italo Calvino"], correct:0, explain:"Manzoni è l'autore dei Promessi Sposi."}
      ];
      while(out.length < n){
        out.push(extra[Math.floor(Math.random()*extra.length)]);
      }
      shuffle(out);
      return out.slice(0,n);
    }
  };

  async function loadQuestionsFromJSON(url){
    const res = await fetch(url, {cache:"no-cache"});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if(!Array.isArray(data)) throw new Error("Invalid JSON");
    return data;
  }

  function normalizeQuestion(q){
    const qq = {
      q: String(q.q || ""),
      options: Array.isArray(q.options) ? q.options.map(String) : [],
      correct: Number.isFinite(q.correct) ? q.correct : parseInt(q.correct,10),
      explain: q.explain ? String(q.explain) : "",
      difficulty: q.difficulty ? String(q.difficulty) : ""
    };
    if(!qq.q || qq.options.length < 2) return null;
    if(!(qq.correct >= 0 && qq.correct < qq.options.length)) return null;
    return qq;
  }

  function keyForQuiz(title, src){
    // Stable key per page
    const p = (location.pathname || "").replace(/\/+$/,"");
    return `quiz:${p}:${title || ""}:${src || ""}`;
  }

  class QuizEngine{
    constructor(root, opts){
      this.root = root;
      this.title = opts.title || "Quiz";
      this.subtitle = opts.subtitle || "";
      this.src = opts.src || "";
      this.generator = opts.generator || "";
      this.icon = opts.icon || "";

      this.questions = [];
      this.idx = 0;
      this.answered = false;
      this.score = 0;
      this.wrong = [];
      this.startedAt = 0;

      this.limit = (window.QuizMania && window.QuizMania.getQuizLen) ? window.QuizMania.getQuizLen() : 10;
      this.storageKey = keyForQuiz(this.title, this.src || this.generator);
    }

    mountSkeleton(){
      const wrap = el("div", "qe");

      const head = el("div", "qe-head");
      const titleWrap = el("div", "");
      const h = el("div", "qe-title", this.title);
      const s = el("div", "qe-sub", this.subtitle);
      titleWrap.appendChild(h);
      if(this.subtitle) titleWrap.appendChild(s);

      const sp = el("div", "qe-sp");
      const badge = el("div", "qm-chip");
      badge.textContent = "0/0";
      badge.setAttribute("data-qe-badge","1");

      const bar = el("div", "qe-bar");
      const barInner = el("div", "");
      barInner.setAttribute("data-qe-bar","1");
      bar.appendChild(barInner);

      head.appendChild(titleWrap);
      head.appendChild(sp);
      head.appendChild(badge);
      head.appendChild(bar);

      const body = el("div", "qe-body");
      const qEl = el("div", "qe-q");
      qEl.setAttribute("data-qe-q","1");
      const opts = el("div", "qe-opts");
      opts.setAttribute("data-qe-opts","1");
      const note = el("div", "qe-note");
      note.setAttribute("data-qe-note","1");

      const actions = el("div", "qe-actions");
      const btnNext = el("button", "qm-btn", "Avanti");
      btnNext.type = "button";
      btnNext.setAttribute("data-qe-next","1");
      btnNext.disabled = true;

      const btnRestart = el("button", "qm-btn secondary", "Ricomincia");
      btnRestart.type = "button";
      btnRestart.setAttribute("data-qe-restart","1");

      actions.appendChild(btnNext);
      actions.appendChild(btnRestart);

      body.appendChild(qEl);
      body.appendChild(opts);
      body.appendChild(note);
      body.appendChild(actions);

      const result = el("div", "qe-result");
      result.setAttribute("data-qe-result","1");
      result.style.display = "none";

      wrap.appendChild(head);
      wrap.appendChild(body);
      wrap.appendChild(result);

      this.root.innerHTML = "";
      this.root.appendChild(wrap);

      // Bind
      btnNext.addEventListener("click", ()=>this.next());
      btnRestart.addEventListener("click", ()=>this.restart());
    }

    async load(){
      let raw = [];
      const bank = window.QuizManiaQuestionBank;
      const curated = bank && typeof bank.byPath === "function" ? bank.byPath(location.pathname) : null;
      if(Array.isArray(curated) && curated.length){
        raw = curated;
      }else if(this.generator){
        const fn = Generators[this.generator];
        if(typeof fn !== "function") throw new Error("Unknown generator");
        raw = fn(Math.max(20, this.limit * 4));
      }else if(this.src){
        raw = await loadQuestionsFromJSON(this.src);
      }
      const norm = [];
      for(const q of raw){
        const nq = normalizeQuestion(q);
        if(nq) norm.push(nq);
      }
      if(norm.length < 5) throw new Error("Not enough questions");
      shuffle(norm);
      this.questions = norm.slice(0, clamp(this.limit, 5, 50));
    }

    setBadge(){
      const badge = this.root.querySelector('[data-qe-badge]');
      if(badge) badge.textContent = `${this.idx+1}/${this.questions.length}`;
      const bar = this.root.querySelector('[data-qe-bar]');
      if(bar){
        const p = (this.idx / Math.max(1, this.questions.length)) * 100;
        bar.style.width = `${p}%`;
      }
    }

    render(){
      const q = this.questions[this.idx];
      const qEl = this.root.querySelector('[data-qe-q]');
      const optsEl = this.root.querySelector('[data-qe-opts]');
      const noteEl = this.root.querySelector('[data-qe-note]');
      const nextBtn = this.root.querySelector('[data-qe-next]');
      const resultEl = this.root.querySelector('[data-qe-result]');

      if(!qEl || !optsEl || !noteEl || !nextBtn || !resultEl) return;

      resultEl.style.display = "none";
      this.answered = false;
      nextBtn.disabled = true;

      qEl.textContent = q.q;
      noteEl.textContent = q.difficulty ? `Difficoltà: ${q.difficulty}` : "";
      optsEl.innerHTML = "";

      q.options.forEach((opt, i)=>{
        const b = el("button", "qe-opt");
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", ()=>this.answer(i));
        optsEl.appendChild(b);
      });

      this.setBadge();
    }

    answer(choice){
      if(this.answered) return;
      this.answered = true;
      const q = this.questions[this.idx];
      const buttons = Array.from(this.root.querySelectorAll('.qe-opt'));
      const nextBtn = this.root.querySelector('[data-qe-next]');
      const noteEl = this.root.querySelector('[data-qe-note]');

      buttons.forEach(b=>b.disabled = true);

      const ok = choice === q.correct;
      if(ok){
        this.score += 1;
        if(window.QuizMania && window.QuizMania.beep) window.QuizMania.beep("ok");
      }else{
        this.wrong.push({q:q.q, correct:q.options[q.correct], explain:q.explain || ""});
        if(window.QuizMania && window.QuizMania.beep) window.QuizMania.beep("bad");
      }

      buttons.forEach((b, i)=>{
        if(i === q.correct) b.classList.add("correct");
        if(i === choice && i !== q.correct) b.classList.add("wrong");
      });

      if(noteEl){
        noteEl.textContent = ok ? "✅ Corretto!" : "❌ Risposta sbagliata.";
        if(q.explain) noteEl.textContent += `  ${q.explain}`;
      }
      if(nextBtn) nextBtn.disabled = false;
    }

    persist(){
      const stats = (window.QuizMania && window.QuizMania.getStats) ? window.QuizMania.getStats() : {};
      if(!stats.quizzes) stats.quizzes = {};
      const prev = stats.quizzes[this.storageKey] || {plays:0,best:0,last:0};
      prev.plays += 1;
      prev.last = Date.now();
      prev.best = Math.max(prev.best || 0, this.score);
      stats.quizzes[this.storageKey] = prev;

      // streak
      if(window.QuizMania && window.QuizMania.updateStreak){
        window.QuizMania.updateStreak();
      }
      if(window.QuizMania && window.QuizMania.saveStats){
        window.QuizMania.saveStats(stats);
      }
    }

    showResults(){
      const resultEl = this.root.querySelector('[data-qe-result]');
      const bar = this.root.querySelector('[data-qe-bar]');
      if(bar) bar.style.width = "100%";
      if(!resultEl) return;
      const total = this.questions.length;
      const acc = Math.round((this.score / total) * 100);
      const secs = Math.max(1, Math.round((Date.now() - this.startedAt)/1000));

      resultEl.style.display = "block";
      resultEl.innerHTML = "";

      const title = el("div", "qe-title", "Risultato");
      const sub = el("div", "qe-sub", `Hai risposto a ${total} domande.`);
      resultEl.appendChild(title);
      resultEl.appendChild(sub);

      const kpis = el("div", "qe-kpis");
      kpis.appendChild(kpi(`${this.score}/${total}`, "Punteggio"));
      kpis.appendChild(kpi(`${acc}%`, "Accuratezza"));
      kpis.appendChild(kpi(`${secs}s`, "Tempo"));
      resultEl.appendChild(kpis);

      if(this.wrong.length){
        const wl = el("div", "qe-wronglist");
        const head = el("div", "qe-sub", "Rivedi gli errori (ottimo per imparare):");
        wl.appendChild(head);
        this.wrong.slice(0, 8).forEach(w=>{
          const it = el("div", "qe-wrong");
          it.appendChild(el("p", "t", w.q));
          const a = w.explain ? `${w.correct} — ${w.explain}` : w.correct;
          it.appendChild(el("p", "a", `✅ Risposta corretta: ${a}`));
          wl.appendChild(it);
        });
        if(this.wrong.length > 8){
          wl.appendChild(el("div", "qe-note", `Hai ${this.wrong.length - 8} altri errori: riprova il quiz per allenarti!`));
        }
        resultEl.appendChild(wl);
      }else{
        resultEl.appendChild(el("div", "qe-note", "Perfetto! Zero errori. 🔥"));
      }

      this.persist();
    }

    next(){
      if(!this.answered) return;
      if(this.idx + 1 >= this.questions.length){
        this.showResults();
        const badge = this.root.querySelector('[data-qe-badge]');
        if(badge) badge.textContent = `${this.questions.length}/${this.questions.length}`;
        const nextBtn = this.root.querySelector('[data-qe-next]');
        if(nextBtn) nextBtn.disabled = true;
        return;
      }
      this.idx += 1;
      this.render();
    }

    async restart(){
      this.idx = 0;
      this.score = 0;
      this.wrong = [];
      this.startedAt = Date.now();
      await this.load();
      this.render();
    }

    async start(){
      this.mountSkeleton();
      this.startedAt = Date.now();
      await this.load();
      this.render();
    }
  }

  function kpi(value, label){
    const box = el("div", "qe-kpi");
    box.appendChild(el("div", "v", value));
    box.appendChild(el("div", "l", label));
    return box;
  }

  async function boot(){
    const nodes = Array.from(document.querySelectorAll('[data-quiz]'));
    for(const n of nodes){
      const src = n.getAttribute('data-src') || "";
      const generator = n.getAttribute('data-generator') || "";
      const title = n.getAttribute('data-title') || document.title || "Quiz";
      const subtitle = n.getAttribute('data-subtitle') || "";
      const icon = n.getAttribute('data-icon') || "";
      const engine = new QuizEngine(n, {src, generator, title, subtitle, icon});
      try{
        await engine.start();
      }catch(err){
        n.innerHTML = `<div class="qe"><div class="qe-body"><div class="qe-q">Ops… qualcosa non va.</div><div class="qe-note">Non riesco a caricare le domande di questo quiz. (${String(err && err.message || err)})</div></div></div>`;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    boot();
  });

})();
