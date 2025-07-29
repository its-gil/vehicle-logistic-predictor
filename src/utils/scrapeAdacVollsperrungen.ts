import puppeteer from "puppeteer";
import { Parser } from "json2csv";
import fs from "fs";

/**
 * Scrapes all text blocks from the ADAC traffic info page
 * where the image title is "vollsperrung" and loading is "lazy".
 * Iterates up to 100 pages, stops if a page does not exist or has no results.
 * Exports the result as a CSV file.
 */
export async function scrapeAdacVollsperrungen(filePath: string = "vollsperrungen.csv"): Promise<void> {
    const baseUrl =
        "https://www.adac.de/verkehr/verkehrsinformationen/de/?country=D&federalState=&street=&streetType=Highway&showTrafficNews=true&showConstructionSites=true&submit=true&resetSearchParams=false&pageNumber=";
    const browser = await puppeteer.launch({ headless: true });
    const results: { header: string; comment: string }[] = [];

    for (let pageNum = 1; pageNum <= 20; pageNum++) {
        const url = baseUrl + pageNum;
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        // Extract the desired texts as { header, comment }
        const pageResults = await page.evaluate(() => {
            const items: { header: string; comment: string }[] = [];
            document.querySelectorAll('img[title="vollsperrung"][loading="lazy"]').forEach((img) => {
                let el: HTMLElement | null = img.parentElement as HTMLElement;
                while (el && el.innerText.trim().length < 30 && el.parentElement) {
                    el = el.parentElement as HTMLElement;
                }
                if (el) {
                    const lines = el.innerText
                        .trim()
                        .split("\n")
                        .map((l) => l.trim())
                        .filter(Boolean);
                    const header = lines[0] || "";
                    const comment = lines.slice(1).join(" ") || "";
                    items.push({ header, comment });
                }
            });
            return items;
        });

        results.push(...pageResults);
        await page.close();
    }

    await browser.close();

    // Convert JSON to CSV and write to file
    const parser = new Parser({ fields: ["header", "comment"] });
    const csv = parser.parse(results);
    fs.writeFileSync(filePath, csv, "utf8");
}
