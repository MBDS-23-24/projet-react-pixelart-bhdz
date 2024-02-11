import {axiosApi, del, get, post, put} from "../api_functions";
import Cookies from "universal-cookie";
import {HELLO_WORLD, LOGIN_USER} from "../url_functions.js";

export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data.user));
        window.location.href = '/';
        return res.data.user;
    }).catch((error) => {
        console.log('auth error')
        return {error: 'error', status: 401};
    });
}

export const helloWorld = async () => {
    return get(HELLO_WORLD).then(res => {
        console.log(res.data)
        return res.data;
    }).catch((error) => {
        return {error: 'error', status: 401};
    });
}

window.onload = () => {
    if (window.location.pathname === '/login') {
        console.log('login page - deconnexion token invalid');
    }
}

axiosApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if(error.response.status === 403 || error.response.status === 401){
        const cookies = new Cookies();
        cookies.remove('refreshToken');
        cookies.remove('accessToken');
        localStorage.removeItem('user_session');
        window.location.href = '/login';
    }
});