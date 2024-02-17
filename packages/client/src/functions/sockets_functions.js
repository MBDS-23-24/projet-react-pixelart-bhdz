import { io } from "socket.io-client";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const socket = io("http://localhost:3200", {
    withCredentials: true,
    extraHeaders: {
        "Authorization": cookies.get("accessToken") ? `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("accessToken="))?.split("=")[1]}` : ""
    }
});

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