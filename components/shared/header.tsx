"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    Search,
    Bell,
    ChevronDown,
    Store,
} from "lucide-react";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    rightActions?: React.ReactNode;
    className?: string;
    businessName?: string;
}

export function Header({ title, showBack, rightActions, className, businessName = "Mi App" }: HeaderProps) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainers = document.querySelectorAll("main, .overflow-y-auto");
            let isScrolled = window.scrollY > 2;
            for (const c of Array.from(scrollContainers)) {
                if (c.scrollTop > 2) { isScrolled = true; break; }
            }
            setScrolled(isScrolled);
        };
        window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll, { capture: true });
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-[100] w-full flex-shrink-0",
                "pt-[env(safe-area-inset-top)]",
                "transition-all duration-300",
                className
            )}
            style={{
                backgroundColor: scrolled ? "rgba(255,255,255,0.88)" : "var(--background)",
                backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
                WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none" as any,
                borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
        >
            <div className="w-full h-14 flex items-center justify-between px-4 md:px-5">
                {/* Left */}
                <div className="flex items-center gap-2 min-w-0">
                    {showBack ? (
                        <button
                            onClick={() => router.back()}
                            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-foreground" />
                        </button>
                    ) : (
                        <button className="flex items-center gap-2 hover:bg-black/5 rounded-xl px-2 py-1.5 transition-colors -ml-1">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Store className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                            <span className="text-[15px] font-semibold text-foreground leading-none">
                                {title ?? businessName}
                            </span>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mt-px" strokeWidth={2.5} />
                        </button>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-0.5">
                    {rightActions ?? (
                        <>
                            <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                                <Search className="h-[18px] w-[18px] text-foreground/70" strokeWidth={2} />
                            </button>
                            <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors">
                                <Bell className="h-[18px] w-[18px] text-foreground/70" strokeWidth={2} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
