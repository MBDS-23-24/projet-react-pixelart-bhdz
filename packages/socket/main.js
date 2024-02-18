import express from 'express'
import http from 'http'
import {Server} from "socket.io";
import Action from "./action.js";
import Event from "./event.js";
import '../../config.js'
import ApiService from "./api-service.js";
import {Observable, Subject} from "rxjs";
import cors from "cors";

import {takeUntil} from 'rxjs/operators';


const PIXEL_BOARD_STORES = new Map();

class PixelBoardStore {
    pixels;
    pixelBoardId;
    recurrencePersistence;
    unsubscribePersistence;

    constructor(pixelBoardId) {
        this.pixels = [];
        this.pixelBoardId = pixelBoardId;
        this.unsubscribePersistence = new Subject();
        this.recurrencePersistence = this.startRecurrencePersitence(10000).pipe(takeUntil(this.unsubscribePersistence))
        this.recurrencePersistence.subscribe({
            next: isPersisted => {
                if (isPersisted)
                    emitEvent(Room.pixelBoard(pixelBoardId), Event.PIXEL.PIXELS_IS_PERSISTED, true)
                if (!io.sockets?.adapter?.rooms?.get(Room.pixelBoard(pixelBoardId))) {
                    this.unsubscribePersistence.next();
                    this.unsubscribePersistence.complete();
                    PIXEL_BOARD_STORES.delete(pixelBoardId);
                    logRoom(Room.pixelBoard(pixelBoardId), "No user connected to the pixel board, store deleted");
                }
            },
            error: error => {
                console.error("Une erreur s'est produite:", error);
            }
        });

    }

    startRecurrencePersitence(delayMs) {
        return new Observable(observer => {
            const persistPixels = async () => {
                let isPersisted = false;
                if (this.pixels.length > 0) {

                    await ApiService.postPixels(this.pixelBoardId, this.pixels).catch(error => {
                        console.error("Une erreur s'est produite:", error);
                    });
                    logRoom(Room.pixelBoard(this.pixelBoardId), `${this.pixels.length} pixels persisted for Pixel Board id ${this.pixelBoardId}`);
                    this.pixels = []
                    logRoom(Room.pixelBoard(this.pixelBoardId), `Pixels in memory is cleared`);
                    isPersisted = true;
                } else {
                    logRoom(Room.pixelBoard(this.pixelBoardId), `No pixels to persist in board `);
                    isPersisted = false;
                }

                if (!this.unsubscribePersistence.isStopped) {
                    logRoom(Room.pixelBoard(this.pixelBoardId), `Next persistence in ${delayMs / 1000} seconds`);
                    setTimeout(persistPixels, delayMs);
                } else {
                    logRoom(Room.pixelBoard(this.pixelBoardId), `Persistence stopped`);
                }
                observer.next(isPersisted);
            }

            persistPixels()
        });
    }

    addPixel(ownerId, x, y, color) {
        this.pixels.push({ownerId: ownerId, x: x, y: y, color: color});
    }

    removePixel(ownerId, x, y) {
        const indexToRemove = this.pixels.findIndex(p => p.x === x && p.y === y && p.ownerId === ownerId);
        if (indexToRemove !== -1) {
            this.pixels.splice(indexToRemove, 1);
        }
    }


}


const app = express();
const corsOptions = {
    origin: "http://localhost",
    credentials: true,
}
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const Room = {
    private(userId) {
        return "private_" + userId.toString();
    },

    pixelBoard(pixelBoardId) {
        return "pixel_board_" + pixelBoardId.toString();
    },
}


function emitEvent(room, event, data) {
    logRoom(room, `Emit '${event}' with data: ${JSON.stringify(data)}`);
    io.to(room).emit(event, data); //Emit event to all users in the room
}

function joinRoom(socket, room, userId) {
    logRoom(room, `User id : '${userId}' join room`);
    socket.join(room); //Room privé pour le
}

function logRoom(room, message) {
    console.log(`[${room}] ${message}`);
}

process.on('uncaughtException', (error) => {
    console.error('Error', error);
});

io.on('connection', async (socket) => {
    const request = socket.request;
    const headers = request.headers;
    const token = headers.authorization;
    const userId = await ApiService.getUserIdByToken(token);

    if (userId === null) {
        socket.disconnect();
        return;
    }

    console.log('Nouvelle connexion WebSocket établie');
    const privateRoomUser = Room?.private(userId);
    joinRoom(socket, privateRoomUser, userId); //Room privé pour le user

    socket.on(Action.JOIN_PIXEL_BOARD, ({pixelBoardId}) => {

        const pixelBoardRoom = Room.pixelBoard(pixelBoardId);
        joinRoom(socket, pixelBoardRoom, userId); //Room pour le pixel board

        if (PIXEL_BOARD_STORES.has(pixelBoardId) === false) {
            const pixelBoardStore = new PixelBoardStore(pixelBoardId);
            PIXEL_BOARD_STORES.set(pixelBoardId, pixelBoardStore);
        }
        emitEvent(pixelBoardRoom, Event.PIXEL.NO_PERSISTED_PIXELS, PIXEL_BOARD_STORES.get(pixelBoardId).pixels);


        socket.on(Action.DRAW_PIXEL, ({x, y, color}) => {
            emitEvent(pixelBoardRoom, Event.PIXEL.NEW_PIXEL_ADDED, {x: x, y: y, color: color});
            PIXEL_BOARD_STORES.get(pixelBoardId).addPixel(userId, x, y, color);
        });

        socket.on(Action.ERASE_PIXEL, ({x, y}) => {
            emitEvent(pixelBoardRoom, Event.PIXEL.NEW_PIXEL_REMOVED, {x: x, y: y});
            PIXEL_BOARD_STORES.get(pixelBoardId).removePixel(userId, x, y);
        });

        socket.on('disconnect', () => {
            logRoom(pixelBoardRoom, `User ${userId} disconnected`);

        })
    });

    emitEvent(privateRoomUser, Event.GENERAL.CONNECTION_SUCCESS);
});
server.listen(process.env.SOCKET_PORT, () => {
    console.log(`Serveur Socket.IO écoutant sur le port ${PORT}`);
});


