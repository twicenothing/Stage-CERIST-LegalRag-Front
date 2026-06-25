import { api } from "@/lib/axios";

export interface RagConfig {
    collection_name: string;
    chroma_path: string;
    embedding_model: string;
    reranker_model: string;
    llm_model: string;
    ollama_host: string;
}

export interface GenerationConfig {
    rag_num_ctx: number;
    rag_num_predict: number;
    rag_temperature: number;
    rag_think: boolean;
}

export interface RetrievalConfig {
    rag_top_k_retrieve: number;
    rag_top_k_rerank: number;
}

export interface VisionConfig {
    vision_model: string;
    vision_table_model: string;
    use_pdf_vision_for_tables: boolean;
    vision_max_pages: number;
    vision_page_zoom: number;
    vision_num_ctx: number;
    vision_num_predict: number;
}

export interface DocumentsConfig {
    pdf_path: string;
    pdf_old_path: string;
}

export interface SecurityConfig {
    algorithm: string;
    access_token_expire_minutes: number;
    secret_key_configured: boolean;
}

export interface AppConfigResponse {
    rag: RagConfig;
    generation: GenerationConfig;
    retrieval: RetrievalConfig;
    vision: VisionConfig;
    documents: DocumentsConfig;
    security: SecurityConfig;
    hidden: string[];
}

export async function getAppConfig(): Promise<AppConfigResponse> {
    const response = await api.get<AppConfigResponse>("/stats/app-config");

    return response.data;
}
