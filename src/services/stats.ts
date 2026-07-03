import { getToken } from "@/lib/auth";
import { API_URL } from "@/lib/constants";

export type StatsPeriodDays = 7 | 30 | 90 | 365;

export interface StatsPeriod {
    days: number;
    from: string;
    to: string;
}

export interface StatsOverview {
    total_users: number;
    new_users_period: number;
    active_users_period: number;
    total_sessions: number;
    sessions_period: number;
    total_messages: number;
    messages_period: number;
    user_messages: number | null;
    assistant_messages: number | null;
    avg_messages_per_session: number;
}

export interface StatsFeedbackMessage {
    id: string | number | null;
    preview: string;
    created_at: string | null;
    feedback: string | null;
}

export interface StatsFeedback {
    liked_messages: number;
    disliked_messages: number;
    feedback_total: number;
    feedback_rate: number;
    satisfaction_rate: number;
    most_disliked_messages: StatsFeedbackMessage[];
}

export interface DailyTraffic {
    date: string;
    count: number;
}

export interface MonthlyTraffic {
    month: string;
    count: number;
}

export interface DailyLatency {
    date: string;
    avg_total_duration_seconds: number;
}

export interface SlowQuery {
    created_at: string | null;
    total_duration_seconds: number | null;
    time_to_first_token_seconds: number | null;
    source_count: number | null;
    answer_chars: number | null;
    refused: boolean | null;
    model_id: string | null;
}

export interface StatsHealth {
    avg_total_duration_seconds: number;
    p95_total_duration_seconds: number;
    avg_time_to_first_token_seconds: number;
    slow_queries_count: number;
    slow_queries_rate: number;
    avg_source_count: number;
    daily_latency: DailyLatency[];
    recent_slow_queries: SlowQuery[];
}

export interface StatsResponse {
    period: StatsPeriod;
    overview: StatsOverview;
    feedback: StatsFeedback;
    traffic: {
        daily: DailyTraffic[];
        monthly: MonthlyTraffic[];
    };
    rag_quality: {
        no_answer_count: number;
        no_answer_rate: number;
    };
    health: StatsHealth;
}

export async function getStats(days: StatsPeriodDays): Promise<StatsResponse> {
    const url = new URL(`${API_URL.replace(/\/$/, "")}/stats`);
    url.searchParams.set("days", String(days));

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch statistics");
    }

    return response.json();
}
