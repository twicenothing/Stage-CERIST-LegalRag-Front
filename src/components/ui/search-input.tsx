import React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SearchInputProps extends React.ComponentProps<"input"> {
    wrapperClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, wrapperClassName, type = "search", ...props }, ref) => {
        return (
            <div className={cn("relative", wrapperClassName)}>
                <HugeiconsIcon
                    strokeWidth={2}
                    icon={Search01Icon}
                    className="pointer-events-none absolute left-3 top-1/2 size-4.5 -translate-y-1/2"
                />
                <Input
                    ref={ref}
                    type={type}
                    className={cn("pl-9", className)}
                    {...props}
                />
            </div>
        );
    },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
