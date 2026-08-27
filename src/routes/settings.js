import { Router } from "express";
import { getUser, updateSettings } from "../db/jsonStore.js";

const router = Router();

const VALID_LEVELS = ["rendah", "sedang", "tinggi"];
const VALID_LANGS = ["id", "en", "ja", "ru"];
const VALID_ACCENTS = ["amethyst", "sakura", "ice", "crimson"];

// GET /settings
router.get("/", (req, res) => {
  const user = getUser(req.userId);
  res.json({ settings: user.settings });
});

// PATCH /settings  body: { level?, lang?, accent?, dark? }
router.patch("/", (req, res) => {
  const { level, lang, accent, dark } = req.body;
  const patch = {};

  if (level !== undefined) {
    if (!VALID_LEVELS.includes(level)) return res.status(400).json({ error: `level harus salah satu dari ${VALID_LEVELS.join(", ")}` });
    patch.level = level;
  }
  if (lang !== undefined) {
    if (!VALID_LANGS.includes(lang)) return res.status(400).json({ error: `lang harus salah satu dari ${VALID_LANGS.join(", ")}` });
    patch.lang = lang;
  }
  if (accent !== undefined) {
    if (!VALID_ACCENTS.includes(accent)) return res.status(400).json({ error: `accent harus salah satu dari ${VALID_ACCENTS.join(", ")}` });
    patch.accent = accent;
  }
  if (dark !== undefined) {
    patch.dark = Boolean(dark);
  }

  const user = updateSettings(req.userId, patch);
  res.json({ settings: user.settings });
});

export default router;
