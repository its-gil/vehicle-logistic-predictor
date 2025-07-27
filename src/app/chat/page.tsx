"use client";
import { useState, useEffect } from "react";
import { fetchDashboardData } from "@/app/actions/dashboard.actions";

export default function ChatPage() {
    const [input, setInput] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //useEffect to reset state on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setAnswer("");
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input }),
            });
            const data = await res.json();
            if (res.ok && data.answer) {
                setAnswer(data.answer);
            } else {
                setError(data.error || "No answer returned");
            }
        } catch (err: any) {
            setError("Request failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
            <header className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 p-6 pb-2">
                How can I assist you today?
            </header>
            <div className="flex-1 flex flex-col items-center justify-center">
                <form className="w-full flex items-center p-4 gap-2 max-w-2xl" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </form>
                {answer && (
                    <div className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded shadow max-w-2xl w-full text-zinc-900 dark:text-zinc-100">
                        <div className="font-semibold mb-2">Assistant:</div>
                        <div>{answer}</div>
                    </div>
                )}
                {error && <div className="mt-4 p-4 bg-red-100 text-red-800 rounded max-w-2xl w-full">{error}</div>}
            </div>
        </div>
    );
}
