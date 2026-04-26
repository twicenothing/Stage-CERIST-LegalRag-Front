import { motion } from "motion/react";
import { MagicWand01Icon, Playlist01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const AiStep = () => {
    return (
        <div className="flex flex-col items-center text-center space-y-8 py-8 px-2 max-w-sm mx-auto">
            <div className="relative flex justify-center items-center">
                <div className="absolute -inset-8 bg-emerald-500/10 blur-3xl rounded-full" />
                
                <div className="flex gap-4">
                  <div className="size-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20">
                      <HugeiconsIcon
                          icon={MagicWand01Icon}
                          className="size-8 text-white"
                          strokeWidth={2.5}
                      />
                  </div>
                  <div className="size-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 border border-white/20 -ml-4 translate-y-4">
                      <HugeiconsIcon
                          icon={Playlist01Icon}
                          className="size-8 text-white"
                          strokeWidth={2.5}
                      />
                  </div>
                </div>
            </div>

            <div className="space-y-4">
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-black tracking-tight leading-[0.95]"
                >
                    AI-Powered <span className="text-emerald-500">Atmospheres.</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-muted-foreground font-medium"
                >
                    Not sure what to listen to? Let our AI generate the perfect soundscape for you. Simply describe your mood or activity.
                </motion.p>
            </div>
        </div>
    );
};
