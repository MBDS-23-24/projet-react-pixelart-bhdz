import {get, post, put} from "../api_functions.js";
import {LOGIN_USER, USER} from "../url_functions.js";
export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data));
        return res.data.user;
    });
}

export const registerUser = async (user) => {
    return post(`${USER}/register`, user).then(res => {
        return res.data.user;
    });
}

export const updateUserAccount = async (user) => {
    return put(`${USER}/updateAccount`, user).then(res => {
        return res.data.user;
    });
}
export const updateUser = async (user) => {
    return put(`${USER}/updateUser`, user).then(res => {
        return res.data;
    });
}
export const changeUserPassword = async (password) => {
    return put(`${USER}/change-password`, password).then(res => {
        return res.data.user;
    });
}

export const getAllUsers = async () => {
    return get(`${USER}/all`).then(res => {
        return res.data;
    });
}

export const getNumberOfUsers = async () => {
    return get(`${USER}/count`).then(res => {
        return res.data;
    });
}

export const getAllRoles = async () => {
    return get(`${USER}/roles`).then(res => {
        return res.data;
    });
}