import {axiosApi, get, post} from "../api_functions.js";
import Cookies from "universal-cookie";
import {LOGIN_USER} from "../url_functions.js";
export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data.user));
        return res.data.user;
    });
}

axiosApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if(error.response.status === 403 || error.response.status === 401){
        const cookies = new Cookies();
        cookies.remove('accessToken');
        localStorage.removeItem('user_session');
    }
});