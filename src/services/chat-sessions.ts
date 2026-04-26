import { api } from "@/lib/axios";
import { ChatMessage, ChatSession } from "@/types/globals";

export async function getUserChatSessions(page = 1, limit = 10, q?: string) {

    const res = await api.get<Pick<ChatSession, "id" | "title">[]>(
        `/rag/sessions`,
        {
            params: { page, limit, q },
        },
    );

    return res.data;
}

export async function deleteChatSession(sessionId: ChatSession["id"]) {
    const res = await api.delete(`/rag/sessions/${sessionId}`);
    return res.data;
}

export async function getChatSession(sessionId: ChatSession["id"]) {
    const res = await api.get<ChatSession & { chatMessages: ChatMessage[] }>(
        `/rag/session/${sessionId}`,
    );
    return res.data;
}
