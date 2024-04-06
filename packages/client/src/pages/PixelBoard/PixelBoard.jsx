import './PixelBoard.scss'
import Grids from "../../components/PixelBoard/Grids.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import pixelSocket, {socketActions, socketEvents} from "../../functions/sockets_functions.js";
import {
    getPixelBoardById,
    getPixelsByPixelBoardId
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {AppStatus} from "../../utils/AppStatus.js";
import {Badge, LoadingOverlay, rem, Title, useMantineColorScheme} from "@mantine/core";
import Pixels from "../../components/PixelBoard/Pixels.jsx";
import HoveredPixel from "../../components/PixelBoard/HoveredPixel.jsx";
import PixelAnimation from "../../components/PixelBoard/PixelAnimation.jsx";
import PixelBoardMenu from "../../components/PixelBoardMenu/PixelBoardMenu.jsx";
import {notifications} from "@mantine/notifications";
import {IconCloudLock, IconCloudShare, IconCross, IconPencilOff, IconPencilX, IconUser} from "@tabler/icons-react";
import {decryptUser} from "../../provider/UserContext.jsx";
import TimerComponent from "../../components/TimerComponent/TimerComponent.jsx";

class PixelBoardsStorage {
    static get pixelBoardsStorage() {
        const storedData = localStorage.getItem('pixelBoardsStorage');
        return storedData ? new Map(JSON.parse(storedData)) : new Map();
    }

    static update(pixelBoardId, props) {
        const pixelBoardsStorage = this.pixelBoardsStorage;
        pixelBoardsStorage.set(pixelBoardId, {...PixelBoardsStorage.get(pixelBoardId), ...props});
        localStorage.setItem('pixelBoardsStorage', JSON.stringify([...pixelBoardsStorage]));
    }

    static get(pixelBoardId) {
        return this.pixelBoardsStorage.get(pixelBoardId) || {};
    }
}

export class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.lastUpdate = new Date();
    }

    static getPixelPosition(realPosition, pixelSize) {
        return realPosition / pixelSize;
    }
}

class PixelBoardStatus {
    static INITIAL = "INITIAL";
    static ALREADY_CONNECTED = "ALREADY_CONNECTED";
    static NOT_OPENED = "NOT_OPENED";
    static OPENED = "OPENED";
    static CLOSED = "CLOSED";
}

