import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes } from "react";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
	from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
	<div
		className={cn(
			"group flex w-full items-end gap-2 py-3",
			from === "user" ? "is-user justify-end" : "is-assistant justify-start",
			className
		)}
		{...props}
	/>
);

const messageContentVariants = cva(
	"relative flex flex-col gap-2 overflow-hidden rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-sm transition-all duration-200",
	{
		variants: {
			variant: {
				contained: [
					"group-[.is-user]:max-w-[82%] group-[.is-user]:rounded-br-md group-[.is-user]:border group-[.is-user]:border-primary/20 group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:shadow-[0_16px_35px_-24px_rgba(16,185,129,0.85)]",
					"sm:group-[.is-user]:max-w-[72%]",
					"group-[.is-assistant]:max-w-[92%] group-[.is-assistant]:rounded-bl-md group-[.is-assistant]:border group-[.is-assistant]:border-border/70 group-[.is-assistant]:bg-card/95 group-[.is-assistant]:text-foreground group-[.is-assistant]:ring-1 group-[.is-assistant]:ring-foreground/5 group-[.is-assistant]:shadow-[0_18px_45px_-34px_rgba(15,23,42,0.7)]",
					"sm:group-[.is-assistant]:max-w-[86%]",
					"group-[.is-user]:[&_a]:text-primary-foreground group-[.is-user]:[&_a]:decoration-primary-foreground/60 group-[.is-user]:[&_code]:bg-primary-foreground/15 group-[.is-user]:[&_code]:text-primary-foreground",
				],
				flat: [
					"group-[.is-user]:max-w-[82%] group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md group-[.is-user]:bg-primary/10 group-[.is-user]:text-foreground",
					"sm:group-[.is-user]:max-w-[72%]",
					"group-[.is-assistant]:max-w-[92%] group-[.is-assistant]:text-foreground sm:group-[.is-assistant]:max-w-[86%]",
				],
			},
		},
		defaultVariants: {
			variant: "contained",
		},
	}
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
	children,
	className,
	variant,
	...props
}: MessageContentProps) => (
	<div
		className={cn(messageContentVariants({ variant, className }))}
		{...props}
	>
		{children}
	</div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
	src: string;
	name?: string;
};

export const MessageAvatar = ({
	src,
	name,
	className,
	...props
}: MessageAvatarProps) => (
	<Avatar className={cn("size-8 ring-1 ring-border", className)} {...props}>
		<AvatarImage alt="" className="mt-0 mb-0" src={src} />
		<AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
	</Avatar>
);
