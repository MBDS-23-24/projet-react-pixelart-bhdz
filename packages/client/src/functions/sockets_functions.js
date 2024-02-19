import { io } from "socket.io-client";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const socket = io(import.meta.env.VITE_SOCKET_URL, {
    withCredentials: true,
    extraHeaders: {
        "Authorization": cookies.get("accessToken") ? `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("accessToken="))?.split("=")[1]}` : ""
    }
});

export const socketEvents = {
    PIXEL: {
        NEW_PIXEL_ADDED: 'NEW_PIXEL_ADDED',
        NEW_PIXEL_REMOVED: 'NEW_PIXEL_REMOVED',
        PIXELS_IS_PERSISTED: 'PIXELS_IS_PERSISTED',
        NO_PERSISTED_PIXELS: 'NO_PERSISTED_PIXELS',
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
        socket.on(eventName, callback);
    },
    stopListening(eventName, callback) {
        socket.off(eventName, callback);
    },
    emit(eventName, data) {
        socket.emit(eventName, data);
    }
};

export default pixelSocket;