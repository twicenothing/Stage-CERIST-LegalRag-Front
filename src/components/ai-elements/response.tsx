"use client";

import { cn } from "@/lib/utils";
import { cjk } from "@streamdown/cjk";
import { createCodePlugin } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

const codePlugin = createCodePlugin({
	themes: ["andromeeda", "andromeeda"],
});

const streamdownPlugins = { cjk, math, code: codePlugin, mermaid };

export const Response = memo(
	({ className, ...props }: ResponseProps) => (
		<Streamdown
			plugins={streamdownPlugins}
			className={cn(
				"size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
				"flex flex-col gap-3 leading-relaxed",
				"[&_ul]:pl-6 [&_ul]:list-outside [&_ul]:list-disc [&_ul]:space-y-1.5",
				"[&_ol]:pl-6 [&_ol]:list-outside [&_ol]:list-decimal [&_ol]:space-y-1.5",
				"[&_li]:pl-1",
				"[&_p]:whitespace-pre-wrap",
				"[&_strong]:font-semibold",
				"[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
				"[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
				"[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:font-medium",
				"[&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
				"[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-4",
				"[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-3",
				"[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
				"[&_table]:w-full [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:border",
				"[&_th]:bg-muted/50 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold",
				"[&_td]:p-2 [&_td]:border-t",
				className
			)}
			{...props}
		/>
	),
	(prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
