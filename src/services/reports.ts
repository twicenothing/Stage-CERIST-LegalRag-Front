import { API_URL } from "@/lib/constants";
import { getToken } from "@/lib/auth";

export interface ReportData {
    id: string;
    reason: string;
    details: string | null;
    status: "en_attente" | "traite" | "rejete";
    createdAt: string;
    reporter: {
        id: string | null;
        email: string;
    };
    message: {
        id: string | null;
        role: string | null;
        parts: any[] | null;
    };
}

export const getReports = async (status?: string): Promise<ReportData[]> => {
    const query = status ? `?status=${status}` : "";
    const response = await fetch(`${API_URL}/admin/reports${query}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch reports");
    }

    return response.json();
};

export const updateReportStatus = async (reportId: string, status: string) => {
    const response = await fetch(`${API_URL}/admin/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update report status");
    }

    return response.json();
};

export const deleteReport = async (reportId: string) => {
    const response = await fetch(`${API_URL}/admin/reports/${reportId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete report");
    }

    return response.json();
};
