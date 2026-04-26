import { type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import ChatSidebar from "@/components/chat/ChatSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatConversation from "./ChatConversation";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import Logo from "@/components/Logo";
import ChatInput from "@/components/chat/ChatInput";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { ChatMessage, ChatSession } from "@/types/globals";
import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

interface ChatProps {
  sessionId: string;
  existingChatSession: (ChatSession & { chatMessages: ChatMessage[] }) | null;
  isNewChat: boolean;
}

const Chat = ({ sessionId, existingChatSession, isNewChat }: ChatProps) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const queryClient = useQueryClient();

  const { messages, setMessages, sendMessage, status } = useChat({
    id: sessionId,
    transport: new DefaultChatTransport({
      api: API_URL + "/rag/chat",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }),
    messages: existingChatSession?.chatMessages ?? [],
    onFinish: ({ messages }) => {
      if (messages.length === 2) {
        queryClient.invalidateQueries({
          queryKey: ["chat-sessions-history"],
          exact: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
    generateId: nanoid,
    // experimental_throttle: 20,
  });

  // For existing sessions: when data arrives asynchronously, populate useChat.
  // Skip for new chats (messages come from streaming, not the DB).
  const hasLoadedMessagesRef = useRef(isNewChat);
  useEffect(() => {
    if (
      existingChatSession?.chatMessages &&
      existingChatSession.chatMessages.length > 0 &&
      !hasLoadedMessagesRef.current
    ) {
      setMessages(existingChatSession.chatMessages);
      hasLoadedMessagesRef.current = true;
    }
  }, [existingChatSession, setMessages]);

  const isMobile = useIsMobile();

  const hasMessages = messages.length > 0;

  // Show spinner while loading an existing session (no messages yet, not a new chat)
  const isLoadingSession =
    !isNewChat && !existingChatSession && messages.length === 0;

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          chatSessionId: sessionId,
          isNewChat,
        },
      },
    );

    setInput("");

    if (isNewChat) {
      navigate(`?sessionId=${sessionId}`);
    }
  };

  return (
    <>
      <SidebarProvider>
        <ChatSidebar sessionId={sessionId} />
        <SidebarInset>
          <div className="max-w-4xl mx-auto p-2 md:p-6 relative size-full h-screen">
            {isMobile && (
              <SidebarTrigger className="absolute left-2 top-2 z-50 bg-card shadow-md" />
            )}

            <motion.div
              initial={{ opacity: 0, y: -80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("flex flex-col h-full")}
            >
              {isLoadingSession ? (
                <div className="flex-1 flex items-center justify-center">
                  <Spinner className="size-8" />
                </div>
              ) : (
                <>
                  {hasMessages && (
                    <ChatConversation messages={messages} status={status} />
                  )}
                  <div
                    className={cn(
                      !hasMessages &&
                        "my-auto flex flex-col items-center gap-8",
                    )}
                  >
                    {!hasMessages && (
                      <div className="mx-auto">
                        <Logo />
                      </div>
                    )}
                    <ChatInput
                      status={status}
                      className="mt-4"
                      input={input}
                      setInput={setInput}
                      placeholder="Ask a question..."
                      onSubmit={handleSubmit}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      {/* <div className="absolute top-4 right-4">
                <Usage user={user} />
            </div> */}
    </>
  );
};

export default Chat;
