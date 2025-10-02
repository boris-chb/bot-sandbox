import axios from "axios";
import { ProxyAgent } from "proxy-agent";

interface ProxyMetrics {
  raw: string;
  ok: boolean;
  latencyMs?: number;
  error?: string;
  ip?: string;
}

const CONCURRENCY = 10;
const TIMEOUT = 15_000;

export async function getProxies() {
  const proxies = await axios.get(
    "https://proxy.webshare.io/api/v2/proxy/list/download/xebtxccdojgpofiyjmbospbpvnshocvkqqoerdhd/-/any/username/direct/-/?plan_id=11579920"
  );

  return proxies.data;
}

interface ProxyMetrics {
  raw: string;
  ok: boolean;
  latencyMs?: number;
  error?: string;
  ip?: string;
}

export async function checkProxies(
  proxiesAll: string[]
): Promise<ProxyMetrics[]> {
  const results: ProxyMetrics[] = [];
  let index = 0;

  const worker = async () => {
    while (index < proxiesAll.length) {
      const proxyRaw = proxiesAll[index++];
      const [host, port, user, pass] = proxyRaw.split(":");
      const auth = user && pass ? `${user}:${pass}@` : "";
      const proxyUrl = `http://${auth}${host}:${port}`;
      const agent = new ProxyAgent(proxyUrl);

      const start = Date.now();
      try {
        const res = await axios.get("https://httpbin.org/ip", {
          httpAgent: agent,
          httpsAgent: agent,
          timeout: TIMEOUT,
        });
        const latencyMs = Date.now() - start;
        results.push({
          raw: proxyRaw,
          ok: true,
          latencyMs,
          ip: res.data.origin,
        });
        console.log(`${proxyRaw} ✅ ${res.data.origin} (${latencyMs}ms)`);
      } catch (err: any) {
        const latencyMs = Date.now() - start;
        results.push({
          raw: proxyRaw,
          ok: false,
          latencyMs,
          error: err.message,
        });
        console.log(`${proxyRaw} ❌ ${err.message} (${latencyMs}ms)`);
      }
    }
  };

  const workers = Array.from(
    { length: Math.min(CONCURRENCY, proxiesAll.length) },
    () => worker()
  );
  await Promise.all(workers);

  return results;
}

// Example usage with proxies.all
export async function proxyCheck() {
  const proxiesRaw = await getProxies(); // your existing function
  const proxiesAll = proxiesRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const metrics = await checkProxies(proxiesAll);
  console.log("✅ Summary:");
  console.table(
    metrics.map(({ raw, ok, latencyMs, ip }) => ({ raw, ok, latencyMs, ip }))
  );
}
