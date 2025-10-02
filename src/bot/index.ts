import { handlers } from "@/bot/handlers";
import { deletePlayer } from "@/db/players";
import { mainQueue, mainQueueEvents } from "@/queue/main.queue";
import "@/queue/main.worker";
import { Telegraf } from "telegraf";

const isProd = process.env.NODE_ENV === "production";
const token = isProd ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_DEV;
const bot = new Telegraf(token || "");
const PORT = Number(process.env.PORT || 443);
const DOMAIN = process.env.RAILWAY_PUBLIC_DOMAIN || `localhost`;

bot.command("delete", async (ctx) => {
  const res = await deletePlayer(ctx.from.id, 7362678);

  if (!res) {
    await ctx.reply(`Что-то пошло не так, попробуйте позже.`);
  }

  await ctx.reply(`${res?.message}`);
});

bot.command("job", async (ctx) => {
  const myJob = await mainQueue.add(
    "squid",
    {
      playerId: "123",
      victimId: "456",
      gameType: "stones",
    },
    {
      delay: 5_000,
    }
  );

  const jobs = await mainQueue.getJobs(["delayed"]);

  const formattedJobs = jobs.map((job) => {
    return {
      id: job.id,
      data: job.data,
      delay: job.delay,
    };
  });

  await ctx.reply(`Job created ${jobs.length}`);

  mainQueueEvents.on("progress", async (job) => {
    await ctx.reply(`[${job.jobId}] Job progress: ${JSON.stringify(job.data)}`);
  });
});

bot.command("delayed", async (ctx) => {
  const delayedJobs = await mainQueue.getJobs(["delayed"]);
  await ctx.reply(JSON.stringify(delayedJobs, null, 2));
});

for (const [cmd, handler] of Object.entries(handlers)) {
  bot.command(cmd, handler);
}

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
