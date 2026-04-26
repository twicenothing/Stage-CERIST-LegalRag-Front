import { api } from "@/lib/axios";
import { ChatMessage, ChatSession } from "@/types/globals";

export async function getUserChatSessions(page = 1, limit = 10, q?: string) {
    return [];
    const res = await api.get<Pick<ChatSession, "id" | "title">[]>(
        `/api/rag/sessions`,
        {
            params: { page, limit, q },
        },
    );

    return res.data;
}

export async function deleteChatSession(sessionId: ChatSession["id"]) {
    const res = await api.delete(`/api/rag/sessions/${sessionId}`);
    return res.data;
}

export async function getChatSession(sessionId: ChatSession["id"]) {
    const res = await api.get<ChatSession & { chatMessages: ChatMessage[] }>(
        `/api/rag/session/${sessionId}`,
    );
    return res.data;
}
