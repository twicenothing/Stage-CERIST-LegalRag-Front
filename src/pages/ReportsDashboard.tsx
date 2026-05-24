import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, updateReportStatus, deleteReport, ReportData } from "@/services/reports";
import { FlagIcon, TrashIcon, EyeIcon, MessageSquareIcon } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const getStatusColor = (status: string) => {
    switch (status) {
        case "en_attente": return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
        case "traite": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
        case "rejete": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
        default: return "bg-muted text-muted-foreground";
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case "en_attente": return "En attente";
        case "traite": return "Traité";
        case "rejete": return "Rejeté";
        default: return status;
    }
};

export default function ReportsDashboard() {
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
    const queryClient = useQueryClient();

    const { data: reports, isLoading, isError } = useQuery({
        queryKey: ["reports", statusFilter],
        queryFn: () => getReports(statusFilter !== "all" ? statusFilter : undefined),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateReportStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            toast.success("Statut mis à jour");
        },
        onError: () => toast.error("Erreur lors de la mise à jour"),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            toast.success("Signalement supprimé");
        },
        onError: () => toast.error("Erreur lors de la suppression"),
    });

    return (
        <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FlagIcon className="size-5 text-muted-foreground" /> Signalements
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Gérez les retours et signalements des utilisateurs ({reports?.length || 0})
                    </p>
                </div>
                <div className="w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filtrer par statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="en_attente">En attente</SelectItem>
                            <SelectItem value="traite">Traité</SelectItem>
                            <SelectItem value="rejete">Rejeté</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="p-0 overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Spinner className="size-8" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500">
                        Erreur lors du chargement des signalements.
                    </div>
                ) : !reports || reports.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        Aucun signalement trouvé.
                    </div>
                ) : (
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Raison</th>
                                <th className="px-6 py-4 font-medium">Utilisateur</th>
                                <th className="px-6 py-4 font-medium">Statut</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(report.createdAt))}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-foreground">
                                        {report.reason}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {report.reporter.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                            {getStatusLabel(report.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Select 
                                                value={report.status} 
                                                onValueChange={(val) => updateStatusMutation.mutate({ id: report.id, status: val })}
                                            >
                                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en_attente">En attente</SelectItem>
                                                    <SelectItem value="traite">Traité</SelectItem>
                                                    <SelectItem value="rejete">Rejeté</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)} title="Voir les détails">
                                                <EyeIcon className="size-4" />
                                            </Button>

                                            <Button variant="ghost" size="icon" onClick={() => {
                                                if (confirm("Supprimer ce signalement ?")) {
                                                    deleteMutation.mutate(report.id);
                                                }
                                            }} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" title="Supprimer">
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails du signalement</DialogTitle>
                    </DialogHeader>
                    {selectedReport && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-1">Raison</span>
                                    <div className="font-medium">{selectedReport.reason}</div>
                                </div>
                                <div>
                                    <span className="font-semibold text-muted-foreground block mb-1">Statut</span>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                                        {getStatusLabel(selectedReport.status)}
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="font-semibold text-muted-foreground block mb-1">Détails de l'utilisateur</span>
                                    <div className="p-3 bg-muted/50 rounded-lg whitespace-pre-wrap">
                                        {selectedReport.details || <span className="text-muted-foreground italic">Aucun détail fourni</span>}
                                    </div>
                                </div>
                                <div className="col-span-2 mt-2">
                                    <span className="font-semibold text-muted-foreground block mb-2 flex items-center gap-2">
                                        <MessageSquareIcon className="size-4" /> Message de l'IA (ID: {selectedReport.message.id?.split("-")[0]}...)
                                    </span>
                                    <div className="p-4 bg-muted/30 border rounded-lg max-h-64 overflow-y-auto whitespace-pre-wrap text-sm">
                                        {selectedReport.message.parts?.map((p: any) => p.text).join("") || "Message introuvable"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setSelectedReport(null)}>Fermer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
