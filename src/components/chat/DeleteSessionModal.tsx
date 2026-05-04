import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useModal } from "@/hooks/use-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";
import { deleteChatSession } from "@/services/chat-sessions";
import { useNavigate, useSearchParams } from "react-router-dom";

const DeleteSessionConfirmationModal = () => {
    const { isOpen, toggle, actionData } = useModal(
        "DELETE_SESSION_CONFIRMATION",
    );
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { isPending, mutate: handleDelete } = useMutation({
        mutationFn: async () => {
            if (!actionData) return;
            await deleteChatSession(actionData.sessionId);
        },
        onSuccess() {
            toast.success("Session supprimée avec succès");

            queryClient.invalidateQueries({
                queryKey: ["chat-sessions-history-search"],
            });
            queryClient.invalidateQueries({
                queryKey: ["chat-sessions-history"],
                exact: false,
            });

            toggle("SEARCH_CHAT_SESSIONS");

            // Navigate to a new chat if the deleted session is the current one
            const currentSessionId = searchParams.get("sessionId");
            if (actionData && actionData.sessionId === currentSessionId) {
                navigate("/chat");
            }
        },
        onError(error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Une erreur s'est produite lors de la suppression de la session");
            }
        },
    });

    if (!actionData) return null;

    return (
        <AlertDialog
            open={isOpen("DELETE_SESSION_CONFIRMATION")}
            onOpenChange={() => toggle("SEARCH_CHAT_SESSIONS")}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Êtes-vous absolument sûr(e) ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Cela supprimera définitivement
                        la session et effacera les données de nos serveurs.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => toggle("SEARCH_CHAT_SESSIONS")}
                    >
                        Annuler
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                    >
                        {isPending ? "Suppression..." : "Continuer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteSessionConfirmationModal;
