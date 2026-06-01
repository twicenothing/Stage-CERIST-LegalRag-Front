import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export type LoaderProps = HTMLAttributes<HTMLDivElement> & {
	size?: number;
};

export const Loader = ({ className, size = 16, ...props }: LoaderProps) => {
	const [showDragonBall] = useState(() => Math.random() < 0.05); // 5% chance easter egg

	return (
		<div
			className={cn(
				"inline-flex animate-spin items-center justify-center text-foreground",
				className
			)}
			{...props}
		>
			{showDragonBall ? (
				<svg viewBox="0 0 100 100" width={size * 1.5} height={size * 1.5} className="animate-spin">
					{/* Base ball */}
					<circle cx="50" cy="50" r="45" fill="#fb923c" stroke="#ea580c" strokeWidth="4" />
					{/* Highlight */}
					<path d="M 25 35 A 30 30 0 0 1 65 15" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
					{/* 4 Stars */}
					<path d="M 35 30 l 2 4 5 1 -3 3 1 5 -4 -2 -4 2 1 -5 -3 -3 5 -1 z" fill="#dc2626" />
					<path d="M 65 30 l 2 4 5 1 -3 3 1 5 -4 -2 -4 2 1 -5 -3 -3 5 -1 z" fill="#dc2626" />
					<path d="M 35 60 l 2 4 5 1 -3 3 1 5 -4 -2 -4 2 1 -5 -3 -3 5 -1 z" fill="#dc2626" />
					<path d="M 65 60 l 2 4 5 1 -3 3 1 5 -4 -2 -4 2 1 -5 -3 -3 5 -1 z" fill="#dc2626" />
				</svg>
			) : (
				<Loader2 size={size} />
			)}
		</div>
	);
};
