import { serve } from "bun";
import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN || "");
const PORT = Number(process.env.PORT || 443);
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || "";

bot.start((ctx) => ctx.reply(`Running on ${DOMAIN}:${PORT}!`));

const server = serve({
  port: PORT,
  async fetch(req) {
    if (req.method === "POST") {
      const body = await req.json();
      await bot.handleUpdate(body).catch(console.error);
      return new Response("OK");
    }
    return new Response("Hello from Bun server");
  },
});

console.log("Bun server running on port", PORT);

if (DOMAIN) {
  bot.telegram
    .setWebhook(`${DOMAIN}/bot${process.env.BOT_TOKEN}`)
    .then(() =>
      console.log("Webhook set to", `${DOMAIN}/bot${process.env.BOT_TOKEN}`)
    )
    .catch(console.error);
}
