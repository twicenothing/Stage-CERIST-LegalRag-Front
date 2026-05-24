import { useState } from "react";
import { Popover } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";
import { toast } from "sonner";
import { Loader } from "@/components/ai-elements/loader";
import { cn } from "@/lib/utils";

interface ReportMessagePopoverProps {
    messageId: string;
    children: React.ReactNode;
    onReportSuccess: (messageId: string) => void;
    disabled?: boolean;
}

export const ReportMessagePopover = ({ messageId, children, onReportSuccess, disabled }: ReportMessagePopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Veuillez sélectionner une raison");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/rag/message/${messageId}/report`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ reason, details }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || "Erreur lors du signalement");
            }

            toast.success("Merci, le signalement a été enregistré avec succès");
            setIsOpen(false);
            setReason("");
            setDetails("");
            onReportSuccess(messageId);
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'envoi du signalement");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={(open) => {
            if (disabled) return;
            setIsOpen(open);
        }}>
            <Popover.Trigger asChild>
                <div className={cn(disabled && "opacity-50 cursor-not-allowed")}>
                    {children}
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    className="z-50 w-80 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                >
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Signaler un problème</h4>
                            <p className="text-sm text-muted-foreground">
                                Aidez-nous à améliorer la qualité des réponses.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="reason">Raison</Label>
                            <Select value={reason} onValueChange={setReason}>
                                <SelectTrigger id="reason" className="w-full h-9">
                                    <SelectValue placeholder="Sélectionnez..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hallucination">Hallucination</SelectItem>
                                    <SelectItem value="loi_obsolete">Loi obsolète</SelectItem>
                                    <SelectItem value="contexte_invalide">Contexte invalide</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="details">Détails (Optionnel)</Label>
                            <Textarea
                                id="details"
                                placeholder="Décrivez le problème..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="resize-none h-20 text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                                Annuler
                            </Button>
                            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? <Loader className="size-3" /> : "Envoyer"}
                            </Button>
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
