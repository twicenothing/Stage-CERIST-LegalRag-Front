import { motion } from "motion/react";
import { PageHeader, PageContent } from "@/components/layout/PageLayout";
import { RiInformationLine, RiLightbulbLine, RiQuestionAnswerLine } from "@remixicon/react";

export default function Overview() {
    return (
        <div className="min-h-screen pb-28">
            <PageHeader
                title="Guide d'utilisation"
                subtitle="Comment utiliser l'assistant"
                showBackButton
            />

            <PageContent maxWidth="2xl" className="space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-8"
                >
                    {/* Intro */}
                    <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <RiInformationLine className="size-6" />
                            <h2 className="text-lg font-bold">À propos du site</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Ce site est un chatbot interactif conçu pour répondre à vos questions juridiques concernant le droit algérien. 
                            Que vous soyez un professionnel du droit ou un citoyen cherchant à comprendre ses droits, 
                            notre assistant utilise l'intelligence artificielle pour vous fournir des réponses claires, basées sur la législation en vigueur.
                        </p>
                    </div>

                    {/* How to use */}
                    <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <RiQuestionAnswerLine className="size-6" />
                            <h2 className="text-lg font-bold">Comment l'utiliser</h2>
                        </div>
                        <ul className="space-y-3 text-muted-foreground list-disc pl-5">
                            <li>Posez votre question directement dans la barre de chat.</li>
                            <li>Vous pouvez demander des explications sur un article de loi spécifique.</li>
                            <li>Consultez l'historique de vos conversations dans le panneau latéral.</li>
                            <li>Recherchez parmi vos anciens chats pour retrouver une information juridique importante.</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <RiLightbulbLine className="size-6" />
                            <h2 className="text-lg font-bold">Conseils pour de meilleurs résultats</h2>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Pour aider l'assistant à fournir la réponse la plus précise possible, veuillez prendre en compte ces conseils :
                            </p>
                            <ul className="space-y-3 list-disc pl-5">
                                <li>
                                    <strong className="text-foreground">Fournissez du contexte :</strong> Expliquez brièvement la situation (ex: un litige commercial, un problème immobilier, une question de droit de travail).
                                </li>
                                <li>
                                    <strong className="text-foreground">Citez des textes si possible :</strong> Si vous connaissez déjà le titre de la loi, du décret, ou de l'ordonnance, mentionnez-le pour que l'assistant puisse s'y référer directement.
                                </li>
                                <li>
                                    <strong className="text-foreground">Soyez précis :</strong> Plus votre question est ciblée, plus la réponse sera détaillée et pertinente.
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </PageContent>
        </div>
    );
}
