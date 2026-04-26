import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { API_URL } from "./constants";

export const TOKEN_KEY = "zamili_token";

export const authClient = createAuthClient({
    plugins: [emailOTPClient()],
    baseURL: API_URL,
    basePath: "/auth",
    fetchOptions: {
        auth: {
            type: "Bearer",
            token: () => localStorage.getItem(TOKEN_KEY) || "",
        },

        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token");

            if (authToken) {
                localStorage.setItem(TOKEN_KEY, authToken);
            }
        },
    },
});
