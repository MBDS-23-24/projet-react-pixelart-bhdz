import axios from "axios";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_EXPRESS_URL,
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type": "application/json",
        "Authorization": cookies.get("accessToken") ? `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("accessToken="))?.split("=")[1]}` : "",
    },
});

axiosApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if(error.response.status === 403 || error.response.status === 401){
        const cookies = new Cookies();
        cookies.remove('accessToken');
        localStorage.removeItem('user_session');
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