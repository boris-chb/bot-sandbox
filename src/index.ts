import express from "express";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(process.env);
});
