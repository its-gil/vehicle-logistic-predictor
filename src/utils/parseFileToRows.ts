export async function parseFileToRows(file: File): Promise<any[]> {
    const allowedTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const name = file.name.toLowerCase();
    if (
        !allowedTypes.includes(file.type) &&
        !name.endsWith(".csv") &&
        !name.endsWith(".xls") &&
        !name.endsWith(".xlsx")
    ) {
        throw new Error("Only CSV or Excel files are allowed.");
    }

    // Only CSV supported in this parser for now
    if (file.type === "text/csv" || name.endsWith(".csv")) {
        const text = await file.text();
        return parseCSV(text);
    }
    // TODO: Add XLS/XLSX support if needed
    throw new Error("Only CSV files are supported in this parser.");
}

// Simple CSV parser: returns array of objects (header row required)
function parseCSV(text: string): any[] {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] !== undefined ? values[i].trim() : null;
        });
        return obj;
    });
}
