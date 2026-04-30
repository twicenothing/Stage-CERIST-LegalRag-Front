import { Action, Actions } from "@/components/ai-elements/actions";
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Image } from "@/components/ai-elements/image";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
    Reasoning,
    ReasoningContent,
    ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Response } from "@/components/ai-elements/response";
import {
    Source,
    Sources,
    SourcesContent,
    SourcesTrigger,
} from "@/components/ai-elements/sources";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/globals";
import type { ChatStatus } from "ai";
import { CopyIcon, FileIcon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";

interface ChatConversationProps {
    messages: ChatMessage[];
    status: ChatStatus;
}

const ChatConversation = ({ messages, status }: ChatConversationProps) => {
    return (
        <Conversation className="h-full">
            <ConversationContent className="max-md:p-2">
                {messages.map((message, messageIndex) => {
                    // const toolCalls = getToolCalls(message);
                    return (
                        <div key={message.id}>
                            <Fragment>
                                {message.role === "assistant" &&
                                    message.parts.filter(
                                        (part) => part.type === "source-url",
                                    ).length > 0 && (
                                        <Sources>
                                            <SourcesTrigger
                                                count={
                                                    message.parts.filter(
                                                        (part) =>
                                                            part.type ===
                                                            "source-url",
                                                    ).length
                                                }
                                            />
                                            {message.parts
                                                .filter(
                                                    (part) =>
                                                        part.type ===
                                                        "source-url",
                                                )
                                                .map((part, i) => (
                                                    <SourcesContent
                                                        key={`${message.id}-${i}`}
                                                    >
                                                        <Source
                                                            key={`${message.id}-${i}`}
                                                            href={part.url}
                                                            title={part.url}
                                                        />
                                                    </SourcesContent>
                                                ))}
                                        </Sources>
                                    )}
                            </Fragment>

                            <Fragment>
                                {message.parts.map((part, i) => {
                                    switch (part.type) {
                                        case "text":
                                            return (
                                                <Fragment
                                                    key={`${message.id}-${i}`}
                                                >
                                                    <Message
                                                        from={message.role}
                                                        className="group"
                                                    >
                                                        <Action
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity self-center"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    part.text,
                                                                );
                                                                toast(
                                                                    "Copied!",
                                                                );
                                                            }}
                                                            label="Copy"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </Action>
                                                        <MessageContent variant="contained">
                                                            <Response>
                                                                {part.text}
                                                            </Response>
                                                        </MessageContent>
                                                    </Message>
                                                </Fragment>
                                            );
                                        case "reasoning":
                                            return (
                                                <Reasoning
                                                    key={`${message.id}-${i}`}
                                                    className="w-full"
                                                    isStreaming={
                                                        status ===
                                                            "streaming" &&
                                                        i ===
                                                            message.parts
                                                                .length -
                                                                1 &&
                                                        message.id ===
                                                            messages.at(-1)?.id
                                                    }
                                                >
                                                    <ReasoningTrigger />
                                                    <ReasoningContent>
                                                        {part.text}
                                                    </ReasoningContent>
                                                </Reasoning>
                                            );
                                        case "file":
                                            if (
                                                part.mediaType.startsWith(
                                                    "image/",
                                                )
                                            ) {
                                                return (
                                                    <div
                                                        key={`${message.id}-${i}`}
                                                        className={cn(
                                                            "flex flex-col gap-1 w-fit",
                                                            message.role ===
                                                                "user" &&
                                                                "ml-auto",
                                                        )}
                                                    >
                                                        <Image
                                                            className="w-72"
                                                            mediaType={
                                                                part.mediaType
                                                            }
                                                            base64={
                                                                part.url.split(
                                                                    ",",
                                                                )[1]
                                                            }
                                                            uint8Array={
                                                                new Uint8Array(
                                                                    [],
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={`${message.id}-${i}`}
                                                    className={cn(
                                                        "flex flex-col gap-1 w-fit mt-2",
                                                        message.role ===
                                                            "user" &&
                                                            "ml-auto mt-0",
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 p-3 border bg-muted/50 max-w-72">
                                                        <div className="flex bg-background p-2 border">
                                                            <FileIcon className="size-5 text-primary" />
                                                        </div>
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className="text-sm font-medium truncate">
                                                                File Attachment
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate uppercase">
                                                                {part.mediaType
                                                                    .split("/")
                                                                    .pop() ||
                                                                    "UNKNOWN"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </Fragment>
                            {/* <Fragment>
								{message.role === "assistant" && (
									<Fragment>
										{toolCalls.knowledgeBaseTool && (
											<KnowledgeBaseToolCall
												toolCall={
													toolCalls.knowledgeBaseTool
												}
											/>
										)}
									</Fragment>
								)}
							</Fragment> */}
                        </div>
                    );
                })}
                {((status === "submitted") || (status === "streaming" && messages.at(-1)?.role === "assistant" && (messages.at(-1)?.parts.length === 0 || messages.at(-1)?.parts.every((p: any) => p.type === 'text' ? !p.text : false)))) && <Loader />}
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
};

export default ChatConversation;
