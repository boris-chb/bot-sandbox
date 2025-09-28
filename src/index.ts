import express from "express";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const PORT = process.env.PORT || 443;
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || "";
const app = express();

app.use(express.json());
app.use(await bot.createWebhook({ domain: DOMAIN }));

bot.start((ctx) => ctx.reply("Hello World!"));

app.listen(PORT, () => console.log("Listening on PORT", PORT));
