"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ScrollReveal = ({ children, className }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1, 
                rootMargin: "0px 0px -50px 0px", // offset trigger slightly
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-1000 ease-out transform will-change-transform opacity-0 translate-y-8",
                isVisible && "opacity-100 translate-y-0",
                className
            )}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
