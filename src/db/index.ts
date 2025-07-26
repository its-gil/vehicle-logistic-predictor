import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Ensure that the environment variable DATABASE_URL is set
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
}
const client = postgres(connectionString, { prepare: false }); // Disable prefetch as it is not supported for "Transaction" pool mode

export const db = drizzle(client);
