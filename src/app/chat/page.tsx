"use client";
import { useState, useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

type Chat = { id: number; chatName: string };
type Message = { role: "user" | "assistant"; content: string };

export default function ChatLayout() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const [selectedChatName, setSelectedChatName] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch chats on mount
    useEffect(() => {
        async function fetchChats() {
            const res = await fetch("/api/chats");
            const data = await res.json();
            setChats(data.chats || []);
            // Auto-select first chat if exists
            if (data.chats?.length && selectedChatId === null) {
                setSelectedChatId(data.chats[0].id);
                setSelectedChatName(data.chats[0].chatName);
            }
        }
        fetchChats();
    }, []);

    // Fetch messages for selected chat
    useEffect(() => {
        if (!selectedChatId) {
            setMessages([]);
            return;
        }
        async function fetchMessages() {
            const res = await fetch(`/api/messages?chatId=${selectedChatId}`);
            const data = await res.json();
            setMessages(data.messages || []);
        }
        fetchMessages();
    }, [selectedChatId]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    async function createChat() {
        const name = prompt("Enter chat name:") || "New Chat";
        const res = await fetch("/api/chats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatName: name }),
        });
        const data = await res.json();
        if (res.ok && data.chatId) {
            setChats((prev) => [...prev, { id: data.chatId, chatName: name }]);
            setSelectedChatId(data.chatId);
            setSelectedChatName(name);
            setMessages([]);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        if (!input.trim() || !selectedChatId) return;
        setLoading(true);

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input, chatId: selectedChatId, chatName: selectedChatName }),
            });
            const data = await res.json();
            if (res.ok && data.answer) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
            } else {
                setError(data.error || "No answer returned");
            }
        } catch {
            setError("Request failed");
        } finally {
            setLoading(false);
            setInput("");
        }
    }

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside className="w-72 bg-zinc-900 text-white flex flex-col border-r border-zinc-800">
                <div className="p-4 text-xl font-bold border-b border-zinc-800 sticky top-0 z-10 bg-zinc-900">
                    Chats
                </div>
                <ul className="flex-1 overflow-y-auto">
                    {chats.map((chat) => (
                        <li key={chat.id} className="flex items-center">
                            <button
                                onClick={() => {
                                    setSelectedChatId(chat.id);
                                    setSelectedChatName(chat.chatName);
                                }}
                                className={`flex-1 text-left px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ${
                                    selectedChatId === chat.id ? "font-semibold" : ""
                                }`}
                            >
                                {chat.chatName}
                            </button>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm("Delete this chat?")) return;
                                    await fetch(`/api/chats?id=${chat.id}`, { method: "DELETE" });
                                    setChats((prev) => prev.filter((c) => c.id !== chat.id));
                                    if (selectedChatId === chat.id) {
                                        setSelectedChatId(null);
                                        setSelectedChatName("");
                                        setMessages([]);
                                    }
                                }}
                                className="mx-2 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Delete chat"
                            >
                                <Trash2 size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={createChat}
                    className="m-4 mt-0 mb-6 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors cursor-pointer"
                >
                    + New Chat
                </button>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="h-16 flex items-center px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
                    <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedChatName || "Select a chat"}
                    </span>
                </header>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-8 py-4" style={{ maxHeight: "calc(100vh - 128px)" }}>
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`
                                flex mb-2
                                ${msg.role === "assistant" ? "justify-start" : "justify-end"}
                            `}
                        >
                            <div
                                className={`
                                    p-4 rounded max-w-2xl
                                    ${msg.role === "assistant" ? "bg-blue-600 text-left" : "bg-green-600 text-right"}
                                `}
                                style={{ minWidth: "120px" }}
                            >
                                <div className="font-semibold"></div>
                                <div className="text-lg text-zinc-900 dark:text-zinc-100 whitespace-pre-line">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {/* Input fixed at bottom */}
                <form
                    className="w-full flex items-center p-4 gap-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky bottom-0 z-10"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        className="flex-1 rounded border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading || !selectedChatId}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                        disabled={loading || !selectedChatId}
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </form>
                {error && <div className="p-4 bg-red-100 text-red-800 rounded max-w-2xl mx-8 my-2">{error}</div>}
            </main>
        </div>
    );
}
