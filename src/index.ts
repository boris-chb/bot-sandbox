import express from "express";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const app = express();

app.use(express.json());

const PORT = 443;

app.listen(PORT, async () => {
  console.log(process.env.RAILWAY_PUBLIC_DOMAIN, process.env.PORT);
});
