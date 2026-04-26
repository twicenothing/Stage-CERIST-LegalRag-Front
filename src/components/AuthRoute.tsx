import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useRef } from "react";

const AuthRoute = () => {
    const { data: session, isPending } = authClient.useSession();
    const hasResolved = useRef(false);

    if (isPending && !hasResolved.current) return null;
    hasResolved.current = true;

    if (session) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthRoute;
