import { useSession } from "@/lib/auth";
import { Navigate, useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { ArrowLeftIcon, UsersIcon, BarChart3Icon, FlagIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
    const { data: sessionData } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to home if not admin
    if (sessionData?.user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    const tabs = [
        {
            name: "Utilisateurs",
            href: "/dashboard/users",
            icon: UsersIcon,
        },
        {
            name: "Statistiques",
            href: "/dashboard/statistics",
            icon: BarChart3Icon,
        },
        {
            name: "Signalements",
            href: "/dashboard/reports",
            icon: FlagIcon,
        },
    ];

    return (
        <div className="min-h-screen bg-muted/20 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation Header */}
                <div className="flex items-center gap-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0 rounded-full mb-1">
                        <ArrowLeftIcon className="size-6" />
                    </Button>
                    <div className="flex items-center space-x-8">
                        {tabs.map((tab) => {
                            const isActive = location.pathname.startsWith(tab.href);
                            return (
                                <Link
                                    key={tab.name}
                                    to={tab.href}
                                    className={cn(
                                        "flex items-center gap-3 py-4 text-2xl font-bold border-b-[3px] transition-colors",
                                        isActive
                                            ? "border-primary text-foreground"
                                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                                    )}
                                >
                                    <tab.icon className={cn("size-6", !isActive && "opacity-70")} />
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Page Content */}
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
