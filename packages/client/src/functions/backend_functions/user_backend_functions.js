import {axiosApi, post} from "../api_functions.js";
import Cookies from "universal-cookie";
import {LOGIN_USER, UPDATE_USER, CHANGE_PASSWORD} from "../url_functions.js";
export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data));
        return res.data.user;
    });
}

