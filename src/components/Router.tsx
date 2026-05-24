import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import Settings from "@/pages/Settings";
import ChatPage from "@/pages/Chat";
import Overview from "@/pages/Overview";
import DashboardLayout from "@/pages/DashboardLayout";
import UsersDashboard from "@/pages/UsersDashboard";
import StatisticsDashboard from "@/pages/StatisticsDashboard";
import ReportsDashboard from "@/pages/ReportsDashboard";
import { Navigate } from "react-router-dom";

const Router = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<ChatPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/users" replace />} />
          <Route path="users" element={<UsersDashboard />} />
          <Route path="statistics" element={<StatisticsDashboard />} />
          <Route path="reports" element={<ReportsDashboard />} />
        </Route>
      </Route>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      {/* Catch all route (404) */}
      <Route
        path="*"
        element={
          <div className="text-3xl font-bold text-center p-4">Not Found</div>
        }
      />
    </Routes>
  );
};

export default Router;
