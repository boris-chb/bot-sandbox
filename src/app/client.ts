import { headers } from "@/app/const";
import axios from "axios";
import type { AxiosInstance } from "axios";
import * as cheerio from "cheerio";

import http from "http";
import https from "https";

type GameResponse = {
  $?: cheerio.CheerioAPI;
  ok: boolean;
  error?: string;
  data?: object | string;
};

export class GameClient {
  private readonly http: AxiosInstance;

  private cookies: string;

  constructor({ cookies }: { cookies: string }) {
    this.cookies = cookies;

    this.http = axios.create({
      baseURL: "https://www.moswar.ru",
      headers: {
        ...headers,
        Cookie: this.cookies,
      },
      timeout: 0,
      httpAgent: new http.Agent({ keepAlive: false }),
      httpsAgent: new https.Agent({ keepAlive: false }),
      maxRedirects: 3,
      validateStatus: () => true,
    });

    this.http.interceptors.request.use((config) => {
      config.transformRequest = [
        (data, headers) => {
          headers["Connection"] = "close"; // force close connection
          return data;
        },
      ];

      return config;
    });
  }

  async request(
    path: string,
    body?: Record<string, any>
  ): Promise<GameResponse> {
    const fetchPage = async (url: string, depth = 0): Promise<GameResponse> => {
      if (depth > 5) {
        return { ok: false, error: "Too many redirects" };
      }

      console.log(`[${new Date().toISOString()}]  ${url} ⬇️`);

      try {
        url = url.startsWith("/") ? url : "/" + url;
        url = url.endsWith("/") ? url : url + "/";

        const res = await this.http.request({
          url,
          method: body ? "POST" : "GET",
          data: body ? new URLSearchParams(body).toString() : undefined,
        });

        const data = res.data;

        if (typeof data === "object" && data !== null) {
          if ("alertbox" in data) {
            const $ = cheerio.load(data.alertbox);
            const msg = $(".alert.infoalert #alert-text")
              .map((_, el) => $(el).text())
              .toArray()
              .join("\n");

            return { $, ok: true, data: msg };
          } else if ("error" in data) {
            return { ok: false, error: data.error };
          } else if ("return_url" in data) {
            console.log(data);
            if ("result" in data) {
              if (data.result === 0) {
                return { ok: true, data: data.title };
              } else if (data.result === 1) {
                return { ok: true, data };
              }
            }

            // redirect
            console.log(`[${new Date().toISOString()}]  ${data.return_url} ⤴️`);

            const isGroupFight = /^\/fight\/\d+\/?$/.test(data.return_url);

            if (isGroupFight) {
              // group fight
              console.log(
                `[${new Date().toISOString()}] : ${data.return_url} 🥊`
              );

              const fightId = data.return_url.match(/\/fight\/(\d+)\//)?.[1];

              return {
                ok: false,
                error: "GROUP_FIGHT",
                data: fightId,
              };
            }

            return await this.request(
              `${data.return_url}?_=${Date.now().toString()}`
            );
          } else if ("content" in data) {
            const $ = cheerio.load(data.content);
            if (data?.window_name) {
              $("head").append(`<title>${data.window_name}</title>`);
            }

            const response: GameResponse = { $, ok: true };
            if (data.variablesToJs) {
              response.data = data.variablesToJs;
            }

            return response;
          } else if ("result" in data) {
            return { data, ok: !!data.result };
          }

          return { data, ok: true };
        }

        return {
          $: cheerio.load(typeof data === "string" ? data : ""),
          ok: true,
        };
      } catch (err: any) {
        console.log(`[${new Date().toISOString()}]  💥💥💥\n`, err.message);
        return { ok: false, error: String(err) };
      }
    };

    return await fetchPage(path);
  }
}
