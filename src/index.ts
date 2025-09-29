import { Telegraf } from "telegraf";

const isProd = process.env.NODE_ENV === "production";
const token = isProd ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV;
const bot = new Telegraf(token || "");
const PORT = Number(process.env.PORT || 443);
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || `localhost`;

bot.start((ctx) => ctx.reply(`Running on ${DOMAIN}:${PORT}`));

if (isProd) {
  const server = Bun.serve({
    port: process.env.PORT,
    async fetch(req) {
      if (req.method === "POST") {
        const body = await req.json();
        await bot.handleUpdate(body).catch(console.error);
        return new Response("OK");
      }
      return new Response("Hello from Bun server");
    },
  });

  try {
    const me = await bot.telegram.getMe();
    console.log("[🤖] Bot running on webhook:", `${DOMAIN}`);
    await bot.telegram.setWebhook(`${DOMAIN}`);
  } catch (error) {
    console.error("Failed setting webhook:", error);
    process.exit(1);
  }
} else {
  // Test API connection
  try {
    const me = await bot.telegram.getMe();
    console.log(`[🤖] ${me.username} running locally:`, PORT);
    await bot.launch({ dropPendingUpdates: true });
  } catch (error) {
    console.error("API connection failed:", error);
    process.exit(1);
  }
}
