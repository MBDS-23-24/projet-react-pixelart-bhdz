export function splitStringMaxSize(username, max) {
    return username.length > max ? username.substring(0, max) + "..." : username;
}