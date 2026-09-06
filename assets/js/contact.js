(function () {
  "use strict";
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const submit = form.querySelector("[data-contact-submit]");
  const status = form.querySelector("[data-contact-status]");
  const setStatus = (message, type) => {
    status.textContent = message;
    status.dataset.type = type || "";
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const payload = Object.fromEntries(new FormData(form).entries());
    submit.disabled = true;
    setStatus("Invio della richiesta in corso…", "pending");
    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Non è stato possibile inviare la richiesta.");
      form.reset();
      setStatus("Grazie! La tua proposta è arrivata a QuizMania.it.", "success");
    } catch (error) {
      setStatus(error.message || "Si è verificato un problema. Riprova tra poco.", "error");
    } finally {
      submit.disabled = false;
    }
  });
}());
