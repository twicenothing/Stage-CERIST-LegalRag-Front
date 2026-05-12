import { api } from "@/lib/axios";

export interface StatsOverview {
    total_users: number;
    total_sessions: number;
    total_messages: number;
    liked_messages: number;
    disliked_messages: number;
}

export interface DailyTraffic {
    date: string;
    count: number;
}

export interface MonthlyTraffic {
    month: string;
    count: number;
}

export interface StatsResponse {
    overview: StatsOverview;
    traffic: {
        daily: DailyTraffic[];
        monthly: MonthlyTraffic[];
    };
}

export async function getStats(): Promise<StatsResponse> {
    const { data } = await api.get<StatsResponse>("/stats/");
    return data;
}
