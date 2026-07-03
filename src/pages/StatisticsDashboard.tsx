import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
    ActivityIcon,
    AlertTriangleIcon,
    BarChart3Icon,
    CalendarDaysIcon,
    ClockIcon,
    FileTextIcon,
    GaugeIcon,
    MessageCircleIcon,
    MessageSquareIcon,
    PercentIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
    TimerIcon,
    UserCheckIcon,
    UserPlusIcon,
    UsersIcon,
    ZapIcon,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getStats, StatsPeriodDays } from "@/services/stats";
import { cn } from "@/lib/utils";

type ChartTooltipProps = {
    active?: boolean;
    label?: string;
    payload?: Array<{ value?: number | string }>;
};

type SummaryCard = {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    bg: string;
};

const periodOptions: { label: string; value: StatsPeriodDays }[] = [
    { label: "7 jours", value: 7 },
    { label: "30 jours", value: 30 },
    { label: "90 jours", value: 90 },
    { label: "365 jours", value: 365 },
];

const numberFormatter = new Intl.NumberFormat("fr-FR");
const secondsFormatter = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
});

const formatNumber = (value: number | null | undefined) =>
    numberFormatter.format(value ?? 0);

const formatPercent = (value: number | null | undefined) =>
    `${numberFormatter.format(value ?? 0)}%`;

const formatSeconds = (value: number | null | undefined) =>
    `${secondsFormatter.format(value ?? 0)}s`;

const greenTone = {
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
};

const warningTone = {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
};

const dangerTone = {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
};

const neutralTone = {
    color: "text-slate-600 dark:text-slate-300",
    bg: "bg-slate-500/10",
};

const getAvgResponseTone = (seconds: number) => {
    if (seconds < 20) return greenTone;
    if (seconds <= 60) return warningTone;
    return dangerTone;
};

const getP95ResponseTone = (seconds: number) =>
    seconds > 90 ? dangerTone : greenTone;

const getNoAnswerTone = (rate: number) =>
    rate > 25 ? warningTone : greenTone;

const getSatisfactionTone = (rate: number) =>
    rate < 70 ? warningTone : greenTone;

const getSlowQueriesTone = (count: number) =>
    count > 0 ? warningTone : greenTone;

const formatDateTime = (value: string | null) => {
    if (!value) return "Non disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const formatPeriodDate = (value: string | undefined) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-xl">
            <p className="mb-1 text-sm font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">
                    {formatNumber(Number(payload[0].value ?? 0))}
                </span>{" "}
                message(s)
            </p>
        </div>
    );
};

const LatencyTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-xl">
            <p className="mb-1 text-sm font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">
                Latence moyenne :{" "}
                <span className="font-bold text-primary">
                    {formatSeconds(Number(payload[0].value ?? 0))}
                </span>
            </p>
        </div>
    );
};

const EmptyChart = ({ label }: { label: string }) => (
    <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed bg-muted/20 text-center text-sm text-muted-foreground">
        {label}
    </div>
);

const SectionHeader = ({
    icon: Icon,
    label,
    title,
    description,
}: {
    icon: LucideIcon;
    label: string;
    title: string;
    description: string;
}) => (
    <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
            <Icon className="size-4" />
            {label}
        </div>
        <h2 className="mt-2 text-xl font-bold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
);

