import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

export const PageHeader = ({
    title,
    subtitle,
    children,
    className,
}: PageHeaderProps) => {
    return (
        <header
            className={cn(
                "sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60",
                className,
            )}
        >
            <div className="px-6 py-5 max-w-2xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight leading-none text-foreground">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest opacity-60 mt-1.5">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </header>
    );
};

interface PageContentProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export const PageContent = ({
    children,
    className,
    maxWidth = "3xl",
}: PageContentProps) => {
    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
    };

    return (
        <main
            className={cn(
                "mx-auto px-4 sm:px-6 py-6",
                maxWidthClasses[maxWidth],
                className,
            )}
        >
            {children}
        </main>
    );
};
