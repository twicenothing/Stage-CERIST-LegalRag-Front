import { ChatMessage } from "@/types/globals";
import MarkdownMessage from "./MarkdownMessage";

interface ChatSessionPdfExportProps {
    messages: ChatMessage[];
    title: string;
}

const getPartText = (part: ChatMessage["parts"][number]) => {
    if (part?.type === "text" || part?.type === "reasoning") {
        return part.text || "";
    }

    if (part?.type === "file") {
        return `[Fichier joint: ${part.filename || part.mediaType || "document"}]`;
    }

    return "";
};

const getMessageText = (message: ChatMessage) => {
    return (message.parts || [])
        .map(getPartText)
        .filter(Boolean)
        .join("\n\n");
};

const getRoleLabel = (role: ChatMessage["role"]) => {
    if (role === "assistant") return "JurIA";
    if (role === "user") return "Utilisateur";
    return "Système";
};

const formatDate = (value?: Date) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleString("fr-DZ", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const ChatSessionPdfExport = ({ messages, title }: ChatSessionPdfExportProps) => {
    const exportedMessages = messages.filter(
        (message) => message.role !== "system" && getMessageText(message),
    );

    return (
        <article className="chat-session-pdf-document">
            <header className="chat-session-pdf-header">
                <p className="chat-session-pdf-brand">JurIA</p>
                <h1 className="chat-session-pdf-title">{title}</h1>
                <p className="chat-session-pdf-meta">
                    Export généré le{" "}
                    {new Date().toLocaleString("fr-DZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </p>
            </header>

            {exportedMessages.map((message) => {
                const text = getMessageText(message);
                const createdAt = formatDate(message.created_at);

                return (
                    <section
                        key={message.id}
                        className={`chat-session-pdf-message chat-session-pdf-message-${message.role}`}
                    >
                        <div className="chat-session-pdf-role">
                            {getRoleLabel(message.role)}
                            {createdAt && (
                                <span className="chat-session-pdf-date">
                                    {createdAt}
                                </span>
                            )}
                        </div>

                        {message.role === "assistant" ? (
                            <MarkdownMessage content={text} />
                        ) : (
                            <p className="chat-session-pdf-user-text">
                                {text}
                            </p>
                        )}
                    </section>
                );
            })}
        </article>
    );
};

ChatSessionPdfExport.displayName = "ChatSessionPdfExport";

export default ChatSessionPdfExport;
