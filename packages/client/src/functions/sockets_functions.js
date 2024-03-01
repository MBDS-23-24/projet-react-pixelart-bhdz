import {io} from "socket.io-client";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

let socket;

export const initializeSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        extraHeaders: {
            "Authorization": cookies.get("accessToken") ? `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("accessToken="))?.split("=")[1]}` : ""
        }
    });
}

export const socketEvents = {
    PIXEL: {
        NEW_PIXEL_ADDED: 'NEW_PIXEL_ADDED',
        NEW_PIXEL_REMOVED: 'NEW_PIXEL_REMOVED',
        PIXELS_IS_PERSISTED: 'PIXELS_IS_PERSISTED',
        NO_PERSISTED_PIXELS: 'NO_PERSISTED_PIXELS',
        CONNECTED_USERS_CHANGED: 'CONNECTED_USERS_CHANGED',
    },
    GENERAL: {
        INFO: 'INFO',
        ERROR: 'ERROR',
        CONNECTION_SUCCESS: 'CONNECTION_SUCCESS',
    }
}

export const socketActions = {
    JOIN_PIXEL_BOARD: 'JOIN_PIXEL_BOARD',
    DRAW_PIXEL: 'DRAW_PIXEL',
    ERASE_PIXEL: 'ERASE_PIXEL',
}

const pixelSocket = {
    listen(eventName, callback) {
        if (!socket) {
            initializeSocket();
        }
        socket.on(eventName, callback);
    },
    stopListening(eventName, callback) {
        if (socket) {
            socket.off(eventName, callback);
        }
    },
    emit(eventName, data) {
        if (socket) {
            socket.emit(eventName, data);
        }
    },
    disconnect() {
        if (socket) {
            socket.disconnect();
        }
    },
    connect() {
        initializeSocket();
    },
    onDisconnect(callback) {
        if (socket) {
            socket.on('disconnect', callback);
        }
    }
};

export default pixelSocket;
