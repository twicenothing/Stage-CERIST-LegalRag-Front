import { motion } from "motion/react";
import { MusicNote01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const WelcomeStep = () => {
    return (
        <div className="flex flex-col items-center text-center space-y-8 py-8 px-2 max-w-sm mx-auto">
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative size-24 rounded-[32px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20">
                    <HugeiconsIcon
                        icon={MusicNote01Icon}
                        className="size-10 text-white"
                        strokeWidth={2.5}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black tracking-tight leading-[0.95]"
                >
                    Experience your perfect <span className="text-primary italic">ambient</span> world.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-muted-foreground font-medium"
                >
                    Aetherscape is a sensory-first sound machine for focus, sleep, and everything in between.
                </motion.p>
            </div>
        </div>
    );
};
