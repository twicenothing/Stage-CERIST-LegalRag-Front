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
import { useEffect, useMemo, useRef, useState } from "react";
import objectionImg from "@/assets/objection.jpg";
import { toast } from "sonner";
import ChatConversation from "./ChatConversation";
import { DefaultChatTransport } from "ai";
import { nanoid } from "nanoid";
import ChatInput from "@/components/chat/ChatInput";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { ChatMessage, ChatSession } from "@/types/globals";
import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import { getChatSession } from "@/services/chat-sessions";

interface ChatProps {
  sessionId: string;
  existingChatSession: (ChatSession & { chatMessages: ChatMessage[] }) | null;
  isNewChat: boolean;
}

const Chat = ({ sessionId, existingChatSession, isNewChat }: ChatProps) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [showObjection, setShowObjection] = useState(false);
  const welcomeQuestion = useMemo(() => {
    const questions = [
      "Quelle est votre question juridique ?",
      "Que souhaitez-vous vérifier ?",
      "Quel texte voulez-vous comprendre ?",
      "Quelle situation voulez-vous analyser ?",
      "Sur quel point souhaitez-vous être guidé ?",
    ];

    return questions[Math.floor(Math.random() * questions.length)];
  }, []);
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
    onFinish: ({ messages: finishedMessages }) => {
      if (finishedMessages.length === 2) {
        queryClient.invalidateQueries({
          queryKey: ["chat-sessions-history"],
          exact: false,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["user"] });

      void (async () => {
        const retryDelays = [300, 500, 800, 1200, 1800, 2500];

        for (const delay of retryDelays) {
          await new Promise((resolve) => setTimeout(resolve, delay));

          try {
            const session = await getChatSession(sessionId, { fresh: true });
            const savedMessages = session?.chatMessages ?? [];
            const finishedAssistantCount = finishedMessages.filter(
              (message) => message.role === "assistant",
            ).length;
            const savedAssistantCount = savedMessages.filter(
              (message) => message.role === "assistant",
            ).length;

            if (savedAssistantCount < finishedAssistantCount) {
              continue;
            }

            setMessages((currentMessages) => {
              const rolePositions: Partial<Record<ChatMessage["role"], number>> =
                {};
              const savedMessagesByRole = {
                system: savedMessages.filter(
                  (message) => message.role === "system",
                ),
                user: savedMessages.filter(
                  (message) => message.role === "user",
                ),
                assistant: savedMessages.filter(
                  (message) => message.role === "assistant",
                ),
              };

              return currentMessages.map((message) => {
                const rolePosition = rolePositions[message.role] ?? 0;
                const savedMessage =
                  savedMessagesByRole[message.role][rolePosition];
                rolePositions[message.role] = rolePosition + 1;

                if (savedMessage?.id) {
                  return {
                    ...message,
                    id: savedMessage.id,
                    feedback: savedMessage.feedback,
                  };
                }

                return message;
              });
            });
            return;
          } catch {
            // Persistence can briefly lag behind stream completion.
          }
        }

        console.error("Failed to sync saved chat messages after retrying.");
      })();
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
                    <ChatConversation
                      messages={messages}
                      status={status}
                      sessionId={sessionId}
                      onEditClick={handleEditClick}
                    />
                  )}
                  <div
                    className={cn(
                      !hasMessages &&
                        "my-auto flex flex-col items-center gap-8",
                    )}
                  >
                    {!hasMessages && (
                      <div className="mx-auto max-w-2xl px-4 text-center">
                        <h1 className="text-xl font-medium leading-snug text-muted-foreground md:text-2xl">
                          {welcomeQuestion}
                        </h1>
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
