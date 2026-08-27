import "dotenv/config";
import express from "express";
import cors from "cors";
import { requireAppSecret, requireUserId } from "./middleware/auth.js";
import chatRouter from "./routes/chat.js";
import memoryRouter from "./routes/memory.js";
import settingsRouter from "./routes/settings.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Senna server jalan. Bukan berarti aku senang kamu cek-cek terus." });
});

// Semua endpoint di bawah ini butuh x-app-secret dan x-user-id di header
app.use(requireAppSecret, requireUserId);

app.use("/chat", chatRouter);
app.use("/memory", memoryRouter);
app.use("/settings", settingsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Senna server nyala di http://localhost:${PORT}`);
});
