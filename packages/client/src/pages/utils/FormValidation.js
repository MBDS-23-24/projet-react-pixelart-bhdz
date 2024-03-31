export function checkEmail(email) {
    const re = /^\S+@\S+$/;
    return re.test(email);
}

export function checkPassword(password) {
    return password.length >= 4;
}

export function checkUsername(username) {
    return username.length >= 6;
}