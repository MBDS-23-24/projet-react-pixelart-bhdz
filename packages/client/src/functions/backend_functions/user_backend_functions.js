import {post, put, get} from "../api_functions.js";
import {LOGIN_USER, USER} from "../url_functions.js";
export const loginUser = async (user) => {
    return post(`${LOGIN_USER}`, user).then(res => {
        localStorage.setItem('user_session', JSON.stringify(res.data));
        return res.data.user;
    });
}

export const updateUser = async (user) => {
    return put(`${USER}/update`, user).then(res => {
        return res.data.user;
    });
}
export const changeUserPassword = async (password) => {
    return put(`${USER}/change-password`, password).then(res => {
        return res.data.user;
    });
}

export const getUserContribution = async (userId) => {
    return get(`${USER}/${userId}/contribution/pixelboards`).then(res => {
        return res.data;
    });
}

export const getContributors = async () => {
    return get(`${USER}/contributors`).then(res => {
        return res.data;
    });
}