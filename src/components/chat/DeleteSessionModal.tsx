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
            toast.success("Session deleted successfully");

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
                toast.error("An error occurred while deleting the session");
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
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the session and remove the data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => toggle("SEARCH_CHAT_SESSIONS")}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isPending}
                    >
                        {isPending ? "Deleting..." : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteSessionConfirmationModal;
