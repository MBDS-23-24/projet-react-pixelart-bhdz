import './PixelBoard.scss'
import Grids from "../../components/PixelBoard/Grids.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import pixelSocket, {socketActions, socketEvents} from "../../functions/sockets_functions.js";
import {
    getPixelBoardById,
    getPixelsByPixelBoardId
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {ApiStatus} from "../../utils/ApiStatus.js";
import {LoadingOverlay} from "@mantine/core";
import Pixels from "../../components/PixelBoard/Pixels.jsx";
import HoveredPixel from "../../components/PixelBoard/HoveredPixel.jsx";
import PixelAnimation from "../../components/PixelBoard/PixelAnimation.jsx";

export class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

export default function PixelBoard() {
    const {id} = useParams();
    const pixelsComponentRef = useRef([]);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixelBoard, setPixelBoard] = useState(null);
    const [fetchPixelBoardStatus, setFetchPixelBoardStatus] = useState(ApiStatus.INITIAL);
    const [savedPixels, setSavedPixels] = useState([]);
    const [lastDrawedPixel, setLastDrawedPixel] = useState(null);
    const [currentHoveredPixel, setCurrentHoveredPixel] = useState(null);
    const pixelSize = 10;

    const onDrawPixel = (pixel) => {
        setLastDrawedPixel(pixel);
        pixelSocket.emit(socketActions.DRAW_PIXEL, {x: pixel.x, y: pixel.y, color: pixel.color})
    }

    useEffect(() => {
        fetchPixelsData();
        fetchNoPersistedPixel()
        fetchPixelBoard();
        joinPixelBoard();
    }, [id]);

    /**
     * Listen to new pixel added event
     */
    const listenPixelAdded = (drawPixelFunction) => {
        pixelSocket.listen(socketEvents.PIXEL.NEW_PIXEL_ADDED, (pixel) => {
            drawPixelFunction(new Pixel(pixel.x, pixel.y, pixel.color));
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
            <div>
                <LoadingOverlay visible={fetchPixelBoardStatus === ApiStatus.LOADING} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}/>
                {fetchPixelBoardStatus === ApiStatus.SUCCESS && (
                    <div className={"draw-container"}>
                        <nav>{pixelBoard.title}</nav>
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