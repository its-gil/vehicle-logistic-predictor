import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";

import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
    title: "Logistic Predictor@MBTI",
    description: "Virgil B.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
