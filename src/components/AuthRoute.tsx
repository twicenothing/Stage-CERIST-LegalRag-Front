import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/lib/auth";

const AuthRoute = () => {
    const { data: session } = useSession();

    if (session) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AuthRoute;
