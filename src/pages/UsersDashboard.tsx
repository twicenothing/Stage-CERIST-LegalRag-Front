import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/users";
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import CreateUserModal from "@/components/dashboard/CreateUserModal";
import UpdateUserModal from "@/components/dashboard/UpdateUserModal";
import DeleteUserDialog from "@/components/dashboard/DeleteUserDialog";

const UsersDashboard = () => {
    const { data: users, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    return (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
                <div>
                    <h2 className="text-xl font-semibold">Utilisateurs</h2>
                    <p className="text-sm text-muted-foreground">
                        Liste de tous les utilisateurs enregistrés ({users?.length || 0})
                    </p>
                </div>
                <CreateUserModal />
            </div>

            <div className="p-0 overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Spinner className="size-8" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500">
                        Erreur lors du chargement des utilisateurs.
                    </div>
                ) : !users || users.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Aucun autre utilisateur trouvé.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nom complet</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Rôle</th>
                                <th className="px-6 py-4 font-medium">Date d'inscription</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role === "admin" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <ShieldCheckIcon className="size-3.5" />
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                <ShieldAlertIcon className="size-3.5" />
                                                Utilisateur
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {user.created_at ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(user.created_at)) : "Inconnue"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <UpdateUserModal user={user} />
                                            <DeleteUserDialog user={user} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UsersDashboard;