const MetricCard = ({ card }: { card: SummaryCard }) => {
    const Icon = card.icon;

    return (
        <Card className="border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                    {card.title}
                </CardTitle>
                <div className={cn("rounded-lg p-2", card.bg)}>
                    <Icon className={cn("size-4", card.color)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">
                    {card.value}
                </div>
            </CardContent>
        </Card>
    );
};

const StatisticsDashboard = () => {
    const [days, setDays] = useState<StatsPeriodDays>(30);

    const {
        data: stats,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["stats", days],
        queryFn: () => getStats(days),
        placeholderData: keepPreviousData,
    });

    const cardGroups = useMemo(() => {
        if (!stats) {
            return {
                activity: [] as SummaryCard[],
                health: [] as SummaryCard[],
                feedback: [] as SummaryCard[],
            };
        }

        const { overview, feedback, rag_quality, health } = stats;
        const avgResponseTone = getAvgResponseTone(health.avg_total_duration_seconds);
        const p95ResponseTone = getP95ResponseTone(health.p95_total_duration_seconds);
        const firstTokenTone = getAvgResponseTone(health.avg_time_to_first_token_seconds);
        const slowQueriesTone = getSlowQueriesTone(health.slow_queries_count);
        const noAnswerTone = getNoAnswerTone(rag_quality.no_answer_rate);
        const satisfactionTone = getSatisfactionTone(feedback.satisfaction_rate);

        return {
            activity: [
                {
                    title: "Total utilisateurs",
                    value: formatNumber(overview.total_users),
                    icon: UsersIcon,
                    color: "text-blue-600 dark:text-blue-400",
                    bg: "bg-blue-500/10",
                },
                {
                    title: "Nouveaux utilisateurs",
                    value: formatNumber(overview.new_users_period),
                    icon: UserPlusIcon,
                    color: "text-emerald-600 dark:text-emerald-400",
                    bg: "bg-emerald-500/10",
                },
                {
                    title: "Utilisateurs actifs",
                    value: formatNumber(overview.active_users_period),
                    icon: UserCheckIcon,
                    color: "text-cyan-600 dark:text-cyan-400",
                    bg: "bg-cyan-500/10",
                },
                {
                    title: "Total sessions",
                    value: formatNumber(overview.total_sessions),
                    icon: MessageSquareIcon,
                    color: "text-indigo-600 dark:text-indigo-400",
                    bg: "bg-indigo-500/10",
                },
                {
                    title: "Sessions période",
                    value: formatNumber(overview.sessions_period),
                    icon: CalendarDaysIcon,
                    color: "text-violet-600 dark:text-violet-400",
                    bg: "bg-violet-500/10",
                },
                {
                    title: "Total messages",
                    value: formatNumber(overview.total_messages),
                    icon: MessageCircleIcon,
                    color: "text-sky-600 dark:text-sky-400",
                    bg: "bg-sky-500/10",
                },
                {
                    title: "Messages période",
                    value: formatNumber(overview.messages_period),
                    icon: ActivityIcon,
                    color: "text-teal-600 dark:text-teal-400",
                    bg: "bg-teal-500/10",
                },
                {
                    title: "Moy. messages/session",
                    value: formatNumber(overview.avg_messages_per_session),
                    icon: GaugeIcon,
                    color: "text-amber-700 dark:text-amber-400",
                    bg: "bg-amber-500/10",
                },
            ],
            health: [
                {
                    title: "Temps réponse moyen",
                    value: formatSeconds(health.avg_total_duration_seconds),
                    icon: TimerIcon,
                    ...avgResponseTone,
                },
                {
                    title: "P95 réponse",
                    value: formatSeconds(health.p95_total_duration_seconds),
                    icon: ClockIcon,
                    ...p95ResponseTone,
                },
                {
                    title: "1er token moyen",
                    value: formatSeconds(health.avg_time_to_first_token_seconds),
                    icon: ZapIcon,
                    ...firstTokenTone,
                },
                {
                    title: "Requêtes lentes",
                    value: `${formatNumber(health.slow_queries_count)} (${formatPercent(health.slow_queries_rate)})`,
                    icon: AlertTriangleIcon,
                    ...slowQueriesTone,
                },
                {
                    title: "Sources moyennes",
                    value: formatNumber(health.avg_source_count),
                    icon: FileTextIcon,
                    ...neutralTone,
                },
            ],
            feedback: [
                {
                    title: "Likes",
                    value: formatNumber(feedback.liked_messages),
                    icon: ThumbsUpIcon,
                    color: "text-green-600 dark:text-green-400",
                    bg: "bg-green-500/10",
                },
                {
                    title: "Dislikes",
                    value: formatNumber(feedback.disliked_messages),
                    icon: ThumbsDownIcon,
                    color: "text-rose-600 dark:text-rose-400",
                    bg: "bg-rose-500/10",
                },
                {
                    title: "Satisfaction",
                    value: formatPercent(feedback.satisfaction_rate),
                    icon: PercentIcon,
                    ...satisfactionTone,
                },
                {
                    title: "Sans réponse",
                    value: formatPercent(rag_quality.no_answer_rate),
                    icon: AlertTriangleIcon,
                    ...noAnswerTone,
                },
            ],
        };
    }, [stats]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
                <Spinner className="size-10" />
                <p className="animate-pulse text-muted-foreground">
                    Chargement des statistiques...
                </p>
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
                <BarChart3Icon className="mb-4 size-12 opacity-80" />
                <h3 className="mb-2 text-xl font-bold">Erreur de chargement</h3>
                <p>Impossible de récupérer les statistiques du serveur. Veuillez réessayer plus tard.</p>
            </div>
        );
    }

    const { period, feedback, traffic, health } = stats;
    const periodFrom = formatPeriodDate(period.from);
    const periodTo = formatPeriodDate(period.to);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <section className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                        <BarChart3Icon className="size-4" />
                        Statistiques admin
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-foreground">
                        Vue d'ensemble de l'activité
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Période analysée : {periodFrom} - {periodTo}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isFetching && (
                        <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                            <Spinner className="size-4" />
                            Mise à jour
                        </span>
                    )}
                    <Select
                        value={String(days)}
                        onValueChange={(value) => setDays(Number(value) as StatsPeriodDays)}
                    >
                        <SelectTrigger className="min-w-36 bg-background">
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            {periodOptions.map((option) => (
                                <SelectItem key={option.value} value={String(option.value)}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </section>

            <section className="space-y-4">
                <SectionHeader
                    description="Utilisateurs, sessions, messages et évolution du trafic."
                    icon={UsersIcon}
                    label="Activité"
                    title="Utilisateurs et activité"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cardGroups.activity.map((card) => (
                        <MetricCard key={card.title} card={card} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Trafic quotidien</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Messages par jour sur {period.days} jours
                                </p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {formatNumber(traffic.daily.reduce((sum, item) => sum + item.count, 0))}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {traffic.daily.length > 0 ? (
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={traffic.daily} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            axisLine={false}
                                            dataKey="date"
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                            tickLine={false}
                                            tickFormatter={(value: string) => {
                                                const parts = value.split("-");
                                                return parts.length === 3 ? `${parts[2]}/${parts[1]}` : value;
                                            }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            axisLine={false}
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                            tickLine={false}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
                                        <Bar dataKey="count" fill="var(--primary)" maxBarSize={34} radius={[7, 7, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart label="Aucune donnée de trafic quotidien disponible." />
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <CardTitle>Trafic mensuel</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Messages par mois sur les 12 derniers mois
                                </p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                {formatNumber(traffic.monthly.reduce((sum, item) => sum + item.count, 0))}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {traffic.monthly.length > 0 ? (
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={traffic.monthly} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            axisLine={false}
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            axisLine={false}
                                            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                            tickLine={false}
                                        />
                                        <RechartsTooltip content={<CustomTooltip />} />
                                        <Line
                                            activeDot={{ r: 6 }}
                                            dataKey="count"
                                            dot={{ fill: "var(--background)", r: 4, stroke: "var(--primary)", strokeWidth: 2 }}
                                            stroke="var(--primary)"
                                            strokeWidth={3}
                                            type="monotone"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <EmptyChart label="Aucune donnée de trafic mensuel disponible." />
                        )}
                    </CardContent>
                </Card>
                </div>
            </section>

            <section className="space-y-4">
                <SectionHeader
                    description="Temps de réponse, latence quotidienne et requêtes lentes."
                    icon={TimerIcon}
                    label="Santé"
                    title="Santé et performance"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {cardGroups.health.map((card) => (
                        <MetricCard key={card.title} card={card} />
                    ))}
                </div>

                <section className="rounded-lg border bg-card shadow-sm">
                <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Latence quotidienne</h2>
                        <p className="text-sm text-muted-foreground">
                            Temps de réponse moyen par jour sur la période sélectionnée.
                        </p>
                    </div>
                    <span className={cn(
                        "w-fit rounded-full px-3 py-1 text-xs font-semibold",
                        getAvgResponseTone(health.avg_total_duration_seconds).bg,
                        getAvgResponseTone(health.avg_total_duration_seconds).color
                    )}>
                        Moyenne {formatSeconds(health.avg_total_duration_seconds)}
                    </span>
                </div>
                <div className="p-5">
                    {health.daily_latency.length > 0 ? (
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={health.daily_latency} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
                                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        axisLine={false}
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                        tickLine={false}
                                        tickFormatter={(value: string) => {
                                            const parts = value.split("-");
                                            return parts.length === 3 ? `${parts[2]}/${parts[1]}` : value;
                                        }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                                        tickFormatter={(value) => formatSeconds(Number(value))}
                                        tickLine={false}
                                    />
                                    <RechartsTooltip content={<LatencyTooltip />} />
                                    <Line
                                        activeDot={{ r: 6 }}
                                        dataKey="avg_total_duration_seconds"
                                        dot={{ fill: "var(--background)", r: 4, stroke: "var(--primary)", strokeWidth: 2 }}
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        type="monotone"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <EmptyChart label="Aucune donnée de latence quotidienne disponible." />
                    )}
                </div>
            </section>

                <section className="rounded-lg border bg-card shadow-sm">
                <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Requêtes lentes récentes</h2>
                        <p className="text-sm text-muted-foreground">
                            Dernières requêtes dont le temps de réponse dépasse le seuil serveur.
                        </p>
                    </div>
                    <span className={cn(
                        "w-fit rounded-full px-3 py-1 text-xs font-semibold",
                        getSlowQueriesTone(health.slow_queries_count).bg,
                        getSlowQueriesTone(health.slow_queries_count).color
                    )}>
                        {formatNumber(health.slow_queries_count)} lente(s)
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1080px] text-left text-sm">
                        <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3 font-semibold">created_at</th>
                                <th className="px-5 py-3 font-semibold">total_duration_seconds</th>
                                <th className="px-5 py-3 font-semibold">time_to_first_token_seconds</th>
                                <th className="px-5 py-3 font-semibold">source_count</th>
                                <th className="px-5 py-3 font-semibold">answer_chars</th>
                                <th className="px-5 py-3 font-semibold">refused</th>
                                <th className="px-5 py-3 font-semibold">model_id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {health.recent_slow_queries.length > 0 ? (
                                health.recent_slow_queries.map((query, index) => (
                                    <tr
                                        key={`${query.created_at ?? "slow-query"}-${query.model_id ?? "model"}-${index}`}
                                        className="border-t transition-colors hover:bg-muted/25"
                                    >
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatDateTime(query.created_at)}
                                        </td>
                                        <td className="px-5 py-4 font-mono font-medium">
                                            {formatSeconds(query.total_duration_seconds)}
                                        </td>
                                        <td className="px-5 py-4 font-mono font-medium">
                                            {formatSeconds(query.time_to_first_token_seconds)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {formatNumber(query.source_count)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {formatNumber(query.answer_chars)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={cn(
                                                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                                query.refused
                                                    ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                    : "bg-green-500/10 text-green-600 dark:text-green-400"
                                            )}>
                                                {query.refused ? "true" : "false"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="break-all font-mono text-xs text-foreground">
                                                {query.model_id || "Non disponible"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-5 py-10 text-center text-muted-foreground" colSpan={7}>
                                        Aucune requête lente récente pour cette période.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            </section>

            <section className="space-y-4">
                <SectionHeader
                    description="Retours utilisateurs, satisfaction et réponses sans résultat."
                    icon={ThumbsDownIcon}
                    label="Feedback"
                    title="Messages problématiques"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cardGroups.feedback.map((card) => (
                        <MetricCard key={card.title} card={card} />
                    ))}
                </div>

                <section className="rounded-lg border bg-card shadow-sm">
                <div className="flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">Messages les plus signalés négativement</h2>
                        <p className="text-sm text-muted-foreground">
                            Les 5 derniers messages avec un feedback négatif.
                        </p>
                    </div>
                    <span className="w-fit rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        {formatNumber(feedback.disliked_messages)} dislike(s)
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-5 py-3 font-semibold">Preview</th>
                                <th className="w-56 px-5 py-3 font-semibold">Created at</th>
                                <th className="w-32 px-5 py-3 font-semibold">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedback.most_disliked_messages.length > 0 ? (
                                feedback.most_disliked_messages.map((message, index) => (
                                    <tr
                                        key={message.id ?? `${message.created_at}-${index}`}
                                        className="border-t transition-colors hover:bg-muted/25"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="line-clamp-2 max-w-3xl text-foreground">
                                                {message.preview || "Aucun aperçu disponible"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {formatDateTime(message.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                                {message.feedback || "dislike"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-5 py-10 text-center text-muted-foreground" colSpan={3}>
                                        Aucun message négatif pour cette période.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </section>
            </section>
        </div>
    );
};

export default StatisticsDashboard;
