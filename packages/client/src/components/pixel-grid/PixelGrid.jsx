import {useRef, useState, useEffect} from 'react';

class Pixel {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

export default function PixelGrid(props) {
    const canvasRef = useRef(); // Référence vers le canvas
    const [ctx, setCtx] = useState(null);
    const pixelSize = 10; // Taille d'un pixel
    const [pixels] = useState([]);

    const {color, width, height} = props;

    const realWidth = width * pixelSize;
    const realHeight = height * pixelSize;

    useEffect(() => {
        pixels.forEach((pixel) => {
            drawPixel(pixel)
        })
    }, [pixels]);

    useEffect(() => {
        // Initialisation du contexte 2D du canvas
        setCtx(canvasRef.current.getContext('2d'));
    }, [canvasRef]);

    useEffect(() => {
        if (ctx) {
            drawGrid();
        }
    }, [ctx, width, height, drawGrid]);

    /**
     * Dessine la grille sur le canvas
     */
    function drawGrid() {
        ctx.strokeStyle = '#6e6e6e'; // Couleur des lignes de la grille
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
        const realX = Math.floor(offsetX / pixelSize) * pixelSize;
        const realy = Math.floor(offsetY / pixelSize) * pixelSize;
        const pixel = new Pixel(getPixelX(realX), getPixelY(realy), color);
        drawPixel(pixel);
    }

    function getRealX(pixelX) {
        return pixelX * pixelSize;
    }

    function getRealY(pixelY) {
        return pixelY * pixelSize;
    }

    function getPixelX(realX) {
        return realX / pixelSize;
    }

    function getPixelY(realY) {
        return realY / pixelSize;
    }

    function drawPixel(pixel) {
        pixels.push(pixel);
        ctx.fillStyle = pixel.color;
        ctx.fillRect(getRealX(pixel.x), getRealX(pixel.y), pixelSize, pixelSize);
    }

    return (
        <canvas
            ref={canvasRef}
            width={realWidth}
            height={realHeight}
            onClick={handleMouseClick}
        ></canvas>
    );
}
