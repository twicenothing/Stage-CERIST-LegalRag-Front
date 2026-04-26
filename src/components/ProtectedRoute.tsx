import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "./ui/spinner";

const ProtectedRoute = () => {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
