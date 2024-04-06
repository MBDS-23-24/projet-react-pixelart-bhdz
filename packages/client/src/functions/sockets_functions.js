import {io} from "socket.io-client";

let socket;

export const initializeSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        withCredentials: true,
        extraHeaders: {
            "Authorization": localStorage?.getItem('user_session') ? `Bearer ${JSON.parse(localStorage.getItem('user_session')).accessToken}` : "",
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
        SUCCESSFULLY_JOINED: 'SUCCESSFULLY_JOINED',
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
        socket.on('disconnect', callback);

    }
};

export default pixelSocket;
