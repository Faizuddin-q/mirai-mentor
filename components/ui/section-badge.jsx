import React from "react";

const SectionBadge = ({ icon, title }) => {
    return (
        <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1px] focus:outline-none">
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,hsl(var(--primary))_50%,transparent_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-background px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-3xl">
                <span className="flex items-center gap-2">
                    {icon}
                    {title}
                </span>
            </span>
        </div>
    );
};

export default SectionBadge;
