import React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DiceIcon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
    wrapperClassName?: string;
    onRandomize?: () => void;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, wrapperClassName, onRandomize, ...props }, ref) => {
        const [isVisible, setIsVisible] = React.useState(false);

        return (
            <div className={cn("relative", wrapperClassName)}>
                <Input
                    placeholder="••••••••••••••"
                    ref={ref}
                    type={isVisible ? "text" : "password"}
                    className={cn("pr-10", className)}
                    {...props}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {onRandomize && (
                        <button
                            type="button"
                            onClick={onRandomize}
                            className="text-muted-foreground hover:text-foreground focus-visible:outline-none"
                            aria-label="Générer un mot de passe"
                        >
                            <HugeiconsIcon
                                strokeWidth={2}
                                icon={DiceIcon}
                                className="size-4"
                                aria-hidden
                            />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsVisible((v) => !v)}
                        className="text-muted-foreground hover:text-foreground focus-visible:outline-none"
                        aria-label={
                            isVisible
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                        }
                    >
                        {isVisible ? (
                            <HugeiconsIcon
                                strokeWidth={2}
                                icon={ViewOffIcon}
                                className="size-4"
                                aria-hidden
                            />
                        ) : (
                            <HugeiconsIcon
                                strokeWidth={2}
                                icon={ViewIcon}
                                className="size-4"
                                aria-hidden
                            />
                        )}
                    </button>
                </div>
            </div>
        );
    },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
