import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ArchiveIcon,
    EyeIcon,
    FileTextIcon,
    FolderIcon,
    HardDriveIcon,
    RefreshCwIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getToken } from "@/lib/auth";
import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getIndexedPdfs, IndexedPdf, uploadPdfToVectorBase } from "@/services/admin-pdfs";

const PAGE_SIZE = 50;

const numberFormatter = new Intl.NumberFormat("fr-FR");

const formatNumber = (value: number | null | undefined) =>
    numberFormatter.format(value ?? 0);

const formatSize = (bytes: number | null | undefined) => {
    const safeBytes = bytes ?? 0;

    if (safeBytes < 1024) return `${formatNumber(safeBytes)} o`;
    if (safeBytes < 1024 * 1024) return `${formatNumber(Math.round(safeBytes / 1024))} Ko`;

    return `${numberFormatter.format(Number((safeBytes / 1024 / 1024).toFixed(1)))} Mo`;
};

const formatDateTime = (value: string | null | undefined) => {
    if (!value) return "Non disponible";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

const getSourceLabel = (source: string) => {
    if (source === "pdf") return "Actifs";
    if (source === "pdf_old") return "Archivés";

    return source;
};

const getSourceClasses = (source: string) =>
    source === "pdf"
        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "bg-amber-500/10 text-amber-700 dark:text-amber-300";

const HnswMark = ({ className }: { className?: string }) => (
    <span className={cn("relative block size-5 text-current", className)} aria-hidden="true">
        <span className="absolute left-[4px] top-[5px] h-px w-3 rotate-[18deg] bg-current/60" />
        <span className="absolute left-[7px] top-[13px] h-px w-3 -rotate-[22deg] bg-current/60" />
        <span className="absolute left-[5px] top-[8px] h-px w-2.5 rotate-[66deg] bg-current/50" />
        <span className="absolute left-[12px] top-[6px] h-px w-2.5 rotate-[92deg] bg-current/50" />
        <span className="absolute left-0 top-[3px] size-2 rounded-full bg-current" />
        <span className="absolute right-[2px] top-[5px] size-2 rounded-full bg-current" />
        <span className="absolute bottom-[1px] left-[5px] size-2 rounded-full bg-current" />
        <span className="absolute bottom-[4px] right-0 size-1.5 rounded-full bg-current/75" />
    </span>
);

const DocumentsDashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState("all");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [openingFilename, setOpeningFilename] = useState<string | null>(null);
    const [selectedPdf, setSelectedPdf] = useState<{ title: string; url: string } | null>(null);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["indexed-pdfs"],
        queryFn: getIndexedPdfs,
    });

    const pdfs = useMemo(() => data?.pdfs ?? [], [data?.pdfs]);

    const years = useMemo(
        () => Array.from(new Set(pdfs.map((pdf) => pdf.year_folder))).sort((a, b) => b.localeCompare(a)),
        [pdfs]
    );

    const filteredPdfs = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase("fr");

        return pdfs.filter((pdf) => {
            const matchesQuery = !normalizedQuery
                || pdf.filename.toLocaleLowerCase("fr").includes(normalizedQuery)
                || pdf.year_folder.toLocaleLowerCase("fr").includes(normalizedQuery);
            const matchesSource = sourceFilter === "all" || pdf.source === sourceFilter;
            const matchesYear = yearFilter === "all" || pdf.year_folder === yearFilter;

            return matchesQuery && matchesSource && matchesYear;
        });
    }, [pdfs, searchQuery, sourceFilter, yearFilter]);

    const visiblePdfs = filteredPdfs.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPdfs.length;
    const activeCount = pdfs.filter((pdf) => pdf.source === "pdf").length;
    const archivedCount = pdfs.filter((pdf) => pdf.source === "pdf_old").length;

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [searchQuery, sourceFilter, yearFilter]);

    useEffect(() => {
        return () => {
            if (selectedPdf?.url) {
                URL.revokeObjectURL(selectedPdf.url);
            }
        };
    }, [selectedPdf]);

    const handleOpenPdf = async (pdf: IndexedPdf) => {
        const toastId = toast.loading("Ouverture du document...");
        setOpeningFilename(pdf.filename);

        try {
            const response = await fetch(`${API_URL}/rag/pdf?title=${encodeURIComponent(pdf.filename)}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (!response.ok) {
                toast.error("Document introuvable", { id: toastId });
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setSelectedPdf({ title: pdf.filename, url });
            toast.dismiss(toastId);
        } catch {
            toast.error("Erreur lors de l'ouverture du document", { id: toastId });
        } finally {
            setOpeningFilename(null);
        }
    };

    const setPdfFile = (file: File | null) => {
        if (!file) return;

        const isPdf = file.type === "application/pdf" || file.name.toLocaleLowerCase("fr").endsWith(".pdf");

        if (!isPdf) {
            toast.error("Veuillez choisir un fichier PDF.");
            return;
        }

        setUploadFile(file);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPdfFile(event.target.files?.[0] ?? null);
        event.target.value = "";
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(false);
        setPdfFile(event.dataTransfer.files?.[0] ?? null);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsDragActive(false);
        }
    };

    const handleUploadPdf = async () => {
        if (!uploadFile) {
            toast.error("Ajoutez un PDF avant de lancer l'augmentation.");
            return;
        }

        const toastId = toast.loading("Envoi du PDF vers la base vectorielle...");
        setIsUploading(true);

        try {
            await uploadPdfToVectorBase(uploadFile);
            toast.success("PDF envoyé vers la base vectorielle.", { id: toastId });
            setIsUploadOpen(false);
            setUploadFile(null);
            refetch();
        } catch {
            toast.error("Interface prête, mais l'ajout n'est pas encore disponible côté backend.", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                            <FolderIcon className="size-4" />
                            Documents indexés
                        </div>
                        <h2 className="mt-2 text-2xl font-bold text-foreground">Bibliothèque PDF</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Tous les PDF trouvés dans les dossiers actifs et archivés.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button
                            className="w-fit gap-2"
                            onClick={() => setIsUploadOpen(true)}
                        >
                            <HnswMark />
                            Augmenter la base de données
                        </Button>
                        <Button
                            className="w-fit gap-2"
                            disabled={isFetching}
                            variant="outline"
                            onClick={() => refetch()}
                        >
                            {isFetching ? <Spinner className="size-4" /> : <RefreshCwIcon className="size-4" />}
                            Actualiser
                        </Button>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Total</p>
                        <p className="mt-2 text-2xl font-bold">{formatNumber(data?.count ?? 0)}</p>
                    </div>
                    <div className="rounded-lg border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">PDF actifs</p>
                        <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatNumber(activeCount)}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">PDF archivés</p>
                        <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
                            {formatNumber(archivedCount)}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">Affichés</p>
                        <p className="mt-2 text-2xl font-bold text-primary">
                            {formatNumber(Math.min(visibleCount, filteredPdfs.length))}
                            <span className="text-sm font-medium text-muted-foreground">
                                {" "}/ {formatNumber(filteredPdfs.length)}
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex flex-col gap-4 border-b p-5 xl:flex-row xl:items-center xl:justify-between">
                    <SearchInput
                        aria-label="Rechercher un PDF"
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Rechercher par nom de fichier ou année"
                        value={searchQuery}
                        wrapperClassName="w-full xl:max-w-md"
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Select value={sourceFilter} onValueChange={setSourceFilter}>
                            <SelectTrigger className="w-full bg-background sm:w-44">
                                <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les sources</SelectItem>
                                <SelectItem value="pdf">PDF actifs</SelectItem>
                                <SelectItem value="pdf_old">PDF archivés</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={yearFilter} onValueChange={setYearFilter}>
                            <SelectTrigger className="w-full bg-background sm:w-40">
                                <SelectValue placeholder="Année" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes les années</SelectItem>
                                {years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Spinner className="size-8" />
                        </div>
                    ) : isError ? (
                        <div className="py-16 text-center text-destructive">
                            Erreur lors du chargement des PDF.
                        </div>
                    ) : pdfs.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            Aucun PDF trouvé.
                        </div>
                    ) : filteredPdfs.length === 0 ? (
                        <div className="py-16 text-center text-muted-foreground">
                            Aucun PDF ne correspond à votre recherche.
                        </div>
                    ) : (
                        <table className="w-full min-w-[920px] text-left text-sm">
                            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Fichier</th>
                                    <th className="px-6 py-4 font-medium">Année</th>
                                    <th className="px-6 py-4 font-medium">Source</th>
                                    <th className="px-6 py-4 font-medium">Taille</th>
                                    <th className="px-6 py-4 font-medium">Modifié le</th>
                                    <th className="px-6 py-4 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {visiblePdfs.map((pdf) => (
                                    <tr key={`${pdf.source}-${pdf.year_folder}-${pdf.filename}`} className="transition-colors hover:bg-muted/30">
                                        <td className="px-6 py-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                    <FileTextIcon className="size-4" />
                                                </div>
                                                <span className="max-w-[420px] truncate font-medium text-foreground" title={pdf.filename}>
                                                    {pdf.filename}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{pdf.year_folder}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", getSourceClasses(pdf.source))}>
                                                {getSourceLabel(pdf.source)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <HardDriveIcon className="size-3.5" />
                                                {formatSize(pdf.size_bytes)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDateTime(pdf.modified_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end">
                                                <Button
                                                    className="gap-2"
                                                    disabled={openingFilename === pdf.filename}
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleOpenPdf(pdf)}
                                                >
                                                    {openingFilename === pdf.filename ? (
                                                        <Spinner className="size-4" />
                                                    ) : (
                                                        <EyeIcon className="size-4" />
                                                    )}
                                                    Inspecter
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {hasMore && (
                    <div className="flex items-center justify-center border-t p-5">
                        <Button
                            className="gap-2"
                            variant="outline"
                            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                        >
                            <ArchiveIcon className="size-4" />
                            Charger plus
                        </Button>
                    </div>
                )}
            </section>

            <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
                <DialogContent className="flex h-[90vh] w-[1200px] max-w-[90vw] flex-col gap-4 p-4 sm:max-w-7xl sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="break-all text-xl">{selectedPdf?.title}</DialogTitle>
                    </DialogHeader>
                    {selectedPdf && (
                        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border bg-muted/30">
                            <iframe
                                className="h-full w-full border-0"
                                src={selectedPdf.url}
                                title={selectedPdf.title}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={isUploadOpen}
                onOpenChange={(open) => {
                    setIsUploadOpen(open);
                    if (!open) {
                        setUploadFile(null);
                        setIsDragActive(false);
                    }
                }}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-primary/10 p-3 text-primary">
                                <HnswMark className="size-6" />
                            </div>
                            <div>
                                <DialogTitle>Augmenter la base de données</DialogTitle>
                                <DialogDescription className="mt-1">
                                    Ajoutez un PDF à envoyer vers la base vectorielle.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div
                        className={cn(
                            "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center transition-colors",
                            isDragActive
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:bg-muted/30"
                        )}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            accept="application/pdf,.pdf"
                            className="hidden"
                            type="file"
                            onChange={handleFileChange}
                        />

                        {uploadFile ? (
                            <div className="w-full max-w-md rounded-lg border bg-background p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        <FileTextIcon className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-foreground" title={uploadFile.name}>
                                            {uploadFile.name}
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {formatSize(uploadFile.size)}
                                        </p>
                                    </div>
                                    <Button
                                        aria-label="Retirer le fichier"
                                        size="icon-sm"
                                        variant="ghost"
                                        onClick={() => setUploadFile(null)}
                                    >
                                        <XIcon className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-2xl bg-background p-4 text-primary shadow-sm">
                                    <UploadIcon className="size-8" />
                                </div>
                                <p className="mt-4 text-base font-semibold text-foreground">
                                    Glissez-déposez un PDF ici
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    ou sélectionnez un fichier depuis votre ordinateur.
                                </p>
                                <Button
                                    className="mt-5"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Choisir un PDF
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            disabled={isUploading}
                            variant="outline"
                            onClick={() => setIsUploadOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            className="gap-2"
                            disabled={!uploadFile}
                            isLoading={isUploading}
                            onClick={handleUploadPdf}
                        >
                            <HnswMark />
                            Envoyer vers la base
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DocumentsDashboard;
