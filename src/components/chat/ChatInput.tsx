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
            className={cn("w-full bg-card", className)}
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
                />
            </PromptInputBody>
            <PromptInputFooter>
                <PromptInputTools>
                    <PromptInputActionMenu>
                        <AddAttachments
                        // disabled={
                        //     !model || !doesModelAcceptAttachments(model)
                        // }
                        />
                    </PromptInputActionMenu>
                    {/* <button
                        type="button"
                     
                        className={cn(
                            "rounded-full flex items-center gap-1.5 px-3 py-2 transition-colors",
                            webSearch
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/50",
                        )}
                    >
                        <HugeiconsIcon
                            strokeWidth={2}
                            icon={GlobalSearchIcon}
                            className="size-4"
                        />
                        <span>Search</span>
                    </button> */}
                </PromptInputTools>
                <PromptInputSubmit
                    disabled={!input && status !== "ready"}
                    status={status}
                />
            </PromptInputFooter>
        </PromptInput>
    );
};

export default ChatInput;
