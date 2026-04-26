import { authClient } from "../lib/auth-client";

/**
 * Sends a 6-digit OTP to the user's email for passwordless sign-in.
 */
export async function sendSignInOtp(email: string) {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
    });

    if (error) throw error;
    return data;
}

/**
 * Sign in using the email and the OTP code received.
 * If the user doesn't exist, they will be automatically registered by Better Auth.
 * The bearer token is automatically captured and persisted by auth-client.ts.
 */
export async function verifySignInOtp(email: string, otp: string) {
    const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp,
    });

    if (error) throw error;
    return data;
}
