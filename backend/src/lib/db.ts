import { Pool, QueryResultRow } from "pg";
import { config } from "dotenv";

config();

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL environment variable");
}

// Strip channel_binding param — not supported by node-postgres
const connectionString = process.env.DATABASE_URL.replace(/&?channel_binding=[^&]*/g, "").replace(/\?$/, "");

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000, // increased: Neon free-tier needs ~10s on cold start
});

pool.on("error", (err) => {
  console.error("Unexpected DB pool error:", err);
});

export const query = <T extends QueryResultRow = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) => pool.query<T>(text, params);
