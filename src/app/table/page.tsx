"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type TableInfo = {
    name: string;
    columns: number;
    rows: number;
    sizeMB: number;
};

export default function TablePage() {
    const [tables, setTables] = useState<TableInfo[]>([]);

    const handleDelete = (idx: number) => {
        setTables((tables) => tables.filter((_, i) => i !== idx));
    };

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-64px)]">
            <header className="flex items-center gap-2 p-6 pb-2">
                <button
                    className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    // onClick={...} // Add your add table logic here
                >
                    <Plus className="w-4 h-4" />
                    Add Table
                </button>
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
                                key={table.name}
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
