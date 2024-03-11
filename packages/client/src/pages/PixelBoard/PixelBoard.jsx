import './PixelBoard.scss'
import Grids from "../../components/PixelBoard/Grids.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import '../../components/Countdown/Countdown.scss'
import pixelSocket, {socketActions, socketEvents} from "../../functions/sockets_functions.js";
import {
    getPixelBoardById,
    getPixelsByPixelBoardId
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {ApiStatus} from "../../utils/ApiStatus.js";
import {LoadingOverlay, useMantineColorScheme} from "@mantine/core";
import Pixels from "../../components/PixelBoard/Pixels.jsx";
import HoveredPixel from "../../components/PixelBoard/HoveredPixel.jsx";
import PixelAnimation from "../../components/PixelBoard/PixelAnimation.jsx";
import PixelBoardMenu from "../../components/PixelBoardMenu/PixelBoardMenu.jsx";
import {notifications} from "@mantine/notifications";
import {IconUser} from "@tabler/icons-react";

export class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.lastUpdate = new Date();
    }
}

class PixelBoardStatus {
    static INITIAL = "INITIAL";
    static ALREADY_CONNECTED = "ALREADY_CONNECTED";
}

export default function PixelBoard() {
    const {colorScheme} = useMantineColorScheme();
    const {id} = useParams();
    const pixelsComponentRef = useRef([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixelBoard, setPixelBoard] = useState(null);
    const [fetchPixelBoardStatus, setFetchPixelBoardStatus] = useState(ApiStatus.INITIAL);
    const [savedPixels, setSavedPixels] = useState([]);
    const [lastDrawedPixel, setLastDrawedPixel] = useState(null);
    const [currentHoveredPixel, setCurrentHoveredPixel] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [globalPixelBoardStatus, setGlobalPixelBoardStatus] = useState(PixelBoardStatus.INITIAL);
    const navigate = useNavigate();
    const [countdownProgress, setCountdownProgress] = useState(100);
    const [isChoosingColor, setIsChoosingColor] = useState(true);
    const [hasDrawnDuringCountdown, setHasDrawnDuringCountdown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(15);
    const pixelSize = 10;
    let lastNbUserConnected = useRef(0);

    const onDrawPixel = (pixel) => {
        if (!hasDrawnDuringCountdown && !isChoosingColor) {
            setLastDrawedPixel(pixel);
            pixelSocket.emit(socketActions.DRAW_PIXEL, {x: pixel.x, y: pixel.y, color: pixel.color});
            setHasDrawnDuringCountdown(true)
        }
    }

    useEffect(() => {
        if (globalPixelBoardStatus === PixelBoardStatus.ALREADY_CONNECTED) {
            notifications.show({
                title: "Already connected",
                message: `You are already connected, you join a new session on this Pixel Board !`,
                color: "orange",
                icon: <IconUser size={24}/>,
            })
        }
    }, [globalPixelBoardStatus])

    useEffect(() => {
        if (connectedUsers?.length < lastNbUserConnected.current) {
            notifications.show({
                title: "User leaved the Pixelboard",
                message: `1 user leaved the pixel board !`,
                color: "red",
                icon: <IconUser size={24}/>,
            })

        } else if (connectedUsers.length > lastNbUserConnected.current) {
            const newUserJoined = connectedUsers[connectedUsers.length - 1];
            notifications.show({
                title: "New user joined the Pixelboard",
                message: `${newUserJoined?.username} joined the pixel board !`,
                color: "green",
                icon: <IconUser size={24}/>,
            })
        }
        lastNbUserConnected.current = connectedUsers.length;
    }, [connectedUsers]);

    useEffect(() => {
        pixelSocket.connect();
        listenSocketError();
        listenJoinedUsers();
        fetchNoPersistedPixel();
        joinPixelBoard();
        fetchPixelsData();
        fetchPixelBoard();

        pixelSocket.onDisconnect(() => {
            navigate("/");
        });

        return () => {
            pixelSocket.disconnect();
        }
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdownProgress(prevProgress => {
                return prevProgress - (100 / (15000 / 1000));
            });
            setRemainingTime(prevTime => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval= null;
        if (countdownProgress <= 0) {
            setIsChoosingColor(true);
            setHasDrawnDuringCountdown(false);
            setRemainingTime(15);
        } else {
            interval = setInterval(() => {
                setCountdownProgress(prevProgress => {
                    return prevProgress - (100 / (15000 / 1000));
                });
                setRemainingTime(prevTime => Math.max(prevTime - 1, 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [countdownProgress]);

    useEffect(() => {
        const initialColor = localStorage.getItem('selectedColor');
        if (initialColor) {
            setSelectedColor(initialColor);
            setIsChoosingColor(false);
            setCountdownProgress(100);
            setRemainingTime(15);
        }
    }, []);

    const startCountdownAndSelectColor = (color) => {
        if (!isChoosingColor && color === selectedColor) return;
        setSelectedColor(color);
        setIsChoosingColor(false);
        setCountdownProgress(100);
        setRemainingTime(15);
        setHasDrawnDuringCountdown(false);
        localStorage.setItem('selectedColor', color);
    };


    /**
     * Listen to new pixel added event
     */
    const listenPixelAdded = (drawPixelFunction) => {
        pixelSocket.listen(socketEvents.PIXEL.NEW_PIXEL_ADDED, (pixel) => {
            drawPixelFunction(new Pixel(pixel.x, pixel.y, pixel.color));
        });
    }


    const listenSocketError = () => {
        pixelSocket.listen(socketEvents.GENERAL.ERROR, (error) => {
            if (error?.code === 409 && error?.message === "Already in PixelBoard") {
                setGlobalPixelBoardStatus(PixelBoardStatus.ALREADY_CONNECTED);
            }
        });
    }

    function listenJoinedUsers() {
        pixelSocket.listen(socketEvents.PIXEL.CONNECTED_USERS_CHANGED, (connectedUsersInPixelBoard) => {
            setConnectedUsers(connectedUsersInPixelBoard);
        });
    }

    function fetchPixelBoard() {
        setFetchPixelBoardStatus(ApiStatus.LOADING);
        getPixelBoardById(id).then((pixelBoard) => {
            setPixelBoard(pixelBoard);
            setFetchPixelBoardStatus(ApiStatus.SUCCESS);
        }).catch(() => {
            setFetchPixelBoardStatus(ApiStatus.ERROR);
        });
    }

    const fetchNoPersistedPixel = () => {
        //NO_PERSISTED_PIXELS , this event is emitted when the user join the pixel board
        //The data received is the list of pixels not yet persisted in the database
        pixelSocket.listen(socketEvents.PIXEL.NO_PERSISTED_PIXELS, (pixelsNoPersisted) => {
            if (pixelsNoPersisted?.length > 0) {
                const newPixels = []
                pixelsNoPersisted.forEach(pixel => {
                    newPixels.push(new Pixel(pixel.x, pixel.y, pixel.color))
                })
                setSavedPixels((prev) => [...prev, ...newPixels]);
            }
        });
    }

    const fetchPixelsData = () => {
        getPixelsByPixelBoardId(id).then((pixels) => {
            if (pixels?.length > 0) {
                const newPixels = []
                pixels.forEach(pixel => {
                    newPixels.push(new Pixel(pixel.x, pixel.y, pixel.color))
                })
                setSavedPixels((prev) => [...prev, ...newPixels]);
            }
        });
    }

    /**
     * Gère le clic de la souris sur le canvas
     * @param event
     */
    function handleMouseClick(event) {
        const {offsetX, offsetY} = event.nativeEvent;
        const realPoistionX = Math.floor(offsetX / pixelSize) * pixelSize;
        const realPoistionY = Math.floor(offsetY / pixelSize) * pixelSize;
        const pixel = new Pixel(getPixelPosition(realPoistionX), getPixelPosition(realPoistionY), selectedColor);
        onDrawPixel(pixel)
    }

    function handleMouseMove(event) {
        const {offsetX, offsetY} = event.nativeEvent;
        const pixelPositionX = getPixelPosition(Math.floor(offsetX / pixelSize) * pixelSize);
        const pixelPositionY = getPixelPosition(Math.floor(offsetY / pixelSize) * pixelSize);
        if (pixelPositionX !== currentHoveredPixel?.x || pixelPositionY !== currentHoveredPixel?.y) {
            setCurrentHoveredPixel(new Pixel(pixelPositionX, pixelPositionY, selectedColor));
        }
    }

    /**
     * Join the pixel board
     */
    function joinPixelBoard() {
        pixelSocket.emit(socketActions.JOIN_PIXEL_BOARD, {pixelBoardId: id})
    }

    function getPixelPosition(realPosition) {
        return realPosition / pixelSize;
    }


    return (
        <>

            <div className={"pixel-board"} data-theme={(colorScheme === "dark").toString()}>
                <LoadingOverlay visible={fetchPixelBoardStatus === ApiStatus.LOADING} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}/>
                {fetchPixelBoardStatus === ApiStatus.SUCCESS &&
                    <PixelBoardMenu connectedUsers={connectedUsers} pixelBoard={pixelBoard}/>}
                {fetchPixelBoardStatus === ApiStatus.SUCCESS && (
                    <div className={"draw-container"}>
                        <div className={"draw-grids"} onClick={handleMouseClick} onMouseMove={handleMouseMove}>

                            <Pixels
                                ref={pixelsComponentRef}
                                initPixel={savedPixels} onNewPixelAdded={listenPixelAdded}
                                width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                                pixelColor={selectedColor}
                                pixelSize={pixelSize}
                            />

                            <HoveredPixel
                                width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                                currentHoveredPixel={currentHoveredPixel}
                                pixelSize={pixelSize}
                            />

                            <Grids
                                width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                                pixelSize={pixelSize}
                            />

                            <PixelAnimation
                                width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                                pixelSize={pixelSize}
                                currentDrawedPixel={lastDrawedPixel}
                            />
                            <div className="bar"
                                 style={{backgroundColor: selectedColor, width: `${countdownProgress}%`}}>
                            </div>
                            <div className="countdown-timer">Time remaining: {remainingTime} seconds
                            </div>
                        </div>
                        <ColorsRange onSelectColor={startCountdownAndSelectColor}/>

                    </div>
                )}

            </div>

        </>

    )
}
