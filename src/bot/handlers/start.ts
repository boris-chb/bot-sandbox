import { logIn } from "@/app/auth";
import { addPlayer } from "@/db/players";
import { getOrCreateUser } from "@/db/users";
import type { Context } from "telegraf";

const userId = 323104695;

const playerData = {
  id: 7362678,
  email: "bc060912@gmail.com",
  level: 15,
  name: "Toni Kroos",
  nickname: "toni",
  password: "f4f9a33f",
  cookies:
    "PHPSESSID=edr3p2taice7cle4h11jbk2la5; authkey=a6dd1badc4bb8a6caebde3fdc9008031472498e7; userid=7362678; player=Toni+Kroos; player_id=7362678",
};

export async function startHandler(ctx: Context) {
  const { id, username } = ctx.from!;

  const client = await logIn({
    email: playerData.email,
    password: playerData.password,
  });

  const currentUser = await getOrCreateUser(id, username!);

  const res = await addPlayer(currentUser.id, playerData);

  const messages = {
    created: "Персонаж добавлен успешно.",
    already_linked: "Персонаж уже добавлен.",
    error: "Что-то пошло не так, попробуйте позже.",
  };

  if (!res) {
    await ctx.reply(messages.error);
    return;
  }

  const { status, player } = res;

  if (!player) {
    await ctx.reply(messages.error);
    return;
  }

  await ctx.replyWithHTML(
    `<a href="https://www.moswar.ru/player/${player.id}"><b>${player.name} [${player.level}]</b></a> ${messages[status]}`
  );
}
