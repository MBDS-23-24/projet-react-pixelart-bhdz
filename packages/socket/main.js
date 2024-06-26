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
import Room from "./room.js";
import {SocketError} from "./socket-error.js";

const PIXEL_BOARD = new Map();
const DELAY_PERSISTENCE = 30000;

class PixelBoard {
    pixels;
    pixelBoardId;
    connectedUsers;
    recurrencePersistence;
    unsubscribePersistence;
    socket;

    constructor(pixelBoardId) {
        this.pixels = [];
        this.connectedUsers = [];
        this.pixelBoardId = pixelBoardId;
        this.initPersistence();
    }

    initPersistence() {
        this.unsubscribePersistence = new Subject();
        this.recurrencePersistence = this.startRecurrencePersitence(DELAY_PERSISTENCE).pipe(takeUntil(this.unsubscribePersistence))
        this.recurrencePersistence.subscribe({
            next: isPersisted => {
                if (isPersisted)
                    emitEvent(this.getRoom(), Event.PIXEL.PIXELS_IS_PERSISTED, true)
            },
            error: error => {
                console.error("Une erreur s'est produite:", error);
            }
        });
    }

    join(socket, user) {
        user.socket = socket;
        const userFind = this.connectedUsers.find(u => u.id === user.id);
        if (userFind) {
            emitEvent(Room.pixelBoardPrivate(user.id, this.pixelBoardId), Event.GENERAL.ERROR, new SocketError(409, "Already in PixelBoard", "You are already connected to this pixel board"));
            this.leavePixelBoard(userFind);
        }
        joinRoom(user.socket, this.getRoom(), user.id);
        joinRoom(user.socket, Room.pixelBoardPrivate(user.id, this.pixelBoardId), user.id);
        this.connectedUsers.push(user);
        emitEvent(this.getRoom(), Event.PIXEL.NO_PERSISTED_PIXELS, this.pixels);
        emitEvent(this.getRoom(), Event.PIXEL.CONNECTED_USERS_CHANGED, this.connectedUsers.map(({id, username, accountImageUrl}) => ({
            id,
            username,
            accountImageUrl
        })));
    }

    leavePixelBoard(user) {
        const indexToRemove = this.connectedUsers.findIndex(u => u.id === user.id);
        if (indexToRemove > -1) {
            logRoom(this.getRoom(), `If no user connected to the pixel board in 5 seconds, the persistence will be stopped`);
            setTimeout(() => {
                if (this.connectedUsers.length === 0) {
                    this.unsubscribePersistence.next();
                    this.unsubscribePersistence.complete();
                    logRoom(this.getRoom(), "No user connected to the pixel board, will be stopped");
                }else{
                    logRoom(this.getRoom(), "User connected to the pixel board, will not be stopped");
                }
            }, 10000);

            this.connectedUsers.splice(indexToRemove, 1);

            logRoom(this.getRoom(), `User ${user.id} disconnected`);

            emitEvent(this.getRoom(), Event.PIXEL.CONNECTED_USERS_CHANGED, this.connectedUsers.map(({id, username, accountImageUrl}) => ({
                id,
                username,
                accountImageUrl
            })));
            user.socket.disconnect();
        }

    }

    startRecurrencePersitence(delayMs) {
        return new Observable(observer => {
            const persistPixels = async () => {
                let isPersisted = false;
                if (this.pixels.length > 0) {

                    await ApiService.postPixels(this.pixelBoardId, this.pixels).catch(error => {
                        console.error("Une erreur s'est produite:", error);
                    });
                    logRoom(this.getRoom(), `${this.pixels.length} pixels persisted for Pixel Board id ${this.pixelBoardId}`);
                    this.pixels = []
                    logRoom(this.getRoom(), `Pixels in memory is cleared`);
                    isPersisted = true;
                } else {
                    logRoom(this.getRoom(), `No pixels to persist in board `);
                    isPersisted = false;
                }

                if (!this.unsubscribePersistence.isStopped) {
                    logRoom(this.getRoom(), `Next persistence in ${delayMs / 1000} seconds`);
                    setTimeout(persistPixels, delayMs);
                } else {
                    PIXEL_BOARD.delete(this.pixelBoardId);
                    logRoom(this.getRoom(), `Persistence stopped due to no user connected to the pixel board`);
                }
                observer.next(isPersisted);
            }

            persistPixels()
        });
    }

    addPixel(ownerId, x, y, color) {
        this.pixels.push({ownerId: ownerId, x: x, y: y, color: color, lastUpdate: new Date()});
    }

    removePixel(ownerId, x, y) {
        const indexToRemove = this.pixels.findIndex(p => p.x === x && p.y === y && p.ownerId === ownerId);
        if (indexToRemove !== -1) {
            this.pixels.splice(indexToRemove, 1);
        }
    }

    getRoom() {
        return Room.pixelBoard(this.pixelBoardId);
    }
}


const app = express();
const corsOptions = {
    origin: true,
    credentials: true,
}
app.use(cors(corsOptions));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

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
    socket.on(Action.JOIN_PIXEL_BOARD, async ({pixelBoardId}) => {
        const user = await ApiService.getUserByToken(token);
        if (user === null) {
            socket.disconnect();
            return;
        }

        if (PIXEL_BOARD.has(pixelBoardId) === false) {
            const pixelBoard = new PixelBoard(pixelBoardId);
            PIXEL_BOARD.set(pixelBoardId, pixelBoard);
        }
        const pixelBoard = PIXEL_BOARD.get(pixelBoardId);
        pixelBoard.join(socket, user)

        socket.on('disconnect', () => {
            pixelBoard.leavePixelBoard(user);
        });

        const pixelBoardRoom = pixelBoard.getRoom();

        socket.on(Action.DRAW_PIXEL, ({x, y, color}) => {
            emitEvent(pixelBoardRoom, Event.PIXEL.NEW_PIXEL_ADDED, {x: x, y: y, color: color});
            pixelBoard.addPixel(user.id, x, y, color);
        });

        socket.on(Action.ERASE_PIXEL, ({x, y}) => {
            emitEvent(pixelBoardRoom, Event.PIXEL.NEW_PIXEL_REMOVED, {x: x, y: y});
            pixelBoard.removePixel(user.id, x, y);
        });
    });
});

const PORT = process.env.SOCKET_PORT;
server.listen(PORT, () => {
    console.log(`Serveur Socket.IO écoutant sur le port ${PORT}`);
});


