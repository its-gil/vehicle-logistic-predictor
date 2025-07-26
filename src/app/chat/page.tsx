"use client";
import { useState } from "react";

export default function ChatPage() {
    const [input, setInput] = useState("");

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
            <header className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 p-6 pb-2">
                How can I assist you today?
            </header>
            <div className="flex-1" />
            <form
                className="w-full flex items-center p-4 gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <input
                    type="text"
                    className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
