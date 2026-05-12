import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    first_name?: string;
    last_name?: string;
    role?: string;
}

interface AuthState {
    token: string | null;
    user: SessionUser | null;
    setSession: (token: string, user: SessionUser) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setSession: (token, user) => set({ token, user }),
            clearSession: () => set({ token: null, user: null }),
        }),
        { name: "zamili_auth" },
    ),
);

export function getToken() {
    return useAuthStore.getState().token;
}

export function useSession() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    return {
        data: user && token ? { user } : null,
        isPending: false,
    };
}
