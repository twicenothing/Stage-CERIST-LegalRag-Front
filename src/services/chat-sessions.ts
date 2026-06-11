import { api } from "@/lib/axios";
import { ChatMessage, ChatSession } from "@/types/globals";

export async function getUserChatSessions() {
    const res = await api.get<Pick<ChatSession, "id" | "title" | "archived">[]>(
        `/rag/sessions`,
    );

    return res.data;
}

export async function archiveChatSession(sessionId: ChatSession["id"]) {
    const res = await api.post(`/rag/session/${sessionId}/archive`);
    return res.data;
}

export async function unarchiveChatSession(sessionId: ChatSession["id"]) {
    const res = await api.post(`/rag/session/${sessionId}/unarchive`);
    return res.data;
}

export async function deleteChatSession(sessionId: ChatSession["id"]) {
    const res = await api.delete(`/rag/sessions/${sessionId}`);
    return res.data;
}

export async function getChatSession(
    sessionId: ChatSession["id"],
    options?: { fresh?: boolean },
) {
    const res = await api.get<ChatSession & { chatMessages: ChatMessage[] }>(
        `/rag/session/${sessionId}`,
        options?.fresh
            ? {
                  params: { _ts: Date.now() },
                  headers: { "Cache-Control": "no-cache" },
              }
            : undefined,
    );
    return res.data;
}
