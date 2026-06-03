import { Action } from "@/components/ai-elements/actions";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/globals";
import type { ChatStatus } from "ai";
import { CopyIcon, FileIcon, ChevronDownIcon, PencilIcon, ThumbsUpIcon, ThumbsDownIcon, CheckIcon, FlagIcon } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import { ReportMessagePopover } from "./ReportMessagePopover";

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
    const sources: { title: string; percentage: string; page?: string }[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
        const match = line.match(/-\s*(.*?)\s*(?:-\s*Page\s*(\w+))?\s*\(\s*(?:Pertinence\s*:\s*)?(\d+%?)\s*\)/i);
        if (match) {
            sources.push({ 
                title: match[1].trim(), 
                page: match[2] ? match[2].trim() : undefined,
                percentage: match[3].trim() 
            });
        } else {
            const titleMatch = line.match(/-\s*(.+)/);
            if (titleMatch && titleMatch[1].trim() !== '') {
                let title = titleMatch[1].trim();
                let page = undefined;
                const pageMatch = title.match(/(.*?)\s*-\s*Page\s*(\w+)/i);
                if (pageMatch) {
                    title = pageMatch[1].trim();
                    page = pageMatch[2].trim();
                }
                sources.push({ title, percentage: "", page });
            }
        }
    }
    return sources;
};

