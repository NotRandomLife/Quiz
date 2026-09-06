/* QuizMania.it — curated question bank
   Each topic supplies conceptually distinct facts. The engine turns every fact
   into recall, definition, association and completion prompts, with balanced
   answer positions and checked multiple-choice structure. */
(function () {
  "use strict";

  const raw = {
    storia: `Preistoria::Periodo precedente alla comparsa della scrittura|Civiltà egizia::Civiltà nata lungo il fiume Nilo|Democrazia ateniese::Sistema in cui i cittadini partecipavano alle decisioni della polis|Repubblica romana::Fase di Roma governata da magistrati e Senato prima dell'Impero|Impero romano::Periodo iniziato con Ottaviano Augusto nel 27 a.C.|Medioevo::Epoca europea compresa convenzionalmente tra V e XV secolo|Feudalesimo::Organizzazione sociale basata su rapporti di fedeltà e concessione di feudi|Comuni::Città medievali con forme autonome di governo|Rinascimento::Movimento culturale che rivalutò l'uomo, le arti e i classici|Stampa a caratteri mobili::Tecnica perfezionata da Gutenberg nel Quattrocento|Scoperta dell'America::Viaggio di Cristoforo Colombo del 1492|Riforma protestante::Movimento religioso avviato da Martin Lutero nel 1517|Rivoluzione francese::Evento iniziato in Francia nel 1789|Risorgimento::Processo che portò all'unità italiana nel 1861|Costituzione italiana::Legge fondamentale della Repubblica entrata in vigore nel 1948`,
    scienze: `Cellula::Unità fondamentale degli esseri viventi|Fotosintesi clorofilliana::Processo con cui le piante producono zuccheri usando luce, acqua e anidride carbonica|Mammifero::Animale che allatta i piccoli con il latte|Vertebrato::Animale dotato di colonna vertebrale|Ecosistema::Insieme di organismi e ambiente in cui interagiscono|Catena alimentare::Sequenza di organismi collegati dal rapporto alimentare|Evaporazione::Passaggio dell'acqua da liquido a vapore|Condensazione::Passaggio del vapore acqueo a liquido|Fusione::Passaggio di stato da solido a liquido|Forza di gravità::Forza che attrae i corpi verso la Terra|Atomo::Unità di base di un elemento chimico|Molecola::Insieme di atomi legati tra loro|pH neutro::Valore 7 nella scala di acidità e basicità|Energia rinnovabile::Energia da fonti che si rigenerano naturalmente|Sistema solare::Insieme formato dal Sole e dai corpi che gli orbitano attorno`,
    geografia: `Equatore::Linea immaginaria che divide la Terra in emisfero nord e sud|Meridiano di Greenwich::Meridiano di riferimento per la longitudine zero|Latitudine::Distanza angolare a nord o sud dell'Equatore|Longitudine::Distanza angolare a est o ovest del meridiano di Greenwich|Continente::Grande massa di terre emerse|Oceano Pacifico::Oceano più esteso della Terra|Oceano Atlantico::Oceano tra Americhe ed Europa-Africa|Penisola::Terra circondata dal mare su tre lati|Arcipelago::Gruppo di isole vicine tra loro|Delta::Foce di un fiume ramificata in più sbocchi|Clima::Insieme delle condizioni atmosferiche medie di un luogo nel tempo|Densità di popolazione::Numero di abitanti in rapporto alla superficie|Capitale::Città sede principale del governo di uno Stato|Unione Europea::Organizzazione politica ed economica di Stati europei|Fuso orario::Area in cui si adotta la stessa ora convenzionale`,
    arte: `Arte rupestre::Pitture e incisioni realizzate sulle pareti delle grotte preistoriche|Partenone::Tempio dell'antica Atene dedicato ad Atena|Mosaico::Immagine composta da piccole tessere di materiali diversi|Affresco::Pittura eseguita su intonaco fresco|Prospettiva::Tecnica che rappresenta la profondità su una superficie piana|Leonardo da Vinci::Artista e inventore autore della Gioconda|Michelangelo Buonarroti::Artista autore della volta della Cappella Sistina|Raffaello Sanzio::Pittore rinascimentale autore delle Stanze Vaticane|Barocco::Stile artistico caratterizzato da movimento e teatralità|Caravaggio::Pittore celebre per il forte contrasto tra luce e ombra|Impressionismo::Movimento che studiò gli effetti momentanei di luce e colore|Claude Monet::Pittore impressionista della serie delle Ninfee|Cubismo::Movimento che scompone le forme in piani geometrici|Pablo Picasso::Artista associato al Cubismo e autore di Guernica|Museo::Istituzione che conserva, studia ed espone opere e reperti`,
    cultura: `Dante Alighieri::Autore della Divina Commedia|Alessandro Manzoni::Autore del romanzo I Promessi Sposi|Italo Calvino::Scrittore italiano autore de Il barone rampante|Premio Nobel::Riconoscimento internazionale assegnato in varie discipline|UNESCO::Organizzazione ONU che tutela anche il patrimonio culturale mondiale|Biblioteca::Luogo che raccoglie, conserva e rende consultabili libri e documenti|Enciclopedia::Opera di consultazione che raccoglie conoscenze su molti argomenti|Romanzo::Testo narrativo in prosa di ampia estensione|Poesia::Forma letteraria che usa ritmo, immagini e linguaggio concentrato|Teatro::Arte della rappresentazione dal vivo davanti a un pubblico|Orchestra::Insieme organizzato di musicisti che suonano strumenti diversi|Lingua madre::Prima lingua appresa da una persona nell'infanzia|Etimologia::Studio dell'origine e della storia delle parole|Archivio::Insieme organizzato di documenti conservati nel tempo|Fonte storica::Traccia usata dagli studiosi per conoscere il passato`,
    digitale: `Algoritmo::Sequenza ordinata di istruzioni per risolvere un problema|Programma::Insieme di istruzioni eseguibili da un computer|Browser::Applicazione usata per navigare sul web|Motore di ricerca::Servizio che aiuta a trovare pagine e informazioni online|Password robusta::Password lunga, unica e difficile da indovinare|Autenticazione a due fattori::Secondo controllo oltre alla password per accedere a un account|Phishing::Tentativo ingannevole di rubare dati fingendosi un soggetto affidabile|Backup::Copia di sicurezza dei dati da usare in caso di perdita|Cloud computing::Uso di risorse informatiche disponibili via rete|Indirizzo IP::Identificativo assegnato a un dispositivo in una rete|URL::Indirizzo che identifica una risorsa sul web|HTML::Linguaggio che struttura il contenuto di una pagina web|CSS::Linguaggio usato per definire l'aspetto di una pagina web|Variabile::Spazio con nome che contiene un valore in un programma|Debug::Ricerca e correzione degli errori nel codice`,
    salute: `Scheletro::Insieme di ossa che sostiene e protegge il corpo|Muscolo::Tessuto che si contrae per permettere il movimento|Cuore::Organo che pompa il sangue nel sistema circolatorio|Polmoni::Organi che scambiano ossigeno e anidride carbonica|Cervello::Organo che coordina molte funzioni del sistema nervoso|Digestione::Processo che trasforma il cibo in sostanze utilizzabili|Vaccino::Preparato che allena il sistema immunitario a riconoscere un agente patogeno|Igiene delle mani::Abitudine che riduce la diffusione di molti microrganismi|Alimentazione equilibrata::Scelta varia e proporzionata di alimenti|Idratazione::Assunzione adeguata di liquidi, soprattutto acqua|Sonno::Periodo di riposo essenziale per molte funzioni dell'organismo|Sistema immunitario::Insieme di difese dell'organismo contro agenti estranei|Globuli rossi::Cellule del sangue che trasportano principalmente ossigeno|Arteria::Vaso sanguigno che porta il sangue dal cuore verso i tessuti|Pronto soccorso::Struttura sanitaria per emergenze e urgenze`,
    economia: `Budget::Piano delle entrate e delle uscite previste|Risparmio::Parte del reddito non spesa nel presente|Interesse semplice::Compenso calcolato solo sul capitale iniziale|Inflazione::Aumento generale e persistente dei prezzi|PIL::Valore dei beni e servizi finali prodotti in un Paese|Tasso di interesse::Percentuale applicata a un capitale prestato o investito|Diversificazione::Ripartizione degli investimenti per ridurre il rischio specifico|Liquidità::Facilità con cui un'attività può essere trasformata in denaro|Obbligazione::Titolo con cui un emittente prende denaro in prestito|Azione::Quota di proprietà di una società per azioni|Mutuo::Prestito di lunga durata spesso legato all'acquisto di una casa|Assicurazione::Contratto che copre alcuni rischi in cambio di un premio|Imposta::Tributo versato per finanziare servizi e spese pubbliche|IVA::Imposta sul valore aggiunto applicata ai consumi|Potere d'acquisto::Quantità di beni e servizi acquistabili con una somma`,
    musica_cinema: `Pentagramma::Insieme di cinque linee su cui si scrivono le note musicali|Ritmo::Organizzazione di durate e accenti nella musica|Melodia::Successione di suoni percepita come una linea musicale|Armonia::Combinazione simultanea di suoni e accordi|Orchestra::Gruppo di musicisti con strumenti diversi|Violino::Strumento ad arco della famiglia degli archi|Pianoforte::Strumento a tastiera con corde percosse da martelletti|Opera lirica::Spettacolo teatrale in cui il testo è in gran parte cantato|Colonna sonora::Musica creata o scelta per accompagnare un film|Regista::Professionista che guida la realizzazione artistica di un film|Sceneggiatura::Testo che descrive storia, dialoghi e scene di un film|Montaggio::Fase che seleziona e ordina le inquadrature filmate|Documentario::Film basato su fatti, persone o temi reali|Animazione::Tecnica che crea l'illusione del movimento da immagini successive|Premio Oscar::Premio cinematografico assegnato dall'Academy statunitense`,
    educazione_civica: `Costituzione::Legge fondamentale che definisce principi e regole di uno Stato|Repubblica italiana::Forma di Stato italiana fondata sul voto popolare|Parlamento::Organo che esercita la funzione legislativa|Governo::Organo che dirige la politica generale ed esercita funzione esecutiva|Presidente della Repubblica::Capo dello Stato italiano|Comune::Ente locale più vicino ai cittadini|Regione::Ente territoriale con competenze stabilite dalla Costituzione|Cittadinanza::Appartenenza giuridica di una persona a uno Stato|Diritto::Pretesa o libertà riconosciuta e tutelata dall'ordinamento|Dovere::Comportamento richiesto dalla convivenza civile e dalle regole|Voto::Strumento con cui i cittadini scelgono i propri rappresentanti|Legalità::Rispetto delle leggi e delle regole comuni|Bene comune::Ciò che favorisce il benessere dell'intera comunità|Raccolta differenziata::Separazione dei rifiuti per favorire recupero e riciclo|Privacy::Protezione dei dati personali e della vita privata`,
    astronomia: `Sole::Stella al centro del Sistema solare|Pianeta::Corpo celeste che orbita attorno a una stella|Satellite naturale::Corpo che orbita attorno a un pianeta|Luna::Satellite naturale della Terra|Rotazione terrestre::Movimento della Terra attorno al proprio asse|Rivoluzione terrestre::Moto della Terra attorno al Sole|Anno bisestile::Anno di 366 giorni introdotto per allineare calendario e moto terrestre|Eclissi solare::Evento in cui la Luna si interpone tra Sole e Terra|Eclissi lunare::Evento in cui la Terra proietta la propria ombra sulla Luna|Galassia::Grande sistema di stelle, gas, polveri e materia oscura|Via Lattea::Galassia che ospita il Sistema solare|Asteroide::Piccolo corpo roccioso in orbita attorno al Sole|Cometa::Corpo ricco di ghiacci e polveri che può formare una coda|Costellazione::Gruppo apparente di stelle associato a una figura convenzionale|Telescopio::Strumento usato per osservare oggetti celesti lontani`,
    italia: `Roma::Capitale d'Italia e capoluogo del Lazio|Alpi::Catena montuosa lungo il confine settentrionale italiano|Appennini::Catena montuosa che attraversa gran parte della penisola|Po::Fiume più lungo d'Italia|Tevere::Fiume che attraversa Roma|Sicilia::Regione italiana insulare più estesa|Sardegna::Isola italiana nel Mar Mediterraneo occidentale|Mar Adriatico::Mare che bagna la costa orientale italiana|Mar Tirreno::Mare che bagna gran parte della costa occidentale italiana|Lombardia::Regione con capoluogo Milano|Toscana::Regione con capoluogo Firenze|Campania::Regione con capoluogo Napoli|Puglia::Regione situata nel tacco della penisola italiana|Emilia-Romagna::Regione attraversata dalla Via Emilia|Trentino-Alto Adige::Regione italiana con due province autonome`,
    ambiente: `Biodiversità::Varietà di specie viventi, geni ed ecosistemi|Effetto serra::Fenomeno per cui alcuni gas trattengono parte del calore nell'atmosfera|Cambiamento climatico::Variazione duratura dei modelli climatici globali o regionali|Energia solare::Energia ottenuta dalla radiazione del Sole|Energia eolica::Energia prodotta sfruttando il vento|Riciclo::Trasformazione dei materiali di scarto in nuove risorse|Compostaggio::Decomposizione controllata di rifiuti organici per ottenere compost|Impronta ecologica::Misura della pressione umana sulle risorse naturali|Inquinamento dell'aria::Presenza di sostanze nocive nell'atmosfera|Microplastiche::Piccoli frammenti di plastica dispersi nell'ambiente|Deforestazione::Riduzione delle superfici forestali|Specie autoctona::Specie originaria di un determinato territorio|Specie invasiva::Specie introdotta che può alterare gli ecosistemi locali|Area protetta::Zona tutelata per conservare natura e paesaggio|Economia circolare::Modello che punta a riuso, riparazione e riciclo`,
    psicologia: `Emozione::Risposta psicofisica a eventi valutati come rilevanti|Empatia::Capacità di comprendere il punto di vista o lo stato emotivo altrui|Memoria a breve termine::Sistema che mantiene poche informazioni per un tempo limitato|Attenzione selettiva::Capacità di concentrarsi su alcuni stimoli ignorandone altri|Abitudine::Comportamento reso più automatico dalla ripetizione|Motivazione intrinseca::Spinta ad agire per interesse o soddisfazione personale|Bias di conferma::Tendenza a cercare o favorire informazioni coerenti con le proprie idee|Effetto placebo::Miglioramento collegato alle aspettative, non solo a un principio attivo|Comunicazione assertiva::Espressione chiara dei propri bisogni rispettando gli altri|Stress::Risposta dell'organismo a richieste percepite come impegnative|Resilienza::Capacità di adattarsi e recuperare dopo difficoltà|Autostima::Valutazione che una persona fa del proprio valore|Ascolto attivo::Ascolto attento con domande e riscontri comprensivi|Pensiero critico::Valutazione ragionata di fonti, argomenti e prove|Correlazione::Relazione statistica che non dimostra da sola causalità`,
    filosofia: `Filosofia::Ricerca razionale su domande fondamentali riguardo conoscenza, realtà e valori|Socrate::Filosofo ateniese noto per il dialogo e il metodo maieutico|Platone::Filosofo autore della teoria delle idee|Aristotele::Filosofo che studiò logica, natura, etica e politica|Etica::Riflessione su azioni, valori e comportamenti morali|Logica::Studio delle forme corrette di ragionamento|Argomento::Insieme di premesse proposte a sostegno di una conclusione|Premessa::Proposizione da cui parte un ragionamento|Conclusione::Proposizione che un ragionamento intende sostenere|Stoicismo::Scuola che valorizza ragione, virtù e controllo delle proprie reazioni|Illuminismo::Movimento che valorizzò ragione, scienza e critica delle autorità|Empirismo::Corrente che attribuisce un ruolo centrale all'esperienza sensibile|Razionalismo::Corrente che attribuisce un ruolo centrale alla ragione|Contratto sociale::Idea secondo cui l'autorità politica deriva da un accordo tra individui|Dubbio metodico::Uso del dubbio come strumento per cercare basi certe della conoscenza`,
    sport: `Olimpiadi::Grande manifestazione sportiva internazionale a cadenza quadriennale|Fair play::Comportamento leale e rispettoso nelle competizioni|Allenamento::Attività programmata per migliorare capacità fisiche e tecniche|Riscaldamento::Esercizi preparatori svolti prima dell'attività intensa|Defaticamento::Attività leggera dopo lo sforzo per favorire il recupero|Arbitro::Persona che applica le regole e dirige una gara|Record::Migliore prestazione registrata in una disciplina|Staffetta::Gara in cui i componenti di una squadra si alternano|Maratona::Corsa su strada di 42,195 chilometri|Decathlon::Gara di atletica composta da dieci prove|Fuorigioco::Regola del calcio che limita alcune posizioni d'attacco al passaggio|Set::Suddivisione del gioco in sport come tennis e pallavolo|Tiebreak::Gioco decisivo usato in caso di parità in alcuni sport|Doping::Uso di sostanze o metodi vietati per migliorare la prestazione|Paralimpiadi::Manifestazione sportiva internazionale per atleti con disabilità`,
    grammatica: `Nome comune::Parola che indica persone, animali o cose in modo generale|Nome proprio::Parola che identifica in modo specifico una persona, un luogo o un ente|Articolo determinativo::Parola come il, lo, la che introduce un nome noto o specifico|Aggettivo qualificativo::Parola che indica una qualità del nome|Verbo::Parola che esprime azione, stato o evento|Pronome::Parola che sostituisce o richiama un nome|Avverbio::Parola invariabile che modifica verbo, aggettivo o altro avverbio|Preposizione::Parola che collega elementi della frase indicando relazioni|Congiunzione::Parola che collega parole o proposizioni|Soggetto::Elemento della frase di cui si dice qualcosa|Predicato verbale::Parte della frase centrata su un verbo che esprime azione o stato|Complemento oggetto::Elemento che riceve direttamente l'azione del verbo|Singolare::Numero grammaticale che indica una sola entità|Plurale::Numero grammaticale che indica più entità|Sinonimo::Parola con significato uguale o molto simile a un'altra`,
    inglese: `apple::mela|book::libro|chair::sedia|dog::cane|family::famiglia|friend::amico o amica|garden::giardino|happy::felice|house::casa|keyboard::tastiera|library::biblioteca|mountain::montagna|notebook::quaderno|orange::arancia|picture::immagine`,
    bambini: `Settimana::Periodo formato da sette giorni|Triangolo::Figura geometrica con tre lati|Arcobaleno::Fenomeno colorato visibile quando luce e gocce d'acqua interagiscono|Bruco::Larva che può trasformarsi in farfalla|Semaforo rosso::Segnale che indica di fermarsi|Bussola::Strumento che indica il nord magnetico|Stagione::Periodo dell'anno con caratteristiche climatiche ricorrenti|Dentista::Professionista che cura denti e bocca|Biblioteca::Luogo dove si possono prendere in prestito libri|Riciclo::Separazione dei materiali per poterli recuperare|Mammifero::Animale che nutre i piccoli con il latte|Pianeta Terra::Pianeta su cui viviamo|Capitale::Città principale di uno Stato|Regola::Indicazione che aiuta a convivere e giocare in modo corretto|Gentilezza::Modo rispettoso e premuroso di trattare gli altri`,
    patente_b: `Segnale di STOP::Impone l'arresto e la precedenza secondo le regole|Segnale di dare precedenza::Impone di lasciare passare chi ha diritto di precedenza|Striscia continua::Non deve essere oltrepassata salvo casi previsti dalla normativa|Distanza di sicurezza::Spazio da mantenere per poter frenare senza urtare chi precede|Cintura di sicurezza::Dispositivo che deve essere correttamente allacciato quando previsto|Casco protettivo::Dispositivo obbligatorio per conducenti e passeggeri di ciclomotori e motocicli|Patente di guida::Documento che abilita alla guida delle categorie indicate|Revisione::Controllo periodico obbligatorio dell'idoneità del veicolo|Assicurazione RCA::Copertura obbligatoria per i danni causati a terzi dalla circolazione|Passaggio pedonale::Attraversamento riservato ai pedoni|Semaforo rosso::Segnale luminoso che impone di arrestarsi|Semaforo verde::Segnale luminoso che consente il passaggio se sicuro|Frenata::Azione che riduce la velocità del veicolo|Pneumatici::Componenti che assicurano contatto e aderenza tra veicolo e strada|Alcol alla guida::Fattore che riduce attenzione e capacità di reazione e può violare la legge`
  };

  function rotate(values, correct, offset) {
    const choices = [correct, ...values.filter((value) => value !== correct).slice(0, 3)];
    const shift = offset % choices.length;
    const options = choices.slice(shift).concat(choices.slice(0, shift));
    return { options, correct: options.indexOf(correct) };
  }

  function facts(key) {
    return (raw[key] || "").split("|").filter(Boolean).map((row) => {
      const [term, definition] = row.split("::");
      return { term: term.trim(), definition: definition.trim() };
    });
  }

  function fromFacts(key) {
    const items = facts(key);
    const terms = items.map((item) => item.term);
    const definitions = items.map((item) => item.definition);
    const output = [];
    items.forEach((item, index) => {
      let choice = rotate(terms.slice(index + 1).concat(terms.slice(0, index)), item.term, index);
      output.push({ q: `Quale concetto corrisponde a questa descrizione? ${item.definition}`, ...choice, difficulty: index % 4 ? "medium" : "easy", explain: `${item.term}: ${item.definition}` });
      choice = rotate(definitions.slice(index + 1).concat(definitions.slice(0, index)), item.definition, index + 1);
      output.push({ q: `Quale affermazione definisce correttamente “${item.term}”?`, ...choice, difficulty: index % 3 ? "medium" : "easy", explain: `${item.term}: ${item.definition}` });
      const wrongOne = items[(index + 1) % items.length];
      const wrongTwo = items[(index + 2) % items.length];
      const wrongThree = items[(index + 3) % items.length];
      const correctPair = `${item.term} — ${item.definition}`;
      choice = rotate([
        `${wrongOne.term} — ${item.definition}`,
        `${item.term} — ${wrongTwo.definition}`,
        `${wrongThree.term} — ${wrongOne.definition}`
      ], correctPair, index + 2);
      output.push({ q: `Quale associazione relativa a “${item.term}” è corretta?`, ...choice, difficulty: "medium", explain: `${item.term}: ${item.definition}` });
      choice = rotate(definitions.slice(index + 2).concat(definitions.slice(0, index + 2)), item.definition, index + 3);
      output.push({ q: `Completa correttamente la frase: “${item.term} è…”`, ...choice, difficulty: "medium", explain: `${item.term}: ${item.definition}` });
    });
    return output;
  }

  function numberQuestion(q, answer, distractors, difficulty, explain) {
    const options = [String(answer), ...distractors.map(String)];
    const shift = Math.abs(String(answer).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % options.length;
    const ordered = options.slice(shift).concat(options.slice(0, shift));
    return { q, options: ordered, correct: ordered.indexOf(String(answer)), difficulty, explain };
  }

  function math() {
    const output = [];
    for (let a = 2; a <= 16; a++) {
      for (let b = 3; b <= 12; b += 3) {
        const answer = a * b;
        output.push(numberQuestion(`Quanto fa ${a} × ${b}?`, answer, [answer - a, answer + b, answer + a + b], "easy", `${a} × ${b} = ${answer}.`));
      }
    }
    for (let base = 20; base <= 140; base += 5) {
      const part = (base / 5) * 2;
      output.push(numberQuestion(`Qual è il 40% di ${base}?`, part, [part - 5, part + 5, part + 7], "medium", `Il 40% corrisponde a 4 decimi: ${base} × 0,4 = ${part}.`));
    }
    return output;
  }

  function geometry() {
    const output = [];
    for (let side = 3; side <= 30; side++) {
      const perimeter = side * 4;
      const area = side * side;
      output.push(numberQuestion(`Qual è il perimetro di un quadrato con lato ${side} cm?`, `${perimeter} cm`, [`${side * 2} cm`, `${area} cm²`, `${perimeter + 4} cm`], "easy", `Il perimetro del quadrato è lato × 4: ${side} × 4 = ${perimeter} cm.`));
      output.push(numberQuestion(`Qual è l'area di un quadrato con lato ${side} cm?`, `${area} cm²`, [`${perimeter} cm`, `${side * 2} cm²`, `${area + side} cm²`], "medium", `L'area del quadrato è lato × lato: ${side} × ${side} = ${area} cm².`));
    }
    return output;
  }

  function logic() {
    const output = [];
    for (let start = 2; start <= 75; start++) {
      const step = (start % 7) + 2;
      const answer = start + step * 3;
      output.push(numberQuestion(`Completa la sequenza: ${start}, ${start + step}, ${start + step * 2}, …`, answer, [answer - 1, answer + 1, start + step * 4], start % 2 ? "easy" : "medium", `Ogni numero aumenta di ${step}.`));
    }
    return output;
  }

  function byPath(pathname) {
    const path = pathname.replace(/\\/g, "/");
    if (path.includes("/matematica/")) return math();
    if (path.includes("/geometria/")) return geometry();
    if (path.includes("/logica/")) return logic();
    const groups = [
      ["/storia/", "storia"], ["/scienze/", "scienze"], ["/geografia_italia/", "italia"], ["/geografia/", "geografia"],
      ["/arte_adulti/", "arte"], ["/arte/", "arte"], ["/informatica/", "digitale"], ["/coding/", "digitale"], ["/tecnologia/", "digitale"],
      ["/corpo_umano/", "salute"], ["/medicina/", "salute"], ["/economia/", "economia"], ["/finanza_personale/", "economia"],
      ["/cinema_musica/", "musica_cinema"], ["/musica/", "musica_cinema"], ["/educazione_civica/", "educazione_civica"], ["/astronomia/", "astronomia"],
      ["/ambiente/", "ambiente"], ["/psicologia/", "psicologia"], ["/filosofia/", "filosofia"], ["/sport/", "sport"],
      ["/grammatica/", "grammatica"], ["/italiano/", "grammatica"], ["/inglese/", "inglese"], ["/cultura/", "cultura"], ["/attualita/", "cultura"],
      ["/bambini/", "bambini"], ["/eta_", "bambini"]
    ];
    const found = groups.find(([fragment]) => path.includes(fragment));
    return found ? fromFacts(found[1]) : null;
  }

  window.QuizManiaQuestionBank = { byPath, fromFacts, facts };
}());
