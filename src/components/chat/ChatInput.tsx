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
                    disabled={status === "submitted" || status === "streaming"}
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
                </PromptInputTools>
                <PromptInputSubmit
                    disabled={(!input && status === "ready") || status === "submitted" || status === "streaming"}
                    status={status}
                />
            </PromptInputFooter>
        </PromptInput>
    );
};

export default ChatInput;
