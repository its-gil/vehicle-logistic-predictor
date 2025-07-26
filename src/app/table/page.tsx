"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type TableInfo = {
    name: string;
    columns: number;
    rows: number;
    sizeMB: number;
    uploadId: string;
};

export default function TablePage() {
    const [tables, setTables] = useState<TableInfo[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch tables from API
    const fetchTables = async () => {
        try {
            const res = await fetch("/api/tables");
            if (!res.ok) throw new Error("Failed to fetch tables");
            const data = await res.json();
            // Map backend fields to TableInfo
            setTables(
                (data.tables || []).map((t: any) => ({
                    name: t.tableName || t.name || "(no name)",
                    columns: Array.isArray(t.rowData?.[0])
                        ? t.rowData[0].length
                        : t.rowData && t.rowData[0]
                        ? Object.keys(t.rowData[0]).length
                        : 0,
                    rows: Array.isArray(t.rowData) ? t.rowData.length : 0,
                    sizeMB: t.tableSize ? Math.round((parseInt(t.tableSize, 10) / 1024 / 1024) * 100) / 100 : 0,
                    uploadId: t.uploadId,
                }))
            );
        } catch (err) {
            setError("Failed to load tables");
        }
    };

    useEffect(() => {
        fetchTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (idx: number) => {
        const table = tables[idx];
        if (!table?.uploadId) return;
        try {
            const res = await fetch("/api/tables", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uploadId: table.uploadId }),
            });
            if (!res.ok) throw new Error("Delete failed");
            await fetchTables();
        } catch (err) {
            setError("Failed to delete table");
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;
        const allowed = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (
            !allowed.includes(file.type) &&
            !file.name.endsWith(".csv") &&
            !file.name.endsWith(".xls") &&
            !file.name.endsWith(".xlsx")
        ) {
            setError("Only CSV or Excel files are allowed.");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tableName", file.name.replace(/\.[^.]+$/, ""));
        const res = await fetch("/api/tables", { method: "POST", body: formData });
        if (!res.ok) {
            setError("Upload failed: " + (await res.text()));
        } else {
            setError(null);
            await fetchTables(); // Refresh list after upload
        }
        e.target.value = "";
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
            <header className="flex items-center gap-2 p-6 pb-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Plus className="w-4 h-4" />
                    Add Table
                </button>
                {error && <span className="text-red-600 text-sm ml-4">{error}</span>}
            </header>
            <div className="flex-1 flex flex-col">
                {tables.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-lg">
                        No tables added.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 p-4">
                        {tables.map((table, idx) => (
                            <div
                                key={table.uploadId || table.name}
                                className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 rounded px-4 py-3"
                            >
                                <div className="flex-1 font-medium text-zinc-900 dark:text-zinc-100">{table.name}</div>
                                <div className="text-xs text-zinc-500">Cols: {table.columns}</div>
                                <div className="text-xs text-zinc-500">Rows: {table.rows}</div>
                                <div className="text-xs text-zinc-500">{table.sizeMB} MB</div>
                                <button
                                    className="ml-2 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                    aria-label="Delete table"
                                    onClick={() => handleDelete(idx)}
                                >
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
