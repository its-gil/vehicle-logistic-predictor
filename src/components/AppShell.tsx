"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ShipsPositionsProvider } from "@/providers/ShipsPositionsProvider";
import { MarineWeatherProvider } from "@/providers/MarineWeatherProvider";
import { StormsProvider } from "@/providers/StormsProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 600);
            if (window.innerWidth < 600) setIsSidebarOpen(false);
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ShipsPositionsProvider>
            <MarineWeatherProvider>
                <StormsProvider>
                    <Navbar
                        onSidebarToggle={() => setIsSidebarOpen((v) => !v)}
                        isSidebarOpen={isSidebarOpen}
                        isMobile={isMobile}
                    />
                    <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />
                    <div
                        className="transition-all duration-200"
                        style={{
                            marginLeft: !isMobile && isSidebarOpen ? 224 : 0,
                            marginTop: "64px",
                        }}
                    >
                        {children}
                    </div>
                </StormsProvider>
            </MarineWeatherProvider>
        </ShipsPositionsProvider>
    );
}
