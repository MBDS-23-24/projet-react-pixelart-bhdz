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
        this.recurrencePersistence = this.startRecurrencePersitence(10000).pipe(takeUntil(this.unsubscribePersistence));
    }

    startRecurrencePersitence(delayMs) {
        return new Observable(observer => {
            const persistPixels = async () => {
                let isPersisted = false;
                if (this.pixels.length > 0) {
                    await ApiService.postPixels(this.pixelBoardId, this.pixels).then();
                    logRoom(Room.pixelBoard(this.pixelBoardId), `${this.pixels.length} pixels persisted for Pixel Board id ${this.pixelBoardId}`);
                    this.pixels = []

                    logRoom(Room.pixelBoard(this.pixelBoardId), `Pixels in memory is cleared`);
                    isPersisted = true;
                } else {
                    isPersisted = false;

                    logRoom(Room.pixelBoard(this.pixelBoardId), `No pixels to persist`);
                }

                if (!this.unsubscribePersistence.isStopped) {
                    logRoom(Room.pixelBoard(this.pixelBoardId), `Next persistence in ${delayMs / 1000} seconds`);
                    setTimeout(persistPixels, delayMs);
                } else {
                    logRoom(Room.pixelBoard(this.pixelBoardId), `Persistence stopped`);
                }
                observer.next(isPersisted);
            }

            persistPixels();

            return () => {
                this.unsubscribePersistence.next(); // Unsubscribe when complete
            };
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
const io = new Server(server,{
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


io.on('connection', (socket) => {
    const request = socket.request;
    const headers = request.headers;
    const token = headers.authorization;
    console.log("Headers:", headers);
    console.log("Authorization Token:", token);

    console.log('Nouvelle connexion WebSocket établie');
    const userId = socket.handshake?.query?.userId;
    const privateRoomUser = Room?.private(userId);
    joinRoom(socket, privateRoomUser, userId); //Room privé pour le user

    try {
        socket.on(Action.JOIN_PIXEL_BOARD, ({pixelBoardId}) => {

            const pixelBoardRoom = Room.pixelBoard(pixelBoardId);
            joinRoom(socket, pixelBoardRoom, userId); //Room pour le pixel board



            if (PIXEL_BOARD_STORES.has(pixelBoardId) === false) {
                const pixelBoardStore = new PixelBoardStore(pixelBoardId);
                PIXEL_BOARD_STORES.set(pixelBoardId, pixelBoardStore);

                pixelBoardStore.recurrencePersistence.subscribe({
                    next: isPersisted => {
                        if (isPersisted)
                            emitEvent(pixelBoardRoom, Event.PIXEL.PIXELS_IS_PERSISTED, true);

                        if (!io.sockets.adapter.rooms.get(pixelBoardRoom)) {
                            const pixelBoardStoreConcernedByUserDisconnect = PIXEL_BOARD_STORES.get(pixelBoardId);
                            pixelBoardStoreConcernedByUserDisconnect.unsubscribePersistence.next();
                            pixelBoardStoreConcernedByUserDisconnect.unsubscribePersistence.complete();
                            PIXEL_BOARD_STORES.delete(pixelBoardId);
                            logRoom(pixelBoardRoom, "No user connected to the pixel board, store deleted");
                        }
                    },
                    error: error => {
                        console.error("Une erreur s'est produite:", error);
                    }
                });
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
    } catch (error) {
        emitEvent(privateRoomUser, Event.GENERAL.ERROR, error);
    }
});
const PORT = 3200;

server.listen(PORT, () => {
    console.log(`Serveur Socket.IO écoutant sur le port ${PORT}`);
});
