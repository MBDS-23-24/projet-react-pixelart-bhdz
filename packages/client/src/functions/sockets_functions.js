import { io } from "socket.io-client";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const socket = io("http://localhost:3200?userId=00000000cdc41c32293c296c", {
    withCredentials: true,
    extraHeaders: {
        "authorization": cookies.get("accessToken") ? `Bearer ${document.cookie.split("; ").find((row) => row.startsWith("accessToken="))?.split("=")[1]}` : ""
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