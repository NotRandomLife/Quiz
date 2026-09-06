(function () {
  "use strict";

  const root = document.querySelector("[data-qm-faq]");
  const select = document.querySelector("[data-faq-language]");
  const title = document.querySelector("[data-faq-title]");
  const intro = document.querySelector("[data-faq-intro]");
  const languageLabel = document.querySelector("[data-faq-language-label]");
  const list = document.querySelector("[data-faq-list]");
  const storageKey = "quizmania-faq-language";

  if (!root || !select || !title || !intro || !languageLabel || !list) return;

  const faq = {
    it: {
      title: "Domande frequenti", intro: "Risposte rapide per iniziare a giocare, studiare e proporre nuovi quiz.", label: "Lingua FAQ",
      items: [["Che cos'è QuizMania.it?", "Una raccolta gratuita di quiz per bambini, scuola, adulti e patenti: puoi iniziare subito, senza registrazione."], ["Le domande sono coerenti con l'argomento?", "Sì. Per ogni argomento usiamo domande e opzioni controllate; il catalogo viene ampliato nel tempo."], ["Il quiz NCC è valido per tutti gli esami?", "No. La raccolta NCC è dedicata esclusivamente alla preparazione dell'esame NCC di Milano."], ["Posso chiedere un nuovo quiz?", "Sì. Dal modulo Contatti puoi suggerire argomento, pubblico, difficoltà e un esempio di domanda."], ["Come installo l'app?", "In Chrome o Edge usa “Installa app”; in Safari usa Condividi e poi “Aggiungi a Home”. Nell'app installata il pulsante non compare."]]
    },
    en: {
      title: "Frequently asked questions", intro: "Quick answers to start playing, learning, and suggesting new quizzes.", label: "FAQ language",
      items: [["What is QuizMania.it?", "A free collection of quizzes for children, school, adults, and driving licences. Start right away, with no sign-up."], ["Are the questions relevant to each topic?", "Yes. Each topic uses reviewed questions and answer options, and the catalogue keeps growing."], ["Is the NCC quiz for every exam?", "No. The NCC collection is exclusively for preparing for the Milan NCC exam."], ["Can I request a new quiz?", "Yes. Use the Contact form to suggest a topic, audience, difficulty, and a sample question."], ["How do I install the app?", "In Chrome or Edge choose “Install app”; in Safari choose Share, then “Add to Home Screen”. The button is hidden in the installed app."]]
    },
    es: {
      title: "Preguntas frecuentes", intro: "Respuestas rápidas para jugar, estudiar y proponer nuevos cuestionarios.", label: "Idioma de las FAQ",
      items: [["¿Qué es QuizMania.it?", "Una colección gratuita de cuestionarios para niños, escuela, adultos y permisos de conducir. Puedes empezar sin registrarte."], ["¿Las preguntas son coherentes con el tema?", "Sí. Cada tema utiliza preguntas y opciones revisadas; el catálogo se amplía con el tiempo."], ["¿El cuestionario NCC sirve para todos los exámenes?", "No. La colección NCC está dedicada exclusivamente a la preparación del examen NCC de Milán."], ["¿Puedo pedir un nuevo cuestionario?", "Sí. Usa el formulario de Contacto para sugerir tema, público, dificultad y una pregunta de ejemplo."], ["¿Cómo instalo la aplicación?", "En Chrome o Edge elige “Instalar aplicación”; en Safari usa Compartir y luego “Añadir a la pantalla de inicio”. En la app instalada el botón no aparece."]]
    },
    fr: {
      title: "Questions fréquentes", intro: "Des réponses rapides pour jouer, apprendre et proposer de nouveaux quiz.", label: "Langue de la FAQ",
      items: [["Qu'est-ce que QuizMania.it ?", "Une collection gratuite de quiz pour enfants, école, adultes et permis de conduire. Vous pouvez commencer sans inscription."], ["Les questions correspondent-elles au sujet ?", "Oui. Chaque sujet utilise des questions et des réponses vérifiées, et le catalogue s'enrichit au fil du temps."], ["Le quiz NCC convient-il à tous les examens ?", "Non. La collection NCC est exclusivement dédiée à la préparation de l'examen NCC de Milan."], ["Puis-je demander un nouveau quiz ?", "Oui. Utilisez le formulaire de contact pour proposer un sujet, un public, une difficulté et un exemple de question."], ["Comment installer l'application ?", "Dans Chrome ou Edge, choisissez « Installer l'application » ; dans Safari, choisissez Partager puis « Sur l'écran d'accueil ». Le bouton est masqué dans l'application installée."]]
    },
    de: {
      title: "Häufige Fragen", intro: "Schnelle Antworten zum Spielen, Lernen und Vorschlagen neuer Quiz.", label: "FAQ-Sprache",
      items: [["Was ist QuizMania.it?", "Eine kostenlose Quizsammlung für Kinder, Schule, Erwachsene und Führerscheine. Du kannst ohne Anmeldung sofort starten."], ["Passen die Fragen zum jeweiligen Thema?", "Ja. Für jedes Thema verwenden wir geprüfte Fragen und Antwortoptionen; der Katalog wächst weiter."], ["Gilt das NCC-Quiz für alle Prüfungen?", "Nein. Die NCC-Sammlung dient ausschließlich der Vorbereitung auf die NCC-Prüfung in Mailand."], ["Kann ich ein neues Quiz vorschlagen?", "Ja. Über das Kontaktformular kannst du Thema, Zielgruppe, Schwierigkeitsgrad und eine Beispielfrage vorschlagen."], ["Wie installiere ich die App?", "Wähle in Chrome oder Edge „App installieren“; in Safari „Teilen“ und dann „Zum Home-Bildschirm“. In der installierten App wird die Schaltfläche nicht angezeigt."]]
    },
    pt: {
      title: "Perguntas frequentes", intro: "Respostas rápidas para jogar, estudar e sugerir novos quizzes.", label: "Idioma das FAQ",
      items: [["O que é o QuizMania.it?", "Uma coleção gratuita de quizzes para crianças, escola, adultos e cartas de condução. Pode começar sem registo."], ["As perguntas são coerentes com o tema?", "Sim. Cada tema utiliza perguntas e opções revistas; o catálogo cresce ao longo do tempo."], ["O quiz NCC serve para todos os exames?", "Não. A coleção NCC é exclusivamente dedicada à preparação para o exame NCC de Milão."], ["Posso pedir um novo quiz?", "Sim. Use o formulário de Contacto para sugerir tema, público, dificuldade e uma pergunta de exemplo."], ["Como instalo a aplicação?", "No Chrome ou Edge escolha “Instalar aplicação”; no Safari escolha Partilhar e depois “Adicionar ao ecrã principal”. O botão não aparece na aplicação instalada."]]
    },
    ro: {
      title: "Întrebări frecvente", intro: "Răspunsuri rapide pentru a te juca, a învăța și a propune quizuri noi.", label: "Limba FAQ",
      items: [["Ce este QuizMania.it?", "O colecție gratuită de quizuri pentru copii, școală, adulți și permise de conducere. Poți începe fără înregistrare."], ["Întrebările sunt potrivite pentru subiect?", "Da. Fiecare subiect are întrebări și opțiuni verificate, iar catalogul crește în timp."], ["Quizul NCC este pentru toate examenele?", "Nu. Colecția NCC este dedicată exclusiv pregătirii pentru examenul NCC din Milano."], ["Pot cere un quiz nou?", "Da. Folosește formularul de contact pentru a sugera subiectul, publicul, dificultatea și un exemplu de întrebare."], ["Cum instalez aplicația?", "În Chrome sau Edge alege „Instalează aplicația”; în Safari alege Partajare și apoi „Adaugă pe ecranul principal”. Butonul nu apare în aplicația instalată."]]
    },
    pl: {
      title: "Najczęściej zadawane pytania", intro: "Szybkie odpowiedzi, aby grać, uczyć się i proponować nowe quizy.", label: "Język FAQ",
      items: [["Czym jest QuizMania.it?", "To bezpłatna kolekcja quizów dla dzieci, szkoły, dorosłych i prawa jazdy. Możesz zacząć bez rejestracji."], ["Czy pytania pasują do tematu?", "Tak. Każdy temat zawiera sprawdzone pytania i odpowiedzi, a katalog jest stale rozwijany."], ["Czy quiz NCC dotyczy wszystkich egzaminów?", "Nie. Kolekcja NCC służy wyłącznie do przygotowania do egzaminu NCC w Mediolanie."], ["Czy mogę zaproponować nowy quiz?", "Tak. W formularzu kontaktowym możesz podać temat, odbiorców, poziom trudności i przykładowe pytanie."], ["Jak zainstalować aplikację?", "W Chrome lub Edge wybierz „Zainstaluj aplikację”; w Safari wybierz Udostępnij, a następnie „Do ekranu początkowego”. W zainstalowanej aplikacji przycisk jest ukryty."]]
    },
    ar: {
      title: "الأسئلة الشائعة", intro: "إجابات سريعة لبدء اللعب والتعلّم واقتراح اختبارات جديدة.", label: "لغة الأسئلة الشائعة",
      items: [["ما هو QuizMania.it؟", "مجموعة مجانية من الاختبارات للأطفال والمدرسة والبالغين ورخص القيادة. يمكنك البدء فورًا من دون تسجيل."], ["هل الأسئلة مرتبطة بالموضوع؟", "نعم. يستخدم كل موضوع أسئلة وخيارات إجابة تمت مراجعتها، ويستمر الكتالوج في التوسع."], ["هل اختبار NCC مناسب لكل الامتحانات؟", "لا. مجموعة NCC مخصصة حصريًا للتحضير لامتحان NCC في ميلانو."], ["هل يمكنني طلب اختبار جديد؟", "نعم. استخدم نموذج الاتصال لاقتراح الموضوع والجمهور ومستوى الصعوبة وسؤال نموذجي."], ["كيف أثبت التطبيق؟", "في Chrome أو Edge اختر «تثبيت التطبيق». في Safari اختر مشاركة ثم «إضافة إلى الشاشة الرئيسية». لا يظهر الزر داخل التطبيق المثبت."]]
    },
    zh: {
      title: "常见问题", intro: "快速了解如何开始答题、学习和建议新测验。", label: "FAQ 语言",
      items: [["QuizMania.it 是什么？", "这是一个面向儿童、学校、成人和驾照学习者的免费测验集合，无需注册即可开始。"], ["题目与主题相关吗？", "是的。每个主题都采用经过检查的题目和选项，题库会持续扩展。"], ["NCC 测验适用于所有考试吗？", "不是。NCC 题库仅用于准备米兰的 NCC 考试。"], ["我可以请求新的测验吗？", "可以。请通过联系表单建议主题、受众、难度和示例问题。"], ["如何安装应用？", "在 Chrome 或 Edge 中选择“安装应用”；在 Safari 中选择分享，然后选择“添加到主屏幕”。已安装的应用中不会显示该按钮。"]]
    },
    ja: {
      title: "よくある質問", intro: "クイズを始める方法、学習、新しいクイズの提案に関する簡単な回答です。", label: "FAQ の言語",
      items: [["QuizMania.it とは何ですか？", "子ども、学校、成人、運転免許向けの無料クイズ集です。登録なしですぐに始められます。"], ["質問はテーマに合っていますか？", "はい。各テーマでは確認済みの質問と選択肢を使用し、カタログは継続的に拡大しています。"], ["NCC クイズはすべての試験向けですか？", "いいえ。NCC コレクションは、ミラノの NCC 試験対策専用です。"], ["新しいクイズを依頼できますか？", "はい。お問い合わせフォームから、テーマ、対象者、難易度、質問例を提案できます。"], ["アプリをインストールするには？", "Chrome または Edge では「アプリをインストール」を選びます。Safari では共有から「ホーム画面に追加」を選びます。インストール済みのアプリではボタンは表示されません。"]]
    },
    ru: {
      title: "Часто задаваемые вопросы", intro: "Краткие ответы, чтобы начать играть, учиться и предлагать новые викторины.", label: "Язык FAQ",
      items: [["Что такое QuizMania.it?", "Это бесплатная коллекция викторин для детей, школы, взрослых и подготовки к водительским экзаменам. Можно начать без регистрации."], ["Соответствуют ли вопросы теме?", "Да. Для каждой темы используются проверенные вопросы и варианты ответов, а каталог постоянно расширяется."], ["Подходит ли викторина NCC для всех экзаменов?", "Нет. Коллекция NCC предназначена исключительно для подготовки к экзамену NCC в Милане."], ["Можно ли предложить новую викторину?", "Да. Через форму контактов можно предложить тему, аудиторию, сложность и пример вопроса."], ["Как установить приложение?", "В Chrome или Edge выберите «Установить приложение»; в Safari выберите «Поделиться», затем «На экран Домой». В установленном приложении кнопка не отображается."]]
    }
  };

  const preferredLanguage = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && faq[saved]) return saved;
    } catch (_) {}
    const browserLanguages = navigator.languages || [navigator.language || "en"];
    const match = browserLanguages.map((language) => language.toLowerCase().split("-")[0]).find((language) => faq[language]);
    return match || "en";
  };

  const render = (language) => {
    const content = faq[language] || faq.en;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    title.textContent = content.title;
    intro.textContent = content.intro;
    languageLabel.textContent = content.label;
    select.setAttribute("aria-label", content.label);
    select.value = language;
    list.replaceChildren(...content.items.map(([question, answer], index) => {
      const item = document.createElement("details");
      item.className = "faq-item";
      item.open = index === 0;
      const summary = document.createElement("summary");
      summary.textContent = question;
      const paragraph = document.createElement("p");
      paragraph.textContent = answer;
      item.append(summary, paragraph);
      return item;
    }));
  };

  const initialLanguage = preferredLanguage();
  render(initialLanguage);
  select.addEventListener("change", () => {
    const language = faq[select.value] ? select.value : "en";
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (_) {}
    render(language);
  });
}());
