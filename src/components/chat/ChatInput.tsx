import { cn } from "@/lib/utils";

import { ChatStatus } from "ai";
import type { ClassValue } from "clsx";

import {
    AddAttachments,
    PromptInput,
    PromptInputActionMenu,
    PromptInputAttachment,
    PromptInputAttachments,
    PromptInputBody,
    PromptInputFooter,
    PromptInputMessage,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputTools,
} from "../ai-elements/prompt-input";

interface ChatInputProps {
    className: ClassValue;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    placeholder: string;

    status: ChatStatus;
    onSubmit: (message: PromptInputMessage) => Promise<void>;
}

const ChatInput = ({
    className,
    input,
    setInput,
    placeholder,

    status,
    onSubmit,
}: ChatInputProps) => {
    return (
        <PromptInput
            onSubmit={onSubmit}
            className={cn(
                "w-full rounded-[1.75rem] bg-gradient-to-br from-primary/30 via-border/70 to-blue-500/20 p-px shadow-[0_18px_55px_-35px_rgba(15,23,42,0.55)] transition-all duration-200 focus-within:from-primary/60 focus-within:via-primary/20 focus-within:to-blue-500/30 focus-within:shadow-[0_22px_70px_-35px_rgba(16,185,129,0.5)]",
                "[&_[data-slot=input-group]]:min-h-[116px] [&_[data-slot=input-group]]:rounded-[1.7rem] [&_[data-slot=input-group]]:border-transparent [&_[data-slot=input-group]]:bg-card/95 [&_[data-slot=input-group]]:shadow-sm [&_[data-slot=input-group]]:ring-1 [&_[data-slot=input-group]]:ring-foreground/5 [&_[data-slot=input-group]]:backdrop-blur-md",
                "[&_[data-slot=input-group]:focus-within]:ring-primary/20",
                className
            )}
            globalDrop
            multiple
        >
            <PromptInputBody>
                <PromptInputAttachments>
                    {(attachment) => (
                        <PromptInputAttachment data={attachment} />
                    )}
                </PromptInputAttachments>
                <PromptInputTextarea
                    placeholder={placeholder}
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    disabled={status === "submitted" || status === "streaming"}
                    className="min-h-[82px] px-5 pt-5 pb-1 text-[15px] leading-7 placeholder:text-muted-foreground/55"
                />
            </PromptInputBody>
            <PromptInputFooter className="px-4 pb-4 pt-1">
                <PromptInputTools>
                    <PromptInputActionMenu>
                        <AddAttachments
                            aria-label="Ajouter une pièce jointe"
                            className="size-9 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        // disabled={
                        //     !model || !doesModelAcceptAttachments(model)
                        // }
                        />
                    </PromptInputActionMenu>
                </PromptInputTools>
                <PromptInputSubmit
                    disabled={(!input && status === "ready") || status === "submitted" || status === "streaming"}
                    className="size-9 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
                    status={status}
                />
            </PromptInputFooter>
        </PromptInput>
    );
};

export default ChatInput;
