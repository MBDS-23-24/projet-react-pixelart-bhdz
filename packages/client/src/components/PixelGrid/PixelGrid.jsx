import {useRef, useState, useEffect} from 'react';
import pixelSocket from "../../functions/sockets_functions.js";

export class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

export default function PixelGrid({onNewPixelAdded, pixelsInit, onDrawPixel, pixelColor, width, height}) {
    const canvasRef = useRef(); // Référence vers le canvas
    const [ctx, setCtx] = useState(null);
    const pixelSize = 10; // Taille d'un pixel

    useEffect(() => {

    }, []);

    const realWidth = width * pixelSize;
    const realHeight = height * pixelSize;

    useEffect(() => {
        if (canvasRef) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);


    useEffect(() => {
        if (ctx) {
            drawGrid();
            pixelsInit(drawPixel)
            onNewPixelAdded(drawPixel);
        }
    }, [ctx]);


    /**
     * Dessine la grille sur le canvas
     */
    function drawGrid() {
        ctx.strokeStyle = '#000000'; // Couleur des lignes de la grille
        ctx.lineWidth = 0.1;

        // Dessin des lignes verticales
        for (let x = 0; x <= realWidth; x += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, realWidth);
            ctx.stroke();
        }

        // Dessin des lignes horizontales
        for (let y = 0; y <= realHeight; y += pixelSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(realHeight, y);
            ctx.stroke();
        }
    }

    /**
     * Gère le clic de la souris sur le canvas
     * @param event
     */
    function handleMouseClick(event) {
        const {offsetX, offsetY} = event.nativeEvent;
        const realPoistionX = Math.floor(offsetX / pixelSize) * pixelSize;
        const realPoistionY = Math.floor(offsetY / pixelSize) * pixelSize;
        const pixel = new Pixel(getPixelPosition(realPoistionX), getPixelPosition(realPoistionY), pixelColor);
        onDrawPixel(pixel);
        drawPixel(pixel);
    }

    function getRealPosition(pixelPosition) {
        return pixelPosition * pixelSize;
    }


    function getPixelPosition(realPosition) {
        return realPosition / pixelSize;
    }

    function drawPixel(pixel) {
        ctx.fillStyle = pixel.color;
        ctx.fillRect(getRealPosition(pixel.x), getRealPosition(pixel.y), pixelSize, pixelSize);
    }

    return (
        <canvas
            style={{background: 'rgba(255,247,234,0.85)'}}
            ref={canvasRef}
            width={realWidth}
            height={realHeight}
            onClick={handleMouseClick}
        ></canvas>
    );
}
