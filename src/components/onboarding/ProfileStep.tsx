import { useState, useEffect } from "react";
import { UserCheckIcon, PencilEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth";

interface ProfileStepProps {
    onReady: (canContinue: boolean) => void;
    onChange: (value: string) => void;
}

export const ProfileStep = ({ onReady, onChange }: ProfileStepProps) => {
    const { data: session } = useSession();
    const [name, setName] = useState(session?.user?.name || "");

    useEffect(() => {
      if(session?.user?.name && !name) {
        setName(session.user.name);
      }
    }, [session, name]);

    useEffect(() => {
        onReady(name.length >= 3);
        onChange(name);
    }, [name, onReady, onChange]);

    return (
        <div className="flex flex-col items-center text-center space-y-8 py-8 px-2 max-w-sm mx-auto">
            <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative size-24 rounded-full bg-primary/10 flex items-center justify-center shadow-inner border border-primary/40">
                    <div className="size-16 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40 border border-white/20">
                      <HugeiconsIcon
                          icon={UserCheckIcon}
                          className="size-8 text-white"
                          strokeWidth={2.5}
                      />
                    </div>
                </div>
            </div>

            <div className="space-y-4 w-full">
                <h2 className="text-4xl font-black tracking-tight leading-[0.95]">
                    Almost there! <br/><span className="text-primary italic">Who are you?</span>
                </h2>
                <div className="bg-muted/30 backdrop-blur-xl p-6 rounded-3xl border border-border/40 space-y-4 text-left w-full">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest pl-1 text-muted-foreground">Username</Label>
                      <div className="relative">
                        <Input
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Atmospheric Nomad"
                            className="bg-background/50 h-12 rounded-2xl pl-10 border-border/40 focus:ring-primary shadow-inner"
                        />
                        <HugeiconsIcon icon={PencilEditIcon} className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1 opacity-60">minimum 3 characters</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
