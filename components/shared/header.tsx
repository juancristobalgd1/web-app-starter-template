"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/satin-liquid-glass";
import {
    ArrowLeft,
    Search,
    LogOut,
    Store,
    User,
    Settings,
    Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    rightActions?: React.ReactNode;
    className?: string;
}

export function Header({ title, showBack, rightActions, className }: HeaderProps) {
    const router = useRouter();
    const [showShadow, setShowShadow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check window scroll
            if (window.scrollY > 0) {
                setShowShadow(true);
                return;
            }

            // Check scroll containers (common in dashboard layouts)
            const scrollContainers = document.querySelectorAll("main, .overflow-y-auto");
            for (const container of Array.from(scrollContainers)) {
                if (container.scrollTop > 0) {
                    setShowShadow(true);
                    return;
                }
            }

            setShowShadow(false);
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
                "transition-all duration-300 ease-in-out",
                showShadow ? "border-b border-border shadow-sm" : "border-b border-transparent",
                className
            )}
        >
            <LiquidGlass
                intensity={showShadow ? "medium" : "subtle"}
                satin={showShadow}
                radius="none"
                disableHover
                disableActive
                className="w-full h-14 md:h-16 flex items-center justify-between px-4"
                style={{
                    border: 'none',
                    backgroundColor: showShadow ? 'hsl(var(--background) / 0.8)' : 'transparent',
                }}
            >
                {/* Left Section */}
                <div className="flex items-center gap-3 min-w-0">
                    {showBack ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                <Store className="h-4 w-4 text-primary-foreground" />
                            </div>
                        </div>
                    )}
                    {title && (
                        <h1 className="text-base font-semibold text-foreground truncate">
                            {title}
                        </h1>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {rightActions ? (
                        rightActions
                    ) : (
                        <>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hidden md:flex">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border cursor-pointer hover:bg-muted/80 transition-colors ml-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </>
                    )}
                </div>
            </LiquidGlass>
        </header>
    );
}
