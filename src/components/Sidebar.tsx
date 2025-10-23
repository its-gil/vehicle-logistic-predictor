import React from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    MessageCircle,
    Table2,
    Settings,
    LogOut,
    History,
    CloudLightning,
    Anchor,
    Waves,
} from "lucide-react";

type SidebarProps = {
    isOpen: boolean;
    isMobile: boolean;
    navbarHeight?: number;
    onClose?: () => void;
};

export default function Sidebar({ isOpen, isMobile, navbarHeight = 64, onClose }: SidebarProps) {
    if (isMobile) {
        if (!isOpen) return null;
        return (
            <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-label="Close sidebar" />
                {/* Sidebar panel */}
                <aside
                    className="fixed top-0 left-0 h-screen w-2/3 max-w-xs bg-white dark:bg-zinc-900 z-50 flex flex-col p-6 transition-transform duration-200 shadow-lg"
                    style={{ transitionProperty: "transform, left, width" }}
                >
                    <div className="flex flex-col flex-1">
                        <h1 className="text-xl font-bold mb-8 text-zinc-900 dark:text-zinc-100">
                            Vehicle Logistic Predictor @ MBTI
                        </h1>
                        <nav className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </Link>
                            <Link
                                href="/storms"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <CloudLightning className="w-5 h-5" />
                                Storms
                            </Link>
                            <Link
                                href="/marine_weather"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <Anchor className="w-5 h-5" />
                                Weather
                            </Link>
                            <Link
                                href="/ports"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <Anchor className="w-5 h-5" />
                                Ports
                            </Link>
                            <Link
                                href="/historical_routes"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <History className="w-5 h-5" />
                                Historical Routes
                            </Link>
                            <Link
                                href="/chat"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Chat
                            </Link>
                            <Link
                                href="/table"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <Table2 className="w-5 h-5" />
                                Tables
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                                Settings
                            </Link>
                        </nav>
                        <div className="flex-1" />
                        <button className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold hover:underline mt-8 cursor-pointer">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </aside>
            </>
        );
    }
    // Desktop: normal push sidebar
    return (
        <aside
            className={`fixed top-16 left-0 h-[calc(100vh-64px)] w-56 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 z-30 transition-transform duration-200 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col`}
            style={{ transitionProperty: "transform, left, width" }}
        >
            <div className="flex flex-col flex-1">
                <nav className="flex flex-col gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/storms"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <CloudLightning className="w-5 h-5" />
                        Storms
                    </Link>
                    <Link
                        href="/marine_weather"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        {/* Use Lucide's Waves icon for marine weather */}
                        <Waves className="w-5 h-5" />
                        Marine Weather
                    </Link>
                    <Link
                        href="/ports"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <Anchor className="w-5 h-5" />
                        Ports
                    </Link>
                    <Link
                        href="/historical_routes"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <History className="w-5 h-5" />
                        Historical Routes
                    </Link>
                    <Link
                        href="/chat"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Chat
                    </Link>
                    <Link
                        href="/table"
                        className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                        <Table2 className="w-5 h-5" />
                        Tables
                    </Link>
                </nav>
                <div className="flex-1" />
                <button className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold hover:underline mt-8 cursor-pointer">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
