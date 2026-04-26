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
				// "[&_a]:text-accent",
				className
			)}
			{...props}
		/>
	),
	(prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
