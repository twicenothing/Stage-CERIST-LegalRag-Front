import { Navigate, Outlet } from "react-router-dom";
import { useSession, useAuthStore } from "@/lib/auth";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function isTokenValid(token: string | null) {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

const ProtectedRoute = () => {
    const { data: session } = useSession();
    const token = useAuthStore((s) => s.token);
    const clearSession = useAuthStore((s) => s.clearSession);
    const queryClient = useQueryClient();
    const toastShown = useRef(false);

    const valid = isTokenValid(token);

    useEffect(() => {
        if (!valid && !toastShown.current) {
            toast.error("Session expirée, veuillez vous connecter.");
            toastShown.current = true;
            queryClient.clear();
            clearSession();
        }
    }, [valid, clearSession, queryClient]);

    if (!valid || !session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
