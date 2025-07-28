import React from "react";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";

type NavbarProps = {
    onSidebarToggle: () => void;
    isSidebarOpen: boolean;
    isMobile: boolean;
};

export default function Navbar({ onSidebarToggle, isSidebarOpen, isMobile }: NavbarProps) {
    const pathname = usePathname();
    let pageTitle = "Dashboard";
    if (pathname === "/settings") pageTitle = "Settings";
    else if (pathname === "/chat") pageTitle = "Chat";
    else if (pathname === "/table") pageTitle = "Tables";
    // Add more routes as needed

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 flex items-center px-4 bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur z-40">
            <button
                className="mr-4 flex items-center justify-center p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                onClick={onSidebarToggle}
            >
                {/* Hamburger icon */}
                <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                >
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
            </button>
            <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex-1">{pageTitle}</div>
            <button className="cursor-pointer">
                <User className="w-7 h-7 text-zinc-700 dark:text-zinc-200 ml-auto" />
            </button>
        </nav>
    );
}
