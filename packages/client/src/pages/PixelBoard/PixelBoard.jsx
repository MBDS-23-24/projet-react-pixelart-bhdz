import './PixelBoard.scss'
import PixelGrid, {Pixel} from "../../components/PixelGrid/PixelGrid.jsx";
import ColorsRange from "../../components/ColorsRange/ColorsRange.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import pixelSocket from "../../functions/sockets_functions.js";
import {getPixelsByPixelBoardId} from "../../functions/backend_functions/pixelboard_backend_functions.js";

export default function PixelBoard() {
    const {id} = useParams();
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [pixels, setPixels] = useState([]);

    const onDrawPixel = (pixel) => {
        pixelSocket.emit('DRAW_PIXEL', {x: pixel.x, y: pixel.y, color: pixel.color})
    }

    useEffect(() => {
        fetchPixelsData()
        listenNewPixelAdded();
        joinPixelBoard();
    }, [id]);

    /**
     * Listen to new pixel added event
     */
    function listenNewPixelAdded() {
        pixelSocket.listen('NEW_PIXEL_ADDED', (pixel) => {
            setPixels(prevPixels => [...prevPixels, new Pixel(pixel.x, pixel.y, pixel.color)]);
        });
    }

    function fetchPixelsData() {
        getPixelsByPixelBoardId(id).then((pixels) => {
            const newPixels = []
            pixels.forEach(pixel => {
                newPixels.push(new Pixel(pixel.x, pixel.y, pixel.color));
            })
            setPixels(newPixels);
        });

        //NO_PERSISTED_PIXELS , this event is emitted when the user join the pixel board
        //The data received is the list of pixels not yet persisted in the database
        pixelSocket.listen('NO_PERSISTED_PIXELS', (pixelsNoPersisted) => {
            const newPixels = []
            pixelsNoPersisted.forEach(pixel => {
                newPixels.push(new Pixel(pixel.x, pixel.y, pixel.color));
            })
            setPixels(prevPixels => [...prevPixels, ...newPixels]);
        });
    }

    /**
     * Join the pixel board
     */
    function joinPixelBoard() {
        pixelSocket.emit('JOIN_PIXEL_BOARD', {pixelBoardId: id})
    }


    return (
        <div>
            <h1>Pixel Board</h1>
            <p>Libre à vous de dessiner !</p>

            <div className={"draw-container"}>

                <PixelGrid onDrawPixel={onDrawPixel} pixels={pixels} width={100} height={100}
                           pixelColor={selectedColor}/>
                <ColorsRange onSelectColor={setSelectedColor}/>
            </div>
        </div>
    )
}