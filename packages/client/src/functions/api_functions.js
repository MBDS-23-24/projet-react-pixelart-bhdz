import axios from "axios";
import Cookies from 'universal-cookie';
import {notifications} from "@mantine/notifications";

export const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_EXPRESS_URL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": localStorage?.getItem('user_session') ? `Bearer ${JSON.parse(localStorage.getItem('user_session')).accessToken}` : "",
    },
});

axiosApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    notifications.show({
        title: "Error",
        message: error.response.data.message + (error.response.data.details ? `: ${error.response.data.details}` : ""),
        color: "red",
    });
    if (error.response.status === 403 && error.response.data?.message === "Forbidden - JWT Expired") {
        const cookies = new Cookies();
        cookies.remove('accessToken');
        localStorage.removeItem('user_session');
        window.location.reload();
    }
    if (error.response.status === 403 && error.response.data?.message === "Forbidden") {
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    }
});

export async function get(url, config = {}) {
    return axiosApi.get(url, { ...config });
}

export async function post(url, data, config = {}) {
    return axiosApi.post(url, Array.isArray(data) ? [...data] : { ...data }, { ...config });
}

export async function put(url, data, config = {}) {
    return axiosApi.put(url, Array.isArray(data) ? [...data] : { ...data }, { ...config });
}

export async function del(url, config = {}) {
    return axiosApi.delete(url, { ...config });
}

export async function patch(url, data, config = {}) {
    return axiosApi.patch(url, { ...data }, { ...config });
}