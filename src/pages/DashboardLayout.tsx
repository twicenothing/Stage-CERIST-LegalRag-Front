import { useSession } from "@/lib/auth";
import { Navigate, useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { ArrowLeftIcon, UsersIcon, BarChart3Icon, FlagIcon, Settings2Icon, FileTextIcon } from "lucide-react";
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
        {
            name: "Configurations",
            href: "/dashboard/configurations",
            icon: Settings2Icon,
        },
        {
            name: "Documents",
            href: "/dashboard/documents",
            icon: FileTextIcon,
        },
    ];

    return (
        <div className="min-h-screen bg-muted/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Navigation Header */}
                <div className="flex items-start gap-4 md:items-center md:gap-6">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="shrink-0 rounded-full mb-1">
                        <ArrowLeftIcon className="size-6" />
                    </Button>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        {tabs.map((tab) => {
                            const isActive = location.pathname.startsWith(tab.href);
                            return (
                                <Link
                                    key={tab.name}
                                    to={tab.href}
                                    className={cn(
                                        "flex items-center gap-2.5 py-3 text-xl font-bold border-b-[3px] transition-colors md:text-2xl",
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