const SourcesViewer = ({ sources }: { sources: { title: string; percentage: string; page?: string }[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);

    if (!sources || sources.length === 0) return null;

    const handleOpenPdf = async (title: string, page?: string) => {
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
            const finalUrl = (page && page !== 'Inconnu' && !isNaN(Number(page))) ? `${url}#page=${page}` : url;
            setSelectedPdf({ url: finalUrl, title });
            toast.dismiss(toastId);
        } catch {
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
        <div className="flex w-fit max-w-[92%] flex-col gap-1.5 pl-1 pt-2 sm:max-w-[86%]">
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
                        onClick={() => handleOpenPdf(s.title, s.page)}
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

            <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
                <DialogContent className="max-w-[90vw] w-[1200px] h-[90vh] flex flex-col p-4 sm:p-6 sm:max-w-7xl">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-xl">{selectedPdf?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedPdf && (
                        <div className="flex-1 w-full bg-muted/30 rounded-lg overflow-hidden border">
                            <iframe 
                                src={selectedPdf.url} 
                                className="w-full h-full border-0" 
                                title={selectedPdf.title}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

const PROGRESSIVE_STATES = [
    "🔍 Recherche dans le Journal Officiel...",
    "⚖️ Analyse des articles de loi...",
    "✍️ Rédaction de la réponse..."
];

const ProgressiveLoader = () => {
    const [stateIndex, setStateIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStateIndex((prev) => Math.min(prev + 1, PROGRESSIVE_STATES.length - 1));
        }, 1800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium w-full min-w-[280px]">
            <Loader className="size-4 shrink-0 text-primary" />
            <div className="relative flex-1 overflow-hidden h-5 flex items-center">
                <div
                    key={stateIndex}
                    className="absolute whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                    {PROGRESSIVE_STATES[stateIndex]}
                </div>
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
    const [feedbackState, setFeedbackState] = useState<Record<string, "like" | "dislike" | null>>({});
    const [reportedMessages, setReportedMessages] = useState<Set<string>>(new Set());

    const handleFeedback = async (messageId: string, feedback: "like" | "dislike" | null) => {
        if (!messageId || messageId.length < 32) {
            toast.error("Veuillez patienter, la réponse n'est pas encore enregistrée.");
            return;
        }

        setFeedbackState(prev => ({ ...prev, [messageId]: feedback }));
        
        try {
            const response = await fetch(`${API_URL}/rag/message/${messageId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ feedback })
            });
            
            if (!response.ok) {
                throw new Error("Erreur de feedback");
            }
        } catch {
            setFeedbackState(prev => {
                const newState = { ...prev };
                delete newState[messageId];
                return newState;
            });
            toast.error("Erreur lors de l'envoi du feedback");
        }
    };

    return (
        <Conversation className="h-full">
            <ConversationContent className="max-md:p-2">
                {messages.map((message) => {
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

                                            if (!mainText && sources.length === 0) {
                                                if (status === "streaming" && message.id === messages.at(-1)?.id) {
                                                    return (
                                                        <Fragment key={`${message.id}-${i}`}>
                                                            <Message from={message.role} className="group items-start">
                                                                <div className="flex flex-col w-full">
                                                                    <MessageContent variant="contained" className="w-fit px-5 py-4">
                                                                        <ProgressiveLoader />
                                                                    </MessageContent>
                                                                </div>
                                                            </Message>
                                                        </Fragment>
                                                    );
                                                }
                                                return null;
                                            }

                                            return (
                                                <Fragment
                                                    key={`${message.id}-${i}`}
                                                >
                                                    <Message
                                                        from={message.role}
                                                        className="group items-start"
                                                    >
                                                        <div className="flex flex-col w-full">
                                                            <MessageContent variant="contained" className={cn("w-fit", reportedMessages.has(message.id) && "opacity-50 grayscale transition-all duration-300")}>
                                                                <Response>
                                                                    {mainText}
                                                                </Response>
                                                            </MessageContent>
                                                            <SourcesViewer sources={sources} />
                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex flex-row items-center gap-1">
                                                                <Action
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
                                                                {(() => {
                                                                    const currentFeedback = feedbackState[message.id] !== undefined ? feedbackState[message.id] : message.feedback;
                                                                    return (
                                                                        <div className="flex items-center justify-center">
                                                                            <AnimatePresence mode="wait">
                                                                                {!currentFeedback ? (
                                                                                    <motion.div
                                                                                        key="actions"
                                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                                                        transition={{ duration: 0.15 }}
                                                                                        className="flex flex-row gap-1"
                                                                                    >
                                                                                        <Action
                                                                                            onClick={() => handleFeedback(message.id, "like")}
                                                                                            label="J'aime"
                                                                                        >
                                                                                            <ThumbsUpIcon className="size-3" />
                                                                                        </Action>
                                                                                        <Action
                                                                                            onClick={() => handleFeedback(message.id, "dislike")}
                                                                                            label="Je n'aime pas"
                                                                                        >
                                                                                            <ThumbsDownIcon className="size-3" />
                                                                                        </Action>
                                                                                        <ReportMessagePopover
                                                                                            messageId={message.id}
                                                                                            onReportSuccess={(id) => setReportedMessages(prev => new Set(prev).add(id))}
                                                                                            disabled={reportedMessages.has(message.id)}
                                                                                        >
                                                                                            <Action
                                                                                                onClick={() => {}}
                                                                                                label={reportedMessages.has(message.id) ? "Déjà signalé" : "Signaler un problème"}
                                                                                            >
                                                                                                <FlagIcon className="size-3" />
                                                                                            </Action>
                                                                                        </ReportMessagePopover>
                                                                                    </motion.div>
                                                                                ) : (
                                                                                    <motion.div
                                                                                        key="check"
                                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                                                        transition={{ duration: 0.15 }}
                                                                                    >
                                                                                        <Action
                                                                                            onClick={() => handleFeedback(message.id, null)}
                                                                                            label="Retirer l'avis"
                                                                                            className="text-emerald-500 opacity-100 dark:text-emerald-400"
                                                                                        >
                                                                                            <CheckIcon className="size-3" />
                                                                                        </Action>
                                                                                    </motion.div>
                                                                                )}
                                                                            </AnimatePresence>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </div>
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
                {status === "error" && (
                    <Message from="assistant" className="items-start">
                        <div className="flex w-full flex-col">
                            <MessageContent
                                variant="contained"
                                role="alert"
                                className="w-fit !border-destructive/30 !bg-destructive/5 !text-destructive !ring-destructive/10"
                            >
                                <div className="flex items-start gap-3">
                                    <span aria-hidden="true" className="text-lg leading-7">
                                        ⚠️
                                    </span>
                                    <div>
                                        <p className="font-semibold">Une erreur est survenue.</p>
                                        <p className="text-sm leading-6 text-destructive/80">
                                            Impossible de générer la réponse pour le moment. Veuillez réessayer.
                                        </p>
                                    </div>
                                </div>
                            </MessageContent>
                        </div>
                    </Message>
                )}
                {((status === "submitted") || (status === "streaming" && messages.at(-1)?.role === "assistant" && messages.at(-1)?.parts.length === 0)) && <Loader className="mt-2" />}
            </ConversationContent>
            <ConversationScrollButton />
        </Conversation>
    );
};

export default ChatConversation;
