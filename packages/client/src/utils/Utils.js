export function hasRightToAccess(user, route) {
    if (route.needRight) {
        return user.roleId === "ROLE_ADMIN";
    }
    return true;
}