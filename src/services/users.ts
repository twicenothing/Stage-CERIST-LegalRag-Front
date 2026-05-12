import { api } from "@/lib/axios";

export interface UserDTO {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface CreateUserPayload {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    role: string;
}

export interface UpdateUserPayload {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: string;
}

export async function getUsers(): Promise<UserDTO[]> {
    const { data } = await api.get<UserDTO[]>("/users/");
    return data;
}

export async function createUser(payload: CreateUserPayload): Promise<any> {
    const { data } = await api.post("/users/", payload);
    return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<any> {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
}

export async function deleteUser(id: string): Promise<any> {
    const { data } = await api.delete(`/users/${id}`);
    return data;
}
