import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Простая "база данных"
const DB_FILE = "./users.json";

function loadUsers() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

// Генератор "номера карты"
function generateCardNumber() {
  const prefix = "4000";
  const randomDigits = Array(12).fill(0).map(() => Math.floor(Math.random() * 10)).join("");
  return `${prefix}${randomDigits}`.replace(/(.{4})/g, "$1 ").trim();
}

// Эндпоинт для получения или создания карты
app.post("/api/getCard", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Нет username" });

  const users = loadUsers();
  if (!users[username]) {
    users[username] = { cardNumber: generateCardNumber(), createdAt: new Date() };
    saveUsers(users);
  }

  res.json(users[username]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
