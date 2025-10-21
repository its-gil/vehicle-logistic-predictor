export function formatDate(dateStr: string): string {
    // Handles formats like "2024-09-01 15:00" or "2024-09-01T15:00"
    if (!dateStr) return "";
    let [date, time] = dateStr.split(/[T ]/);
    if (!time) time = "";
    const [year, month, day] = date.split("-");
    const [hour = "", minute = ""] = time.split(":");
    return `${day}.${month}.${year} ${hour}:${minute}`;
}
