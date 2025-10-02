import { GameClient } from "@/app/client";
import { headers } from "@/app/const";
import axios from "axios";
import qs from "qs";

export async function logIn({
  email,
  password,
  proxyUrl,
  nickname,
  saveMe = true,
}: {
  email: string;
  password: string;
  proxyUrl?: string;
  nickname?: string;
  saveMe?: boolean;
}) {
  try {
    const payload = qs.stringify({
      action: "login",
      email,
      password,
      remember: saveMe ? "on" : "off",
    });

    const res = await axios.post("https://www.moswar.ru/", payload, {
      // httpsAgent: agent,
      headers,
      maxRedirects: 3,
      validateStatus: () => true,
    });

    const cookieMap = new Map();

    if (!res.headers["set-cookie"]) {
      throw new Error("No cookies");
    }

    res.headers["set-cookie"].forEach((c: string) => {
      const [pair] = c.split(";");
      const [key, value] = pair.split("=");
      cookieMap.set(key.trim(), value.trim());
    });

    const cookies = Array.from(cookieMap.entries())
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    const playerId = cookieMap.get("player_id");
    if (!playerId) throw new Error("[🔐login] No player_id found");
    const playerName = cookieMap.get("player").replace("+", " ");

    const client = new GameClient({
      cookies,
    });

    const { ok, $, data, error } = await client.request("/player/");

    if (!ok || !$) {
      if (error === "GROUP_FIGHT") {
        throw new Error(error);
      }
    }

    if (!data || typeof data === "string") {
      throw new Error("Could not find player metadata");
    }

    return client;
  } catch (e: any) {
    console.error("Auth error:", e);
    throw new Error(e);
  }
}
