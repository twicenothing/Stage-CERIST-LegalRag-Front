import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth";

const OnboardingGuard = () => {
    const { data: session } = useSession();
    const location = useLocation();

    if (location.pathname === "/onboarding") {
        if (!session) return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default OnboardingGuard;
