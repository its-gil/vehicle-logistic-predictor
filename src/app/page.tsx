import Image from "next/image";

export default function Home() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <header className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-bold">Vehicle Logistic Predictor @MBTI</h1>
            </header>
            <main className="flex flex-col items-center">
                <p className="text-lg">Welcome to the Vehicle Logistic Predictor app!</p>
            </main>
            <footer className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Vehicle Logistic Predictor
            </footer>
        </div>
    );
}
