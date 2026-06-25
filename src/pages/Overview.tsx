import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
    ArrowRightIcon,
    BadgeCheckIcon,
    BookOpenCheckIcon,
    CheckCircle2Icon,
    FileSearchIcon,
    FlagIcon,
    MessageSquareTextIcon,
    SearchIcon,
    ShieldCheckIcon,
    ThumbsDownIcon,
    ThumbsUpIcon,
} from "lucide-react";
import { PageHeader, PageContent } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featureCards = [
    {
        title: "Recherche en langage naturel",
        description:
            "Posez votre question comme vous la formuleriez à un collègue, sans syntaxe spéciale.",
        icon: SearchIcon,
        accent: "text-primary bg-primary/10 ring-primary/20",
    },
    {
        title: "Sources officielles",
        description:
            "Les réponses s'appuient sur les textes du Journal Officiel et restent reliées aux documents consultables.",
        icon: FileSearchIcon,
        accent: "text-blue-600 bg-blue-500/10 ring-blue-500/20 dark:text-blue-400",
    },
    {
        title: "Lecture assistée",
        description:
            "Les scores de pertinence vous aident à repérer rapidement les documents les plus utiles.",
        icon: BadgeCheckIcon,
        accent: "text-amber-700 bg-amber-500/10 ring-amber-500/20 dark:text-amber-400",
    },
];

const workflowSteps = [
    {
        title: "Cadrez la question",
        description:
            "Indiquez le contexte, le secteur concerné et les termes juridiques déjà connus.",
    },
    {
        title: "Lisez la synthèse",
        description:
            "Utilisez la réponse pour comprendre l'idée générale, puis vérifiez les passages importants.",
    },
    {
        title: "Ouvrez les sources",
        description:
            "Cliquez sur les PDF et contrôlez le texte original avant de vous appuyer sur une réponse.",
    },
];

const bestPractices = [
    "Posez une seule question à la fois pour éviter les réponses trop larges.",
    "Ajoutez les numéros de loi, années ou articles quand vous les connaissez.",
    "Reformulez avec d'autres termes si la première réponse manque de précision.",
    "Utilisez les boutons d'avis et le signalement pour améliorer la qualité des réponses.",
];

const feedbackActions = [
    {
        label: "J'aime",
        description: "Marquez les réponses utiles et fiables.",
        icon: ThumbsUpIcon,
    },
    {
        label: "Je n'aime pas",
        description: "Indiquez qu'une réponse ne répond pas au besoin.",
        icon: ThumbsDownIcon,
    },
    {
        label: "Signaler",
        description: "Remontez une hallucination, une loi obsolète ou une source incorrecte.",
        icon: FlagIcon,
    },
];

export default function Overview() {
    return (
        <div className="min-h-screen bg-background pb-24">
            <PageHeader
                title="JurIA"
                subtitle="Guide pratique"
                showBackButton
            />

            <PageContent maxWidth="5xl" className="space-y-8 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]"
                >
                    <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
                        <div className="flex max-w-3xl flex-col gap-5">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                                <BookOpenCheckIcon className="size-6" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="max-w-2xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                                    Un assistant juridique pour explorer les textes algériens plus vite.
                                </h2>
                                <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                                    JurIA analyse votre question, recherche les passages pertinents
                                    dans les documents disponibles, puis prépare une synthèse claire avec des
                                    sources vérifiables.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <Button asChild>
                                    <Link to="/">
                                        Poser une question
                                        <ArrowRightIcon className="size-4" />
                                    </Link>
                                </Button>
                                <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                                    <ShieldCheckIcon className="size-4 text-primary" />
                                    Sources consultables après chaque réponse
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-lg border bg-muted/30 p-6 shadow-sm">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs font-semibold uppercase text-primary">
                                    À retenir
                                </p>
                                <h3 className="mt-2 text-xl font-bold text-foreground">
                                    La réponse est un point de départ.
                                </h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Consultez les documents liés à la fin de la réponse.",
                                    "Comparez le score de pertinence entre plusieurs sources.",
                                    "Demandez une reformulation si le contexte n'est pas assez précis.",
                                ].map((item) => (
                                    <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </motion.div>

                <section className="grid gap-4 md:grid-cols-3">
                    {featureCards.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.06 * index, duration: 0.3, ease: "easeOut" }}
                                className="rounded-lg border bg-card p-5 shadow-sm"
                            >
                                <div className={cn("mb-4 flex size-10 items-center justify-center rounded-lg ring-1", feature.accent)}>
                                    <Icon className="size-5" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </section>

                <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400">
                                <MessageSquareTextIcon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                    Exemple de requête
                                </p>
                                <h2 className="text-xl font-bold text-foreground">
                                    Plus le contexte est clair, meilleure est la recherche.
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                                <p className="text-sm font-semibold text-destructive">Moins efficace</p>
                                <p className="mt-2 text-sm italic text-foreground">"Congé maternité"</p>
                            </div>
                            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                                <p className="text-sm font-semibold text-primary">Plus efficace</p>
                                <p className="mt-2 text-sm italic text-foreground">
                                    "Quelle est la durée légale du congé maternité pour une employée
                                    dans le secteur privé ?"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                                <BookOpenCheckIcon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                    Méthode simple
                                </p>
                                <h2 className="text-xl font-bold text-foreground">
                                    Trois étapes pour exploiter une réponse
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {workflowSteps.map((step, index) => (
                                <div key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-3">
                                    <div className="flex size-9 items-center justify-center rounded-lg border bg-muted text-sm font-bold text-foreground">
                                        {index + 1}
                                    </div>
                                    <div className="border-b pb-4 last:border-b-0 last:pb-0">
                                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-xs font-semibold uppercase text-primary">Bonnes pratiques</p>
                            <h2 className="mt-2 text-2xl font-bold text-foreground">
                                Quelques habitudes qui améliorent les résultats.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                L'assistant gagne en précision quand votre demande donne un cadre clair et
                                vérifiable.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {bestPractices.map((practice) => (
                                <div key={practice} className="flex gap-3 rounded-lg border bg-muted/25 p-4">
                                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                                    <p className="text-sm leading-6 text-muted-foreground">{practice}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-lg border bg-muted/30 p-6 shadow-sm">
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-xs font-semibold uppercase text-primary">Qualité</p>
                            <h2 className="mt-2 text-2xl font-bold text-foreground">
                                Vos retours rendent l'assistant plus fiable.
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">
                                Les actions sous chaque réponse aident l'équipe à repérer les réponses utiles,
                                les erreurs et les sources à revoir.
                            </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {feedbackActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <div key={action.label} className="rounded-lg border bg-card p-4">
                                        <Icon className="size-5 text-primary" />
                                        <h3 className="mt-3 font-semibold text-foreground">{action.label}</h3>
                                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                            {action.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </PageContent>
        </div>
    );
}
