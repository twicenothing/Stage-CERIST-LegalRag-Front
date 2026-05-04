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

            if (actionData?.fromSearch) {
                toggle("SEARCH_CHAT_SESSIONS");
            } else {
                toggle("DELETE_SESSION_CONFIRMATION");
            }

            // Navigate to a new chat if the deleted session is the current one
            const currentSessionId = searchParams.get("sessionId");
            if (actionData && actionData.sessionId === currentSessionId) {
                navigate("/");
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

    const handleOpenChange = () => {
        if (actionData.fromSearch) {
            toggle("SEARCH_CHAT_SESSIONS");
        } else {
            toggle("DELETE_SESSION_CONFIRMATION");
        }
    };

    const handleCancel = () => {
        if (actionData.fromSearch) {
            toggle("SEARCH_CHAT_SESSIONS");
        } else {
            toggle("DELETE_SESSION_CONFIRMATION");
        }
    };

    return (
        <AlertDialog
            open={isOpen("DELETE_SESSION_CONFIRMATION")}
            onOpenChange={handleOpenChange}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Supprimer la session ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        cette action entraînera la suppression de "{actionData.sessionTitle}"
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>
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
                        {isPending ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteSessionConfirmationModal;
