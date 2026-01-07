import fs from "fs";
import path from "path";
import { Client } from "pg";

type CheckResult = {
  ok: boolean;
  label: string;
  message?: string;
};

function readEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const contents = fs.readFileSync(filePath, "utf8");
  const env: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

async function checkDatabaseConnection(databaseUrl: string): Promise<CheckResult> {
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    await client.query("SELECT 1");
    return { ok: true, label: "Database connection" };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao conectar no banco";
    return { ok: false, label: "Database connection", message };
  } finally {
    await client.end().catch(() => null);
  }
}

async function run() {
  const results: CheckResult[] = [];
  const envPath = path.join(process.cwd(), ".env");
  const envFile = readEnvFile(envPath);

  const databaseUrl = process.env.DATABASE_URL ?? envFile.DATABASE_URL;

  if (!databaseUrl) {
    results.push({
      ok: false,
      label: "DATABASE_URL",
      message:
        "Variavel nao encontrada. Defina em apps/web/.env ou exporte no ambiente.",
    });
  } else {
    results.push({ ok: true, label: "DATABASE_URL" });
    results.push(await checkDatabaseConnection(databaseUrl));
  }

  const failed = results.filter((item) => !item.ok);

  for (const item of results) {
    const status = item.ok ? "OK" : "ERRO";
    const detail = item.message ? ` - ${item.message}` : "";
    console.log(`${status}: ${item.label}${detail}`);
  }

  if (failed.length > 0) {
    process.exit(1);
  }
}

run().catch((error) => {
    console.error("ERRO: Healthcheck falhou", error);
  process.exit(1);
});
