import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const historyPath = path.join(__dirname, "public", "history.json");

const defaultPayload = {
  description:
    "История очков команд. Формат элементов соответствует ScoreSnapshot из src/types.ts.",
  history: [],
};

app.use(express.json({ limit: "1mb" }));

// Простая CORS-разрешилка для локальной разработки
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

const ensureHistoryFile = () => {
  try {
    if (!fs.existsSync(historyPath)) {
      fs.writeFileSync(historyPath, JSON.stringify(defaultPayload, null, 2), {
        encoding: "utf-8",
      });
    }
  } catch (error) {
    console.error("Не удалось подготовить history.json", error);
  }
};

app.post("/history", (req, res) => {
  const { history } = req.body ?? {};

  if (!Array.isArray(history)) {
    res.status(400).json({ ok: false, error: "history must be an array" });
    return;
  }

  const payload = {
    ...defaultPayload,
    history,
  };

  try {
    fs.writeFileSync(historyPath, JSON.stringify(payload, null, 2), {
      encoding: "utf-8",
    });
    res.json({ ok: true, saved: history.length });
  } catch (error) {
    console.error("Ошибка записи history.json", error);
    res.status(500).json({ ok: false });
  }
});

ensureHistoryFile();

app.listen(PORT, () => {
  console.log(`History server listening on http://localhost:${PORT}`);
});

