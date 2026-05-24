export type ChatRole = "system" | "user" | "assistant";

export interface User {
    id: string;
    last_name: string;
    first_name : string;
    email: string;
    created_at: Date;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    session: ChatSession;
    model_id: string | null;
    role: ChatRole;
    parts: any[];
    attachments: any[];
    feedback?: "like" | "dislike" | null;
    created_at: Date;
}

export interface ChatSession {
    id: string;
    title: string;
    user_id: string;
    archived: boolean;
    created_at: Date;
}
