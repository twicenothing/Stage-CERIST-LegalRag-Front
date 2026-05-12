import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/services/stats";
import { 
    UsersIcon, 
    MessageSquareIcon, 
    MessageCircleIcon, 
    ThumbsUpIcon, 
    ThumbsDownIcon,
    BarChart3Icon
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip, 
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatisticsDashboard = () => {
    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ["stats"],
        queryFn: getStats,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Spinner className="size-10" />
                <p className="text-muted-foreground animate-pulse">Chargement des statistiques...</p>
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="bg-destructive/10 text-destructive p-8 rounded-xl flex flex-col items-center justify-center text-center">
                <BarChart3Icon className="size-12 mb-4 opacity-80" />
                <h3 className="text-xl font-bold mb-2">Erreur de chargement</h3>
                <p>Impossible de récupérer les statistiques du serveur. Veuillez réessayer plus tard.</p>
            </div>
        );
    }

    const { overview, traffic } = stats;

    const summaryCards = [
        {
            title: "Total Utilisateurs",
            value: overview.total_users,
            icon: UsersIcon,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Sessions de Chat",
            value: overview.total_sessions,
            icon: MessageSquareIcon,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
        },
        {
            title: "Messages Échangés",
            value: overview.total_messages,
            icon: MessageCircleIcon,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
        {
            title: "Messages Aimés",
            value: overview.liked_messages,
            icon: ThumbsUpIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            title: "Messages Non Aimés",
            value: overview.disliked_messages,
            icon: ThumbsDownIcon,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ];

    // Formatter pour le tooltip des graphiques
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border shadow-md p-3 rounded-lg">
                    <p className="font-medium text-foreground mb-1">{label}</p>
                    <p className="text-primary font-bold">
                        {payload[0].value} message(s)
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryCards.map((card, index) => (
                    <Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.bg}`}>
                                <card.icon className={`size-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                {card.value.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Traffic Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Trafic Quotidien (30 derniers jours)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {traffic.daily && traffic.daily.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={traffic.daily} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => {
                                                // Format 'YYYY-MM-DD' to 'DD/MM'
                                                const parts = value.split('-');
                                                if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                                                return value;
                                            }}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                                        <Bar 
                                            dataKey="count" 
                                            fill="hsl(var(--primary))" 
                                            radius={[4, 4, 0, 0]} 
                                            maxBarSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Aucune donnée de trafic quotidien disponible.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Traffic Chart */}
                <Card className="border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Trafic Mensuel (12 derniers mois)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {traffic.monthly && traffic.monthly.length > 0 ? (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={traffic.monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis 
                                            dataKey="month" 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Line 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="hsl(var(--primary))" 
                                            strokeWidth={3}
                                            dot={{ fill: 'hsl(var(--background))', stroke: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Aucune donnée de trafic mensuel disponible.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
