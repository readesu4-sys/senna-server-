import { Router } from "express";
import { askSenna } from "../services/claudeClient.js";
import { buildSystemPrompt, detectLang } from "../services/personaPrompt.js";
import { getUser, appendHistory } from "../db/jsonStore.js";

const router = Router();

// POST /chat  body: { message: string }
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Field 'message' wajib diisi (string)" });
    }

    const user = getUser(req.userId);
    const effectiveLang = detectLang(message) || user.settings.lang;

    const systemPrompt = buildSystemPrompt({
      level: user.settings.level,
      lang: effectiveLang,
      memories: user.memories,
    });

    appendHistory(req.userId, "user", message);
    const freshUser = getUser(req.userId);

    const reply = await askSenna({
      messages: freshUser.history,
      systemPrompt,
    });

    appendHistory(req.userId, "assistant", reply);

    res.json({ reply, lang: effectiveLang });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Gagal menghubungi Senna. Coba lagi sebentar lagi." });
  }
});

// GET /chat/history
router.get("/history", (req, res) => {
  const user = getUser(req.userId);
  res.json({ history: user.history });
});

export default router;
