import { readFileSync, readdirSync, existsSync } from "fs";

export function env(name) {
  if (process.env[name]) return process.env[name];

  if (existsSync(".env")) {
    const dotEnv = readFileSync(".env", { encoding: "utf-8" });
    const match = dotEnv.match(new RegExp(`${name}=(.*)`));
    if (match) return match[1];
  }

  throw new Error(`Environment variable '${name}' is not set.`);
}

export function listProjects() {
  const files = readdirSync("./projects");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .map((id) => {
      const content = JSON.parse(
        readFileSync(`./projects/${id}.json`, { encoding: "utf-8" })
      );
      return {
        id,
        ...content,
      };
    });
}

export async function gitHubRequest(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
    },
  });

  if (response.status >= 300) {
    const text = await response.text();
    throw new Error(
      `GitHub request failed with status ${response.status}: ${text}`
    );
  }

  return await response.json();
}
