// Penyimpanan sederhana berbasis file JSON, per-user (device_id).
// Ini cukup buat prototipe/MVP. Kalau sudah banyak user, ganti ke Supabase/Postgres
// (struktur fungsi di bawah sengaja dibuat mirip supaya gampang di-swap nanti).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const FILE = path.join(DATA_DIR, "users.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}, null, 2));
}

function readAll() {
  ensureFile();
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function writeAll(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function defaultUser() {
  return {
    settings: { level: "sedang", lang: "id", accent: "amethyst", dark: true },
    memories: [],
    history: [],
  };
}

export function getUser(userId) {
  const all = readAll();
  if (!all[userId]) {
    all[userId] = defaultUser();
    writeAll(all);
  }
  return all[userId];
}

export function saveUser(userId, userData) {
  const all = readAll();
  all[userId] = userData;
  writeAll(all);
  return userData;
}

export function updateSettings(userId, newSettings) {
  const user = getUser(userId);
  user.settings = { ...user.settings, ...newSettings };
  return saveUser(userId, user);
}

export function addMemory(userId, text) {
  const user = getUser(userId);
  user.memories.push({ id: Date.now(), text });
  return saveUser(userId, user);
}

export function deleteMemory(userId, memoryId) {
  const user = getUser(userId);
  user.memories = user.memories.filter((m) => m.id !== Number(memoryId));
  return saveUser(userId, user);
}

export function appendHistory(userId, role, content) {
  const user = getUser(userId);
  user.history.push({ role, content });
  if (user.history.length > 40) user.history = user.history.slice(-40);
  return saveUser(userId, user);
                      }
