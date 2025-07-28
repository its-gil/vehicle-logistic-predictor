"use client";

export default function SettingsPage() {
    return (
        <div className="h-[calc(100vh-64px)] flex flex-col items-center bg-zinc-100 dark:bg-zinc-900">
            <div className="w-full max-w-md flex-1 flex flex-col items-center mx-auto py-8 overflow-y-auto">
                {/* User Profile */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-zinc-300 dark:bg-zinc-700 mb-4 flex items-center justify-center text-4xl font-bold text-zinc-500">
                        {/* Placeholder avatar */}U
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1">User Name</div>
                    <div className="text-zinc-500 dark:text-zinc-400 text-sm">user@email.com</div>
                </div>

                {/* Dummy Settings */}
                <div className="w-full bg-white dark:bg-zinc-800 rounded-lg shadow p-6 mb-8">
                    <div className="mb-4">
                        <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Theme</label>
                        <select className="w-full rounded border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            <option>System</option>
                            <option>Light</option>
                            <option>Dark</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Notifications</label>
                        <input type="checkbox" className="mr-2" /> Enable email notifications
                    </div>
                    <div>
                        <label className="block text-zinc-700 dark:text-zinc-200 mb-1">Language</label>
                        <select className="w-full rounded border border-zinc-300 dark:border-zinc-700 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </div>
                </div>

                {/* Logout Button */}
                <button className="w-full max-w-md mb-8 px-4 py-3 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                    Log out
                </button>
            </div>
        </div>
    );
}
