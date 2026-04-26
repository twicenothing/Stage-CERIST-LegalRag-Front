import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Chat from "@/components/chat/Chat";
import DeleteSessionConfirmationModal from "@/components/chat/DeleteSessionModal";
import SearchSessionsModal from "@/components/chat/SearchSessionsModal";
import { getChatSession } from "@/services/chat-sessions";
import { nanoid } from "nanoid";
import { useMemo } from "react";

const ChatPage = () => {
    const [searchParams] = useSearchParams();
    const existingSessionId = searchParams.get("sessionId");

    // Recompute sessionId when URL params change.
    // For existing sessions: use the sessionId from the URL.
    // For new chats: generate a fresh nanoid (re-generates when navigating away and back).
    const sessionId = useMemo(
        () => existingSessionId || nanoid(),
        [existingSessionId],
    );

    const isNewChat = !existingSessionId;

    const { data: existingChatSession = null } = useQuery({
        queryKey: ["chatSession", existingSessionId],
        queryFn: () => getChatSession(existingSessionId!),
        enabled: !!existingSessionId,
    });

    // No blocking loading check here — Chat always renders so the sidebar stays visible.
    // Chat handles the loading state internally via setMessages + a spinner in the content area.

    return (
        <>
            {/* key forces Chat to remount with fresh state when switching sessions */}
            <Chat
                key={sessionId}
                isNewChat={isNewChat}
                sessionId={sessionId}
                existingChatSession={existingChatSession}
            />
            <SearchSessionsModal />
            <DeleteSessionConfirmationModal />
        </>
    );
};

export default ChatPage;
