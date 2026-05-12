import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
	size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => (
	<div
		className={cn(
			"inline-flex animate-spin items-center justify-center text-foreground",
			className
		)}
		{...props}
	>
		<Loader2 size={size} />
	</div>
);
