import React from "react";

type LoadingOverlayProps = {
    size?: number; // box size in px
    color?: string; // wave color
    className?: string; // custom classes
    speed?: number; // animation duration in seconds
};

export default function LoadingOverlay({
    size = 64,
    color = "#ffffff",
    className = "",
    speed = 0.5,
}: LoadingOverlayProps) {
    // SVG width/height scales with box size
    const svgWidth = size * 4; // Make SVG much wider than box for visible movement
    const svgHeight = size / 2;

    return (
        <div
            className={`flex items-center justify-center absolute inset-0 z-500 bg-zinc-900 pointer-events-none ${className}`}
            style={{ width: "100%", height: "100%" }}
        >
            <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center bg-transparent shadow-lg"
                style={{ width: size, height: size }}
            >
                <svg
                    width={svgWidth}
                    height={svgHeight}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <path
                        className="wave-path"
                        d={`
                            M0,${svgHeight / 2}
                            Q${svgWidth / 32},0 ${svgWidth / 8},${svgHeight / 2}
                            Q${svgWidth / 4},${svgHeight} ${(svgWidth * 3) / 8},${svgHeight / 2}
                            Q${svgWidth / 2},0 ${(svgWidth * 5) / 8},${svgHeight / 2}
                            Q${(svgWidth * 3) / 4},${svgHeight} ${(svgWidth * 7) / 8},${svgHeight / 2}
                            Q${svgWidth},0 ${svgWidth},${svgHeight / 2}
                            V${svgHeight} H0 Z
                        `}
                        fill={color}
                        opacity="0.85"
                    />
                </svg>
                <style>{`
                    .wave-path {
                        animation: wave-logo-move ${speed}s linear infinite;
                    }
                    @keyframes wave-logo-move {
                        0% {
                            transform: translateX(0);
                        }
                        100% {
                            transform: translateX(-${svgWidth / 2}px);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}
