import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth";

const ProtectedRoute = () => {
    const { data: session } = useSession();

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
