import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
    AlertTriangleIcon,
    BotIcon,
    CheckCircle2Icon,
    DatabaseIcon,
    EyeIcon,
    FolderIcon,
    GaugeIcon,
    LockKeyholeIcon,
    RefreshCwIcon,
    SearchIcon,
    Settings2Icon,
    ShieldCheckIcon,
    SlidersHorizontalIcon,
    XCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
    AppConfigResponse,
    getAppConfig,
} from "@/services/app-config";

type ConfigValue = string | number | boolean | null | undefined;

type ConfigItem = {
    label: string;
    value: ConfigValue;
    hint?: string;
};

type ConfigSection = {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accent: string;
    iconBackground: string;
    items: ConfigItem[];
};

const numberFormatter = new Intl.NumberFormat("fr-FR");

const formatNumber = (value: number | null | undefined) =>
    numberFormatter.format(value ?? 0);

const formatDuration = (minutes: number | null | undefined) => {
    const safeMinutes = minutes ?? 0;
    const days = Math.floor(safeMinutes / 1440);

    if (days >= 1) {
        return `${formatNumber(safeMinutes)} min (${formatNumber(days)} jour${days > 1 ? "s" : ""})`;
    }

    return `${formatNumber(safeMinutes)} min`;
};

const renderValue = (value: ConfigValue) => {
    if (typeof value === "boolean") {
        return (
            <Badge
                className={cn(
                    "h-6 px-2.5",
                    value
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "bg-muted text-muted-foreground"
                )}
                variant="outline"
            >
                {value ? "Activé" : "Désactivé"}
            </Badge>
        );
    }

    if (typeof value === "number") {
        return (
            <span className="font-mono text-sm font-semibold text-foreground">
                {formatNumber(value)}
            </span>
        );
    }

    if (!value) {
        return <span className="text-muted-foreground">Non configuré</span>;
    }

    return (
        <span className="break-all font-mono text-sm font-medium text-foreground">
            {value}
        </span>
    );
};

const buildSections = (config: AppConfigResponse): ConfigSection[] => [
    {
        id: "rag",
        title: "RAG",
        description: "Base documentaire, modèles et service LLM utilisés par JurIA.",
        icon: DatabaseIcon,
        accent: "text-blue-600 dark:text-blue-400",
        iconBackground: "bg-blue-500/10",
        items: [
            { label: "Collection", value: config.rag.collection_name },
            { label: "Chemin Chroma", value: config.rag.chroma_path },
            { label: "Modèle d'embedding", value: config.rag.embedding_model },
            { label: "Modèle de reranking", value: config.rag.reranker_model },
            { label: "Modèle LLM", value: config.rag.llm_model },
            { label: "Hôte Ollama", value: config.rag.ollama_host },
        ],
    },
    {
        id: "generation",
        title: "Génération",
        description: "Paramètres qui contrôlent la longueur, le contexte et la créativité.",
        icon: SlidersHorizontalIcon,
        accent: "text-violet-600 dark:text-violet-400",
        iconBackground: "bg-violet-500/10",
        items: [
            { label: "Contexte RAG", value: config.generation.rag_num_ctx, hint: "tokens" },
            { label: "Réponse max", value: config.generation.rag_num_predict, hint: "tokens" },
            { label: "Température", value: config.generation.rag_temperature },
            { label: "Mode réflexion", value: config.generation.rag_think },
        ],
    },
    {
        id: "retrieval",
        title: "Récupération",
        description: "Nombre de documents récupérés puis rerankés avant la réponse.",
        icon: SearchIcon,
        accent: "text-emerald-600 dark:text-emerald-400",
        iconBackground: "bg-emerald-500/10",
        items: [
            { label: "Top K récupération", value: config.retrieval.rag_top_k_retrieve },
            { label: "Top K reranking", value: config.retrieval.rag_top_k_rerank },
        ],
    },
    {
        id: "vision",
        title: "Vision",
        description: "Configuration de lecture visuelle des PDF et des tableaux.",
        icon: EyeIcon,
        accent: "text-cyan-600 dark:text-cyan-400",
        iconBackground: "bg-cyan-500/10",
        items: [
            { label: "Modèle vision", value: config.vision.vision_model },
            { label: "Modèle tableaux", value: config.vision.vision_table_model },
            { label: "Vision PDF tableaux", value: config.vision.use_pdf_vision_for_tables },
            { label: "Pages max", value: config.vision.vision_max_pages },
            { label: "Zoom page", value: config.vision.vision_page_zoom },
            { label: "Contexte vision", value: config.vision.vision_num_ctx, hint: "tokens" },
            { label: "Prédiction vision", value: config.vision.vision_num_predict, hint: "tokens" },
        ],
    },
    {
        id: "documents",
        title: "Documents",
        description: "Emplacements utilisés pour les PDF actifs et archivés.",
        icon: FolderIcon,
        accent: "text-amber-700 dark:text-amber-400",
        iconBackground: "bg-amber-500/10",
        items: [
            { label: "PDF actifs", value: config.documents.pdf_path },
            { label: "PDF anciens", value: config.documents.pdf_old_path },
        ],
    },
    {
        id: "security",
        title: "Sécurité",
        description: "Informations non sensibles sur la configuration d'authentification.",
        icon: ShieldCheckIcon,
        accent: "text-rose-600 dark:text-rose-400",
        iconBackground: "bg-rose-500/10",
        items: [
            { label: "Algorithme JWT", value: config.security.algorithm },
            {
                label: "Expiration du token",
                value: formatDuration(config.security.access_token_expire_minutes),
            },
            { label: "Clé secrète configurée", value: config.security.secret_key_configured },
        ],
    },
];

