import type React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Dollar02Icon,
    GridViewIcon,
    HeadphonesIcon,
    Settings01Icon,
} from "@hugeicons/core-free-icons";

type DockItem = {
    icon: React.ReactNode;
    label: string;
    href: string;
    isShown: boolean;
};
export const noDockPathnames = ["/login", "/onboarding"];

export default function Dock() {
    const { pathname } = useLocation();

    const dockItems: DockItem[] = [
        {
            icon: (
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={HeadphonesIcon}
                    className="size-6"
                />
            ),
            label: "Sounds",
            href: "/",
            isShown: true,
        },
        {
            icon: (
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={GridViewIcon}
                    className="size-6"
                />
            ),
            label: "Presets",
            href: "/presets",
            isShown: true,
        },
        {
            icon: (
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={Dollar02Icon}
                    className="size-6"
                />
            ),
            label: "Upgrade",
            href: "/pricing",
            isShown: true,
        },

        {
            icon: (
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={Settings01Icon}
                    className="size-6"
                />
            ),
            label: "Settings",
            href: "/settings",
            isShown: true,
        },
    ];

    if (noDockPathnames.some((path) => pathname.includes(path))) {
        return null;
    }

    const shownDockItems = dockItems.filter((item) => item.isShown);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 select-none bg-background">
            <div className="border-t border-border">
                <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
                    {shownDockItems.map((item) => (
                        <DockIcon
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface DockIconProps {
    item: DockItem;
    isActive: boolean;
}

function DockIcon({ item, isActive }: DockIconProps) {
    const navigate = useNavigate();
    const platform = "capacitorX";

    return (
        <button
            onClick={
                platform !== "capacitor"
                    ? () => {
                          navigate(item.href);
                      }
                    : undefined
            }
            onTouchEnd={
                platform === "capacitor"
                    ? (e) => {
                          e.preventDefault();
                          navigate(item.href);
                      }
                    : undefined
            }
            className="relative flex flex-col items-center justify-center w-16 h-14 group dock-item"
        >
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isActive ? 1.25 : 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={cn(
                    "flex items-center justify-center rounded-full p-1",
                    isActive ? "text-primary" : "text-muted-foreground",
                )}
            >
                {item.icon}
            </motion.div>

            {/* {isActive && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-4 h-1 w-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                />
            )} */}

            <span
                className={cn(
                    "text-xs mt-1 font-medium text-muted-foreground",
                    isActive && "text-primary",
                )}
            >
                {item.label}
            </span>
        </button>
    );
}
