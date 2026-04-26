import { apiNoAuth } from "@/lib/axios";
import { SessionUser, useAuthStore } from "@/lib/auth";

interface LoginResponse {
    access_token: string;
    token_type: string;
    user_name: string;
}

interface RegisterResponse {
    message: string;
    user_id: string;
    email: string;
}

function decodeJwt<T = any>(token: string): T | null {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as T;
    } catch {
        return null;
    }
}

export async function login(email: string, password: string) {
    const { data } = await apiNoAuth.post<LoginResponse>("/users/login", {
        email,
        password,
    });

    const decoded = decodeJwt<{ user_id: string }>(data.access_token);
    const user: SessionUser = {
        id: String(decoded?.user_id ?? ""),
        email,
        name: data.user_name,
    };
    useAuthStore.getState().setSession(data.access_token, user);
    return data;
}

export async function register(payload: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}) {
    const { data } = await apiNoAuth.post<RegisterResponse>("/users/", payload);
    return data;
}

export function logout() {
    useAuthStore.getState().clearSession();
}
