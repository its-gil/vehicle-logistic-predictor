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

export const chats = pgTable("chats", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // change to uuid later
    chatName: text("chat_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    chatId: integer("chat_id")
        .notNull()
        .references(() => chats.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
