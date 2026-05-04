import { motion } from "motion/react";
import { PageHeader, PageContent } from "@/components/layout/PageLayout";
import { AccountDetailsSection } from "@/components/settings/AccountDetailsSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";

export default function Settings() {
    return (
        <div className="min-h-screen pb-28">
            <PageHeader
                title="Settings"
                subtitle="Configuration & Preferences"
                showBackButton
            />

            <PageContent maxWidth="xl" className="space-y-10">
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
        </div>
    );
}
