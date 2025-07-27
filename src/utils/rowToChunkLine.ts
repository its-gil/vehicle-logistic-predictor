// utils/rowToChunkLine.ts
// Transforms a JSONB row (object) into a single chunk line string

export function rowToChunkLine(row: Record<string, any>, fields: string[]): string {
    return fields.map((field) => `${field}: ${row[field] ?? ""}`).join(", ");
}

// Example usage:
// rowToChunkLine({ model: 'GWagon', endpunkt: 'Bucharest', preis: '100000' }, ['model', 'endpunkt', 'preis'])
// => "model: GWagon, endpunkt: Bucharest, preis: 100000"
