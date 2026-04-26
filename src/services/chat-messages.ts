import { api } from "@/lib/axios";
import { ChatMessage, ChatSession } from "@/types/globals";

export async function getChatMessages(chatSessionId: ChatSession["id"]) {
    const res = await api.get("/chat/messages", {
        params: {
            chatSessionId,
        },
    });

    return res.data as ChatMessage[];
}
