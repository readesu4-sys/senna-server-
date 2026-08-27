import { Router } from "express";
import { getUser, addMemory, deleteMemory } from "../db/jsonStore.js";

const router = Router();

// GET /memory
router.get("/", (req, res) => {
  const user = getUser(req.userId);
  res.json({ memories: user.memories });
});

// POST /memory  body: { text: string }
router.post("/", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Field 'text' wajib diisi (string)" });
  }
  const user = addMemory(req.userId, text.trim());
  res.json({ memories: user.memories });
});

// DELETE /memory/:id
router.delete("/:id", (req, res) => {
  const user = deleteMemory(req.userId, req.params.id);
  res.json({ memories: user.memories });
});

export default router;
