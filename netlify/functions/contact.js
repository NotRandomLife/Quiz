const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DESTINATION = "notrandomlife@gmail.com";
const MAX_MESSAGE_LENGTH = 2000;

function clean(value, maxLength) {
  return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function response(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return response(405, { error: "Metodo non consentito." });
  const origin = event.headers.origin || event.headers.Origin || "";
  if (origin && !["https://quizmania.it", "https://www.quizmania.it"].includes(origin)) {
    return response(403, { error: "Origine non autorizzata." });
  }
  let input;
  try { input = JSON.parse(event.body || "{}"); } catch { return response(400, { error: "Dati del modulo non validi." }); }

  const name = clean(input.name, 80);
  const email = clean(input.email, 160).toLowerCase();
  const topic = clean(input.topic, 140);
  const audience = clean(input.audience, 80);
  const message = clean(input.message, MAX_MESSAGE_LENGTH);
  const honeypot = clean(input.website, 200);

  if (honeypot) return response(200, { ok: true });
  if (!name || !topic || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return response(400, { error: "Compila nome, email e argomento del quiz." });
  if (!process.env.RESEND_API_KEY) return response(503, { error: "Il servizio messaggi è in fase di attivazione. Riprova più tardi." });

  const subject = `[QuizMania.it] Nuova richiesta quiz: ${topic.replace(/[\r\n]/g, " ")}`;
  const rows = [
    ["Sito di origine", "QuizMania.it (contact form)"],
    ["Nome", name],
    ["Email per la risposta", email],
    ["Quiz richiesto", topic],
    ["Destinatari / difficoltà", audience || "Non indicati"],
    ["Messaggio", message || "Nessun dettaglio aggiuntivo"]
  ];
  const html = `<h2>Nuova richiesta dal contact form di QuizMania.it</h2><table>${rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const from = process.env.RESEND_FROM || "QuizMania.it <contatti@quizmania.it>";

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [DESTINATION], reply_to: email, subject, html, text })
    });
    if (!resendResponse.ok) {
      console.error("Resend rejected contact form", resendResponse.status, await resendResponse.text());
      return response(502, { error: "Non è stato possibile consegnare la richiesta. Riprova più tardi." });
    }
    return response(200, { ok: true });
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return response(502, { error: "Non è stato possibile consegnare la richiesta. Riprova più tardi." });
  }
};
