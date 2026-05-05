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
import { CopyIcon, FileIcon, ChevronDownIcon, PencilIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

const parseTextAndSources = (text: string) => {
    const match = text.match(/^(.*?)(?:\n\n)?\*\*Documents pertinents\s*:\*\*(.*)$/is);
    if (match) {
        return { mainText: match[1], sourcesText: match[2] };
    }
    const matchNoBold = text.match(/^(.*?)(?:\n\n)?Documents pertinents\s*:(.*)$/is);
    if (matchNoBold) {
        return { mainText: matchNoBold[1], sourcesText: matchNoBold[2] };
    }
    return { mainText: text, sourcesText: "" };
};

const parseSources = (text: string) => {
    const sources: { title: string; percentage: string }[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
        const match = line.match(/-\s*(.*?)\s*\(\s*(?:Pertinence\s*:\s*)?(\d+%?)\s*\)/i);
        if (match) {
            sources.push({ title: match[1].trim(), percentage: match[2].trim() });
        } else {
            const titleMatch = line.match(/-\s*(.+)/);
            if (titleMatch && titleMatch[1].trim() !== '') {
                sources.push({ title: titleMatch[1].trim(), percentage: "" });
            }
        }
    }
    return sources;
};

const SourcesViewer = ({ sources }: { sources: { title: string; percentage: string }[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    if (!sources || sources.length === 0) return null;

    const handleOpenPdf = async (title: string) => {
        try {
            const toastId = toast.loading("Ouverture du document...");
            const response = await fetch(`${API_URL}/rag/pdf?title=${encodeURIComponent(title)}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });
            
            if (!response.ok) {
                toast.error("Document introuvable", { id: toastId });
                return;
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
            toast.dismiss(toastId);
        } catch (err) {
            toast.error("Erreur lors de l'ouverture du document");
        }
    };
    
    // color grading logic
    const getColorClass = (percentage: string) => {
        const num = parseInt(percentage);
        if (isNaN(num)) return "text-muted-foreground bg-muted";
        if (num >= 80) return "text-emerald-700 bg-emerald-100/50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
        if (num >= 50) return "text-amber-700 bg-amber-100/50 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
        return "text-red-700 bg-red-100/50 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/50";
    };

    return (
        <div className="flex flex-col gap-1.5 mt-2 w-full max-w-[90%]">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit p-1 -ml-1 rounded hover:bg-muted/50"
            >
                <ChevronDownIcon className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
                {isOpen ? "Masquer les sources" : "Voir tous les sources"}
            </button>
            
            <div className={cn("flex flex-wrap gap-2")}>
               {(isOpen ? sources : sources.slice(0, 1)).map((s, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => handleOpenPdf(s.title)}
                        className={cn("flex items-center gap-2 p-1.5 px-2.5 rounded-md border bg-background text-xs shadow-sm w-fit max-w-[280px] cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring", getColorClass(s.percentage))}
                        title={`Ouvrir ${s.title}`}
                    >
                        <FileIcon className="size-3.5 shrink-0 opacity-70" />
                        <span className="font-medium truncate text-left">{s.title}</span>
                        {s.percentage && (
                            <span className="font-bold ml-1">
                                {s.percentage}
                            </span>
                        )}
                    </button>
               ))}
            </div>
        </div>
    );
};

interface ChatConversationProps {
    messages: ChatMessage[];
    status: ChatStatus;
    onEditClick?: (text: string) => void;
}

const ChatConversation = ({ messages, status, onEditClick }: ChatConversationProps) => {
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
                                        case "text": {
                                            if (message.role === "user") {
                                                return (
                                                    <Fragment key={`${message.id}-${i}`}>
                                                        <Message
                                                            from={message.role}
                                                            className="group"
                                                        >
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center flex items-center gap-1">
                                                                {onEditClick && (
                                                                    <Action
                                                                        onClick={() => onEditClick(part.text)}
                                                                        label="Modifier"
                                                                    >
                                                                        <PencilIcon className="size-3" />
                                                                    </Action>
                                                                )}
                                                                <Action
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(part.text);
                                                                        toast("Copié !");
                                                                    }}
                                                                    label="Copier"
                                                                >
                                                                    <CopyIcon className="size-3" />
                                                                </Action>
                                                            </div>
                                                            <MessageContent variant="contained">
                                                                <Response>
                                                                    {part.text}
                                                                </Response>
                                                            </MessageContent>
                                                        </Message>
                                                    </Fragment>
                                                );
                                            }

                                            const { mainText, sourcesText } = parseTextAndSources(part.text);
                                            const sources = sourcesText ? parseSources(sourcesText) : [];

                                            return (
                                                <Fragment
                                                    key={`${message.id}-${i}`}
                                                >
                                                    <Message
                                                        from={message.role}
                                                        className="group items-start"
                                                    >
                                                        <Action
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity self-center"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    part.text,
                                                                );
                                                                toast(
                                                                    "Copié !",
                                                                );
                                                            }}
                                                            label="Copier"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </Action>
                                                        <div className="flex flex-col w-full">
                                                            <MessageContent variant="contained" className="w-fit max-w-full">
                                                                <Response>
                                                                    {mainText}
                                                                </Response>
                                                            </MessageContent>
                                                            <SourcesViewer sources={sources} />
                                                        </div>
                                                    </Message>
                                                </Fragment>
                                            );
                                        }
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
                                                                Pièce jointe
                                                            </span>
                                                            <span className="text-xs text-muted-foreground truncate uppercase">
                                                                {part.mediaType
                                                                    .split("/")
                                                                    .pop() ||
                                                                    "INCONNU"}
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
