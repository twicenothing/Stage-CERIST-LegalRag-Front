import axios from "axios";
import { getToken } from "./auth";
import { API_URL } from "./constants";

export const api = axios.create({
    baseURL: API_URL,
});

export const apiNoAuth = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
