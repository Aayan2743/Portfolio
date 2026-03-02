import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import apiClient from "./axiosInstance";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export { apiClient };
