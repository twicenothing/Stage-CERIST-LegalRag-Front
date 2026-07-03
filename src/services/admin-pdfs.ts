import { api } from "@/lib/axios";

export interface IndexedPdf {
    filename: string;
    year_folder: string;
    source: "pdf" | "pdf_old" | string;
    size_bytes: number;
    modified_at: string;
}

export interface IndexedPdfsResponse {
    count: number;
    pdfs: IndexedPdf[];
}

export async function getIndexedPdfs(): Promise<IndexedPdfsResponse> {
    const { data } = await api.get<IndexedPdfsResponse>("/rag/admin/pdfs");

    return data;
}

export async function uploadPdfToVectorBase(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/rag/admin/pdfs", formData);
}
