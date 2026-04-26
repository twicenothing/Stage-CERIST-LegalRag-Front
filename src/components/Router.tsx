import { Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import LoginPage from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";

import Settings from "@/pages/Settings";
import Pricing from "@/pages/Pricing";
import Onboarding from "@/pages/Onboarding";
import OnboardingGuard from "./OnboardingGuard";
import ChatPage from "@/pages/Chat";

const Router = () => {
    return (
        <Routes>
            <Route element={<OnboardingGuard />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route element={<ProtectedRoute />}></Route>
                <Route element={<AuthRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Route>
            {/* Catch all route (404) */}
            <Route
                path="*"
                element={
                    <div className="text-3xl font-bold text-center p-4">
                        Not Found
                    </div>
                }
            />
        </Routes>
    );
};

export default Router;
