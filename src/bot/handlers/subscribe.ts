import type { Context } from "telegraf";

export async function subscribeHandler(ctx: Context) {
  await ctx.replyWithInvoice({
    title: "Ежемесячная подписка",
    description: "Доступ к полной версии бота Moswar.",
    payload: "sub_payload", // your internal reference
    provider_token: "2051251535:TEST:OTk5MDA4ODgxLTAwNQ", // RedSys
    currency: "USD",
    prices: [{ label: "Premium Access", amount: 60_00 }], // $5.00 (amount is in cents)
  });
}
