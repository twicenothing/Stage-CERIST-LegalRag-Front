import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser, UserDTO } from "@/services/users";

interface DeleteUserDialogProps {
    user: UserDTO;
}

const DeleteUserDialog = ({ user }: DeleteUserDialogProps) => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => deleteUser(user.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Utilisateur supprimé avec succès");
            setOpen(false);
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.detail || 
                "Erreur lors de la suppression de l'utilisateur"
            );
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2Icon className="size-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Cela supprimera définitivement le compte de 
                        {" "}<span className="font-semibold text-foreground">{user.first_name} {user.last_name}</span>{" "}
                        et supprimera toutes ses données (historique de chat, etc.) de nos serveurs.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Annuler</AlertDialogCancel>
                    <Button 
                        variant="destructive" 
                        onClick={(e) => {
                            e.preventDefault();
                            mutation.mutate();
                        }}
                        isLoading={mutation.isPending}
                    >
                        Supprimer
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteUserDialog;
