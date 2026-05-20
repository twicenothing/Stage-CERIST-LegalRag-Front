import { motion } from "motion/react";
import { PageHeader, PageContent } from "@/components/layout/PageLayout";

export default function Overview() {
    return (
        <div className="min-h-screen pb-28">
            <PageHeader
                title="Bienvenue sur Légale DjazairIA 🇩🇿"
                subtitle="Guide d'utilisation et bonnes pratiques"
                showBackButton
            />

            <PageContent maxWidth="3xl" className="space-y-12 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-12"
                >
                    {/* Section 1 */}
                    <section className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">À propos de l'assistant</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">Qu'est-ce que Légale DjazairIA ?</h3>
                                <p>
                                    Légale DjazairIA est votre assistant juridique intelligent. Conçu pour simplifier l'accès à l'information légale algérienne, il vous permet d'interroger les textes du Journal Officiel en langage naturel.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">Comment ça marche ?</h3>
                                <p>
                                    Contrairement à un simple moteur de recherche, cet outil s'appuie sur l'Intelligence Artificielle pour analyser votre question, rechercher les articles de loi pertinents dans notre base de données sécurisée, et générer une réponse de synthèse claire. Chaque information fournie est systématiquement accompagnée de sa source officielle pour garantir une fiabilité et une transparence totales.
                                </p>
                                <p className="mt-2 text-primary font-medium">
                                    À savoir : Chaque réponse est suivie d'un pourcentage de pertinence indiquant le degré de certitude de l'IA quant à la provenance de l'information pour chaque document affiché. De plus, les documents PDF sont cliquables pour vous permettre de consulter directement la source en question.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Bonnes pratiques</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Comment formuler vos questions pour obtenir les meilleurs résultats ?</h3>
                                <p>
                                    Pour exploiter tout le potentiel de l'assistant, voici quelques conseils lors de la rédaction de vos requêtes :
                                </p>
                                
                                <ul className="space-y-4 pl-2">
                                    <li className="flex flex-col gap-1">
                                        <div className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <strong className="text-foreground">Soyez précis et contextualisez :</strong>
                                        </div>
                                        <span className="pl-5">Plus vous donnez de détails, meilleure sera la réponse.</span>
                                        <div className="pl-5 mt-2 flex flex-col sm:flex-row gap-2">
                                            <div className="flex flex-col border border-destructive/20 bg-destructive/5 rounded-md p-3 text-sm flex-1">
                                                <span className="font-semibold text-destructive mb-1">Moins efficace :</span>
                                                <span className="italic text-foreground">"Congé maternité"</span>
                                            </div>
                                            <div className="flex flex-col border border-emerald-500/20 bg-emerald-500/5 rounded-md p-3 text-sm flex-1">
                                                <span className="font-semibold text-emerald-600 mb-1">Plus efficace :</span>
                                                <span className="italic text-foreground">"Quelle est la durée légale du congé maternité pour une employée dans le secteur privé ?"</span>
                                            </div>
                                        </div>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>
                                            <strong className="text-foreground">Posez une seule question à la fois :</strong> Si vous avez plusieurs interrogations, séparez-les en plusieurs requêtes distinctes pour éviter de diluer la recherche.
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>
                                            <strong className="text-foreground">Mentionnez les références si vous les connaissez :</strong> Si votre question porte sur une loi spécifique, incluez son numéro ou son année (ex: "Selon la loi de finances 2023...").
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>
                                            <strong className="text-foreground">Vérifiez toujours les sources :</strong> Bien que l'assistant soit conçu pour minimiser les erreurs, il est primordial de cliquer sur les références fournies (numéro de loi, article, page du JO) à la fin de chaque réponse pour lire le texte brut et confirmer l'information. L'IA vous assiste, mais ne remplace pas l'expertise humaine.
                                        </span>
                                    </li>

                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>
                                            <strong className="text-foreground">Reformulez en cas de doute :</strong> Si la réponse ne correspond pas exactement à vos attentes, essayez de formuler votre question différemment en utilisant d'autres termes juridiques.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Aidez-nous à nous améliorer</h2>
                            <div className="h-px w-full bg-border/50" />
                        </div>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground">Évaluez les réponses de l'IA</h3>
                                <p>
                                    Afin d'améliorer continuellement la qualité et la précision de notre assistant, nous vous invitons à utiliser les boutons <strong>"J'aime"</strong> et <strong>"Je n'aime pas"</strong> situés sous chaque réponse générée par l'IA.
                                </p>
                                <p>
                                    Vos retours sont précieux : ils permettent à notre équipe d'identifier les réponses les plus pertinentes et d'ajuster notre système pour mieux répondre à vos besoins juridiques à l'avenir.
                                </p>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </PageContent>
        </div>
    );
}
