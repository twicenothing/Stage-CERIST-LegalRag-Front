import { motion } from "motion/react";
import { PageHeader, PageContent } from "@/components/layout/PageLayout";
import { AccountDetailsSection } from "@/components/settings/AccountDetailsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";

export default function Settings() {
    return (
        <div className="min-h-screen pb-28 relative">
            <PageHeader
                title="Settings"
                subtitle="Configuration & Preferences"
                showBackButton
            />

            <PageContent maxWidth="xl" className="space-y-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex flex-col gap-10"
                >
                    <AccountDetailsSection />
                    <AppearanceSection />
                </motion.div>
            </PageContent>

            {/* Zelda Triforce Easter Egg */}
            <svg 
                viewBox="0 0 100 86.6" 
                className="fixed bottom-8 right-8 w-20 h-20 opacity-[0.04] text-foreground pointer-events-none z-0"
                fill="currentColor" 
            >
                <polygon points="50,0 25,43.3 75,43.3" />
                <polygon points="25,43.3 0,86.6 50,86.6" />
                <polygon points="75,43.3 50,86.6 100,86.6" />
            </svg>
        </div>
    );
}
