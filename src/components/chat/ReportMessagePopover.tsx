import { useEffect, useRef, useState } from "react";
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
    resolveMessageId?: () => Promise<string>;
    children: React.ReactNode;
    onReportSuccess: (messageId: string) => void;
    disabled?: boolean;
}

export const ReportMessagePopover = ({ messageId, resolveMessageId, children, onReportSuccess, disabled }: ReportMessagePopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragState = useRef({
        startX: 0,
        startY: 0,
        originX: 0,
        originY: 0,
        minX: 0,
        maxX: 0,
        minY: 0,
        maxY: 0,
    });

    useEffect(() => {
        if (!isDragging) return;

        const handlePointerMove = (event: PointerEvent) => {
            const nextX = dragState.current.originX + event.clientX - dragState.current.startX;
            const nextY = dragState.current.originY + event.clientY - dragState.current.startY;

            setPosition({
                x: Math.min(Math.max(nextX, dragState.current.minX), dragState.current.maxX),
                y: Math.min(Math.max(nextY, dragState.current.minY), dragState.current.maxY),
            });
        };

        const handlePointerUp = () => setIsDragging(false);

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
        };
    }, [isDragging]);

    const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0 || !contentRef.current) return;

        const viewportMargin = 8;
        const rect = contentRef.current.getBoundingClientRect();
        const baseLeft = rect.left - position.x;
        const baseTop = rect.top - position.y;

        dragState.current = {
            startX: event.clientX,
            startY: event.clientY,
            originX: position.x,
            originY: position.y,
            minX: viewportMargin - baseLeft,
            maxX: window.innerWidth - viewportMargin - rect.width - baseLeft,
            minY: viewportMargin - baseTop,
            maxY: window.innerHeight - viewportMargin - rect.height - baseTop,
        };

        setIsDragging(true);
        event.preventDefault();
    };

    const handleOpenChange = (open: boolean) => {
        if (disabled) return;

        if (open) {
            setPosition({ x: 0, y: 0 });
        } else {
            setIsDragging(false);
        }

        setIsOpen(open);
    };

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Veuillez sélectionner une raison");
            return;
        }

        setIsSubmitting(true);
        try {
            const savedMessageId = resolveMessageId
                ? await resolveMessageId()
                : messageId;
            const response = await fetch(`${API_URL}/rag/message/${savedMessageId}/report`, {
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
            onReportSuccess(savedMessageId);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur lors de l'envoi du signalement";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
            <Popover.Trigger asChild>
                <div className={cn(disabled && "opacity-50 cursor-not-allowed")}>
                    {children}
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    ref={contentRef}
                    side="bottom"
                    align="end"
                    sideOffset={8}
                    style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
                    className={cn(
                        "z-50 w-80 rounded-2xl border bg-popover p-4 text-popover-foreground shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        isDragging && "select-none"
                    )}
                >
                    <div className="flex flex-col gap-4">
                        <div
                            className={cn("space-y-2 cursor-grab touch-none", isDragging && "cursor-grabbing")}
                            onPointerDown={handleDragStart}
                            title="Déplacer"
                        >
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
