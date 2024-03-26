import './PixelBoard.scss'
import Grids from "../../components/PixelBoard/Grids.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import pixelSocket, {socketActions, socketEvents} from "../../functions/sockets_functions.js";
import {
    getPixelBoardById,
    getPixelsByPixelBoardId
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {AppStatus} from "../../utils/AppStatus.js";
import {LoadingOverlay, useMantineColorScheme} from "@mantine/core";
import Pixels from "../../components/PixelBoard/Pixels.jsx";
import HoveredPixel from "../../components/PixelBoard/HoveredPixel.jsx";
import PixelAnimation from "../../components/PixelBoard/PixelAnimation.jsx";
import PixelBoardMenu from "../../components/PixelBoardMenu/PixelBoardMenu.jsx";
import {notifications} from "@mantine/notifications";
import {IconUser} from "@tabler/icons-react";
import {decryptUser} from "../../provider/UserContext.jsx";

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
    static CONNECTED = "JOINED";
    static ALREADY_CONNECTED = "ALREADY_CONNECTED";
}

export default function PixelBoard() {
    const {colorScheme} = useMantineColorScheme();
    const {id} = useParams();
    const pixelsComponentRef = useRef([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixelBoard, setPixelBoard] = useState(null);
    const [fetchPixelBoardStatus, setFetchPixelBoardStatus] = useState(AppStatus.INITIAL);
    const [savedPixels, setSavedPixels] = useState([]);
    const [lastDrawedPixel, setLastDrawedPixel] = useState(null);
    const [currentHoveredPixel, setCurrentHoveredPixel] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [globalPixelBoardStatus, setGlobalPixelBoardStatus] = useState(PixelBoardStatus.INITIAL);
    const navigate = useNavigate();
    const pixelSize = 10;
    let lastNbUserConnected = useRef(0);

    const onDrawPixel = (pixel) => {
        setLastDrawedPixel(pixel);
        pixelSocket.emit(socketActions.DRAW_PIXEL, {x: pixel.x, y: pixel.y, color: pixel.color})
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

            const user = decryptUser();
            if(newUserJoined?.id === user.id){
                setGlobalPixelBoardStatus(PixelBoardStatus.CONNECTED);
            }
        }
        lastNbUserConnected.current = connectedUsers.length;
    }, [connectedUsers]);

    useEffect(() => {
        pixelSocket.connect();
        listenJoinedUsers();
        listenSocketError();
        fetchNoPersistedPixel();
        fetchPixelsData();
        fetchPixelBoard();

        pixelSocket.onDisconnect(() => {
            navigate("/");
        });

        pixelSocket.listen(socketEvents.GENERAL.READY, () => {
            setTimeout(()=>{
                joinPixelBoard();
            }, 2000);
        });

        return () => {
            pixelSocket.disconnect();
        }
    }, [id]);

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
        setFetchPixelBoardStatus(AppStatus.LOADING);
        getPixelBoardById(id).then((pixelBoard) => {
            setPixelBoard(pixelBoard);
            setFetchPixelBoardStatus(AppStatus.SUCCESS);
        }).catch(() => {
            setFetchPixelBoardStatus(AppStatus.ERROR);
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
        console.log("Joining pixel board");
        pixelSocket.emit(socketActions.JOIN_PIXEL_BOARD, {pixelBoardId: id})
    }

    function getPixelPosition(realPosition) {
        return realPosition / pixelSize;
    }


    return (
        <>

            <div className={"pixel-board"} data-theme={(colorScheme === "dark").toString()}>
                <LoadingOverlay visible={fetchPixelBoardStatus === AppStatus.LOADING || globalPixelBoardStatus !== PixelBoardStatus.CONNECTED } zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}/>
                {fetchPixelBoardStatus === AppStatus.SUCCESS &&
                    <PixelBoardMenu connectedUsers={connectedUsers} pixelBoard={pixelBoard}/>}
                {fetchPixelBoardStatus === AppStatus.SUCCESS && (
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
                        </div>
                        <ColorsRange onSelectColor={setSelectedColor}/>
                    </div>
                )}
            </div>

        </>

    )
}