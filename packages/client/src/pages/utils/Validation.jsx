export function checkEmail(email) {
    const re = /^\S+@\S+$/;
    return re.test(email);
}