export default function PixelBoard() {
    const {colorScheme} = useMantineColorScheme();
    const {id} = useParams();
    const pixelsComponentRef = useRef([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixelBoard, setPixelBoard] = useState(null);
    const [fetchPixelBoardStatus, setFetchPixelBoardStatus] = useState(AppStatus.INITIAL);
    const [socketStatus, setSocketStatus] = useState(AppStatus.LOADING);
    const [savedPixels, setSavedPixels] = useState([]);
    const [lastDrawedPixel, setLastDrawedPixel] = useState(null);
    const [lastTimeDrawn, setLastTimeDrawn] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [globalPixelBoardStatus, setGlobalPixelBoardStatus] = useState(PixelBoardStatus.INITIAL);
    const navigate = useNavigate();
    const hoveredPixelRef = useRef();
    const [canDraw, setCanDraw] = useState(false);
    const pixelSize = 10;
    let lastNbUserConnected = useRef(0);

    const onDrawPixel = (pixel) => {
        if (canDraw) {
            if (pixelBoard.isPixelOverwrite === false && pixelsComponentRef.current.isPixelDrawn(pixel.x, pixel.y)) {
                notifications.show({
                    title: "Overwrite not allowed",
                    message: `Pixel already drawn at this position !`,
                    color: "red",
                    icon: <IconPencilOff size={24}/>,
                })
                return; //If the pixel is already drawn and the pixel board does not allow overwrite, we do nothing
            }
            pixelSocket.emit(socketActions.DRAW_PIXEL, {x: pixel.x, y: pixel.y, color: pixel.color});
            setLastDrawedPixel(pixel);
        }
    };


    useEffect(() => {
        if (pixelBoard) {
            const now = new Date();
            if (now > new Date(pixelBoard.endDate)) {
                setGlobalPixelBoardStatus(PixelBoardStatus.CLOSED);
            } else if (now < new Date(pixelBoard.startDate)) {
                setGlobalPixelBoardStatus(PixelBoardStatus.NOT_OPENED);
            } else {
                setGlobalPixelBoardStatus(PixelBoardStatus.OPENED);
            }
        }
    }, [pixelBoard]);

    useEffect(() => {
        if (lastDrawedPixel) {
            PixelBoardsStorage.update(id, {
                lastTimeDrawn: new Date()
            });
            setLastTimeDrawn(PixelBoardsStorage.get(id)?.lastTimeDrawn || null);
            setCanDraw(false)
        }
    }, [lastDrawedPixel])


    useEffect(() => {
        if (globalPixelBoardStatus === PixelBoardStatus.ALREADY_CONNECTED) {
            notifications.show({
                title: "Already connected",
                message: `You are already connected, you join a new session on this Pixel Board !`,
                color: "orange",
                icon: <IconUser size={24}/>,
            })
        } else if (globalPixelBoardStatus === PixelBoardStatus.OPENED) {
            setLastTimeDrawn(PixelBoardsStorage.get(id)?.lastTimeDrawn || null);
            setSelectedColor(PixelBoardsStorage.get(id)?.lastSelectedColor || '#000000');
            setSocketStatus(AppStatus.LOADING)
            pixelSocket.connect();
            listenJoinedUsers();
            listenSocketError();
            fetchNoPersistedPixel();
            fetchPixelsData();

            pixelSocket.onDisconnect(() => {
                setTimeout(() => {
                    if (window.location.pathname === `/pixel-board/${id}`) {
                        navigate('/')
                    }
                }, 300);
            });

            setTimeout(() => {
                joinPixelBoard();
            }, 2000);

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
            if (newUserJoined?.id === user.id) {
                setSocketStatus(AppStatus.SUCCESS);
            }
        }
        lastNbUserConnected.current = connectedUsers.length;
    }, [connectedUsers]);

    useEffect(() => {
        fetchPixelBoard();

        return () => {
            pixelSocket.disconnect();
        }
    }, [id]);

    /**
     * Load the saved data from the local storage
     * if the user reload the page or change the pixel board
     */
    useEffect(() => {
        fetchPixelBoard();
    }, []);

    const changeSelectedColor = (color) => {
        setSelectedColor(color);
        PixelBoardsStorage.update(id, {
            lastSelectedColor: color
        });

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
        const pixel = new Pixel(Pixel.getPixelPosition(realPoistionX, pixelSize), Pixel.getPixelPosition(realPoistionY, pixelSize), selectedColor);
        onDrawPixel(pixel)
    }

    function handleMouseMove(event) {
        const {offsetX, offsetY} = event.nativeEvent;
        const pixelPositionX = Pixel.getPixelPosition(Math.floor(offsetX / pixelSize) * pixelSize, pixelSize);
        const pixelPositionY = Pixel.getPixelPosition(Math.floor(offsetY / pixelSize) * pixelSize, pixelSize);
        if (hoveredPixelRef.current) {
            hoveredPixelRef.current.drawHoveredPixel(new Pixel(pixelPositionX, pixelPositionY, selectedColor));
        }

    }

    function joinPixelBoard() {
        pixelSocket.emit(socketActions.JOIN_PIXEL_BOARD, {pixelBoardId: id})
    }

    let body = null

    if (globalPixelBoardStatus === PixelBoardStatus.CLOSED) {
        body = <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div>

                    <IconCloudLock style={{width: rem(80), height: rem(80)}}
                                   stroke={1.5}/>
                    <Title order={1}> {pixelBoard.title} </Title>

                    <Badge
                        style={{marginTop: rem(20)}}
                        size="xl"
                        variant="gradient"
                        gradient={{from: 'pink', to: 'red', deg: 90}}
                    >

                        The pixel board is closed since the {new Date(pixelBoard.endDate).toLocaleString()}
                    </Badge>
                </div>

            </div>

        </>

    } else if (globalPixelBoardStatus === PixelBoardStatus.NOT_OPENED) {
        body = <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div>

                    <IconCloudShare style={{width: rem(80), height: rem(80)}}
                                    stroke={1.5}/>
                    <Title order={1}> {pixelBoard.title} </Title>

                    <Badge
                        style={{marginTop: rem(20)}}
                        size="xl"
                        variant="gradient"
                        gradient={{from: 'teal', to: 'lime', deg: 90}}
                    >

                        The pixel board will be open soon : {new Date(pixelBoard.startDate).toLocaleString()}
                    </Badge>
                </div>

            </div>
        </>
    } else if (fetchPixelBoardStatus === AppStatus.LOADING || socketStatus === AppStatus.LOADING) {
        body = <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{radius: "sm", blur: 2}}/>
    } else if (globalPixelBoardStatus === PixelBoardStatus.OPENED) {
        body = <>
            <PixelBoardMenu connectedUsers={connectedUsers} pixelBoard={pixelBoard}/>

            <div className={"draw-container"}>
                <div className={"draw-grids"} onClick={handleMouseClick} onMouseMove={handleMouseMove}>
                    <Pixels
                        ref={pixelsComponentRef}
                        initPixel={savedPixels} onNewPixelAdded={listenPixelAdded}
                        width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                        pixelColor={selectedColor}
                        pixelSize={pixelSize}
                    />

                    {canDraw === true && (
                        <HoveredPixel
                            ref={hoveredPixelRef}
                            width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                            pixelSize={pixelSize}
                        />
                    )}

                    <Grids
                        width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                        pixelSize={pixelSize}
                    />

                    <PixelAnimation
                        width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                        pixelSize={pixelSize}
                        currentDrawedPixel={lastDrawedPixel}
                    />

                    <TimerComponent callback={() => {
                        setCanDraw(true);
                    }} startTimer={lastTimeDrawn}
                                    thresholdInMs={pixelBoard.delayMs}></TimerComponent>


                </div>
                <ColorsRange onSelectColor={changeSelectedColor}/>

                <div className={'extra-info'}>
                    <small>
                        {pixelBoard.pixelWidth}x{pixelBoard.pixelHeight} - {pixelBoard.isPixelOverwrite ? "Overwrite allowed" : "Overwrite not allowed"}
                    </small>
                </div>
            </div>
        </>
    }

    return (
        <>
            <div className={"pixel-board"} data-theme={(colorScheme === "dark").toString()}>
                {body}
            </div>
        </>
    )
}