const ConfigRow = ({ item }: { item: ConfigItem }) => (
    <div className="group grid gap-2 border-b border-border/60 px-5 py-4 last:border-b-0 sm:grid-cols-[220px_1fr] sm:items-center">
        <div>
            <p className="text-sm font-medium text-foreground">{item.label}</p>
            {item.hint && (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
            )}
        </div>
        <div className="rounded-md bg-muted/30 px-3 py-2 transition-colors group-hover:bg-muted/45">
            {renderValue(item.value)}
        </div>
    </div>
);

const ConfigSectionCard = ({ section }: { section: ConfigSection }) => {
    const Icon = section.icon;

    return (
        <Card className="border-border/60 shadow-sm">
            <CardHeader className="border-b">
                <div className="flex items-start gap-3">
                    <div className={cn("rounded-lg p-2.5", section.iconBackground)}>
                        <Icon className={cn("size-5", section.accent)} />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {section.description}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {section.items.map((item) => (
                    <ConfigRow key={item.label} item={item} />
                ))}
            </CardContent>
        </Card>
    );
};

const ConfigurationsDashboard = () => {
    const [selectedSectionId, setSelectedSectionId] = useState("rag");
    const {
        data: config,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["app-config"],
        queryFn: getAppConfig,
    });

    const sections = useMemo(
        () => (config ? buildSections(config) : []),
        [config]
    );

    const highlights = useMemo(() => {
        if (!config) return [];

        return [
            {
                label: "Collection active",
                value: config.rag.collection_name,
                icon: DatabaseIcon,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-500/10",
            },
            {
                label: "Modèle LLM",
                value: config.rag.llm_model,
                icon: BotIcon,
                color: "text-violet-600 dark:text-violet-400",
                bg: "bg-violet-500/10",
            },
            {
                label: "Contexte RAG",
                value: `${formatNumber(config.generation.rag_num_ctx)} tokens`,
                icon: GaugeIcon,
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-500/10",
            },
            {
                label: "Clé secrète",
                value: config.security.secret_key_configured ? "Configurée" : "Absente",
                icon: config.security.secret_key_configured ? CheckCircle2Icon : AlertTriangleIcon,
                color: config.security.secret_key_configured
                    ? "text-green-600 dark:text-green-400"
                    : "text-orange-600 dark:text-orange-400",
                bg: config.security.secret_key_configured
                    ? "bg-green-500/10"
                    : "bg-orange-500/10",
            },
        ];
    }, [config]);

    const selectedSection =
        sections.find((section) => section.id === selectedSectionId) ?? sections[0] ?? null;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
                <Spinner className="size-10" />
                <p className="animate-pulse text-muted-foreground">
                    Chargement des configurations...
                </p>
            </div>
        );
    }

    if (isError || !config) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
                <XCircleIcon className="mb-4 size-12 opacity-80" />
                <h3 className="mb-2 text-xl font-bold">Erreur de chargement</h3>
                <p>Impossible de récupérer la configuration de l'application.</p>
                <Button className="mt-5" variant="outline" onClick={() => refetch()}>
                    Réessayer
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <section className="flex flex-col gap-4 rounded-lg border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                        <Settings2Icon className="size-4" />
                        Configurations admin
                    </div>
                    <h1 className="mt-2 text-2xl font-bold text-foreground">
                        Configuration actuelle de l'application
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Lecture seule des paramètres runtime non sensibles exposés par le backend.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge
                        className="h-8 gap-2 border-primary/20 bg-primary/10 px-3 text-primary"
                        variant="outline"
                    >
                        <LockKeyholeIcon className="size-3.5" />
                        Secrets masqués
                    </Badge>
                    <Button
                        className="gap-2"
                        disabled={isFetching}
                        variant="outline"
                        onClick={() => refetch()}
                    >
                        {isFetching ? (
                            <Spinner className="size-4" />
                        ) : (
                            <RefreshCwIcon className="size-4" />
                        )}
                        Actualiser
                    </Button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={item.label}
                            className="border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                                <div className={cn("rounded-lg p-2", item.bg)}>
                                    <Icon className={cn("size-4", item.color)} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="line-clamp-2 break-all text-xl font-bold text-foreground">
                                    {item.value}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="space-y-5">
                <div className="grid grid-cols-2 gap-2 rounded-lg border bg-card p-2 shadow-sm md:grid-cols-3 xl:grid-cols-6">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isSelected = section.id === selectedSection?.id;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                aria-pressed={isSelected}
                                className={cn(
                                    "flex h-11 min-w-0 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors",
                                    isSelected
                                        ? "border-primary/30 bg-primary/10 text-primary"
                                        : "border-transparent bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                )}
                                onClick={() => setSelectedSectionId(section.id)}
                            >
                                <Icon className="size-4 shrink-0" />
                                <span className="truncate">{section.title}</span>
                            </button>
                        );
                    })}
                </div>

                {selectedSection && <ConfigSectionCard section={selectedSection} />}
            </section>
        </div>
    );
};

export default ConfigurationsDashboard;
