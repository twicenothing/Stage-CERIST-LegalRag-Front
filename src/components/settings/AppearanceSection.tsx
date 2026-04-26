import { HugeiconsIcon } from "@hugeicons/react";
import {
    Sun01Icon,
    Moon02Icon,
    LaptopIcon as ComputerIcon,
} from "@hugeicons/core-free-icons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeProvider";

export function AppearanceSection() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 pl-1">
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={Sun01Icon}
                    className="text-primary size-4"
                />
                <h2 className="text-sm font-semibold">Appearance</h2>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Theme</CardTitle>
                    <CardDescription>
                        Switch between light and dark modes
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end">
                    <Select
                        value={theme}
                        onValueChange={(t) =>
                            setTheme(t as "light" | "dark" | "system")
                        }
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon
                                        strokeWidth={2}
                                        icon={Sun01Icon}
                                        className="size-3.5"
                                    />
                                    <span>Light</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="dark">
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon
                                        strokeWidth={2}
                                        icon={Moon02Icon}
                                        className="size-3.5"
                                    />
                                    <span>Dark</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="system">
                                <div className="flex items-center gap-2">
                                    <HugeiconsIcon
                                        strokeWidth={2}
                                        icon={ComputerIcon}
                                        className="size-3.5"
                                    />
                                    <span>System</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
        </div>
    );
}
