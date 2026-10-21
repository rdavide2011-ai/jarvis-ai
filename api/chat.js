
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito." });
  }

  const apiKey = process.env.OLLAMA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Chiave Ollama non configurata su Vercel."
    });
  }

  try {
    const { message, history = [], lang = "it-IT" } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Il messaggio è vuoto o non valido."
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "Sei Jarvis, un assistente AI utile, preciso e conciso. " +
          "Rispondi in italiano, salvo richiesta diversa. " +
          "La lingua richiesta è " + String(lang).slice(0, 20) + "."
      }
    ];

    if (Array.isArray(history)) {
      for (const item of history.slice(-12)) {
        if (
          item &&
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
        ) {
          messages.push({
            role: item.role,
            content: item.content.slice(0, 4000)
          });
        }
      }
    }

    messages.push({
      role: "user",
      content: message.trim().slice(0, 8000)
    });

    const response = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-oss:120b",
        messages,
        stream: false
      }),
      signal: AbortSignal.timeout(60000)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Ollama API error:", response.status);
      return res.status(502).json({
        error: "Ollama non ha completato la richiesta. Controlla il modello e i limiti API."
      });
    }

    const reply = data?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({
        error: "Ollama ha restituito una risposta vuota."
      });
    }

    return res.status(200).json({ reply: reply.trim() });
  } catch (error) {
    console.error("Jarvis backend error:", error.name);

    return res.status(502).json({
      error: error.name === "TimeoutError"
        ? "Ollama ha impiegato troppo tempo. Riprova."
        : "Errore di connessione al servizio AI."
    });
  }
}
