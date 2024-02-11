import {createContext, useEffect, useState} from "react";

export function decryptUser() {
    const session_user = localStorage.getItem('user_session');
    if (session_user) {
        return JSON.parse(session_user);
    }
    return null;
}

export function updateUserContext(user) {
    localStorage.setItem('user_session', JSON.stringify(user));
}

export function logoutUser() {
    localStorage.removeItem('user_session');
    window.location.reload();
}

export const UserContext = createContext({
    user: null,
    setUser: (user) => {}
});

export const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = decryptUser();
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {props}
        </UserContext.Provider>
    );
};