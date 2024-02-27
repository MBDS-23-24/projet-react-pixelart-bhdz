import {axiosApi, post} from "../api_functions.js";
import {LOGIN_USER, USER} from "../url_functions.js";
export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data));
        return res.data.user;
    });
}

export const updateUser = async (user) => {
    return axiosApi.put(`${USER}/update`, user).then(res => {
        return res.data.user;
    });
}
export const changeUserPassword = async (password) => {
    return axiosApi.put(`${USER}/change-password`, password).then(res => {
        return res.data.user;
    });
}