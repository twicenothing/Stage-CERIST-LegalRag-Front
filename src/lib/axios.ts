import axios from "axios";
import { TOKEN_KEY } from "./auth-client";
import { API_URL } from "./constants";

export const api = axios.create({
    baseURL: API_URL,
});

export const apiNoAuth = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
