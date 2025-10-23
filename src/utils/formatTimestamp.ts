export function formatTimestamp(date: Date): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const sec = String(date.getSeconds()).padStart(2, "0");
    return `${dd}.${mm}.${yyyy} ${HH}:${min}:${sec === "" || sec === null || sec === undefined ? "00" : sec}`;
}

export function formatDate(dateStr?: string): string {
    // Handles formats like "2024-09-01 15:00" or "2024-09-01T15:00"
    // 2023-10-29T11:00:00.000Z to "29.10.2023 11:00:00"
    if (!dateStr) return "";
    let [date, time] = dateStr.split(/[T ]/);
    if (!time) time = "";
    const [year, month, day] = date.split("-");
    const [hour = "", minute = "", secondPart = ""] = time.split(":");
    const second = secondPart.split(".")[0]; // Remove milliseconds if present
    return `${day}.${month}.${year} ${hour}:${minute}:${
        second === "" || second === null || second === undefined ? "00" : second
    }`;
}

export function formatToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return the original string if invalid
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}
