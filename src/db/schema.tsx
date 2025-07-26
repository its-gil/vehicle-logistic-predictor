import { pgTable, uuid, jsonb, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const uploads = pgTable("uploads", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // change to uuid later
    uploadId: text("upload_id").notNull(), //change to uuid later
    tableName: text("table_name").notNull(),
    tableDimensions: integer("table_dimensions").notNull(),
    tableSize: text("table_size").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    rowData: jsonb("row_data").notNull(),
});
