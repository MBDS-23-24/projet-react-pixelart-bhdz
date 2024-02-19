import './PixelBoard.scss'
import PixelGrid, {Pixel} from "../../components/PixelGrid/PixelGrid.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import pixelSocket, {socketActions, socketEvents} from "../../functions/sockets_functions.js";
import {
    getPixelBoardById,
    getPixelsByPixelBoardId
} from "../../functions/backend_functions/pixelboard_backend_functions.js";
import {ApiStatus} from "../../utils/ApiStatus.js";
import {LoadingOverlay} from "@mantine/core";

export default function PixelBoard() {
    const {id} = useParams();
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixelBoard, setPixelBoard] = useState(null);
    const [fetchPixelBoardStatus, setFetchPixelBoardStatus] = useState(ApiStatus.INITIAL);
    const [savedPixels, setSavedPixels] = useState([]);

    const onDrawPixel = (pixel) => {
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
     * Join the pixel board
     */
    function joinPixelBoard() {
        pixelSocket.emit(socketActions.JOIN_PIXEL_BOARD, {pixelBoardId: id})
    }


    return (
        <>
            <div>
                <LoadingOverlay visible={fetchPixelBoardStatus === ApiStatus.LOADING} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}/>

                {fetchPixelBoardStatus === ApiStatus.SUCCESS && (
                    <div>
                        <h1>Pixel Board</h1>
                        <p>Libre à vous de dessiner !</p>

                        <div className={"draw-container"}>

                            <PixelGrid initPixel={savedPixels} onNewPixelAdded={listenPixelAdded}
                                       onDrawPixel={onDrawPixel}
                                       width={pixelBoard.pixelWidth} height={pixelBoard.pixelHeight}
                                       pixelColor={selectedColor}/>
                            <ColorsRange onSelectColor={setSelectedColor}/>
                        </div>
                    </div>
                )}
            </div>

        </>

    )
}