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
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import objectionImg from "@/assets/objection.jpg";
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
import { getToken, useSession } from "@/lib/auth";
import { getChatSession } from "@/services/chat-sessions";
import { Button } from "@/components/ui/button";

interface ChatProps {
  sessionId: string;
  existingChatSession: (ChatSession & { chatMessages: ChatMessage[] }) | null;
  isNewChat: boolean;
}

const Chat = ({ sessionId, existingChatSession, isNewChat }: ChatProps) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [showObjection, setShowObjection] = useState(false);
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

      // Fetch the session after a small delay to ensure backend has saved the message
      setTimeout(async () => {
        try {
          const session = await getChatSession(sessionId);
          if (session && session.chatMessages) {
            setMessages((currentMessages) => {
              return currentMessages.map((msg, index) => {
                const dbMsg = session.chatMessages[index];
                if (dbMsg && dbMsg.role === msg.role) {
                  return { ...msg, id: dbMsg.id, feedback: dbMsg.feedback };
                }
                return msg;
              });
            });
          }
        } catch (error) {
          console.error("Failed to sync messages:", error);
        }
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message || "Échec de l'envoi du message");
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

    if (message.text?.trim().toLowerCase() === "objection") {
      setShowObjection(true);
      setTimeout(() => setShowObjection(false), 1500);
    }

    sendMessage(
      {
        text: message.text || "Envoyé avec des pièces jointes",
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
  const handleEditClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(text.length, text.length);
      }
    }, 0);
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
                    <ChatConversation messages={messages} status={status} onEditClick={handleEditClick} />
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
                      placeholder="Posez une question..."
                      onSubmit={handleSubmit}
                    />
                    <p className="text-[11px] text-muted-foreground/60 text-center font-medium mt-1">
                      L'IA peut faire des erreurs. Veuillez vérifier les informations importantes.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </div>
          
          <AnimatePresence>
            {showObjection && (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 100 }}
                className="absolute bottom-24 left-4 md:left-8 z-[100] pointer-events-none"
              >
                <img 
                  src={objectionImg} 
                  alt="Objection!" 
                  className="max-h-[200px] max-w-[250px] object-contain drop-shadow-2xl" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default Chat;
