import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { AiStep } from "@/components/onboarding/AiStep";
import { ProfileStep } from "@/components/onboarding/ProfileStep";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowRightIcon,
    CheckmarkCircle02Icon,
    ArrowLeft02Icon,
} from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Onboarding = () => {
    const [step, setStep] = useState(0);
    const [canContinue, setCanContinue] = useState(true);
    const [username, setUsername] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleBack = useCallback(() => {
        setStep((s) => Math.max(0, s - 1));
    }, []);

    const steps = [
        <WelcomeStep key="welcome" />,
        <AiStep key="ai" />,

        <ProfileStep
            key="profile"
            onReady={setCanContinue}
            onChange={setUsername}
        />,
    ];

    const isLastStep = step === steps.length - 1;

    const handleNext = useCallback(async () => {
        if (isLastStep) {
            try {
                setIsSaving(true);
                const { error } = await authClient.updateUser({
                    name: username,
                });

                if (error) {
                    toast.error(error.message || "Failed to save profile");
                } else {
                    navigate("/");
                }
            } catch (err) {
                toast.error("An unexpected error occurred");
            } finally {
                setIsSaving(false);
            }
        } else {
            setStep((s) => s + 1);
        }
    }, [isLastStep, username, navigate]);

    return (
        <div className="min-h-dvh bg-background relative overflow-y-auto overflow-x-hidden flex flex-col items-center p-6">
            {/* Background glow - simplified for performance */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[20%] -left-[20%] w-full h-full bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Header with Back Button and Stepper */}
            <div className="w-full max-w-lg flex items-center justify-between mt-4 mb-12">
                <div className="w-10">
                    {step > 0 && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
                        >
                            <HugeiconsIcon
                                icon={ArrowLeft02Icon}
                                className="size-6"
                                strokeWidth={2.5}
                            />
                        </button>
                    )}
                </div>

                <div className="flex gap-2">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                step === i ? "w-6 bg-primary" : "w-1.5 bg-muted"
                            } ${step > i ? "bg-primary/50" : ""}`}
                        />
                    ))}
                </div>

                <div className="w-10" />
            </div>

            <main className="w-full max-w-lg flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex-1"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="w-full max-w-sm mt-8 pb-8">
                <Button
                    size="lg"
                    disabled={!canContinue || isSaving}
                    isLoading={isSaving}
                    onClick={handleNext}
                    className="w-full h-16 rounded-[24px] text-lg font-black shadow-2xl shadow-primary/30 gap-2 border border-white/20"
                >
                    {isLastStep ? "Start Exploring" : "Continue"}
                    <HugeiconsIcon
                        icon={
                            isLastStep ? CheckmarkCircle02Icon : ArrowRightIcon
                        }
                        className="size-6"
                        strokeWidth={2.5}
                    />
                </Button>
            </footer>
        </div>
    );
};

export default Onboarding;
