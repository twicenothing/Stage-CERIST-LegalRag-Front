import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";

const OnboardingGuard = () => {
    const { data: session, isPending } = authClient.useSession();
    const location = useLocation();

    if (isPending) return null;

    const isMissingName = session && !session.user.name;

    // Redirect to onboarding if they are logged in but missing a name
    if (isMissingName && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // Prevent completed users or guests from seeing onboarding
    if (location.pathname === "/onboarding") {
        if (!session) return <Navigate to="/login" replace />;
        if (!isMissingName) return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default OnboardingGuard;
